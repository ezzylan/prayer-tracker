import { format, intlFormatDistance, isBefore, isToday } from "date-fns";
import { z } from "zod/v4";

interface PrayerTimeItem {
	label: string;
	time: string;
	value: string;
	different: string;
	isCurrent: boolean;
	isNext: boolean;
}

interface PrayerTime {
	hijri: string;
	date: string;
	day: string;
	imsak: string;
	fajr: string;
	syuruk: string;
	dhuhr: string;
	asr: string;
	maghrib: string;
	isha: string;
	items?: PrayerTimeItem[];
}

interface SolatApiData {
	prayerTime: PrayerTime[];
	status: string;
	serverTime: string;
	periodType: string;
	lang: string;
	zone: string;
	bearing: string;
}

type PrayerKey = keyof PrayerTime;

const prayerNamesMap = new Map<PrayerKey, string>([
	["imsak", "Imsak"],
	["fajr", "Fajr"],
	["syuruk", "Syuruk"],
	["dhuhr", "Dhuhr"],
	["asr", "Asr"],
	["maghrib", "Maghrib"],
	["isha", "Isha"],
]);

const prayerKeys = Array.from(prayerNamesMap.keys());

export default defineCachedEventHandler(
	async (event) => {
		const query = await getValidatedQuery(event, (body) =>
			z.object({ zoneId: z.string().default("WLY01") }).safeParse(body)
		);

		if (!query.success) throw query.error.issues;
		const { zoneId } = query.data;

		const solatApiData = await $fetch<SolatApiData | undefined>(
			"https://www.e-solat.gov.my/index.php",
			{
				query: {
					r: "esolatApi/takwimsolat",
					period: "year",
					zone: zoneId,
				},
			}
		);

		return solatApiData?.prayerTime
			?.filter((t) => isToday(new Date(t.date)))
			.map((t) => {
				t.items = prayerKeys.map((key) => {
					const date = t.date;
					const time = t[key] as string;

					const [day, month, year] = date.split("-");
					const [hour, min, sec] = time.split(":");

					const combinedDate = new Date(
						parseInt(year, 10),
						new Date(Date.parse(month + " 1, 2000")).getMonth(),
						parseInt(day, 10),
						parseInt(hour, 10),
						parseInt(min, 10),
						parseInt(sec, 10)
					);

					return {
						value: format(combinedDate, "hh:mm a"),
						label: prayerNamesMap.get(key),
						different: intlFormatDistance(combinedDate, new Date()),
						time,
					} as PrayerTimeItem;
				});

				const current = t.items
					.slice()
					.reverse()
					.find(
						(item, i) =>
							!isBefore(item.time, new Date()) ||
							(t.items && i == t.items?.length - 1)
					);

				if (current) {
					current.isCurrent = true;
					const currentIndex = t.items.indexOf(current);

					if (t.items.length > 1) {
						const nextIndex =
							currentIndex + 1 < t.items.length
								? currentIndex + 1
								: 0;

						t.items[nextIndex]!.isNext = true;
					}
				}

				return t;
			})
			.find(Boolean);
	},
	{
		maxAge: 60 * 60,
	}
);

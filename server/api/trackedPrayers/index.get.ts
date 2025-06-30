import { formatISO } from "date-fns";
import { z } from "zod/v4";

export default defineEventHandler(async (event) => {
	const session = await auth.api.getSession({
		headers: event.headers,
	});

	if (!session) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		});
	}

	const result = await getValidatedQuery(event, (body) =>
		z
			.object({
				beforeToday: z.coerce.boolean().optional().default(false),
			})
			.safeParse(body)
	);

	if (!result.success) throw result.error.issues;

	const { beforeToday } = result.data;
	const db = useDrizzle();
	const userId = session.user.id;
	const todayDate = formatISO(new Date()).split("T")[0];

	const checkDate = () => {
		if (beforeToday) {
			return lt(prayerTables.trackedPrayer.date, todayDate);
		}

		return eq(prayerTables.trackedPrayer.date, todayDate);
	};

	const trackedPrayersPromise = db
		.select()
		.from(prayerTables.trackedPrayer)
		.where(and(eq(prayerTables.trackedPrayer.userId, userId), checkDate()));

	const prayersPromise = db.select().from(prayerTables.prayer).all();

	let [trackedPrayers, prayers] = await Promise.all([
		trackedPrayersPromise,
		prayersPromise,
	]);

	if (trackedPrayers.length === 0) {
		trackedPrayers = await Promise.all(
			prayers.map((prayer) =>
				db
					.insert(prayerTables.trackedPrayer)
					.values({
						userId,
						prayerId: prayer.id,
						date: todayDate,
						isCompleted: false,
					})
					.returning()
					.get()
			)
		);
	}

	const prayerOrderMap = new Map(prayers.map((p) => [p.id, p.order ?? 0]));

	const sortedTrackedPrayers = trackedPrayers.sort((a, b) => {
		if (beforeToday) {
			const dateCompare = b.date.localeCompare(a.date);
			if (dateCompare !== 0) return dateCompare;
			return b.prayerId - a.prayerId;
		}

		return (
			(prayerOrderMap.get(a.prayerId) ?? 0) -
			(prayerOrderMap.get(b.prayerId) ?? 0)
		);
	});

	const prayerMap = new Map(prayers.map((p) => [p.id, p]));

	return sortedTrackedPrayers.map((t) => {
		const prayer = prayerMap.get(t.prayerId);
		return {
			id: t.id,
			name: prayer!.name,
			date: t.date,
			isCompleted: t.isCompleted,
		};
	});
});

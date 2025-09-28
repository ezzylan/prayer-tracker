import { formatISO } from "date-fns";

export default defineEventHandler(async (event) => {
	const { user } = await checkAuthenticatedUser(event);
	const userId = user.id;

	const db = useDrizzle();
	const todayDate = formatISO(new Date()).split("T")[0];

	const trackedPrayersPromise = db
		.select()
		.from(prayerTables.trackedPrayer)
		.where(
			and(
				eq(prayerTables.trackedPrayer.userId, userId),
				eq(prayerTables.trackedPrayer.date, todayDate)
			)
		);

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

	const sortedTrackedPrayers = trackedPrayers.sort(
		(a, b) =>
			(prayerOrderMap.get(a.prayerId) ?? 0) -
			(prayerOrderMap.get(b.prayerId) ?? 0)
	);

	return returnFinalPrayers(prayers, sortedTrackedPrayers);
});

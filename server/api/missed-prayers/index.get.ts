import { formatISO } from "date-fns";

export default defineEventHandler(async (event) => {
	const session = await checkAuthenticatedUser(event);
	const userId = session.user.id;

	const db = useDrizzle();
	const todayDate = formatISO(new Date()).split("T")[0];

	const missedPrayersPromise = db
		.select()
		.from(prayerTables.trackedPrayer)
		.where(
			and(
				eq(prayerTables.trackedPrayer.userId, userId),
				lt(prayerTables.trackedPrayer.date, todayDate)
			)
		);

	const prayersPromise = db.select().from(prayerTables.prayer).all();

	const [missedPrayers, prayers] = await Promise.all([
		missedPrayersPromise,
		prayersPromise,
	]);

	const sortedMissedPrayers = missedPrayers.sort((a, b) => {
		const dateCompare = b.date.localeCompare(a.date);
		if (dateCompare !== 0) return dateCompare;
		return b.prayerId - a.prayerId;
	});

	return returnFinalPrayers(prayers, sortedMissedPrayers);
});

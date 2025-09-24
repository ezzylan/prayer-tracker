import { formatISO } from "date-fns";

export default defineTask({
	meta: {
		name: "prayers:insert",
		description: "Insert new prayers into the database",
	},
	async run() {
		console.log("Running new prayers insertion task...");

		const db = useDrizzle();
		const todayDate = formatISO(new Date()).split("T")[0];

		const usersPromise = db.select().from(authTables.user).all();
		const prayersPromise = db.select().from(prayerTables.prayer).all();

		const [users, prayers] = await Promise.all([
			usersPromise,
			prayersPromise,
		]);

		try {
			const trackedPrayers = users.flatMap((user) =>
				prayers.map((prayer) => ({
					userId: user.id,
					prayerId: prayer.id,
					date: todayDate,
					isCompleted: false,
				}))
			);

			const insertedPrayers = await db
				.insert(prayerTables.trackedPrayer)
				.values(trackedPrayers)
				.returning()
				.get();

			console.log("New prayers inserted successfully for all users");

			return { result: "Success", data: insertedPrayers };
		} catch (error) {
			console.error("Error inserting tracked prayers:", error);

			return {
				result: "Failure",
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});

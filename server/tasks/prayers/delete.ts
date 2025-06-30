import { formatISO } from "date-fns";

export default defineTask({
	meta: {
		name: "prayers:delete",
		description: "Delete old prayers from the database",
	},
	async run() {
		console.log("Running old prayers deletion task...");

		const todayDate = formatISO(new Date()).split("T")[0];

		try {
			await useDrizzle()
				.delete(prayerTables.trackedPrayer)
				.where(
					and(
						lt(prayerTables.trackedPrayer.date, todayDate),
						eq(prayerTables.trackedPrayer.isCompleted, true)
					)
				);

			console.log("Old prayers deleted successfully for all users.");

			return { result: "Success" };
		} catch (error) {
			console.error("Error deleting old prayers:", error);

			return {
				result: "Failure",
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});

import * as z from "zod";

export default defineEventHandler(async (event) => {
	await checkAuthenticatedUser(event);

	const { userId } = await readValidatedBody(
		event,
		z.object({ userId: z.string() }).parse
	);

	await useDrizzle()
		.delete(prayerTables.trackedPrayer)
		.where(eq(prayerTables.trackedPrayer.userId, userId));
});

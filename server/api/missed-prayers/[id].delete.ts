import * as z from "zod";

export default defineEventHandler(async (event) => {
	await checkAuthenticatedUser(event);

	const { id } = await getValidatedRouterParams(
		event,
		z.object({ id: z.string() }).parse
	);

	await useDrizzle()
		.delete(prayerTables.trackedPrayer)
		.where(eq(prayerTables.trackedPrayer.id, Number(id)));
});

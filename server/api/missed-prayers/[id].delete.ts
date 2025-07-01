export default defineEventHandler(async (event) => {
	const session = await checkAuthenticatedUser(event);

	const { id } = getRouterParams(event);

	await useDrizzle()
		.delete(prayerTables.trackedPrayer)
		.where(eq(prayerTables.trackedPrayer.id, Number(id)));
});

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

	const { id } = getRouterParams(event);

	await useDrizzle()
		.delete(prayerTables.trackedPrayer)
		.where(eq(prayerTables.trackedPrayer.id, Number(id)));
});

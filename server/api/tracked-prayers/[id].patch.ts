import * as z from "zod";

export default defineEventHandler(async (event) => {
	await checkAuthenticatedUser(event);

	const { isCompleted } = await readValidatedBody(
		event,
		z.object({ isCompleted: z.boolean() }).parse
	);

	const { id } = await getValidatedRouterParams(
		event,
		z.object({ id: z.string() }).parse
	);

	await useDrizzle()
		.update(prayerTables.trackedPrayer)
		.set({ isCompleted })
		.where(eq(prayerTables.trackedPrayer.id, Number(id)));
});

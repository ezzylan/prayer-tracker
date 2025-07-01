import { z } from "zod/v4";

export default defineEventHandler(async (event) => {
	const session = await checkAuthenticatedUser(event);

	const result = await readValidatedBody(event, (body) =>
		z.object({ isCompleted: z.boolean() }).safeParse(body)
	);

	if (!result.success) throw result.error.issues;

	const { isCompleted } = result.data;
	const { id } = getRouterParams(event);

	await useDrizzle()
		.update(prayerTables.trackedPrayer)
		.set({ isCompleted })
		.where(eq(prayerTables.trackedPrayer.id, Number(id)));
});

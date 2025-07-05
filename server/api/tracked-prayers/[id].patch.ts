import { z } from "zod/v4";

export default defineEventHandler(async (event) => {
	await checkAuthenticatedUser(event);

	const body = await readValidatedBody(event, (body) =>
		z.object({ isCompleted: z.boolean() }).safeParse(body)
	);

	if (!body.success) throw body.error.issues;
	const { isCompleted } = body.data;

	const params = await getValidatedRouterParams(event, (body) =>
		z.object({ id: z.string() }).safeParse(body)
	);

	if (!params.success) throw params.error.issues;
	const { id } = params.data;

	await useDrizzle()
		.update(prayerTables.trackedPrayer)
		.set({ isCompleted })
		.where(eq(prayerTables.trackedPrayer.id, Number(id)));
});

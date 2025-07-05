import { z } from "zod/v4";

export default defineEventHandler(async (event) => {
	await checkAuthenticatedUser(event);

	const params = await getValidatedRouterParams(event, (body) =>
		z.object({ id: z.string() }).safeParse(body)
	);

	if (!params.success) throw params.error.issues;

	const { id } = params.data;

	await useDrizzle()
		.delete(prayerTables.trackedPrayer)
		.where(eq(prayerTables.trackedPrayer.id, Number(id)));
});

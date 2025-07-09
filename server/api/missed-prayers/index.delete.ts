import * as z from "zod";

export default defineEventHandler(async (event) => {
	await checkAuthenticatedUser(event);

	const body = await readValidatedBody(event, (body) =>
		z.object({ userId: z.string() }).safeParse(body)
	);

	if (!body.success) throw body.error.issues;

	const { userId } = body.data;

	await useDrizzle()
		.delete(prayerTables.trackedPrayer)
		.where(eq(prayerTables.trackedPrayer.userId, userId));
});

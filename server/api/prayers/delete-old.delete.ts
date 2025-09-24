import { formatISO } from "date-fns";
import * as z from "zod";

export default defineEventHandler(async (event) => {
	const { secret } = await readValidatedBody(
		event,
		z.object({ secret: z.string() }).parse
	);

	// Validate the secret key
	const secretKey = useRuntimeConfig().taskSecret;
	if (!secretKey) {
		throw createError({
			statusCode: 500,
			statusMessage: "Secret must be set",
		});
	}

	if (secret !== secretKey) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		});
	}

	const todayDate = formatISO(new Date()).split("T")[0];

	await useDrizzle()
		.delete(prayerTables.trackedPrayer)
		.where(
			and(
				lt(prayerTables.trackedPrayer.date, todayDate),
				eq(prayerTables.trackedPrayer.isCompleted, true)
			)
		);

	return { message: "Old prayers deleted successfully for all users" };
});

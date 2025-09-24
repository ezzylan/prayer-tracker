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

	const db = useDrizzle();
	const todayDate = formatISO(new Date()).split("T")[0];

	const usersPromise = db.select().from(authTables.user).all();
	const prayersPromise = db.select().from(prayerTables.prayer).all();

	const [users, prayers] = await Promise.all([usersPromise, prayersPromise]);

	const trackedPrayers = users.flatMap((user) =>
		prayers.map((prayer) => ({
			userId: user.id,
			prayerId: prayer.id,
			date: todayDate,
			isCompleted: false,
		}))
	);

	await db.insert(prayerTables.trackedPrayer).values(trackedPrayers);

	return { message: "New prayers inserted successfully for all users" };
});

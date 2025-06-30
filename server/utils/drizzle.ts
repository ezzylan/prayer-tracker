import { drizzle } from "drizzle-orm/libsql";
import * as authSchema from "../db/schemas/auth";
import * as prayerSchema from "../db/schemas/prayers";

export { and, eq, lt } from "drizzle-orm";
export const prayerTables = prayerSchema;
export const authTables = authSchema;
export const schema = { ...authSchema, ...prayerSchema };

export function useDrizzle() {
	return drizzle(useTurso(), { schema });
}

export type User = typeof authSchema.user.$inferSelect;
export type Prayer = typeof prayerSchema.prayer.$inferSelect;
export type TrackedPrayer = typeof prayerSchema.trackedPrayer.$inferSelect;

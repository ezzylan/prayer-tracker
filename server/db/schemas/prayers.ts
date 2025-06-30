import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const prayer = sqliteTable("prayers", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	order: integer().notNull(),
});

export const trackedPrayer = sqliteTable("trackedPrayers", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	userId: text()
		.references(() => user.id)
		.notNull(),
	prayerId: integer()
		.references(() => prayer.id)
		.notNull(),
	date: text()
		.default(sql`(CURRENT_DATE)`)
		.notNull(),
	isCompleted: integer({ mode: "boolean" }).default(false).notNull(),
});

import type { Config } from "drizzle-kit";

export default {
	schema: "./server/db/schemas",
	out: "./server/db/migrations",
	dialect: "turso",
	dbCredentials: {
		url: process.env.NUXT_TURSO_DATABASE_URL!,
		authToken: process.env.NUXT_TURSO_AUTH_TOKEN,
	},
} satisfies Config;

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const { google, github } = useRuntimeConfig();

export const auth = betterAuth({
	database: drizzleAdapter(useDrizzle(), {
		provider: "sqlite",
		schema,
	}),
	session: {
		cookieCache: { enabled: true, maxAge: 5 * 60 },
	},
	socialProviders: {
		google: {
			clientId: google.clientId,
			clientSecret: google.clientSecret,
		},
		github: {
			clientId: github.clientId,
			clientSecret: github.clientSecret,
		},
		// google: {
		// 	clientId: process.env.GOOGLE_CLIENT_ID as string,
		// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		// },
		// github: {
		// 	clientId: process.env.GITHUB_CLIENT_ID as string,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		// },
	},
});

export const checkAuthenticatedUser = defineCachedFunction(
	async (event) => {
		const session = await auth.api.getSession({
			headers: event.headers,
		});

		if (!session) {
			throw createError({
				statusCode: 401,
				statusMessage: "Unauthorized",
			});
		}

		return session;
	},
	{ maxAge: 5 * 60 }
);

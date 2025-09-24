import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { H3Event } from "h3";

const { google, github } = useRuntimeConfig();

export const auth = betterAuth({
	database: drizzleAdapter(useDrizzle(), {
		provider: "sqlite",
		schema,
	}),
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

export const checkAuthenticatedUser = async (event: H3Event) => {
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
};

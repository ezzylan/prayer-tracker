// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: { compatibilityVersion: 4 },
	compatibilityDate: "2025-05-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxt/ui"],
	css: ["~/assets/css/main.css"],
	runtimeConfig: {
		turso: { databaseUrl: "", authToken: "" },
		google: { clientId: "", clientSecret: "" },
		github: { clientId: "", clientSecret: "" },
	},
	app: {
		head: {
			title: "PrayEZ",
			htmlAttrs: { lang: "en" },
			link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
			meta: [
				{
					name: "title",
					content: "PrayEZ",
				},
				{
					name: "description",
					content: "Track your Islamic prayers with ease!",
				},
				{
					property: "og:type",
					content: "website",
				},
				{
					property: "og:url",
					content: "https://example.com",
				},
				{
					property: "og:title",
					content: "PrayEZ",
				},
				{
					property: "og:description",
					content: "Track your Islamic prayers with ease!",
				},
				{
					property: "twitter:card",
					content: "summary",
				},
				{
					property: "twitter:url",
					content: "https://example.com",
				},
				{
					property: "twitter:title",
					content: "PrayEZ",
				},
				{
					property: "twitter:description",
					content: "Track your Islamic prayers with ease!",
				},
			],
		},
	},
	fonts: { providers: { bunny: false } },
	nitro: {
		experimental: { tasks: true },
		scheduledTasks: {
			"0 0 * * *": ["prayers:insert", "prayers:delete"],
		},
	},
});

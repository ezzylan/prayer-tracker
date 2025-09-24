import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	future: { compatibilityVersion: 4 },
	compatibilityDate: "2025-05-15",
	devtools: { enabled: true },
	vite: { plugins: [tailwindcss()] },
	modules: ["@nuxt/eslint", "@nuxt/ui", "@vite-pwa/nuxt"],
	css: ["~/assets/css/main.css"],
	runtimeConfig: {
		turso: { databaseUrl: "", authToken: "" },
		google: { clientId: "", clientSecret: "" },
		github: { clientId: "", clientSecret: "" },
		taskSecret: "",
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
	// nitro: {
	// 	experimental: { tasks: true },
	// 	scheduledTasks: {
	// 		"0 0 * * *": ["prayers:insert", "prayers:delete"],
	// 	},
	// },
	pwa: {
		registerType: "autoUpdate",
		manifest: {
			name: "PrayEZ",
			short_name: "PrayEZ",
			description: "Track your Islamic prayers with ease!",
			// theme_color: "#4A90E2",
			icons: [
				{
					src: "/web-app-manifest-192x192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "/web-app-manifest-512x512.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
		},
		workbox: {
			runtimeCaching: [
				{
					urlPattern: "https://prayez.netlify.app/.*",
					handler: "NetworkFirst",
					options: {
						cacheName: "api-cache",
						expiration: {
							maxEntries: 50,
							maxAgeSeconds: 86400,
						},
					},
				},
			],
		},
	},
});

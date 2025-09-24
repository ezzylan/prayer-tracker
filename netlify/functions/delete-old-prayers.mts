import type { Config } from "@netlify/functions";
import { FetchError, ofetch } from "ofetch";

export default async (req: Request) => {
	const { next_run } = await req.json();

	console.log("Scheduled function triggered. Next run:", next_run);

	await ofetch<{ message: string }>("/api/prayers/delete-old", {
		method: "DELETE",
		body: { secret: process.env.NUXT_TASK_SECRET },
		baseURL: process.env.URL,
		async onResponse({ response }) {
			console.log("Task completed:", response.body);
		},
	}).catch((error: FetchError) => console.error("Task failed:", error.data));
};

// Run every midnight
export const config: Config = {
	schedule: "@daily",
};

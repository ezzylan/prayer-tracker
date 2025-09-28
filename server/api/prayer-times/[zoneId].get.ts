import * as z from "zod";

export default defineCachedEventHandler(
	async (event) => {
		const { zoneId } = await getValidatedRouterParams(
			event,
			z.object({ zoneId: z.string() }).parse
		);

		const solatApiData = await $fetch<SolatApiData | undefined>(
			`https://api.waktusolat.app/v2/solat/${zoneId}`
		);

		const todayPrayers =
			solatApiData?.prayers?.filter(
				(prayer) => new Date().getDate() === prayer.day
			) || [];

		return todayPrayers[0];
	},
	{ maxAge: 60 * 60 }
);

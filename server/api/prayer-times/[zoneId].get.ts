import * as z from "zod";

export default defineCachedEventHandler(
	async (event) => {
		const params = await getValidatedRouterParams(event, (body) =>
			z.object({ zoneId: z.string() }).safeParse(body)
		);

		if (!params.success) throw params.error.issues;
		const { zoneId } = params.data;

		const solatApiData = await $fetch<SolatApiData | undefined>(
			`https://api.waktusolat.app/v2/solat/${zoneId}`
		);

		const todayPrayers =
			solatApiData?.prayers?.filter(
				(prayer) => new Date().getDate() === prayer.day
			) || [];

		return todayPrayers[0];
	},
	{
		maxAge: 60 * 60,
	}
);

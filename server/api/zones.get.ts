import { parse } from "node-html-parser";

export default defineCachedEventHandler(
	async () => {
		const zonesHtml = await $fetch<string>(
			"https://www.e-solat.gov.my/index.php",
			{
				query: { siteId: 24, pageId: 24 },
				parseResponse: (txt) => txt,
			}
		);

		return parse(zonesHtml)
			.querySelectorAll("select#inputZone>optgroup>option")
			.map((z) => {
				const id = z.getAttribute("value") || "";
				const label = z.textContent.trim();
				const state =
					z.closest("optgroup")?.getAttribute("label") || "";

				return { id, label, state };
			})
			.filter(({ id, label }) => !!id && !!label);
	},
	{
		maxAge: 60 * 60 * 24,
	}
);

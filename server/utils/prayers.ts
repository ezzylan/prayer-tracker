export const returnFinalPrayers = (
	prayers: Prayer[],
	trackedPrayers: TrackedPrayer[]
) => {
	const prayerMap = new Map(prayers.map((p) => [p.id, p]));

	return trackedPrayers.map((t) => {
		const prayer = prayerMap.get(t.prayerId);
		return {
			id: t.id,
			name: prayer!.name,
			date: t.date,
			isCompleted: t.isCompleted,
		};
	});
};

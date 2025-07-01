<script setup lang="ts">
type FocusedPrayer = {
	id: number;
	name: string;
	date: string;
	isCompleted: boolean;
};

const { prayer, includeDate } = defineProps<{
	prayer: FocusedPrayer;
	includeDate?: boolean;
}>();

let previousTrackedPrayers = [] as FocusedPrayer[];

const prayersFetchKey = includeDate ? "missed-prayers" : "tracked-prayers";

const { data: trackedPrayers } = useNuxtData<FocusedPrayer[]>(prayersFetchKey);

const open = ref(false);

const handleClick = () => {
	if (includeDate) {
		open.value = !open.value;
	} else {
		updatePrayer();
	}
};

const prayersOptimisticUpdate = {
	onRequest() {
		if (trackedPrayers.value) {
			previousTrackedPrayers = trackedPrayers.value;

			trackedPrayers.value =
				prayersFetchKey === "tracked-prayers"
					? trackedPrayers.value.map((t) =>
							t.id === prayer.id
								? { ...t, isCompleted: !t.isCompleted }
								: t
					  )
					: trackedPrayers.value.filter((t) => t.id !== prayer.id);
		}
	},
	onResponseError() {
		trackedPrayers.value = previousTrackedPrayers;
	},
	async onResponse() {
		await refreshNuxtData(prayersFetchKey);
	},
};

const updatePrayer = () =>
	$fetch(`/api/tracked-prayers/${prayer.id}`, {
		method: "PATCH",
		body: { isCompleted: !prayer.isCompleted },
		...prayersOptimisticUpdate,
	});

const deletePrayer = () =>
	$fetch(`/api/missed-prayers/${prayer.id}`, {
		method: "DELETE",
		...prayersOptimisticUpdate,
	});

const icon = computed(() =>
	prayer.isCompleted ? "i-lucide-circle-check-big" : "i-lucide-circle"
);

const color = computed(() => (prayer.isCompleted ? "success" : "neutral"));
</script>

<template>
	<UButton :icon :color size="xl" @click="handleClick">
		<div class="flex justify-between w-full">
			<span>{{ prayer.name }}</span>
			<NuxtTime :datetime="prayer.date" month="long" day="numeric" />
		</div>
	</UButton>

	<UModal
		v-model:open="open"
		title="Have you completed this prayer?"
		description="This prayer will be deleted from the database once you've confirmed."
		:ui="{ footer: 'justify-end' }"
	>
		<template #footer>
			<UButton
				label="Not yet"
				color="neutral"
				variant="outline"
				@click="open = false"
			/>
			<UButton label="Yes" color="neutral" @click="deletePrayer()" />
		</template>
	</UModal>
</template>

<script setup lang="ts">
const { prayer } = defineProps<{ prayer: FocusedPrayer }>();

const { data: trackedPrayers } =
	useNuxtData<FocusedPrayer[]>("tracked-prayers");

let previousTrackedPrayers = [] as FocusedPrayer[];

const updatePrayer = async () =>
	await $fetch(`/api/tracked-prayers/${prayer.id}`, {
		method: "PATCH",
		body: { isCompleted: !prayer.isCompleted },
		onRequest() {
			if (trackedPrayers.value) {
				previousTrackedPrayers = trackedPrayers.value;

				trackedPrayers.value = trackedPrayers.value.map((t) =>
					t.id === prayer.id
						? { ...t, isCompleted: !t.isCompleted }
						: t
				);
			}
		},
		onResponseError() {
			trackedPrayers.value = previousTrackedPrayers;
		},
		async onResponse() {
			await refreshNuxtData("tracked-prayers");
		},
	});

const icon = computed(() =>
	prayer.isCompleted ? "i-lucide-circle-check-big" : "i-lucide-circle"
);

const color = computed(() => (prayer.isCompleted ? "success" : "neutral"));

const { zoneId } = useZone();

const { data: prayerTimes, status } = await useFetch("/api/prayer-times", {
	key: "prayer-times",
	query: { zoneId },
	lazy: true,
	server: false,
	pick: ["items"],
});

const prayerTime = computed(
	() =>
		prayerTimes.value?.items?.find((item) => item.label === prayer.name)
			?.value
);
</script>

<template>
	<UButton
		:icon
		:color
		size="xl"
		@click="updatePrayer()"
		:ui="{ base: 'cursor-pointer' }"
	>
		<div class="flex justify-between w-full">
			<span>{{ prayer.name }}</span>
			<USkeleton
				v-if="status === 'pending' || !prayerTime"
				class="h-6 w-[62px]"
			/>
			<span v-else>{{ prayerTime }}</span>
		</div>
	</UButton>
</template>

<script setup lang="ts">
import { format, fromUnixTime } from "date-fns";

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

const { data: todayPrayers } = useNuxtData<PrayerTime>("prayer-times");

const prayerTime = computed(() => {
	if (!todayPrayers.value) {
		return "";
	}

	const prayerTimestamp = todayPrayers.value[
		prayer.name.toLowerCase() as keyof PrayerTime
	] as number;

	return format(fromUnixTime(prayerTimestamp), "hh:mm a");
});
</script>

<template>
	<UButton :icon :color size="xl" @click="updatePrayer()">
		<div class="flex justify-between w-full">
			<span>{{ prayer.name }}</span>
			<USkeleton v-if="!prayerTime" class="h-6 w-[62px]" />
			<span v-else>{{ prayerTime }}</span>
		</div>
	</UButton>
</template>

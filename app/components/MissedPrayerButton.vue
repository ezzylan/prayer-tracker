<script setup lang="ts">
const { prayer } = defineProps<{ prayer: FocusedPrayer }>();

const { data: missedPrayers } = useNuxtData<FocusedPrayer[]>("missed-prayers");

let previousMissedPrayers = [] as FocusedPrayer[];

const deletePrayer = async () =>
	await $fetch(`/api/missed-prayers/${prayer.id}`, {
		method: "DELETE",
		onRequest() {
			if (missedPrayers.value) {
				previousMissedPrayers = missedPrayers.value;

				missedPrayers.value = missedPrayers.value.filter(
					(t) => t.id !== prayer.id
				);
			}
		},
		onResponseError() {
			missedPrayers.value = previousMissedPrayers;
		},
		async onResponse() {
			await refreshNuxtData("missed-prayers");
		},
	});
</script>

<template>
	<UModal
		title="Have you completed this prayer?"
		description="This prayer will be deleted from the database once you've confirmed."
		:ui="{ footer: 'justify-end' }"
	>
		<UButton
			size="xl"
			color="neutral"
			icon="i-lucide-circle"
			:ui="{ base: 'cursor-pointer' }"
		>
			<div class="flex justify-between w-full">
				<span>{{ prayer.name }}</span>
				<NuxtTime :datetime="prayer.date" month="long" day="numeric" />
			</div>
		</UButton>

		<template #footer>
			<UButton label="Not yet" color="neutral" variant="outline" />
			<UButton label="Yes" color="neutral" @click="deletePrayer()" />
		</template>
	</UModal>
</template>

<script setup lang="ts">
const { data: missedPrayers, status } = await useFetch("/api/trackedPrayers", {
	lazy: true,
	key: "missed-prayers",
	query: { beforeToday: true },
});

const open = ref(false);

const openModal = () => {
	if (missedPrayers.value && missedPrayers.value.length > 0) {
		open.value = !open.value;
	}
};
</script>

<template>
	<UModal
		v-model="open"
		title="Missed Prayers"
		:description="`${missedPrayers && missedPrayers.length} more to go! 💪🏻`"
		:ui="{ content: 'w-2xs', body: 'flex flex-col gap-2' }"
	>
		<UCard
			variant="subtle"
			@click="openModal"
			:ui="{
				body: `flex flex-col items-center justify-center gap-1 ${
					missedPrayers && missedPrayers.length > 0
						? 'hover:cursor-pointer hover:border hover:border-primary hover:rounded-lg'
						: ''
				}`,
			}"
		>
			<template v-if="status === 'pending'">
				<USkeleton class="h-7 w-[160px]" />
				<USkeleton class="h-6 w-[200px]" />
			</template>
			<template v-else>
				<p className="text-xl font-semibold tracking-tight scroll-m-20">
					Missed Prayers:
					{{ missedPrayers ? missedPrayers.length : 0 }}
				</p>
				<p v-if="missedPrayers && missedPrayers.length > 0">
					MashaAllah, click here to see
				</p>
				<p v-else>Alhamdulillah, keep it up! ✨</p>
			</template>
		</UCard>

		<template #body v-if="missedPrayers">
			<PrayerButton
				v-for="prayer in missedPrayers"
				:key="prayer.id"
				:prayer
				:includeDate="true"
			/>
		</template>
	</UModal>
</template>

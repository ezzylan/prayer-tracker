<script setup lang="ts">
const { data: missedPrayers, status } = await useFetch("/api/missed-prayers", {
	lazy: true,
	key: "missed-prayers",
});

const openMissedPrayersModal = ref(false);
const openDeleteMissedPrayersModal = ref(false);

const openModal = () => {
	if (missedPrayers.value && missedPrayers.value.length > 0) {
		openMissedPrayersModal.value = true;
	}
};

const { data: session } = await useSession(useFetch);

let previousMissedPrayers = [] as FocusedPrayer[];

const deleteAllMissedPrayers = async () => {
	await $fetch("/api/missed-prayers", {
		method: "DELETE",
		body: { userId: session.value?.user.id },
		onRequest() {
			openDeleteMissedPrayersModal.value = false;
			openMissedPrayersModal.value = false;

			if (missedPrayers.value) {
				previousMissedPrayers = missedPrayers.value;
				missedPrayers.value = [];
			}
		},
		onResponseError() {
			missedPrayers.value = previousMissedPrayers;
		},
		async onResponse() {
			await refreshNuxtData("missed-prayers");
		},
	});
};
</script>

<template>
	<UModal
		v-model="openMissedPrayersModal"
		title="Missed Prayers"
		:description="`${missedPrayers?.length} more to go! 💪🏻`"
		:ui="{
			content: 'w-2xs',
			body: 'flex flex-col gap-2',
			footer: 'justify-end',
		}"
	>
		<UCard
			variant="subtle"
			@click="openModal"
			:ui="{
				body: `flex flex-col items-center justify-center gap-1 ${
					missedPrayers?.length! > 0
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
					{{ missedPrayers?.length ?? 0 }}
				</p>
				<p v-if="missedPrayers?.length! > 0">
					MashaAllah, click here to see
				</p>
				<p v-else>Alhamdulillah, keep it up! ✨</p>
			</template>
		</UCard>

		<template #body v-if="missedPrayers">
			<MissedPrayerButton
				v-for="prayer in missedPrayers"
				:key="prayer.id"
				:prayer
			/>
		</template>

		<template #footer>
			<UModal
				v-model="openDeleteMissedPrayersModal"
				title="Do you wish to clear all missed prayers?"
				description="All missed prayers will be deleted from the database once you've confirmed."
				:ui="{ footer: 'justify-end' }"
			>
				<UButton
					icon="i-lucide-trash"
					color="error"
					label="Clear All"
				/>
				<template #footer>
					<UButton
						label="Not yet"
						color="neutral"
						variant="outline"
						@click="openDeleteMissedPrayersModal = false"
					/>
					<UButton
						label="Yes"
						color="neutral"
						@click="deleteAllMissedPrayers"
					/>
				</template>
			</UModal>
		</template>
	</UModal>
</template>

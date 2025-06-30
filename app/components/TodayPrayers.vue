<script setup lang="ts">
const { data: trackedPrayers, pending } = await useFetch(
	"/api/trackedPrayers",
	{ key: "tracked-prayers" }
);

const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
</script>

<template>
	<div class="flex flex-col gap-2 w-3xs">
		<template v-if="pending">
			<template v-for="prayer in prayerNames" :key="prayer">
				<UButton icon="i-lucide-circle" size="xl" color="neutral">
					{{ prayer }}
				</UButton>
			</template>
		</template>
		<template v-else>
			<PrayerButton
				v-for="prayer in trackedPrayers"
				:key="prayer.id"
				:prayer
			/>
		</template>
	</div>
</template>

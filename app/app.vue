<script setup lang="ts">
const { data: session } = await useSession(useFetch);

const { data: trackedPrayers } = await useFetch("/api/tracked-prayers", {
	key: "tracked-prayers",
});
</script>

<template>
	<NuxtPwaManifest />
	<UApp>
		<main class="flex flex-col items-center justify-center h-screen gap-8">
			<template v-if="session">
				<UButton color="neutral" @click="signOut()">Sign Out</UButton>

				<TodayDates />
				<ZonesSelectMenu />
				<MissedPrayers />

				<div class="flex flex-col gap-2 w-3xs">
					<TrackedPrayerButton
						v-for="prayer in trackedPrayers"
						:key="prayer.id"
						:prayer
					/>
				</div>
			</template>

			<template v-else>
				<div>
					<h1
						class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
					>
						PrayEZ<span class="pl-4">🕌</span>
					</h1>
					<h2 class="text-xl tracking-tight scroll-m-20 pt-2">
						Track your Islamic prayers with ease!
					</h2>
				</div>
				<SignIn />
			</template>
		</main>
	</UApp>
</template>

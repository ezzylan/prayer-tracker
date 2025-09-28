<script setup lang="ts">
const { data: session } = await useSession(useFetch);

const { data: trackedPrayers } = await useFetch("/api/tracked-prayers", {
	key: "tracked-prayers",
});

const toast = useToast();

watch(trackedPrayers, () => {
	if (trackedPrayers.value?.every((prayer) => prayer.isCompleted)) {
		toast.add({
			title: "Alhamdulillah 🤲🏻",
			description: "You have completed all prayers for today!",
			icon: "i-lucide-circle-check",
			color: "success",
		});
	}
});

const isSigningOut = ref(false);
</script>

<template>
	<NuxtPwaManifest />
	<UApp :toaster="{ position: 'top-right' }">
		<main class="flex flex-col items-center justify-center h-screen gap-8">
			<template v-if="session">
				<UButton
					color="neutral"
					:loading="isSigningOut"
					trailing
					@click="
						() => {
							isSigningOut = true;
							signOut();
						}
					"
					>{{ isSigningOut ? "Signing out..." : "Sign Out" }}</UButton
				>

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
						<span class="pr-2">PrayEZ</span>
						<UIcon name="i-twemoji-mosque" />
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

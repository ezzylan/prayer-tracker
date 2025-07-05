<script setup lang="ts">
import { formatHijriDate, toHijri } from "taqwim-core-utils";

const today = new Date();
const hijriToday = toHijri(today);

const { data: session } = await useSession(useFetch);
const { data: zones } = await useFetch("/api/zones", { key: "zones" });

const { zoneId, pending } = useZone();

const { data: trackedPrayers } = await useFetch("/api/tracked-prayers", {
	key: "tracked-prayers",
});
</script>

<template>
	<UApp>
		<main class="flex flex-col items-center justify-center h-screen gap-8">
			<template v-if="session">
				<UButton color="neutral" @click="signOut()">Sign Out</UButton>

				<div class="flex flex-col items-center gap-1">
					<UBadge>TODAY</UBadge>
					<h1
						class="text-2xl font-semibold tracking-tight scroll-m-20"
					>
						<NuxtTime
							:datetime="today"
							weekday="long"
							month="long"
							day="numeric"
						/>
					</h1>
					<h2
						v-if="hijriToday"
						class="text-xl tracking-tight scroll-m-20"
					>
						{{ formatHijriDate(hijriToday, "iMMM iD, iYYYY") }} AH
					</h2>
				</div>

				<USelectMenu
					v-model="zoneId"
					v-model:loading="pending"
					placeholder="Loading zones..."
					value-key="id"
					:items="zones"
					class="w-48"
				/>

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

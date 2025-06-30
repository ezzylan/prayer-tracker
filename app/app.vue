<script setup lang="ts">
import { formatHijriDate, toHijri } from "taqwim-core-utils";

const today = new Date();
const hijriToday = toHijri(today);
const { data: session } = await useSession(useFetch);
</script>

<template>
	<UApp>
		<main class="flex flex-col items-center justify-center h-screen gap-8">
			<UButton v-if="session" color="neutral" @click="signOut()"
				>Sign Out</UButton
			>
			<div class="flex flex-col items-center gap-1">
				<UBadge>TODAY</UBadge>
				<p class="text-2xl font-semibold tracking-tight scroll-m-20">
					<NuxtTime
						:datetime="today"
						weekday="long"
						month="long"
						day="numeric"
					/>
				</p>
				<p v-if="hijriToday" class="text-xl tracking-tight scroll-m-20">
					{{ formatHijriDate(hijriToday, "iMMM iD, iYYYY") }} AH
				</p>
			</div>

			<template v-if="session">
				<MissedPrayers />
				<TodayPrayers />
			</template>

			<SignIn v-else />
		</main>
	</UApp>
</template>

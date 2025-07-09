<script lang="ts" setup>
import { formatHijriDate, toHijri } from "taqwim-core-utils";

const today = new Date();
const hijriToday = toHijri(today);
</script>

<template>
	<div class="flex flex-col items-center gap-1">
		<UBadge>TODAY</UBadge>
		<h1 class="text-2xl font-semibold tracking-tight scroll-m-20">
			<NuxtTime
				:datetime="today"
				weekday="long"
				month="long"
				day="numeric"
			/>
		</h1>
		<h2 v-if="hijriToday" class="text-xl tracking-tight scroll-m-20">
			{{ formatHijriDate(hijriToday, "iMMM iD, iYYYY") }} AH
		</h2>
	</div>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";

type FetchedZones = {
	jakimCode: string;
	negeri: string;
	daerah: string;
};

const zoneIsPending = ref(true);
const zoneId = useState<string>("zoneId");
const storedZoneId = useStorage("zoneId", "WLY01");

const { execute } = await useFetch(() => `/api/prayer-times/${zoneId.value}`, {
	key: "prayer-times",
	server: false,
	immediate: false,
});

onMounted(() => {
	zoneId.value = storedZoneId.value;
	zoneIsPending.value = false;
	execute();
});

watch(zoneId, (newZoneId) => {
	storedZoneId.value = newZoneId;
	execute();
});

const nuxtApp = useNuxtApp();

const { data: zones } = await useFetch<FetchedZones[]>(
	"https://api.waktusolat.app/zones",
	{
		key: "zones",
		transform: (zones) =>
			zones.map((zone) => ({
				...zone,
				label: `${zone.jakimCode} - ${zone.daerah}`,
			})),
		getCachedData(key) {
			return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
		},
	}
);
</script>

<template>
	<USelectMenu
		class="w-48"
		v-model="zoneId"
		:loading="zoneIsPending"
		:items="zones || []"
		value-key="jakimCode"
		placeholder="Loading zones..."
	/>
</template>

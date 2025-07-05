import { useStorage } from "@vueuse/core";

export const useZone = () => {
	const pending = ref(true);
	const zoneId = useState<string>("zoneId");
	const storedZoneId = useStorage("zoneId", "WLY01");

	onMounted(() => {
		zoneId.value = storedZoneId.value;
		pending.value = false;
	});

	watch(zoneId, (newZoneId) => {
		storedZoneId.value = newZoneId;
	});

	return { zoneId, pending };
};

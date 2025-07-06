export type PrayerTime = {
	day: number;
	hijri: string;
	fajr: number;
	syuruk: number;
	dhuhr: number;
	asr: number;
	maghrib: number;
	isha: number;
};

export type SolatApiData = {
	zone: string;
	year: number;
	month: string;
	month_number: number;
	last_updated: null;
	prayers: PrayerTime[];
};

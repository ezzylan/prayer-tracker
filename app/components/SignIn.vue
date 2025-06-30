<script setup lang="ts">
const devEnv = import.meta.dev;
const isLoadingGithub = ref(false);
const isLoadingGoogle = ref(false);
</script>

<template>
	<UCard
		variant="subtle"
		:ui="{ body: 'flex flex-col items-center justify-center gap-4' }"
	>
		<p class="text-xl font-semibold tracking-tight scroll-m-20">
			You are not signed in
		</p>
		<UButton
			v-if="devEnv"
			color="neutral"
			variant="solid"
			:loading="isLoadingGithub"
			trailing
			trailing-icon="i-logos-github-icon"
			@click="
				() => {
					isLoadingGithub = true;
					githubSignIn();
				}
			"
		>
			{{
				isLoadingGithub
					? "Signing in..."
					: "Sign in with GitHub (dev only)"
			}}
		</UButton>
		<UButton
			color="neutral"
			variant="solid"
			:loading="isLoadingGoogle"
			trailing
			trailing-icon="i-logos-google-icon"
			@click="
				() => {
					isLoadingGoogle = true;
					googleSignIn();
				}
			"
		>
			{{ isLoadingGoogle ? "Signing in..." : "Sign in with Google" }}
		</UButton>
	</UCard>
</template>

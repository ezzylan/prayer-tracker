import { createAuthClient } from "better-auth/vue";

export const { signIn, signOut, useSession } = createAuthClient();

export const googleSignIn = async () => {
	const data = await signIn.social({ provider: "google" });
};

export const githubSignIn = async () => {
	const data = await signIn.social({ provider: "github" });
};

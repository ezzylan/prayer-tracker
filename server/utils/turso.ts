import { createClient } from "@libsql/client";

export function useTurso() {
	const { turso } = useRuntimeConfig();

	return createClient({
		url: turso.databaseUrl,
		authToken: turso.authToken,
	});
}

import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSession } from "#/lib/auth-functions.ts";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const session = await getSession();

		throw redirect({ to: session ? "/dashboard" : "/login" });
	},
});

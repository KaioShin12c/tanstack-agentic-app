import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginPage } from "#/components/auth/login-page.tsx";
import { getSession } from "#/lib/auth-functions.ts";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const session = await getSession();

		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});

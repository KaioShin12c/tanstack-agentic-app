import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSession } from "#/features/auth/auth.functions.ts";
import { LoginPage } from "#/features/auth/components/login-page.tsx";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const session = await getSession();

		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});

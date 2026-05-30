import { createFileRoute } from "@tanstack/react-router";

import { RegisterPage } from "#/features/auth/components/register-page.tsx";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "#/components/auth/login-page.tsx";

export const Route = createFileRoute("/login")({ component: LoginPage });

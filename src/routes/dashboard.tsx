import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import { getSession } from "#/features/auth/auth.functions.ts";
import { authClient } from "#/features/auth/auth-client.ts";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		const session = await getSession();

		if (!session) {
			throw redirect({ to: "/login" });
		}

		return { user: session.user };
	},
	component: DashboardPage,
});

function DashboardPage() {
	const { user } = Route.useRouteContext();
	const navigate = useNavigate();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [signOutError, setSignOutError] = useState<string | null>(null);

	const handleSignOut = async () => {
		setIsSigningOut(true);
		setSignOutError(null);

		try {
			const { error } = await authClient.signOut();

			if (error) {
				setSignOutError(error.message || "Could not sign out.");
				setIsSigningOut(false);
				return;
			}

			await navigate({ to: "/login" });
		} catch {
			setSignOutError("Could not sign out.");
			setIsSigningOut(false);
		}
	};

	return (
		<main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-foreground">
			<section className="w-full max-w-2xl rounded-3xl border bg-card p-8 shadow-2xl shadow-primary/5">
				<div className="mb-8">
					<p className="mb-3 text-sm font-semibold tracking-[0.24em] uppercase text-muted-foreground">
						Dashboard
					</p>
					<h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
						Welcome back{user.name ? `, ${user.name}` : ""}.
					</h1>
				</div>

				<div className="mb-8 rounded-2xl border bg-background/70 p-5">
					<p className="text-sm font-medium text-muted-foreground">
						Signed in as
					</p>
					<p className="mt-2 text-lg font-semibold">
						{user.email || user.name || "Authenticated user"}
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<Button
						disabled={isSigningOut}
						onClick={() => {
							void handleSignOut();
						}}
						type="button"
						variant="outline"
					>
						{isSigningOut ? "Signing out..." : "Log out"}
					</Button>
					{signOutError ? (
						<p className="text-sm font-medium text-destructive" role="alert">
							{signOutError}
						</p>
					) : null}
				</div>
			</section>
		</main>
	);
}

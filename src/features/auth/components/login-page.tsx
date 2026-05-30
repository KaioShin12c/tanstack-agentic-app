"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import { GithubIcon, LockKeyholeIcon, TerminalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { type LoginFormValues, loginSchema } from "../auth.schema.ts";
import { authClient } from "../auth-client.ts";

const LOGIN_ERROR_MESSAGE = "Không thể đăng nhập bằng email và mật khẩu.";

function FieldError({ message }: { message?: string }) {
	if (!message) return null;

	return (
		<p
			className="font-mono-display text-[10px] tracking-wider text-rose-400"
			role="alert"
		>
			[ERROR] {message}
		</p>
	);
}

function TypewriterText({
	text,
	delay = 0,
	speed = 40,
}: {
	text: string;
	delay?: number;
	speed?: number;
}) {
	const [displayText, setDisplayText] = useState("");
	const [started, setStarted] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setStarted(true), delay);
		return () => clearTimeout(timeout);
	}, [delay]);

	useEffect(() => {
		if (!started) return;
		let i = 0;
		const interval = setInterval(() => {
			if (i < text.length) {
				setDisplayText(text.slice(0, i + 1));
				i++;
			} else {
				clearInterval(interval);
			}
		}, speed);
		return () => clearInterval(interval);
	}, [started, text, speed]);

	return (
		<span>
			{displayText}
			{started && displayText.length < text.length && (
				<span className="animate-blink inline-block w-[2px] h-[1em] bg-amber-500 ml-0.5 align-middle" />
			)}
		</span>
	);
}

function StatusLine({
	label,
	value,
	status,
	delay,
}: {
	label: string;
	value: string;
	status: "ok" | "warn" | "error";
	delay: number;
}) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), delay);
		return () => clearTimeout(timeout);
	}, [delay]);

	const statusColor = {
		ok: "text-emerald-400",
		warn: "text-amber-400",
		error: "text-rose-400",
	}[status];

	return (
		<div
			className={`flex items-center gap-3 font-mono-display text-xs transition-all duration-700 ${
				visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
			}`}
		>
			<span
				className={`inline-block h-1.5 w-1.5 rounded-full ${statusColor} ${status === "ok" ? "animate-pulse" : ""}`}
			/>
			<span className="text-slate-500 uppercase tracking-wider">{label}</span>
			<span className="text-slate-600">|</span>
			<span className={statusColor}>{value}</span>
		</div>
	);
}

export function LoginPage() {
	const navigate = useNavigate();
	const [authError, setAuthError] = useState<string | null>(null);
	const [githubError, setGithubError] = useState<string | null>(null);
	const [isGithubLoading, setIsGithubLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [mounted, setMounted] = useState(false);
	const {
		clearErrors,
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
		setError,
	} = useForm<LoginFormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleGithubSignIn = async () => {
		setAuthError(null);
		setGithubError(null);
		setIsGithubLoading(true);

		try {
			const { error } = await authClient.signIn.social({
				provider: "github",
				callbackURL: "/dashboard",
				errorCallbackURL: "/login",
			});

			if (error) {
				setGithubError(error.message || "Không thể đăng nhập bằng GitHub.");
				setIsGithubLoading(false);
			}
		} catch {
			setGithubError("Không thể đăng nhập bằng GitHub.");
			setIsGithubLoading(false);
		}
	};

	const onSubmit = handleSubmit(async (values) => {
		setAuthError(null);
		setGithubError(null);
		clearErrors();

		const result = loginSchema.safeParse(values);

		if (!result.success) {
			const fieldErrors = result.error.flatten().fieldErrors;

			for (const [fieldName, messages] of Object.entries(fieldErrors)) {
				const [message] = messages ?? [];

				if (message) {
					setError(fieldName as keyof LoginFormValues, { message });
				}
			}

			return;
		}

		try {
			const { error } = await authClient.signIn.email({
				email: result.data.email,
				password: result.data.password,
			});

			if (error) {
				setAuthError(LOGIN_ERROR_MESSAGE);
				return;
			}

			setIsSuccess(true);
			void navigate({ to: "/dashboard" });
		} catch {
			setAuthError(LOGIN_ERROR_MESSAGE);
		}
	});

	return (
		<main className="relative flex min-h-dvh overflow-hidden bg-[#08080c] text-slate-200">
			{/* Background Grid */}
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.5) 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Radial glow */}
			<div className="absolute left-1/4 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.03] blur-[120px]" />
			<div className="absolute right-1/4 bottom-1/3 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-500/[0.02] blur-[100px]" />

			{/* Noise & Scanlines */}
			<div className="noise-overlay scanlines" />

			{/* Content */}
			<section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-0 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-12">
				{/* Left Panel - Terminal Aesthetic */}
				<div className="flex flex-col gap-10 lg:min-h-[640px] lg:justify-between">
					<div
						className={`flex items-center gap-4 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
					>
						<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 shadow-lg shadow-amber-500/10">
							<TerminalIcon aria-hidden="true" className="h-5 w-5" />
						</div>
						<div>
							<p className="font-mono-display text-xs font-medium tracking-[0.3em] uppercase text-amber-500/60">
								Agentic App
							</p>
							<p className="font-mono-display text-sm text-slate-400">
								Secure Terminal v2.4.1
							</p>
						</div>
					</div>

					<div className="max-w-xl space-y-8">
						<div
							className={`transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
						>
							<p className="mb-4 font-mono-display text-xs font-medium tracking-[0.3em] uppercase text-amber-500/60">
								<span className="text-amber-500">$</span> ./authenticate
								--secure
							</p>
							<h1 className="font-mono-display text-4xl font-bold leading-tight tracking-tight text-slate-100 md:text-6xl lg:text-7xl">
								<TypewriterText text="Access your" delay={600} speed={50} />
								<br />
								<span className="text-glow-amber text-amber-500">
									<TypewriterText
										text="command center."
										delay={1200}
										speed={60}
									/>
								</span>
							</h1>
						</div>

						<p
							className={`font-serif-body text-lg italic leading-relaxed text-slate-400 transition-all duration-1000 delay-[1800ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
						>
							A refined gateway for operators. Authenticate via email and
							password or GitHub to enter the workspace.
						</p>

						<div
							className={`space-y-3 border-l-2 border-amber-500/20 pl-6 transition-all duration-1000 delay-[2200ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
						>
							<StatusLine
								label="System"
								value="ONLINE"
								status="ok"
								delay={2400}
							/>
							<StatusLine
								label="Auth"
								value="EMAIL_PASSWORD"
								status="ok"
								delay={2600}
							/>
							<StatusLine
								label="Encrypt"
								value="AES-256-GCM"
								status="ok"
								delay={2800}
							/>
							<StatusLine
								label="Session"
								value="AWAITING_CREDENTIALS"
								status="warn"
								delay={3000}
							/>
						</div>
					</div>

					<div
						className={`flex gap-4 transition-all duration-1000 delay-[2000ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
					>
						<div className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 font-mono-display text-xs text-slate-500">
							<span className="text-amber-500/60">git</span> commit -m "secure"
						</div>
						<div className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 font-mono-display text-xs text-slate-500">
							<span className="text-cyan-500/60">sha256</span> verified
						</div>
					</div>
				</div>

				{/* Right Panel - Login Form */}
				<div
					className={`transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-100 translate-y-8"}`}
				>
					<Card className="relative w-full max-w-md border-slate-800/60 bg-[#0c0c14]/80 shadow-2xl backdrop-blur-xl animate-glow-pulse">
						{/* Corner accents */}
						<div className="absolute -left-px -top-px h-8 w-8 border-l-2 border-t-2 border-amber-500/30 rounded-tl-xl" />
						<div className="absolute -right-px -top-px h-8 w-8 border-r-2 border-t-2 border-amber-500/30 rounded-tr-xl" />
						<div className="absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2 border-amber-500/30 rounded-bl-xl" />
						<div className="absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2 border-amber-500/30 rounded-br-xl" />

						<CardHeader className="gap-4 text-center pb-2">
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-500 shadow-lg shadow-amber-500/10">
								<LockKeyholeIcon aria-hidden="true" className="h-6 w-6" />
							</div>
							<div className="space-y-2">
								<CardTitle className="font-mono-display text-2xl font-bold tracking-tight text-slate-100">
									Authentication
								</CardTitle>
								<CardDescription className="font-serif-body text-base italic text-slate-500">
									Enter your credentials to proceed.
								</CardDescription>
							</div>
						</CardHeader>

						<CardContent className="pt-6">
							<form onSubmit={(event) => void onSubmit(event)} noValidate>
								<FieldGroup className="gap-5">
									{authError ? (
										<p
											className="rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 font-mono-display text-xs text-rose-400"
											role="alert"
										>
											[AUTH_ERROR] {authError}
										</p>
									) : null}

									<Field>
										<FieldLabel
											htmlFor="login-email"
											className="font-mono-display text-xs font-medium tracking-wider uppercase text-slate-500"
										>
											Email
										</FieldLabel>
										<Input
											id="login-email"
											placeholder="operator@domain.net"
											type="email"
											autoComplete="username"
											aria-invalid={errors.email ? "true" : "false"}
											className="border-slate-800 bg-slate-900/50 font-mono-display text-sm text-slate-200 placeholder:text-slate-700 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all duration-300"
											{...register("email")}
										/>
										<FieldError message={errors.email?.message} />
									</Field>

									<Field>
										<div className="flex items-center justify-between gap-3">
											<FieldLabel
												htmlFor="password"
												className="font-mono-display text-xs font-medium tracking-wider uppercase text-slate-500"
											>
												Password
											</FieldLabel>
										</div>
										<Input
											id="password"
											placeholder="••••••••"
											type="password"
											autoComplete="current-password"
											aria-invalid={errors.password ? "true" : "false"}
											className="border-slate-800 bg-slate-900/50 font-mono-display text-sm text-slate-200 placeholder:text-slate-700 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all duration-300"
											{...register("password")}
										/>
										<FieldError message={errors.password?.message} />
										<FieldDescription className="font-mono-display text-[10px] tracking-wider text-slate-700">
											EMAIL_PASSWORD_AUTH
										</FieldDescription>
									</Field>

									<Button
										className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono-display text-sm tracking-wider uppercase hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300"
										disabled={isSubmitting || isGithubLoading || isSuccess}
										size="lg"
										type="submit"
									>
										{isSuccess
											? "Access Granted"
											: isSubmitting
												? "Authenticating..."
												: "Authenticate"}
									</Button>

									<FieldSeparator className="font-mono-display text-[10px] tracking-[0.3em] text-slate-700">
										OR
									</FieldSeparator>

									<Button
										className="w-full border-slate-800 bg-slate-900/50 font-mono-display text-sm tracking-wider text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all duration-300"
										disabled={isGithubLoading || isSubmitting || isSuccess}
										onClick={() => {
											void handleGithubSignIn();
										}}
										size="lg"
										type="button"
										variant="outline"
									>
										<GithubIcon className="mr-2 h-4 w-4" aria-hidden="true" />
										{isGithubLoading ? "Redirecting..." : "GitHub OAuth"}
									</Button>
									{githubError ? (
										<p
											className="font-mono-display text-xs text-rose-400"
											role="alert"
										>
											[ERROR] {githubError}
										</p>
									) : null}
								</FieldGroup>
							</form>
						</CardContent>

						<CardFooter className="justify-center pb-6">
							<p className="font-mono-display text-[10px] tracking-wider text-slate-600">
								No account?{" "}
								<Link
									className="text-amber-500/60 hover:text-amber-500 transition-colors duration-300"
									to="/register"
								>
									Register
								</Link>
							</p>
						</CardFooter>
					</Card>
				</div>
			</section>
		</main>
	);
}

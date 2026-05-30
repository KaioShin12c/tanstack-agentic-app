import { GithubIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";

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

export function LoginPage() {
	return (
		<main className="relative flex min-h-dvh overflow-hidden bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_28%),radial-gradient(circle_at_82%_20%,color-mix(in_oklab,var(--ring)_36%,transparent),transparent_24%),linear-gradient(135deg,color-mix(in_oklab,var(--muted)_80%,transparent),transparent_42%)]" />
			<div className="absolute left-1/2 top-8 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

			<section className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
				<div className="flex flex-col gap-8 rounded-[2rem] border bg-card/70 p-6 shadow-2xl shadow-primary/5 backdrop-blur md:p-10 lg:min-h-[640px] lg:justify-between">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
								<LockKeyholeIcon aria-hidden="true" />
							</div>
							<div>
								<p className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground">
									Agentic App
								</p>
								<p className="font-medium">Secure workspace</p>
							</div>
						</div>
						<span className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground">
							UI preview
						</span>
					</div>

					<div className="max-w-xl">
						<p className="mb-4 text-sm font-semibold tracking-[0.24em] uppercase text-muted-foreground">
							Đăng nhập hệ thống
						</p>
						<h1 className="text-balance font-serif text-5xl font-semibold tracking-tight md:text-7xl">
							Một cổng vào gọn gàng cho đội vận hành.
						</h1>
						<p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
							Giao diện đăng nhập tối giản, rõ thứ bậc, sẵn sàng nối logic xác
							thực username/password và GitHub ở bước tiếp theo.
						</p>
					</div>

					<div className="grid gap-3 sm:grid-cols-3">
						{["No logic", "shadcn/ui", "GitHub ready"].map((item) => (
							<div
								key={item}
								className="rounded-2xl border bg-background/70 px-4 py-3 text-sm font-medium"
							>
								{item}
							</div>
						))}
					</div>
				</div>

				<Card className="mx-auto w-full max-w-md border bg-card/95 shadow-2xl shadow-primary/10 backdrop-blur">
					<CardHeader className="gap-3 text-center">
						<div className="mx-auto flex size-14 items-center justify-center rounded-2xl border bg-muted">
							<UserRoundIcon aria-hidden="true" />
						</div>
						<CardTitle className="text-3xl">Chào mừng trở lại</CardTitle>
						<CardDescription>
							Nhập thông tin tài khoản hoặc tiếp tục bằng GitHub.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="username">Username</FieldLabel>
									<Input
										id="username"
										name="username"
										placeholder="dat.nguyen"
										type="text"
										autoComplete="username"
									/>
								</Field>

								<Field>
									<div className="flex items-center justify-between gap-3">
										<FieldLabel htmlFor="password">Password</FieldLabel>
										<a
											className="text-sm font-medium no-underline"
											href="/login"
										>
											Quên mật khẩu?
										</a>
									</div>
									<Input
										id="password"
										name="password"
										placeholder="••••••••"
										type="password"
										autoComplete="current-password"
									/>
									<FieldDescription>
										UI-only form, chưa gắn xử lý đăng nhập.
									</FieldDescription>
								</Field>

								<Button className="w-full" size="lg" type="button">
									Đăng nhập
								</Button>

								<FieldSeparator>hoặc</FieldSeparator>

								<Button
									className="w-full"
									size="lg"
									type="button"
									variant="outline"
								>
									<GithubIcon data-icon="inline-start" aria-hidden="true" />
									Tiếp tục với GitHub
								</Button>
							</FieldGroup>
						</form>
					</CardContent>

					<CardFooter className="justify-center text-sm text-muted-foreground">
						Chưa có tài khoản?{" "}
						<a className="ml-1 font-medium no-underline" href="/login">
							Liên hệ quản trị viên
						</a>
					</CardFooter>
				</Card>
			</section>
		</main>
	);
}

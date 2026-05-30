import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "#/server/db/index.ts";
import * as schema from "#/server/db/schema.ts";

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubProvider =
	githubClientId && githubClientSecret
		? {
				github: {
					clientId: githubClientId,
					clientSecret: githubClientSecret,
				},
			}
		: undefined;

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
	},
	socialProviders: githubProvider,
	plugins: [tanstackStartCookies()],
});

import { z } from "zod";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

export const registerSchema = z
	.object({
		name: z.string().trim().min(1, "Name is required."),
		email: z.string().trim().email("Enter a valid email address."),
		password: z
			.string()
			.min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters.")
			.max(PASSWORD_MAX_LENGTH, "Password must be at most 128 characters."),
		confirmPassword: z.string().min(1, "Confirm your password."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
	email: z.string().trim().email("Enter a valid email address."),
	password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

import { z } from "zod";

// bcrypt only uses the first 72 bytes of a password.
const PASSWORD_MAX_LENGTH = 72;

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"));

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

// Unknown keys (such as a client-sent `role`) are stripped by z.object.
export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: emailField,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(PASSWORD_MAX_LENGTH, "Password must be at most 72 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "@/actions/auth";
import FormAlert from "@/components/auth/FormAlert";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterInput) {
    setServerError(undefined);
    const result = await registerUser(values);

    if (result.success) {
      router.push("/sign-in?registered=1");
      return;
    }

    setServerError(result.error);
    for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
      if (messages?.[0]) {
        setError(field as keyof RegisterInput, { message: messages[0] });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      {serverError && <FormAlert variant="error" message={serverError} />}
      <FormField
        id="name"
        label="Name"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <FormField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithCredentials } from "@/actions/auth";
import FormAlert from "@/components/auth/FormAlert";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { signInSchema, type SignInInput } from "@/lib/validations/auth";

interface SignInFormProps {
  callbackUrl?: string;
  initialError?: string;
  notice?: string;
}

export default function SignInForm({
  callbackUrl,
  initialError,
  notice,
}: SignInFormProps) {
  const [serverError, setServerError] = useState(initialError);
  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInInput) {
    setServerError(undefined);
    // On success the action redirects; it only returns when sign-in failed.
    const result = await signInWithCredentials(values, callbackUrl);
    if (result?.success === false) {
      setServerError(result.error);
      // Keep the email, clear the password, and put the cursor back there.
      resetField("password");
      setFocus("password");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      {serverError ? (
        <FormAlert variant="error" message={serverError} />
      ) : (
        notice && <FormAlert variant="success" message={notice} />
      )}
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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import OrDivider from "@/components/auth/OrDivider";
import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth-guard";
import { DEFAULT_SIGN_IN_REDIRECT, SIGN_IN_PATH } from "@/lib/routes";

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect(DEFAULT_SIGN_IN_REDIRECT);

  return (
    <AuthCard
      title="Create an account"
      description="Rent and list properties with one account."
      footer={
        <>
          Already have an account?{" "}
          <Link href={SIGN_IN_PATH} className="font-semibold text-primary-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
      <OrDivider />
      <GoogleSignInButton />
    </AuthCard>
  );
}

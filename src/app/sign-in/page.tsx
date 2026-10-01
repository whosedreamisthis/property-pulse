import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import OrDivider from "@/components/auth/OrDivider";
import SignInForm from "@/components/auth/SignInForm";
import { getCurrentUser } from "@/lib/auth-guard";
import { DEFAULT_SIGN_IN_REDIRECT } from "@/lib/routes";

// NextAuth redirects sign-in failures (including Google ones) here as ?error=<type>.
const SIGN_IN_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already registered with a password — sign in with email and password",
  CredentialsSignin: "Invalid email or password",
};

interface SignInPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  if (await getCurrentUser()) redirect(DEFAULT_SIGN_IN_REDIRECT);

  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : undefined;
  const errorType = typeof params.error === "string" ? params.error : undefined;
  const initialError = errorType
    ? (SIGN_IN_ERRORS[errorType] ?? "Sign-in failed. Please try again.")
    : undefined;
  const notice = params.registered
    ? "Account created. Sign in to continue."
    : undefined;

  return (
    <AuthCard
      title="Sign in"
      description="Welcome back to PropertyPulse."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary-600 hover:underline">
            Register
          </Link>
        </>
      }
    >
      <SignInForm
        callbackUrl={callbackUrl}
        initialError={initialError}
        notice={notice}
      />
      <OrDivider />
      <GoogleSignInButton callbackUrl={callbackUrl} />
    </AuthCard>
  );
}

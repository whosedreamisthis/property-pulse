import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { signInSchema } from "@/lib/validations/auth";

let dummyHash: Promise<string> | undefined;

// Compare against a throwaway hash when there is no usable password, so unknown
// emails take as long as wrong passwords and timing doesn't reveal which accounts exist.
function getDummyHash() {
  dummyHash ??= hashPassword("timing-safe-placeholder");
  return dummyHash;
}

export async function authorizeCredentials(credentials: unknown) {
  const parsed = signInSchema.safeParse(credentials);
  if (!parsed.success) return null;

  try {
    const user = await db.user.findUnique({
      where: { email: parsed.data.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        password: true,
      },
    });

    // Unknown email or Google-only account: still run bcrypt so this fails as slowly as a wrong password.
    if (!user?.password) {
      await verifyPassword(parsed.data.password, await getDummyHash());
      return null;
    }

    const valid = await verifyPassword(parsed.data.password, user.password);
    if (!valid) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    };
  } catch (error) {
    console.error("Credentials sign-in failed", error);
    return null;
  }
}

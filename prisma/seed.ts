import "dotenv/config";
import type { Role } from "../src/generated/prisma/enums";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";

// Made-up demo accounts for local/dev testing only (.test is a reserved domain).
const DEMO_USERS: { name: string; email: string; password: string; role: Role }[] = [
  {
    name: "Avery Admin",
    email: "admin@propertypulse.test",
    password: "AdminDemo123!",
    role: "ADMIN",
  },
  {
    name: "Olivia Owner",
    email: "olivia@propertypulse.test",
    password: "OliviaDemo123!",
    role: "USER",
  },
  {
    name: "Riley Renter",
    email: "riley@propertypulse.test",
    password: "RileyDemo123!",
    role: "USER",
  },
];

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed demo users with NODE_ENV=production.");
  }

  for (const { name, email, password, role } of DEMO_USERS) {
    const data = { name, role, password: await hashPassword(password) };
    await db.user.upsert({
      where: { email },
      update: data,
      create: { email, ...data },
      select: { id: true },
    });
    console.log(`Seeded ${role.padEnd(5)} ${email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());

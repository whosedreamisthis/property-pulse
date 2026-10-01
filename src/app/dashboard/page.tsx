import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";

const SECTIONS = [
  { title: "My Favorites", empty: "You haven't saved any properties yet." },
  { title: "My Inquiries", empty: "You haven't sent any inquiries yet." },
  {
    title: "My Listings",
    empty: "You haven't listed a property yet. List your first property.",
  },
];

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-gray-500">
            Signed in as {user.name ?? user.email}
          </p>
        </div>
        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Admin Dashboard
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-6">
        {SECTIONS.map((section) => (
          <section
            key={section.title}
            className="rounded-lg border border-gray-300 bg-white p-6"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-2 text-gray-500">{section.empty}</p>
          </section>
        ))}
      </div>
    </main>
  );
}

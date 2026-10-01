import type { Session } from "next-auth";

interface DashboardPlaceholderProps {
  title: string;
  user: Session["user"];
}

export default function DashboardPlaceholder({
  title,
  user,
}: DashboardPlaceholderProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{title}</h1>
      <dl className="mt-6 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-gray-700">
        <dt className="font-semibold">Name</dt>
        <dd>{user.name ?? "—"}</dd>
        <dt className="font-semibold">Email</dt>
        <dd>{user.email ?? "—"}</dd>
        <dt className="font-semibold">Role</dt>
        <dd>{user.role}</dd>
      </dl>
    </main>
  );
}

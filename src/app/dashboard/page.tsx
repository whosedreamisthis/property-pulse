import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { ROLE_DASHBOARDS } from "@/lib/routes";

export default async function DashboardPage() {
  const user = await requireUser();
  redirect(ROLE_DASHBOARDS[user.role]);
}

import DashboardPlaceholder from "@/components/dashboard/DashboardPlaceholder";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminDashboardPage() {
  const user = await requireRole("ADMIN");
  return <DashboardPlaceholder title="Admin Dashboard" user={user} />;
}

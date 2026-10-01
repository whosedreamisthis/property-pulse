import DashboardPlaceholder from "@/components/dashboard/DashboardPlaceholder";
import { requireRole } from "@/lib/auth-guard";

export default async function OwnerDashboardPage() {
  const user = await requireRole("OWNER");
  return <DashboardPlaceholder title="Owner Dashboard" user={user} />;
}

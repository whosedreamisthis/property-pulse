import DashboardPlaceholder from "@/components/dashboard/DashboardPlaceholder";
import { requireRole } from "@/lib/auth-guard";

export default async function RenterDashboardPage() {
  const user = await requireRole("RENTER");
  return <DashboardPlaceholder title="Renter Dashboard" user={user} />;
}

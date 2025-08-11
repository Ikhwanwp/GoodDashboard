
import DashboardLayout from "@/app/dashboard/layout";

export default function BADashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We can reuse the main dashboard layout as it contains the logic
  // for sidebar, auth wrapping, and role-based menu display.
  return <DashboardLayout>{children}</DashboardLayout>;
}

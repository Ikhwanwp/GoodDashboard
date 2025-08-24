
import DashboardLayout from "@/app/dashboard/layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The route protection logic is now handled by the AuthWrapper in the main DashboardLayout.
  // This layout simply ensures that admin pages are rendered within the consistent dashboard structure.
  return <DashboardLayout>{children}</DashboardLayout>;
}

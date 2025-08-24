
"use client";

import { useData } from "@/context/data-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading } = useData();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser?.role !== "Admin") {
      // If not loading and user is not an Admin, redirect them.
      // The main layout already handles redirecting to their respective dashboards.
      // This is an extra layer of security.
      router.push("/dashboard"); 
    }
  }, [currentUser, loading, router]);

  if (loading || currentUser?.role !== "Admin") {
    // Show a loader while verifying the role or redirecting.
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If the user is an Admin, render the children within the main DashboardLayout.
  // The DashboardLayout will correctly show the Admin sidebar and handle auth state.
  return <DashboardLayout>{children}</DashboardLayout>;
}

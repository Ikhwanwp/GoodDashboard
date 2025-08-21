
"use client";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Users } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { FulfillmentView } from "@/components/fulfillment/fulfillment-view";

export default function DashboardBAPage() {
  // Dummy data for BA Dashboard
  const summaryData = {
    totalMitra: 25,
    activeKerjasama: 15,
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard Business Alliance" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Proyek dalam Proses" 
          value={"5"} 
          icon={Handshake}
          variant="active"
        />
        <SummaryCard 
          title="Proyek Selesai Bulan Ini" 
          value={"2"} 
          icon={Users} 
        />
      </div>

       <div className="mt-4">
        <FulfillmentView />
       </div>
    </main>
  );
}


"use client";
import { PageHeader } from "@/components/shared/page-header";
import { Handshake, Users, CheckCircle, Package } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { FulfillmentTracker } from "@/components/dashboard/fulfillment-tracker";

export default function DashboardBAPage() {
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
          icon={CheckCircle} 
        />
        <SummaryCard 
          title="Kode Produk Baru" 
          value={"3"} 
          icon={Package} 
        />
        <SummaryCard 
          title="Total Mitra Aktif" 
          value={"12"} 
          icon={Users} 
        />
      </div>

      <div className="mt-4">
        <FulfillmentTracker />
      </div>
    </main>
  );
}

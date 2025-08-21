
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ReminderList } from "@/components/dashboard/reminder-list";
import { Building2, FileText, Handshake } from "lucide-react";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";
import { FulfillmentWidget } from "@/components/dashboard/fulfillment-widget";

export default function DashboardPage() {
  const { instansi, kontrakPks, kontrakMou, loading } = useData();

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Dashboard" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-8 mt-4 md:grid-cols-3">
            <div className="md:col-span-2">
                <Skeleton className="h-96 w-full" />
            </div>
            <div>
                 <Skeleton className="h-96 w-full" />
            </div>
        </div>
        <Skeleton className="h-64 w-full mt-4" />
      </main>
    );
  }
  
  const activePksCount = kontrakPks.filter(k => k.statusKontrak === 'Aktif').length;
  const expiringContracts = [...kontrakPks, ...kontrakMou].filter(c => c.statusKontrak === 'Aktif' && new Date(c.tanggalBerakhir) < new Date(new Date().setDate(new Date().getDate() + 90))).length;


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard Government Account" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard 
          title="Total K/L Aktif" 
          value={instansi.length.toString()} 
          icon={Building2} 
        />
        <SummaryCard 
          title="Kontrak PKS Aktif" 
          value={activePksCount.toString()} 
          icon={Handshake} 
          variant="active" 
        />
        <SummaryCard 
          title="Kontrak Segera Berakhir" 
          value={expiringContracts.toString()} 
          icon={FileText} 
        />
      </div>

      <div className="grid gap-8 mt-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReminderList />
        </div>
        <div className="lg:col-span-1">
           {/* Placeholder for Partnership Health Score */}
           <Skeleton className="h-full w-full" />
        </div>
      </div>
      
      <div className="mt-4">
        <FulfillmentWidget />
      </div>
    </main>
  );
}

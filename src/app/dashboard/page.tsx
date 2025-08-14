
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ReminderList } from "@/components/dashboard/reminder-list";
import { Building2, FileText, Handshake, FileArchive } from "lucide-react";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { instansi, kontrakPks, kontrakMou, dokumenSph, loading } = useData();
  
  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Dashboard" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div>
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }
  
  const activePksCount = kontrakPks.filter(k => k.statusKontrak === 'Aktif').length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard Government Account" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Jumlah K/L Total" 
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
          title="Jumlah MoU" 
          value={kontrakMou.length.toString()} 
          icon={FileText} 
        />
        <SummaryCard 
          title="Jumlah SPH" 
          value={dokumenSph.length.toString()} 
          icon={FileArchive} 
        />
      </div>

      <div>
        <ReminderList />
      </div>
    </main>
  );
}

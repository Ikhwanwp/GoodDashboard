"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ReminderList } from "@/components/dashboard/reminder-list";
import { Building2, FileText, Handshake, FileArchive, Banknote } from "lucide-react";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { instansi, kontrakPks, kontrakMou, dokumenSph, loading } = useData();
  
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Dashboard" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-28 w-full" />
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
  
  const activePks = kontrakPks.filter(k => k.statusKontrak === 'Aktif');
  const activePksCount = activePks.length;
  const totalNominalAktif = activePks.reduce((total, k) => total + (k.nominal || 0), 0);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard Government Account" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
          title="Total Nilai Kontrak Aktif" 
          value={formatRupiah(totalNominalAktif)} 
          icon={Banknote} 
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


"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ReminderList } from "@/components/dashboard/reminder-list";
import { Building2, FileText, Handshake, Banknote, FileClock } from "lucide-react";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";
import { FulfillmentWidget } from "@/components/dashboard/fulfillment-widget";

export default function DashboardPage() {
  const { instansi, kontrakPks, kontrakMou, dokumenSph, loading } = useData();

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
  
  const activePks = kontrakPks.filter(k => k.statusKontrak === 'Aktif');
  const activeMou = kontrakMou.filter(m => m.statusKontrak === 'Aktif');
  const totalActiveRevenue = activePks.reduce((acc, contract) => acc + contract.nominal, 0);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const expiringContracts = [...kontrakPks, ...kontrakMou].filter(c => c.statusKontrak === 'Aktif' && new Date(c.tanggalBerakhir) < new Date(new Date().setDate(new Date().getDate() + 90))).length;


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard Government Account" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <SummaryCard 
          title="Total K/L Aktif" 
          value={instansi.length.toString()} 
          icon={Building2} 
        />
        <SummaryCard 
          title="Kontrak PKS Aktif" 
          value={activePks.length.toString()} 
          icon={Handshake} 
        />
        <SummaryCard 
          title="Kontrak MoU Aktif" 
          value={activeMou.length.toString()} 
          icon={FileText} 
        />
        <SummaryCard 
          title="Kontrak Segera Berakhir" 
          value={expiringContracts.toString()} 
          icon={FileClock} 
        />
         <SummaryCard 
          title="Jumlah SPH" 
          value={dokumenSph.length.toString()} 
          icon={FileText} 
        />
        <SummaryCard 
            title="Total Pendapatan" 
            value={formatRupiah(totalActiveRevenue)} 
            icon={Banknote} 
            variant="active" 
        />
      </div>

      <div className="grid gap-8 mt-4">
        <ReminderList />
      </div>
      
      <div className="mt-8">
        <FulfillmentWidget />
      </div>
    </main>
  );
}

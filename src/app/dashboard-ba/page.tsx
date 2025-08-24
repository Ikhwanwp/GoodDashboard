
"use client";
import { PageHeader } from "@/components/shared/page-header";
import { Handshake, PlayCircle } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { FulfillmentTracker } from "@/components/dashboard/fulfillment-tracker";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardBAPage() {
  const { kontrakPks, fulfillments, loading } = useData();

  if (loading) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <PageHeader title="Dashboard Business Alliance" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
             <Skeleton className="h-[500px] w-full mt-4" />
        </main>
    );
  }

  const activePksCount = kontrakPks.filter(k => k.statusKontrak === 'Aktif').length;

  const contractsInProgressCount = fulfillments.filter(f => 
    f.currentStep > 0 || (f.currentStep === 0 && f.steps[0].status === 'completed')
  ).length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-hidden">
      <PageHeader title="Dashboard Business Alliance" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Jumlah Kontrak Aktif" 
          value={activePksCount.toString()}
          icon={Handshake}
          variant="active"
        />
        <SummaryCard 
          title="Kontrak Sedang Berjalan" 
          value={contractsInProgressCount.toString()}
          icon={PlayCircle} 
        />
      </div>

      <div className="mt-4">
        <FulfillmentTracker />
      </div>
    </main>
  );
}

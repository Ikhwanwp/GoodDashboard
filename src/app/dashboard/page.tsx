import { PageHeader } from "@/components/shared/page-header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ReminderList } from "@/components/dashboard/reminder-list";
import { Building2, FileText, Handshake, FileArchive } from "lucide-react";
import { mockInstansi, mockKontrakPks, mockKontrakMou, mockDokumenSph } from "@/lib/mock-data";

export default function DashboardPage() {
  const activePksCount = mockKontrakPks.filter(k => k.statusKontrak === 'Aktif').length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Jumlah K/L Total" 
          value={mockInstansi.length.toString()} 
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
          value={mockKontrakMou.length.toString()} 
          icon={FileText} 
        />
        <SummaryCard 
          title="Jumlah SPH" 
          value={mockDokumenSph.length.toString()} 
          icon={FileArchive} 
        />
      </div>

      <div>
        <ReminderList />
      </div>
    </main>
  );
}

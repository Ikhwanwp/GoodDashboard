
"use client";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Handshake, Users, FileText } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";

export default function DashboardBAPage() {
  // Dummy data for BA Dashboard
  const summaryData = {
    totalMitra: 25,
    activeKerjasama: 15,
    totalPic: 40,
    pendingDocuments: 5,
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard Business Alliance" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Jumlah Mitra Total" 
          value={summaryData.totalMitra.toString()} 
          icon={Users} 
        />
        <SummaryCard 
          title="Kerja Sama Aktif" 
          value={summaryData.activeKerjasama.toString()} 
          icon={Handshake} 
          variant="active" 
        />
        <SummaryCard 
          title="Jumlah PIC" 
          value={summaryData.totalPic.toString()} 
          icon={Users} 
        />
        <SummaryCard 
          title="Dokumen Tertunda" 
          value={summaryData.pendingDocuments.toString()} 
          icon={FileText} 
        />
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Selamat Datang di Dasbor Business Alliance</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Ini adalah halaman utama untuk manajemen mitra dan kerja sama. Gunakan menu di sebelah kiri untuk menavigasi fitur yang tersedia.
            </p>
        </CardContent>
       </Card>
    </main>
  );
}


"use client"
import { PageHeader } from "@/components/shared/page-header";
import { TimelineView } from "@/components/timeline/timeline-view";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, FileText, FileArchive, MessageSquareQuote, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function TimelineBAPage() {
  const dummyTimelineEvents = [
      { date: new Date("2024-07-20"), type: 'Update', title: 'Finalisasi Desain Modul A', description: 'Desain disetujui oleh semua pihak.', icon: MessageSquareQuote },
      { date: new Date("2024-07-15"), type: 'PKS', title: 'Kick-off Meeting Internal', description: 'Pembahasan teknis implementasi E-Sign.', icon: Handshake },
      { date: new Date("2024-07-10"), type: 'MoU', title: 'Penandatanganan Kontrak dengan PT. Mitra Jaya', description: 'Kerja sama untuk proyek E-Sign Kemenkeu.', icon: FileText },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Timeline Business Alliance" />
      
       <Card>
        <CardHeader>
          <CardTitle>Timeline Aktivitas Mitra</CardTitle>
          <CardDescription>Riwayat aktivitas proyek dengan mitra secara kronologis.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-border after:left-0">
              {dummyTimelineEvents.map((event, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr] items-start gap-x-4 mb-8">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-border -translate-x-[calc(50%+1px)] relative z-10">
                     <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground -translate-y-1.5">{format(event.date, "dd MMMM yyyy")}</div>
                  <div className="row-start-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary -translate-x-[calc(50%+1px)] relative z-10">
                     <event.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="row-start-2">
                    <p className="font-semibold text-foreground">{event.title}</p>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
        </CardContent>
       </Card>
    </main>
  );
}

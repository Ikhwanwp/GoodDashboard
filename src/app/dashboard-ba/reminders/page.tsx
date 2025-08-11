
"use client"
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, FileCheck2 } from "lucide-react";

export default function RemindersPage() {
    const dummyReminders = [
        { id: 1, title: "Pembayaran Invoice #123", project: "Implementasi E-Sign", dueDate: "3 hari lagi", priority: "Tinggi" },
        { id: 2, title: "Penyerahan Laporan Bulanan", project: "Konsultasi Keamanan Siber", dueDate: "7 hari lagi", priority: "Sedang" },
        { id: 3, title: "Perpanjangan Lisensi Software", project: "Pengadaan Server", dueDate: "15 hari lagi", priority: "Rendah" },
    ];
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Reminder Tugas & Dokumen" />
      <Card>
        <CardHeader>
            <CardTitle>Daftar Pengingat</CardTitle>
            <CardDescription>Tugas dan dokumen administrasi yang mendekati tenggat waktu.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
              {dummyReminders.map(reminder => (
                <li key={reminder.id} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{reminder.title}</p>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      <p className="flex items-center gap-2"><FileCheck2 className="h-4 w-4" /> Proyek: {reminder.project}</p>
                    </div>
                  </div>
                   <div className={`text-sm font-bold ml-auto px-2 py-1 rounded-md ${reminder.priority === 'Tinggi' ? 'bg-destructive text-destructive-foreground' : 'bg-green-500 text-white'}`}>
                    {reminder.dueDate}
                  </div>
                </li>
              ))}
            </ul>
        </CardContent>
      </Card>
    </main>
  );
}

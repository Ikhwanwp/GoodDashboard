
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useData } from "@/context/data-context";
import { differenceInDays, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertTriangle, Cake, CalendarClock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ReminderList() {
  const { kontrakPks, kontrakMou, instansi, users } = useData();
  const now = new Date();
  
  const expiringContracts = [
    ...kontrakPks.map(c => ({...c, type: 'PKS' as const})), 
    ...kontrakMou.map(m => ({...m, type: 'MoU' as const}))
  ]
    .map(c => ({...c, daysLeft: differenceInDays(c.tanggalBerakhir, now)}))
    .filter(c => c.daysLeft >= 0 && c.daysLeft <= 90)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const upcomingBirthdays = instansi
    .map(i => ({...i, daysLeft: differenceInDays(i.tanggalUlangTahun, now)}))
    .filter(i => i.daysLeft >= 0 && i.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const getPicName = (picId: string) => users.find(u => u.id === picId)?.nama || 'N/A';
  const getInstansiKode = (instansiId: string) => instansi.find(i => i.id === instansiId)?.kodeInstansi || 'N/A';
  
  const getDaysLeftColor = (days: number) => {
    if (days < 30) return "bg-destructive text-destructive-foreground";
    if (days < 60) return "bg-orange-500 text-white";
    return "bg-green-500 text-white";
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Kontrak Akan Berakhir (90 Hari)</CardTitle>
          <CardDescription>Kontrak PKS & MoU yang akan segera berakhir.</CardDescription>
        </CardHeader>
        <CardContent>
          {expiringContracts.length > 0 ? (
            <ul className="space-y-4">
              {expiringContracts.map(contract => (
                <li key={contract.id} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{getInstansiKode(contract.instansiId)}</p>
                      <Badge variant={contract.type === 'PKS' ? 'default' : 'secondary'}>{contract.type}</Badge>
                    </div>
                     <p className="text-sm text-muted-foreground font-medium">{'judulKontrak' in contract ? contract.judulKontrak : contract.isiMou}</p>
                    <div className="text-sm text-muted-foreground space-y-1 mt-2">
                      <p className="flex items-center gap-2"><CalendarClock className="h-4 w-4" /> Berakhir pada: {format(contract.tanggalBerakhir, 'dd MMMM yyyy', { locale: id })}</p>
                      <p className="flex items-center gap-2"><User className="h-4 w-4" /> PIC GA: {getPicName(contract.picGaId)}</p>
                    </div>
                  </div>
                   <div className={`text-sm font-bold ml-auto px-2 py-1 rounded-md self-start ${getDaysLeftColor(contract.daysLeft)}`}>
                    {contract.daysLeft} hari lagi
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">Tidak ada kontrak yang akan berakhir dalam 90 hari.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ulang Tahun K/L (30 Hari)</CardTitle>
          <CardDescription>K/L yang akan berulang tahun dalam waktu dekat.</CardDescription>
        </CardHeader>
        <CardContent>
           {upcomingBirthdays.length > 0 ? (
            <ul className="space-y-4">
              {upcomingBirthdays.map(instansi => (
                <li key={instansi.id} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Cake className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{instansi.namaInstansi}</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2"><CalendarClock className="h-4 w-4" /> {format(instansi.tanggalUlangTahun, 'dd MMMM yyyy', { locale: id })}</p>
                  </div>
                  <div className="text-sm font-bold text-accent ml-auto">
                    {instansi.daysLeft} hari lagi
                  </div>
                </li>
              ))}
            </ul>
           ) : (
             <p className="text-center text-muted-foreground py-8">Tidak ada K/L yang berulang tahun dalam 30 hari.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

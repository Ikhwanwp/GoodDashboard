"use client"

import { useState, useMemo } from 'react';
import type { Instansi, TimelineEvent } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockKontrakPks, mockKontrakMou, mockDokumenSph, mockStatusPekerjaan } from '@/lib/mock-data';
import { Handshake, FileText, FileArchive, MessageSquareQuote, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface TimelineViewProps {
  instansiList: Instansi[];
}

export function TimelineView({ instansiList }: TimelineViewProps) {
  const [selectedInstansi, setSelectedInstansi] = useState<string | null>(null);

  const timelineEvents = useMemo((): TimelineEvent[] => {
    if (!selectedInstansi) return [];

    const pksEvents: TimelineEvent[] = mockKontrakPks
      .filter(k => k.instansiId === selectedInstansi)
      .flatMap(k => ([
        { instansiId: k.instansiId, date: k.tanggalMulai, type: 'PKS', title: `Mulai PKS: ${k.judulKontrak}`, description: `Nomor: ${k.nomorKontrakPeruri}`, icon: Handshake },
        { instansiId: k.instansiId, date: k.tanggalBerakhir, type: 'PKS', title: `Berakhir PKS: ${k.judulKontrak}`, description: `Status: ${k.statusKontrak}`, icon: Handshake },
      ]));

    const mouEvents: TimelineEvent[] = mockKontrakMou
      .filter(m => m.instansiId === selectedInstansi)
      .flatMap(m => ([
         { instansiId: m.instansiId, date: m.tanggalMulai, type: 'MoU', title: `Mulai MoU: ${m.isiMou}`, description: `Nomor: ${m.nomorMouPeruri}`, icon: FileText },
         { instansiId: m.instansiId, date: m.tanggalBerakhir, type: 'MoU', title: `Berakhir MoU: ${m.isiMou}`, description: 'MoU telah berakhir', icon: FileText },
      ]));

    const sphEvents: TimelineEvent[] = mockDokumenSph
      .filter(s => s.instansiId === selectedInstansi)
      .map(s => ({ instansiId: s.instansiId, date: s.tanggal, type: 'SPH', title: `SPH: ${s.perihal}`, description: `Nomor: ${s.nomorSuratPeruri}`, icon: FileArchive }));

    const statusEvents: TimelineEvent[] = mockStatusPekerjaan
      .filter(u => u.instansiId === selectedInstansi)
      .map(u => ({ instansiId: u.instansiId, date: u.tanggalUpdate, type: 'Update', title: u.judulUpdate, description: u.deskripsi, icon: MessageSquareQuote }));

    return [...pksEvents, ...mouEvents, ...sphEvents, ...statusEvents].sort((a, b) => b.date.getTime() - a.date.getTime());

  }, [selectedInstansi]);

  const EventIcon = ({ type }: { type: TimelineEvent['type']}) => {
    const icons = {
      PKS: <Handshake className="h-5 w-5 text-white" />,
      MoU: <FileText className="h-5 w-5 text-white" />,
      SPH: <FileArchive className="h-5 w-5 text-white" />,
      Update: <MessageSquareQuote className="h-5 w-5 text-white" />,
    }
    const colors = {
      PKS: 'bg-blue-500',
      MoU: 'bg-green-500',
      SPH: 'bg-yellow-500',
      Update: 'bg-purple-500',
    }
    return <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors[type]}`}>{icons[type]}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Aktivitas</CardTitle>
        <CardDescription>Pilih K/L untuk melihat riwayat aktivitas secara kronologis.</CardDescription>
        <div className="pt-4">
          <Select onValueChange={setSelectedInstansi}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Pilih K/L..." />
            </SelectTrigger>
            <SelectContent>
              {instansiList.map(instansi => (
                <SelectItem key={instansi.id} value={instansi.id}>
                  {instansi.namaInstansi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {selectedInstansi ? (
          timelineEvents.length > 0 ? (
            <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-border after:left-0">
              {timelineEvents.map((event, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr] items-start gap-x-4 mb-8">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-border -translate-x-[calc(50%+1px)] relative z-10">
                     <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground -translate-y-1.5">{format(event.date, "dd MMMM yyyy", { locale: id })}</div>
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
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p>Tidak ada data aktivitas untuk K/L ini.</p>
            </div>
          )
        ) : (
           <div className="text-center text-muted-foreground py-16">
              <p>Silakan pilih K/L untuk memulai.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

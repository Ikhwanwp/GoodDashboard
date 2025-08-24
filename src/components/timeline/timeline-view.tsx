
"use client"

import { useState, useMemo } from 'react';
import type { Instansi, TimelineEvent, KontrakMou, KontrakPks } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/data-context';
import { Handshake, FileText, FileArchive, MessageSquareQuote, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface TimelineViewProps {
  instansiList: Instansi[];
}

export function TimelineView({ instansiList }: TimelineViewProps) {
  const [selectedInstansiId, setSelectedInstansiId] = useState<string | null>(null);
  const [selectedKontrakId, setSelectedKontrakId] = useState<string>('all');
  const { kontrakPks, kontrakMou, dokumenSph, statusPekerjaan } = useData();

  const availableContracts = useMemo(() => {
    if (!selectedInstansiId) return [];
    const pks: (KontrakPks & {type: 'PKS'})[] = kontrakPks
        .filter(k => k.instansiId === selectedInstansiId)
        .map(k => ({...k, type: 'PKS'}));
    const mou: (KontrakMou & {type: 'MoU'})[] = kontrakMou
        .filter(m => m.instansiId === selectedInstansiId)
        .map(m => ({...m, type: 'MoU'}));
    return [...pks, ...mou];
  }, [selectedInstansiId, kontrakPks, kontrakMou]);

  const timelineEvents = useMemo((): TimelineEvent[] => {
    if (!selectedInstansiId) return [];

    let filteredPks = kontrakPks.filter(k => k.instansiId === selectedInstansiId);
    let filteredMou = kontrakMou.filter(m => m.instansiId === selectedInstansiId);

    if (selectedKontrakId !== 'all') {
        filteredPks = filteredPks.filter(k => k.id === selectedKontrakId);
        filteredMou = filteredMou.filter(m => m.id === selectedKontrakId);
    }

    const pksEvents: TimelineEvent[] = filteredPks
      .flatMap(k => ([
        { instansiId: k.instansiId, kontrakId: k.id, date: k.tanggalMulai, type: 'PKS', title: `Mulai PKS: ${k.judulKontrak}`, description: `Nomor: ${k.nomorKontrakPeruri}`, icon: Handshake },
        { instansiId: k.instansiId, kontrakId: k.id, date: k.tanggalBerakhir, type: 'PKS', title: `Berakhir PKS: ${k.judulKontrak}`, description: `Status: ${k.statusKontrak}`, icon: Handshake },
      ]));

    const mouEvents: TimelineEvent[] = filteredMou
      .flatMap(m => ([
         { instansiId: m.instansiId, kontrakId: m.id, date: m.tanggalMulai, type: 'MoU', title: `Mulai MoU: ${m.isiMou}`, description: `Nomor: ${m.nomorMouPeruri}`, icon: FileText },
         { instansiId: m.instansiId, kontrakId: m.id, date: m.tanggalBerakhir, type: 'MoU', title: `Berakhir MoU: ${m.isiMou}`, description: 'MoU telah berakhir', icon: FileText },
      ]));

    const sphEvents: TimelineEvent[] = selectedKontrakId === 'all' 
        ? dokumenSph
            .filter(s => s.instansiId === selectedInstansiId)
            .map(s => ({ instansiId: s.instansiId, date: s.tanggal, type: 'SPH', title: `SPH: ${s.perihal}`, description: `Nomor: ${s.nomorSuratPeruri}`, icon: FileArchive }))
        : [];

    const statusEvents: TimelineEvent[] = statusPekerjaan
      .filter(u => {
        if (u.instansiId !== selectedInstansiId) return false;
        if (selectedKontrakId === 'all') return true;
        // Show update if it's linked to the selected contract OR if it's a general update (no contractId)
        return u.kontrakId === selectedKontrakId || !u.kontrakId;
      })
      .map(u => ({ instansiId: u.instansiId, kontrakId: u.kontrakId, date: u.tanggalUpdate, type: 'Update', title: u.judulUpdate, description: u.deskripsi, icon: MessageSquareQuote }));

    return [...pksEvents, ...mouEvents, ...sphEvents, ...statusEvents].sort((a, b) => b.date.getTime() - a.date.getTime());

  }, [selectedInstansiId, selectedKontrakId, kontrakPks, kontrakMou, dokumenSph, statusPekerjaan]);

  const handleInstansiChange = (instansiId: string) => {
    setSelectedInstansiId(instansiId);
    setSelectedKontrakId('all'); // Reset contract filter when institution changes
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Aktivitas</CardTitle>
        <CardDescription>Pilih K/L dan kontrak untuk melihat riwayat aktivitas secara kronologis.</CardDescription>
        <div className="pt-4 flex flex-col md:flex-row gap-4">
          <Select onValueChange={handleInstansiChange}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Pilih K/L..." />
            </SelectTrigger>
            <SelectContent>
              {instansiList.map(instansi => (
                <SelectItem key={instansi.id} value={instansi.id}>
                  {instansi.kodeInstansi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={selectedKontrakId} 
            onValueChange={setSelectedKontrakId}
            disabled={!selectedInstansiId || availableContracts.length === 0}
          >
            <SelectTrigger className="w-full md:w-[400px]">
              <SelectValue placeholder="Pilih Kontrak..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Kontrak</SelectItem>
                {availableContracts.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                        {c.type}: {c.type === 'PKS' ? c.judulKontrak : c.isiMou}
                    </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {selectedInstansiId ? (
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
              <p>Tidak ada data aktivitas untuk filter ini.</p>
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

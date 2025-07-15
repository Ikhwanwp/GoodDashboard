"use client";

import { useParams } from 'next/navigation';
import { useData } from '@/context/data-context';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PksDataTable } from '@/app/dashboard/contracts/data-table-pks';
import { pksColumns } from '@/app/dashboard/contracts/pks-columns';
import { MouDataTable } from '@/app/dashboard/contracts/data-table-mou';
import { mouColumns } from '@/app/dashboard/contracts/mou-columns';
import { UpdatesDataTable } from '@/app/dashboard/updates/data-table';
import { columns as updatesColumns } from '@/app/dashboard/updates/columns';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import type { ColumnDef } from '@tanstack/react-table';
import type { KontrakPks, KontrakMou, StatusPekerjaan } from '@/lib/types';

// Simplified columns for detail view (without actions)
const pksDetailColumns: ColumnDef<KontrakPks>[] = pksColumns.filter(c => c.id !== 'actions');
const mouDetailColumns: ColumnDef<KontrakMou>[] = mouColumns.filter(c => c.id !== 'actions');
const updatesDetailColumns: ColumnDef<StatusPekerjaan>[] = updatesColumns.filter(c => c.id !== 'actions');


export default function InstansiDetailPage() {
  const params = useParams();
  const { id: instansiId } = params;
  const { instansi, kontrakPks, kontrakMou, statusPekerjaan, users } = useData();

  const currentInstansi = instansi.find(i => i.id === instansiId);
  const pic = users.find(u => u.id === currentInstansi?.internalPicId);

  const filteredPks = kontrakPks.filter(k => k.instansiId === instansiId);
  const filteredMou = kontrakMou.filter(m => m.instansiId === instansiId);
  const filteredUpdates = statusPekerjaan.filter(s => s.instansiId === instansiId);

  if (!currentInstansi) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Instansi Tidak Ditemukan" />
        <p>Data untuk instansi ini tidak dapat ditemukan.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title={currentInstansi.namaInstansi} />

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Detail Instansi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-2 text-sm">
              <div>
                <p className="font-semibold text-muted-foreground">Kode Instansi</p>
                <p>{currentInstansi.kodeInstansi}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Jenis Layanan</p>
                <p>{currentInstansi.jenisLayanan}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Status Kementrian</p>
                <div>
                  <Badge variant={currentInstansi.statusKementrian === "STG Prioritas" ? "default" : "secondary"}>
                    {currentInstansi.statusKementrian}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Ulang Tahun</p>
                <p>{format(currentInstansi.tanggalUlangTahun, 'dd MMMM yyyy', { locale: idLocale })}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">PIC Internal</p>
                <p>{pic?.nama || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Update Terakhir</p>
                <p>{format(currentInstansi.tanggalUpdateTerakhir, 'dd MMMM yyyy', { locale: idLocale })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Kontrak PKS</CardTitle>
                <CardDescription>Daftar kontrak Perjanjian Kerja Sama yang terkait dengan instansi ini.</CardDescription>
            </CardHeader>
            <CardContent>
                <PksDataTable columns={pksDetailColumns} data={filteredPks} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Kontrak MoU</CardTitle>
                <CardDescription>Daftar Memorandum of Understanding yang terkait dengan instansi ini.</CardDescription>
            </CardHeader>
            <CardContent>
                <MouDataTable columns={mouDetailColumns} data={filteredMou} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Status Pekerjaan</CardTitle>
                <CardDescription>Riwayat update status pekerjaan untuk instansi ini.</CardDescription>
            </CardHeader>
            <CardContent>
                <UpdatesDataTable columns={updatesDetailColumns} data={filteredUpdates} />
            </CardContent>
        </Card>
      </div>
    </main>
  );
}

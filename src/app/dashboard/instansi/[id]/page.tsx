
// src/app/dashboard/instansi/[id]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { useData } from '@/context/data-context';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PksDataTable } from '@/app/dashboard/contracts/data-table-pks';
import { getPksColumns } from '@/app/dashboard/contracts/pks-columns';
import { MouDataTable } from '@/app/dashboard/contracts/data-table-mou';
import { getMouColumns } from '@/app/dashboard/contracts/mou-columns';
import { UpdatesDataTable } from '@/app/dashboard/updates/data-table';
import { getUpdatesColumns } from '@/app/dashboard/updates/columns';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import type { ColumnDef } from '@tanstack/react-table';
import type { KontrakPks, KontrakMou, StatusPekerjaan, PicEksternal } from '@/lib/types';
import { ExternalPicTable } from '../../pic/external-pic-table';
import { getExternalPicColumns } from '../../pic/external-pic-columns';
import { User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function InstansiDetailPage() {
  const params = useParams();
  const { id: instansiId } = params;
  const { 
    instansi, 
    kontrakPks, 
    kontrakMou, 
    statusPekerjaan, 
    users, 
    picEksternal, 
    deleteKontrakPks, 
    deleteKontrakMou, 
    deleteStatusPekerjaan,
    deletePicEksternal,
    loading,
  } = useData();

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title={<Skeleton className="h-9 w-72" />} />
        <div className="grid gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </main>
    );
  }

  const currentInstansi = instansi.find(i => i.id === instansiId);
  const pic = users.find(u => u.id === currentInstansi?.internalPicId);

  const filteredPks = kontrakPks.filter(k => k.instansiId === instansiId);
  const filteredMou = kontrakMou.filter(m => m.instansiId === instansiId);
  const filteredUpdates = statusPekerjaan.filter(s => s.instansiId === instansiId);
  const filteredExternalPics = picEksternal.filter(p => p.instansiId === instansiId);

  if (!currentInstansi) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Instansi Tidak Ditemukan" />
        <p>Data untuk instansi ini tidak dapat ditemukan.</p>
      </main>
    );
  }
  
  const pksDetailColumns = getPksColumns({ instansi, deleteKontrakPks, showActions: false });
  const mouDetailColumns = getMouColumns({ instansi, deleteKontrakMou, showActions: false });
  const updatesDetailColumns = getUpdatesColumns({ instansi, deleteStatusPekerjaan, showActions: false });
  const externalPicDetailColumns = getExternalPicColumns({ instansi, deletePicEksternal, showActions: false });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title={currentInstansi.namaInstansi} />

      <div className="grid gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Detail Instansi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4 text-sm">
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
                <CardTitle className="flex items-center gap-2">
                    <User className="h-6 w-6"/>
                    PIC Eksternal
                </CardTitle>
                <CardDescription>Kontak dari pihak {currentInstansi.namaInstansi}.</CardDescription>
            </CardHeader>
            <CardContent>
                {filteredExternalPics.length > 0 ? (
                    <ul className="space-y-3">
                        {filteredExternalPics.map(pic => (
                            <li key={pic.id} className="text-sm">
                                <p className="font-semibold">{pic.namaPic}</p>
                                <p className="text-muted-foreground">{pic.jabatan}</p>
                                <p className="text-muted-foreground">{pic.email}</p>
                                <p className="text-muted-foreground">{pic.noHp}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-center text-muted-foreground py-4">Belum ada data PIC Eksternal.</p>
                )}
            </CardContent>
          </Card>
        </div>


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

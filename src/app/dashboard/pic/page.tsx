
// src/app/dashboard/pic/page.tsx
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useData } from "@/context/data-context";
import { ExternalPicTable } from "./external-pic-table";
import { getExternalPicColumns } from "./external-pic-columns";
import { PicForm } from "@/components/forms/pic-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


export default function PicPage() {
  const { instansi, picEksternal, loading, deletePicEksternal } = useData();
  
  if (loading) {
     return (
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Penanggung Jawab (PIC) Eksternal">
            <Skeleton className="h-10 w-44" />
        </PageHeader>
        <div className="py-2">
           <Skeleton className="h-12 w-full mb-4" />
           <Skeleton className="h-96 w-full" />
        </div>
      </main>
     )
  }

  const externalPics = picEksternal;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen PIC Eksternal">
        <PicForm picType="external" />
      </PageHeader>

      <div className="py-2">
         <Card className="mt-4">
          <CardHeader>
            <CardTitle>Daftar PIC Eksternal</CardTitle>
            <CardDescription>Daftar kontak penanggung jawab dari pihak Kementrian/Lembaga.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ExternalPicTable columns={getExternalPicColumns({ instansi, deletePicEksternal })} data={externalPics} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

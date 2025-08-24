// src/app/dashboard/pic/page.tsx
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useData } from "@/context/data-context";
import { ExternalPicTable } from "./external-pic-table";
import { InternalPicTable } from "./internal-pic-table";
import { getExternalPicColumns } from "./external-pic-columns";
import { getInternalPicColumns } from "./internal-pic-columns";
import { PicForm } from "@/components/forms/pic-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function PicPage() {
  const { instansi, users, picEksternal, loading, deletePicEksternal, updateUser } = useData();
  
  if (loading) {
     return (
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Manajemen PIC">
            <Skeleton className="h-10 w-44" />
        </PageHeader>
        <div className="py-2">
           <Skeleton className="h-10 w-64 mb-4" />
           <Skeleton className="h-12 w-full mb-4" />
           <Skeleton className="h-96 w-full" />
        </div>
      </main>
     )
  }

  const internalGaPics = users.filter(u => u.role === 'GA');
  const externalPics = picEksternal;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Penanggung Jawab (PIC)">
        <PicForm picType="external" />
      </PageHeader>

      <div className="py-2">
         <Tabs defaultValue="external-pics" className="mt-2">
            <TabsList>
                <TabsTrigger value="external-pics">PIC Eksternal</TabsTrigger>
                <TabsTrigger value="internal-pics">PIC Internal (GA)</TabsTrigger>
            </TabsList>
            <TabsContent value="external-pics">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Daftar PIC Eksternal</CardTitle>
                    <CardDescription>Daftar kontak penanggung jawab dari pihak Kementrian/Lembaga.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <ExternalPicTable columns={getExternalPicColumns({ instansi, deletePicEksternal })} data={externalPics} />
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="internal-pics">
                 <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Daftar PIC Internal (Government Account)</CardTitle>
                    <CardDescription>Pengguna dengan peran GA yang bertanggung jawab atas K/L.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <InternalPicTable columns={getInternalPicColumns({updateUser})} data={internalGaPics} />
                  </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

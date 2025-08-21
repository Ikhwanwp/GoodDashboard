
// src/app/dashboard/pic/page.tsx
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useData } from "@/context/data-context";
import { InternalPicTable } from "./internal-pic-table";
import { InternalPicColumns } from "./internal-pic-columns";
import { ExternalPicTable } from "./external-pic-table";
import { getExternalPicColumns } from "./external-pic-columns";
import { PicForm } from "@/components/forms/pic-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";


export default function PicPage() {
  const { users, instansi, picEksternal, loading, deleteUser, deletePicEksternal } = useData();
  
  if (loading) {
     return (
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Penanggung Jawab (PIC)">
            <Skeleton className="h-10 w-32" />
        </PageHeader>
        <div className="py-2">
           <Skeleton className="h-10 w-72 mb-4" />
           <Skeleton className="h-12 w-full mb-4" />
           <Skeleton className="h-96 w-full" />
        </div>
      </main>
     )
  }

  const internalPics = users;
  const externalPics = picEksternal;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen PIC">
        <PicForm />
      </PageHeader>

      <div className="py-2">
        <Tabs defaultValue="internal">
          <TabsList>
            <TabsTrigger value="internal">PIC Internal (Peruri)</TabsTrigger>
            <TabsTrigger value="external">PIC Eksternal (K/L)</TabsTrigger>
          </TabsList>
          <TabsContent value="internal">
            <Card className="mt-4">
              <CardContent className="p-4 md:p-6">
                <InternalPicTable columns={InternalPicColumns()} data={internalPics} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="external">
             <Card className="mt-4">
              <CardContent className="p-4 md:p-6">
                <ExternalPicTable columns={getExternalPicColumns({ instansi, deletePicEksternal })} data={externalPics} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

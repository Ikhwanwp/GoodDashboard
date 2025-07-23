
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PksDataTable } from "./data-table-pks";
import { MouDataTable } from "./data-table-mou";
import { SphDataTable } from "./data-table-sph";
import { getPksColumns } from "./pks-columns";
import { getMouColumns } from "./mou-columns";
import { getSphColumns } from "./sph-columns";
import { useData } from "@/context/data-context";
import { ContractForm } from "@/components/forms/contract-form";
import { SphForm } from "@/components/forms/sph-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContractsPage() {
  const { kontrakPks, kontrakMou, dokumenSph, loading, instansi, deleteKontrakPks, deleteKontrakMou, deleteDokumenSph } = useData();

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Manajemen Kontrak & SPH">
          <Skeleton className="h-10 w-52" />
        </PageHeader>
        <div className="container mx-auto py-2">
           <Skeleton className="h-10 w-72 mb-4" />
           <Skeleton className="h-12 w-full mb-4" />
           <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Kontrak & SPH">
        <div className="flex items-center gap-2">
            <SphForm />
            <ContractForm />
        </div>
      </PageHeader>
      
      <div className="container mx-auto py-2">
        <Tabs defaultValue="pks">
          <TabsList>
            <TabsTrigger value="pks">Kontrak PKS</TabsTrigger>
            <TabsTrigger value="mou">Kontrak MoU</TabsTrigger>
            <TabsTrigger value="sph">Dokumen SPH</TabsTrigger>
          </TabsList>
          <TabsContent value="pks">
            <PksDataTable columns={getPksColumns({ instansi, deleteKontrakPks })} data={kontrakPks} />
          </TabsContent>
          <TabsContent value="mou">
            <MouDataTable columns={getMouColumns({ instansi, deleteKontrakMou })} data={kontrakMou} />
          </TabsContent>
          <TabsContent value="sph">
            <SphDataTable columns={getSphColumns({ instansi, deleteDokumenSph })} data={dokumenSph} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

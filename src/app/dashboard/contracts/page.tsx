"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PksDataTable } from "./data-table-pks";
import { MouDataTable } from "./data-table-mou";
import { SphDataTable } from "./data-table-sph";
import { pksColumns } from "./pks-columns";
import { mouColumns } from "./mou-columns";
import { sphColumns } from "./sph-columns";
import { useData } from "@/context/data-context";
import { ContractForm } from "@/components/forms/contract-form";

export default function ContractsPage() {
  const { kontrakPks, kontrakMou, dokumenSph } = useData();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Kontrak & SPH">
        <ContractForm />
      </PageHeader>
      
      <div className="container mx-auto py-2">
        <Tabs defaultValue="pks">
          <TabsList>
            <TabsTrigger value="pks">Kontrak PKS</TabsTrigger>
            <TabsTrigger value="mou">Kontrak MoU</TabsTrigger>
            <TabsTrigger value="sph">Dokumen SPH</TabsTrigger>
          </TabsList>
          <TabsContent value="pks">
            <PksDataTable columns={pksColumns} data={kontrakPks} />
          </TabsContent>
          <TabsContent value="mou">
            <MouDataTable columns={mouColumns} data={kontrakMou} />
          </TabsContent>
          <TabsContent value="sph">
            <SphDataTable columns={sphColumns} data={dokumenSph} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

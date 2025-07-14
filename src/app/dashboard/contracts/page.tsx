"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PksDataTable } from "./data-table-pks";
import { MouDataTable } from "./data-table-mou";
import { pksColumns } from "./pks-columns";
import { mouColumns } from "./mou-columns";
import { useData } from "@/context/data-context";


export default function ContractsPage() {
  const { kontrakPks, kontrakMou } = useData();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Kontrak">
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Kontrak
        </Button>
      </PageHeader>
      
      <div className="container mx-auto py-2">
        <Tabs defaultValue="pks">
          <TabsList>
            <TabsTrigger value="pks">Kontrak PKS</TabsTrigger>
            <TabsTrigger value="mou">Kontrak MoU</TabsTrigger>
          </TabsList>
          <TabsContent value="pks">
            <PksDataTable columns={pksColumns} data={kontrakPks} />
          </TabsContent>
          <TabsContent value="mou">
            <MouDataTable columns={mouColumns} data={kontrakMou} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

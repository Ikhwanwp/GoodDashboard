import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { InstansiDataTable } from "./data-table";
import { columns } from "./columns";
import { mockInstansi } from "@/lib/mock-data";

export default function InstansiPage() {
  // In a real app, this data would be fetched from Firestore
  const data = mockInstansi;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Instansi">
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Instansi
        </Button>
      </PageHeader>
      
      <div className="container mx-auto py-2">
        <InstansiDataTable columns={columns} data={data} />
      </div>
    </main>
  );
}

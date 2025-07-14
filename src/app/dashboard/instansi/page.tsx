"use client";

import { PageHeader } from "@/components/shared/page-header";
import { InstansiDataTable } from "./data-table";
import { columns } from "./columns";
import { useData } from "@/context/data-context";
import { InstansiForm } from "@/components/forms/instansi-form";

export default function InstansiPage() {
  const { instansi } = useData();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Instansi">
        <InstansiForm />
      </PageHeader>
      
      <div className="container mx-auto py-2">
        <InstansiDataTable columns={columns} data={instansi} />
      </div>
    </main>
  );
}

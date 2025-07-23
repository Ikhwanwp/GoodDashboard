
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { InstansiDataTable } from "./data-table";
import { InstansiColumns } from "./columns";
import { useData } from "@/context/data-context";
import { InstansiForm } from "@/components/forms/instansi-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstansiPage() {
  const { instansi, loading } = useData();

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Manajemen Instansi">
          <Skeleton className="h-10 w-36" />
        </PageHeader>
        <div className="container mx-auto py-2">
           <Skeleton className="h-12 w-full mb-4" />
           <Skeleton className="h-96 w-full" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Instansi">
        <InstansiForm />
      </PageHeader>
      
      <div className="container mx-auto py-2">
        <InstansiDataTable columns={InstansiColumns()} data={instansi} />
      </div>
    </main>
  );
}

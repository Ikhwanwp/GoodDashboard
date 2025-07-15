"use client";

import { PageHeader } from "@/components/shared/page-header";
import { UpdatesDataTable } from "./data-table";
import { UpdatesColumns } from "./columns";
import { useData } from "@/context/data-context";
import { StatusUpdateForm } from "@/components/forms/status-update-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpdatesPage() {
  const { statusPekerjaan, loading } = useData();

  if (loading) {
     return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Manajemen Status Pekerjaan">
           <Skeleton className="h-10 w-36" />
        </PageHeader>
        <div className="container mx-auto py-2">
           <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Status Pekerjaan">
        <StatusUpdateForm />
      </PageHeader>
      
      <div className="container mx-auto py-2">
        <UpdatesDataTable columns={UpdatesColumns()} data={statusPekerjaan} />
      </div>
    </main>
  );
}

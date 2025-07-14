"use client";

import { PageHeader } from "@/components/shared/page-header";
import { UpdatesDataTable } from "./data-table";
import { columns } from "./columns";
import { useData } from "@/context/data-context";
import { StatusUpdateForm } from "@/components/forms/status-update-form";

export default function UpdatesPage() {
  const { statusPekerjaan } = useData();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Status Pekerjaan">
        <StatusUpdateForm />
      </PageHeader>
      
      <div className="container mx-auto py-2">
        <UpdatesDataTable columns={columns} data={statusPekerjaan} />
      </div>
    </main>
  );
}

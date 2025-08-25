
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { UpdatesDataTable } from "./data-table";
import { getUpdatesColumns } from "./columns";
import { useData } from "@/context/data-context";
import { StatusUpdateForm } from "@/components/forms/status-update-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function UpdatesPage() {
  const { statusPekerjaan, loading, instansi, deleteStatusPekerjaan } = useData();
  const [selectedInstansiId, setSelectedInstansiId] = useState<string>("all");

  const filteredUpdates = useMemo(() => {
    if (selectedInstansiId === "all") {
      return statusPekerjaan;
    }
    return statusPekerjaan.filter(update => update.instansiId === selectedInstansiId);
  }, [statusPekerjaan, selectedInstansiId]);


  if (loading) {
     return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Manajemen Status Pekerjaan">
           <Skeleton className="h-10 w-36" />
        </PageHeader>
        <div className="py-2">
           <Skeleton className="h-12 w-full mb-4" />
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
      
      <div className="py-2">
        <Card>
           <CardHeader>
                <CardTitle>Riwayat Aktivitas Status Pekerjaan</CardTitle>
                <CardDescription>Pilih K/L untuk melihat riwayat aktivitasnya atau lihat semua update.</CardDescription>
                <div className="pt-4">
                    <Select value={selectedInstansiId} onValueChange={setSelectedInstansiId}>
                        <SelectTrigger className="w-full md:w-[300px]">
                        <SelectValue placeholder="Pilih K/L..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Instansi</SelectItem>
                            {instansi.map(i => (
                                <SelectItem key={i.id} value={i.id}>
                                    {i.kodeInstansi}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
               <UpdatesDataTable columns={getUpdatesColumns({ instansi, deleteStatusPekerjaan })} data={filteredUpdates} />
            </CardContent>
        </Card>
      </div>
    </main>
  );
}

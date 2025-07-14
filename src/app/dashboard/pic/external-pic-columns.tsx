// src/app/dashboard/pic/external-pic-columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { PicEksternal } from "@/lib/types"
import { useData } from "@/context/data-context"
import { Badge } from "@/components/ui/badge"

export const externalPicColumns: ColumnDef<PicEksternal>[] = [
  {
    accessorKey: "namaPic",
    header: "Nama PIC",
  },
  {
    accessorKey: "instansiId",
    header: "Kode Instansi",
    cell: ({ row }) => {
      const { instansi } = useData();
      const picInstansi = instansi.find(i => i.id === row.original.instansiId);
      return <Badge variant="secondary">{picInstansi?.kodeInstansi || 'N/A'}</Badge>
    }
  },
  {
    accessorKey: "jabatan",
    header: "Jabatan",
  },
  {
    accessorKey: "noHp",
    header: "No HP",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]

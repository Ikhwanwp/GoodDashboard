// src/app/dashboard/pic/internal-pic-columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/lib/types"
import { useData } from "@/context/data-context"
import { Badge } from "@/components/ui/badge"

export const internalPicColumns: ColumnDef<User>[] = [
  {
    accessorKey: "nama",
    header: "Nama PIC",
  },
  {
    id: "kodeInstansi",
    header: "Handle Instansi",
    cell: ({ row }) => {
      const { instansi } = useData();
      const handledInstansi = instansi.filter(i => i.internalPicId === row.original.id);
      if (handledInstansi.length === 0) return <span className="text-muted-foreground">N/A</span>
      return (
        <div className="flex flex-wrap gap-1">
          {handledInstansi.map(i => <Badge variant="secondary" key={i.id}>{i.kodeInstansi}</Badge>)}
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
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

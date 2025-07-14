"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { KontrakMou } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { mockInstansi } from "@/lib/mock-data"

export const mouColumns: ColumnDef<KontrakMou>[] = [
  {
    accessorKey: "nomorMouPeruri",
    header: "Nomor MoU",
  },
  {
    accessorKey: "instansiId",
    header: "Nama Instansi",
    cell: ({ row }) => {
      const instansi = mockInstansi.find(i => i.id === row.original.instansiId);
      return <div className="font-medium">{instansi?.namaInstansi || 'N/A'}</div>;
    },
  },
  {
    accessorKey: "isiMou",
    header: "Tentang MoU",
    cell: ({ row }) => <div className="max-w-xs truncate">{row.original.isiMou}</div>,
  },
  {
    accessorKey: "tanggalBerakhir",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tgl Berakhir
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => format(row.original.tanggalBerakhir, "dd MMM yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
            <DropdownMenuItem>Edit MoU</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

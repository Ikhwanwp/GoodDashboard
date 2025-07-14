"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Instansi } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export const columns: ColumnDef<Instansi>[] = [
  {
    accessorKey: "kodeInstansi",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kode
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "namaInstansi",
    header: "Nama Instansi",
    cell: ({ row }) => <div className="font-medium">{row.original.namaInstansi}</div>,
  },
  {
    accessorKey: "statusKementrian",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.statusKementrian;
      return (
        <Badge variant={status === "STG Prioritas" ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    }
  },
  {
    accessorKey: "jenisLayanan",
    header: "Jenis Layanan",
  },
  {
    accessorKey: "tanggalUpdateTerakhir",
    header: "Update Terakhir",
    cell: ({ row }) => format(row.original.tanggalUpdateTerakhir, "dd MMM yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const instansi = row.original

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(instansi.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
            <DropdownMenuItem>Edit Instansi</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

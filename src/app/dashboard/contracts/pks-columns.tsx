"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { KontrakPks } from "@/lib/types"
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
import { mockInstansi } from "@/lib/mock-data"

export const pksColumns: ColumnDef<KontrakPks>[] = [
  {
    accessorKey: "nomorKontrakPeruri",
    header: "Nomor Kontrak",
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
    accessorKey: "judulKontrak",
    header: "Judul Kontrak",
    cell: ({ row }) => <div className="max-w-xs truncate">{row.original.judulKontrak}</div>,
  },
  {
    accessorKey: "statusKontrak",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.statusKontrak;
      return (
        <Badge variant={status === "Aktif" ? "default" : "destructive"}>
          {status}
        </Badge>
      )
    }
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
            <DropdownMenuItem>Edit Kontrak</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

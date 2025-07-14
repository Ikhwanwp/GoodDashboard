"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Instansi } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown, Eye } from "lucide-react"
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
import { useData } from "@/context/data-context"
import { InstansiForm } from "@/components/forms/instansi-form"
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"
import Link from "next/link"

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
      const { deleteInstansi } = useData()

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
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/instansi/${instansi.id}`} className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <InstansiForm instansiToEdit={instansi}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Instansi</DropdownMenuItem>
            </InstansiForm>
            <DeleteConfirmation 
              onConfirm={() => deleteInstansi(instansi.id)}
              itemName={instansi.namaInstansi}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                Hapus
              </DropdownMenuItem>
            </DeleteConfirmation>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

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
import { useData } from "@/context/data-context"
import { ContractForm } from "@/components/forms/contract-form"
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"

export const MouColumns = (): ColumnDef<KontrakMou>[] => {
  const { instansi, deleteKontrakMou } = useData();

  return [
    {
      accessorKey: "nomorMouPeruri",
      header: "Nomor MoU",
    },
    {
      accessorKey: "instansiId",
      header: "Nama Instansi",
      cell: ({ row }) => {
        const i = instansi.find(i => i.id === row.original.instansiId);
        return <div className="font-medium">{i?.namaInstansi || 'N/A'}</div>;
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
        const contract = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contract.id)}>
                Copy ID
              </DropdownMenuItem>
              <ContractForm contractToEdit={contract} contractType="mou">
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit MoU</DropdownMenuItem>
              </ContractForm>
              <DeleteConfirmation
                onConfirm={() => deleteKontrakMou(contract.id)}
                itemName={contract.isiMou}
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
}

// src/app/dashboard/contracts/pks-columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { KontrakPks, Instansi } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ContractForm } from "@/components/forms/contract-form"
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"

type GetPksColumnsParams = {
  instansi: Instansi[];
  deleteKontrakPks: (id: string) => Promise<void>;
  showActions?: boolean;
}

export const getPksColumns = ({ instansi, deleteKontrakPks, showActions = true }: GetPksColumnsParams): ColumnDef<KontrakPks>[] => {
  const columns: ColumnDef<KontrakPks>[] = [
    {
      accessorKey: "nomorKontrakPeruri",
      header: "Nomor Kontrak",
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
  ];

  if (showActions) {
    columns.push({
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
               <ContractForm contractToEdit={contract} contractType="pks">
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Kontrak</DropdownMenuItem>
              </ContractForm>
              <DeleteConfirmation 
                onConfirm={() => deleteKontrakPks(contract.id)}
                itemName={contract.judulKontrak}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                  Hapus
                </DropdownMenuItem>
              </DeleteConfirmation>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    });
  }
  
  return columns;
}

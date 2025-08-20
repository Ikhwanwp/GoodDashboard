// src/app/dashboard/contracts/mou-columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { KontrakMou, Instansi } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format, differenceInDays, startOfDay } from "date-fns"
import { ContractForm } from "@/components/forms/contract-form"
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type GetMouColumnsParams = {
  instansi: Instansi[];
  deleteKontrakMou: (id: string) => Promise<void>;
  showActions?: boolean;
}

export const getMouColumns = ({ instansi, deleteKontrakMou, showActions = true }: GetMouColumnsParams): ColumnDef<KontrakMou>[] => {
  const columns: ColumnDef<KontrakMou>[] = [
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
      filterFn: (row, id, value) => {
        const i = instansi.find(i => i.id === row.original.instansiId);
        return i?.namaInstansi.toLowerCase().includes(value.toLowerCase()) || false;
      },
    },
    {
      accessorKey: "isiMou",
      header: "Tentang MoU",
      cell: ({ row }) => <div className="max-w-xs">{row.original.isiMou}</div>,
    },
    {
      accessorKey: "tanggalMulai",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tgl Mulai
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => format(row.original.tanggalMulai, "dd MMM yyyy"),
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
      id: "sisaHari",
      header: "Sisa Hari",
      cell: ({ row }) => {
        const today = startOfDay(new Date());
        const tglBerakhir = startOfDay(row.original.tanggalBerakhir);
        const daysLeft = differenceInDays(tglBerakhir, today);

        if (daysLeft < 0) {
            return <Badge variant="outline" className="text-muted-foreground">Telah Berakhir</Badge>
        }
        if (daysLeft === 0) {
            return <Badge className="bg-orange-500 text-white">Hari Ini</Badge>
        }

        let colorClass = "bg-blue-500 text-white"; // Default for > 90 days
        if (daysLeft <= 30) {
            colorClass = "bg-destructive text-destructive-foreground";
        } else if (daysLeft <= 60) {
            colorClass = "bg-orange-500 text-white";
        } else if (daysLeft <= 90) {
            colorClass = "bg-green-500 text-white";
        }

        return <Badge className={cn("whitespace-nowrap", colorClass)}>Dalam {daysLeft} hari lagi</Badge>
      }
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
    });
  }

  return columns;
}

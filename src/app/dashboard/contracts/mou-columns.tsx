
// src/app/dashboard/contracts/mou-columns.tsx
"use client"

import type { ColumnDef, SortingFn } from "@tanstack/react-table"
import type { KontrakMou, Instansi, User } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown, Link as LinkIcon } from "lucide-react"
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
import Link from "next/link"

type GetMouColumnsParams = {
  instansi: Instansi[];
  users: User[];
  deleteKontrakMou: (id: string) => Promise<void>;
  showActions?: boolean;
}

// Custom sorting function for MoU
const customMouSortingFn: SortingFn<KontrakMou> = (rowA, rowB, columnId) => {
    const today = startOfDay(new Date());
    const getDaysLeft = (date: Date) => differenceInDays(startOfDay(date), today);

    const daysLeftA = getDaysLeft(rowA.original.tanggalBerakhir);
    const daysLeftB = getDaysLeft(rowB.original.tanggalBerakhir);

    const statusA = rowA.original.statusKontrak;
    const statusB = rowB.original.statusKontrak;

    // 1. Primary sort: by status ("Aktif" comes first)
    if (statusA !== statusB) {
        return statusA === 'Aktif' ? -1 : 1;
    }
    
    // 2. Secondary sort: by days left
    // If both are "Aktif", sort by ascending days left (most urgent first)
    if (statusA === 'Aktif') {
       return daysLeftA - daysLeftB;
    }

    // If both are "Berakhir", sort by descending days left (most recently expired first)
    return daysLeftB - daysLeftA;
};


export const getMouColumns = ({ instansi, users, deleteKontrakMou, showActions = true }: GetMouColumnsParams): ColumnDef<KontrakMou>[] => {
  const columns: ColumnDef<KontrakMou>[] = [
    {
      accessorKey: "nomorMouPeruri",
      header: "Nomor MoU",
    },
    {
      accessorKey: "instansiId",
      header: "Kode Instansi",
      cell: ({ row }) => {
        const i = instansi.find(i => i.id === row.original.instansiId);
        return <div className="font-medium">{i?.kodeInstansi || 'N/A'}</div>;
      },
      filterFn: (row, id, value) => {
        const i = instansi.find(i => i.id === row.original.instansiId);
        return i?.namaInstansi.toLowerCase().includes(value.toLowerCase()) || false;
      },
    },
    {
      accessorKey: "isiMou",
      header: "Tentang MoU",
      cell: ({ row }) => <div className="max-w-xs whitespace-normal">{row.original.isiMou}</div>,
    },
     {
      accessorKey: "picGaId",
      header: "PIC Government Account",
      cell: ({ row }) => {
        const pic = users.find(u => u.id === row.original.picGaId);
        return <div>{pic?.nama || 'N/A'}</div>;
      }
    },
    {
      accessorKey: "statusKontrak",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.original.statusKontrak;
        return (
          <Badge variant={status === "Aktif" ? "default" : "destructive"}>
            {status}
          </Badge>
        )
      },
      sortingFn: customMouSortingFn,
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

        if (row.original.statusKontrak === 'Berakhir') {
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
      },
      sortingFn: customMouSortingFn,
    },
    {
      accessorKey: "linkDokumen",
      header: "Dokumen",
      cell: ({ row }) => {
          const link = row.original.linkDokumen;
          if (!link || link === '#') return <span className="text-muted-foreground">N/A</span>
          return (
              <Button asChild variant="ghost" size="icon">
                  <Link href={link} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4"/>
                  </Link>
              </Button>
          )
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

// src/app/dashboard/updates/columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { StatusPekerjaan, Instansi } from "@/lib/types"
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
import { StatusUpdateForm } from "@/components/forms/status-update-form"
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"

type GetUpdatesColumnsParams = {
  instansi: Instansi[];
  deleteStatusPekerjaan: (id: string) => Promise<void>;
  showActions?: boolean;
}

export const getUpdatesColumns = ({ instansi, deleteStatusPekerjaan, showActions = true }: GetUpdatesColumnsParams): ColumnDef<StatusPekerjaan>[] => {
  const columns: ColumnDef<StatusPekerjaan>[] = [
    {
      accessorKey: "tanggalEvent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tgl Event
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const tanggal = row.original.tanggalEvent;
        // Check if the date is valid before formatting
        if (!tanggal || !(tanggal instanceof Date)) {
          return <span className="text-muted-foreground">N/A</span>;
        }
        try {
          return format(tanggal, "dd MMM yyyy");
        } catch (error) {
          return <span className="text-destructive">Invalid Date</span>;
        }
      },
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
      accessorKey: "judulUpdate",
      header: "Judul Update",
      cell: ({ row }) => <div className="max-w-xs truncate">{row.original.judulUpdate}</div>,
    },
    {
      accessorKey: "type",
      header: "Tipe (AI)",
      cell: ({ row }) => {
        const type = row.original.type;
        return type ? <Badge variant="outline">{type}</Badge> : <span className="text-muted-foreground">N/A</span>
      }
    },
     {
      accessorKey: "subject",
      header: "Subjek (AI)",
      cell: ({ row }) => <div className="max-w-xs truncate">{row.original.subject || <span className="text-muted-foreground">N/A</span>}</div>,
    },
    {
        accessorKey: "tanggalUpdate",
        header: "Tgl Update",
        cell: ({ row }) => format(row.original.tanggalUpdate, "dd MMM yyyy"),
    },
  ];

  if (showActions) {
    columns.push({
      id: "actions",
      cell: ({ row }) => {
        const update = row.original
        
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(update.id)}>
                Copy ID
              </DropdownMenuItem>
              <StatusUpdateForm updateToEdit={update}>
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Update</DropdownMenuItem>
              </StatusUpdateForm>
              <DeleteConfirmation 
                onConfirm={() => deleteStatusPekerjaan(update.id)}
                itemName={update.judulUpdate}
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

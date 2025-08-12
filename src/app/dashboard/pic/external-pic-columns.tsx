// src/app/dashboard/pic/external-pic-columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { PicEksternal, Instansi } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { PicForm } from "@/components/forms/pic-form"
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"

type GetExternalPicColumnsParams = {
  instansi: Instansi[];
  deletePicEksternal: (id: string) => Promise<void>;
  showActions?: boolean;
}

export const getExternalPicColumns = ({ instansi, deletePicEksternal, showActions = true }: GetExternalPicColumnsParams): ColumnDef<PicEksternal>[] => {
  const columns: ColumnDef<PicEksternal>[] = [
    {
      accessorKey: "namaPic",
      header: "Nama PIC",
    },
    {
      accessorKey: "instansiId",
      header: "Nama Instansi",
      cell: ({ row }) => {
        const picInstansi = instansi.find(i => i.id === row.original.instansiId);
        return <div className="font-medium">{picInstansi?.namaInstansi || 'N/A'}</div>;
      },
      filterFn: (row, id, value) => {
        const picInstansi = instansi.find(i => i.id === row.original.instansiId);
        const namaPic = row.original.namaPic;
        const searchTerm = value.toLowerCase();
        
        return picInstansi?.namaInstansi.toLowerCase().includes(searchTerm) || 
               namaPic.toLowerCase().includes(searchTerm);
      },
      // Hiding the individual column filter accessor
      enableColumnFilter: false,
    },
    {
      accessorKey: "jabatan",
      header: "Jabatan",
    },
    {
      accessorKey: "noHp",
      header: "No HP",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
  ];

  if (showActions) {
    columns.push({
      id: "actions",
      cell: ({ row }) => {
        const pic = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(pic.id)}>
                Copy ID
              </DropdownMenuItem>
               <PicForm picToEdit={pic} picType="external">
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit PIC</DropdownMenuItem>
              </PicForm>
              <DeleteConfirmation
                onConfirm={() => deletePicEksternal(pic.id)}
                itemName={pic.namaPic}
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

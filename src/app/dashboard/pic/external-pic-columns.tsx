// src/app/dashboard/pic/external-pic-columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { PicEksternal } from "@/lib/types"
import { useData } from "@/context/data-context"
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

export const ExternalPicColumns = (): ColumnDef<PicEksternal>[] => {
  const { instansi, deletePicEksternal } = useData();
  
  return [
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
      }
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
    {
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
    },
  ]
}

// src/app/dashboard/pic/internal-pic-columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/lib/types"
import { useData } from "@/context/data-context"
import { Badge } from "@/components/ui/badge"
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


export const InternalPicColumns = (): ColumnDef<User>[] => {
  const { instansi, deleteUser } = useData();

  return [
    {
      accessorKey: "nama",
      header: "Nama PIC",
    },
    {
      id: "kodeInstansi",
      header: "Handle Instansi",
      cell: ({ row }) => {
        const handledInstansi = instansi.filter(i => i.internalPicId === row.original.id);
        if (row.original.role !== 'GA' || handledInstansi.length === 0) return <span className="text-muted-foreground">N/A</span>
        return (
          <div className="flex flex-wrap gap-1">
            {handledInstansi.map(i => <Badge variant="secondary" key={i.id}>{i.kodeInstansi}</Badge>)}
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Role",
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
               <PicForm picToEdit={pic} picType="internal">
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit PIC</DropdownMenuItem>
              </PicForm>
              <DeleteConfirmation
                onConfirm={() => deleteUser(pic.id)}
                itemName={pic.nama}
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

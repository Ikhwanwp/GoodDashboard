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
import { MoreHorizontal, Edit } from "lucide-react"
import { AssignInstansiForm } from "@/components/forms/assign-instansi-form"

type InternalPicColumnsProps = {
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
}

export const getInternalPicColumns = ({updateUser}: InternalPicColumnsProps): ColumnDef<User>[] => {
  const { instansi } = useData();

  return [
    {
      accessorKey: "nama",
      header: "Nama PIC",
      size: 200,
    },
    {
      id: "kodeInstansi",
      header: "Handle Instansi",
      cell: ({ row }) => {
        const handledInstansi = instansi.filter(i => i.internalPicId === row.original.id);
        if (row.original.role !== 'GA' || handledInstansi.length === 0) return <span className="text-muted-foreground">Belum ada</span>
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {handledInstansi.map(i => <Badge variant="secondary" key={i.id}>{i.kodeInstansi}</Badge>)}
          </div>
        )
      },
      size: 250,
    },
    {
      accessorKey: "noHp",
      header: "No HP",
      size: 150,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 220,
    },
     {
      id: "actions",
      cell: ({ row }) => {
        const pic = row.original

        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <AssignInstansiForm pic={pic} updateUser={updateUser}>
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit className="mr-2"/> Atur Instansi</DropdownMenuItem>
              </AssignInstansiForm>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        )
      },
      size: 50,
    },
  ]
}

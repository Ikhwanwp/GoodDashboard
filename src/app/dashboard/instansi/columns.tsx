
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Instansi, User } from "@/lib/types"
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
import { useData } from "@/context/data-context"
import { InstansiForm } from "@/components/forms/instansi-form"
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"
import Link from "next/link"

type InstansiColumnsProps = {
  users: User[];
}

export const InstansiColumns = ({ users }: InstansiColumnsProps): ColumnDef<Instansi>[] => {
  const { deleteInstansi } = useData();

  return [
    {
      id: "nomor",
      header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                No.
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row, table }) => {
        const sortedRowIndex = table.getSortedRowModel().rows.findIndex(
            (sortedRow) => sortedRow.id === row.id
        );
        return <div className="text-center">{sortedRowIndex + 1}</div>;
      },
      enableSorting: true,
      enableHiding: false,
      size: 50,
    },
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
      size: 100,
    },
    {
      accessorKey: "namaInstansi",
      header: "Nama Instansi",
      cell: ({ row }) => <div className="font-medium">{row.original.namaInstansi}</div>,
    },
    {
      accessorKey: "pejabatTerkait",
      header: "Pejabat Terkait",
      cell: ({ row }) => {
        const pejabat = row.original.pejabatTerkait;
        const isNotAvailable = !pejabat || pejabat === "Belum ada informasi mengenai kepala badan ini";
        return (
          <div className="">
            {isNotAvailable ? (
              <span className="text-muted-foreground">N/A</span>
            ) : (
              pejabat
            )}
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "jenisLayanan",
      header: "Jenis Layanan",
       size: 150,
    },
    {
        accessorKey: "internalPicId",
        header: "PIC Internal",
        cell: ({ row }) => {
            const picId = row.original.internalPicId;
            const pic = users.find(u => u.id === picId);
            return pic ? pic.nama : <span className="text-muted-foreground">Belum ada</span>
        },
        size: 150,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const instansi = row.original

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
          </div>
        )
      },
      size: 50,
    },
  ]
}

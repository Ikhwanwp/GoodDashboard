"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { DokumenSph } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown, Link as LinkIcon } from "lucide-react"
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
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"
import Link from "next/link"

export const sphColumns: ColumnDef<DokumenSph>[] = [
  {
    accessorKey: "nomorSuratPeruri",
    header: "Nomor SPH",
  },
  {
    accessorKey: "instansiId",
    header: "Nama Instansi",
    cell: ({ row }) => {
        const { instansi } = useData();
        const sphInstansi = instansi.find(i => i.id === row.original.instansiId);
        return <div className="font-medium">{sphInstansi?.namaInstansi || 'N/A'}</div>;
    },
  },
  {
    accessorKey: "perihal",
    header: "Perihal",
    cell: ({ row }) => <div className="max-w-xs truncate">{row.original.perihal}</div>,
  },
  {
    accessorKey: "tanggal",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal SPH
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => format(row.original.tanggal, "dd MMM yyyy"),
  },
  {
    accessorKey: "linkDokumen",
    header: "Link Dokumen",
    cell: ({ row }) => {
        const link = row.original.linkDokumen;
        if (!link || link === '#') return <span className="text-muted-foreground">N/A</span>
        return (
            <Button asChild variant="link" className="p-0 h-auto">
                <Link href={link} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="mr-2 h-4 w-4"/>
                    Buka Dokumen
                </Link>
            </Button>
        )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sph = row.original
      // const { deleteDokumenSph } = useData() // Placeholder for future delete functionality

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(sph.id)}>
              Copy ID
            </DropdownMenuItem>
            {/*
            <DropdownMenuItem>Edit SPH</DropdownMenuItem>
            <DeleteConfirmation
              onConfirm={() => console.log("Deleting SPH", sph.id)}
              itemName={sph.perihal}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                Hapus
              </DropdownMenuItem>
            </DeleteConfirmation>
            */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

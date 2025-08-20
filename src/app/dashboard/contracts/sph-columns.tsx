
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { DokumenSph, Instansi } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown, Link as LinkIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { DeleteConfirmation } from "@/components/shared/delete-confirmation"
import Link from "next/link"
import { SphForm } from "@/components/forms/sph-form"

type GetSphColumnsParams = {
  instansi: Instansi[];
  deleteDokumenSph: (id: string) => Promise<void>;
}

export const getSphColumns = ({ instansi, deleteDokumenSph }: GetSphColumnsParams): ColumnDef<DokumenSph>[] => {
  
  return [
    {
      accessorKey: "nomorSuratPeruri",
      header: "Nomor SPH",
    },
    {
      accessorKey: "instansiId",
      header: "Kode Instansi",
      cell: ({ row }) => {
          const sphInstansi = instansi.find(i => i.id === row.original.instansiId);
          return <div className="font-medium">{sphInstansi?.kodeInstansi || 'N/A'}</div>;
      },
      filterFn: (row, id, value) => {
        const sphInstansi = instansi.find(i => i.id === row.original.instansiId);
        return sphInstansi?.namaInstansi.toLowerCase().includes(value.toLowerCase()) || false;
      }
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
      cell: ({ row }) => {
        const tanggal = row.original.tanggal;
        if (!tanggal || !(tanggal instanceof Date)) {
            return <span className="text-muted-foreground">N/A</span>
        }
        try {
            return format(tanggal, "dd MMM yyyy");
        } catch (error) {
            return <span className="text-muted-foreground">Invalid Date</span>
        }
      },
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
    {
      id: "actions",
      cell: ({ row }) => {
        const sph = row.original
        
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
              <SphForm sphToEdit={sph}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit SPH</DropdownMenuItem>
              </SphForm>
              <DeleteConfirmation
                onConfirm={() => deleteDokumenSph(sph.id)}
                itemName={sph.perihal}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive flex items-center">
                  <Trash2 className="mr-2 h-4 w-4"/>
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

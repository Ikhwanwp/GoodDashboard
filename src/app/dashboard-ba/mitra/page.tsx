
"use client"
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function MitraPage() {
    const dummyMitra = [
        { id: 1, name: "PT. Mitra Jaya", type: "Teknologi", pic: "Andi Wijaya", status: "Aktif" },
        { id: 2, name: "CV. Sinar Abadi", type: "Logistik", pic: "Budi Setiawan", status: "Aktif" },
        { id: 3, name: "PT. Solusi Cipta", type: "Konsultasi", pic: "Citra Lestari", status: "Non-Aktif" },
    ];
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Mitra">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Mitra
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>Daftar Mitra</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Mitra</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>PIC</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyMitra.map((mitra) => (
                  <TableRow key={mitra.id}>
                    <TableCell>{mitra.name}</TableCell>
                    <TableCell>{mitra.type}</TableCell>
                    <TableCell>{mitra.pic}</TableCell>
                    <TableCell>{mitra.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}

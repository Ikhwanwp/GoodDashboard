
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

export default function KerjasamaPage() {
    const dummyKerjasama = [
        { id: 1, project: "Implementasi E-Sign", mitra: "PT. Mitra Jaya", instansi: "Kemenkeu", status: "Berjalan" },
        { id: 2, project: "Pengadaan Server", mitra: "CV. Sinar Abadi", instansi: "Kemenkumham", status: "Selesai" },
        { id: 3, project: "Konsultasi Keamanan Siber", mitra: "PT. Solusi Cipta", instansi: "BSSN", status: "Perencanaan" },
    ];
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Kerja Sama">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Kerja Sama
        </Button>
      </PageHeader>
       <Card>
        <CardHeader>
            <CardTitle>Daftar Kerja Sama Mitra</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyek</TableHead>
                  <TableHead>Mitra</TableHead>
                  <TableHead>Instansi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyKerjasama.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.project}</TableCell>
                    <TableCell>{item.mitra}</TableCell>
                    <TableCell>{item.instansi}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}

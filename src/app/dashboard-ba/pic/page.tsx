
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

export default function PicBAPage() {
    const dummyPics = [
        { id: 1, name: "Rina Kartika", type: "Internal (BA)", role: "Project Manager" },
        { id: 2, name: "Andi Wijaya", type: "Eksternal (Mitra)", role: "Lead Developer" },
        { id: 3, name: "Dedi Irawan", type: "Internal (BA)", role: "Business Analyst" },
    ];
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen PIC">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah PIC
        </Button>
      </PageHeader>
       <Card>
        <CardHeader>
            <CardTitle>Daftar Penanggung Jawab (PIC)</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyPics.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}

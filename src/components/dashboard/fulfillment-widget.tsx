
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/data-context";

// Sample Data
const sampleData = {
  "loggedInUserRole": "GA", // Ubah ke "BA" untuk melihat perbedaannya
  "workflow": {
    "selectedContract": "PKS_KEMENKEU_2025",
    "currentStep": 4,
    "steps": [
      { "name": "Kontrak K/L", "role": "GA", "status": "completed" },
      { "name": "Kode Produk", "role": "GA", "status": "completed" },
      { "name": "Sales Order (SO)", "role": "GA", "status": "completed" },
      { "name": "Purchase Req. (PR)", "role": "BA", "status": "active" },
      { "name": "Purchase Order (PO)", "role": "BA", "status": "pending" },
      { "name": "Surat Perintah Kerja (SPK)", "role": "BA", "status": "pending" },
      { "name": "Goods Receipt (GR)", "role": "BA", "status": "pending" },
      { "name": "Berita Acara Serah Terima (BAST)", "role": "GA", "status": "pending" },
      { "name": "Surat Tanda Terima Jaminan (STTJ)", "role": "GA", "status": "pending" },
      { "name": "Delivery Order (DO)", "role": "GA", "status": "pending" },
      { "name": "Invoicing", "role": "GA", "status": "pending" }
    ],
    "history": [
      { "id": 1, "contract": "PKS Kemenkeu 2024", "status": "Step 4: Create PR", "pic": "Tim BA" },
      { "id": 2, "contract": "MoU BSSN 2024", "status": "Step 2: Kode Produk", "pic": "Tim GA" },
      { "id": 3, "contract": "PKS Kemenkumham 2023", "status": "Step 8: STTJ", "pic": "Tim GA" },
      { "id": 4, "contract": "PKS OJK 2024", "status": "Step 5: PO", "pic": "Tim BA" },
      { "id": 5, "contract": "MoU BI 2025", "status": "Step 1: Kontrak K/L", "pic": "Tim GA" },
    ]
  }
};


export function FulfillmentWidget() {
  const { currentUser } = useData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pelacakan Pemenuhan Kontrak Terkini</CardTitle>
        <CardDescription>
          Menampilkan 5 kontrak terakhir yang sedang dalam proses pemenuhan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kontrak</TableHead>
              <TableHead>Status Saat Ini</TableHead>
              <TableHead>PIC Saat Ini</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.workflow.history.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.contract}</TableCell>
                <TableCell>
                    <Badge variant={item.pic === 'Tim BA' ? 'secondary' : 'default'}>
                        {item.status}
                    </Badge>
                </TableCell>
                <TableCell>{item.pic}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button asChild className="w-full md:w-auto ml-auto">
          <Link href="/dashboard/fulfillment">
            Buka Halaman Pelacakan Penuh
            <ChevronsRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

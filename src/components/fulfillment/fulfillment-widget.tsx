// src/components/fulfillment/fulfillment-widget.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const latestContracts = [
    { name: "PKS Kemenkeu 2025", status: "Step 4: Create PR", pic: "Tim BA" },
    { name: "MoU BSSN 2024", status: "Step 2: Kode Produk", pic: "Tim GA" },
    { name: "PKS Kominfo 2025", status: "Step 8: STTJ", pic: "Tim GA" },
    { name: "PKS Prakerja 2024", status: "Step 10: Invoicing", pic: "Tim GA" },
    { name: "MoU Kemenkes 2024", status: "Step 1: Kontrak K/L", pic: "Tim GA" },
];

export function FulfillmentWidget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pelacakan Pemenuhan Kontrak Terkini</CardTitle>
                <CardDescription>5 kontrak terakhir yang sedang dalam proses pemenuhan.</CardDescription>
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
                        {latestContracts.map((contract) => (
                            <TableRow key={contract.name}>
                                <TableCell className="font-medium">{contract.name}</TableCell>
                                <TableCell>{contract.status}</TableCell>
                                <TableCell>{contract.pic}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/dashboard/fulfillment">Buka Halaman Pelacakan Penuh</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

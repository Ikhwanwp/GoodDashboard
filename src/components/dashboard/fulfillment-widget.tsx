
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
import { ChevronsRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/data-context";
import { useMemo } from "react";

export function FulfillmentWidget() {
  const { fulfillments, kontrakPks, loading } = useData();

  const trackedContracts = useMemo(() => {
    if (!fulfillments || !kontrakPks) return [];

    return fulfillments
      .map(fulfillment => {
        const contract = kontrakPks.find(k => k.id === fulfillment.kontrakId);
        if (!contract) return null;

        const currentStep = fulfillment.steps[fulfillment.currentStep];
        if (!currentStep) return null;
        
        return {
          id: fulfillment.id,
          contractName: contract.judulKontrak,
          status: `Step ${fulfillment.currentStep + 1}: ${currentStep.name}`,
          pic: `Tim ${currentStep.role}`,
          lastUpdatedAt: fulfillment.lastUpdatedAt,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.lastUpdatedAt.getTime() - a!.lastUpdatedAt.getTime())
      .slice(0, 5);
  }, [fulfillments, kontrakPks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pelacakan Pemenuhan Kontrak Terkini</CardTitle>
        <CardDescription>
          Menampilkan 5 kontrak terakhir yang sedang dalam proses pemenuhan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nama Kontrak</TableHead>
                <TableHead>Status Saat Ini</TableHead>
                <TableHead>PIC Saat Ini</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {trackedContracts.length > 0 ? trackedContracts.map((item) => (
                <TableRow key={item!.id}>
                    <TableCell className="font-medium">{item!.contractName}</TableCell>
                    <TableCell>
                        <Badge variant={item!.pic === 'Tim BA' ? 'secondary' : 'default'}>
                            {item!.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{item!.pic}</TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">
                            Belum ada kontrak yang dilacak.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        )}
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

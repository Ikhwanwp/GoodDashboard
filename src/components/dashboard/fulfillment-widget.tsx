
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
import { ChevronsRight, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useData } from "@/context/data-context";
import { useMemo } from "react";

export function FulfillmentWidget() {
  const { fulfillments, kontrakPks, kontrakMou, instansi, loading } = useData();

  const trackedContracts = useMemo(() => {
    if (!fulfillments || !instansi) return [];

    const allContracts = [
        ...kontrakPks.map(k => ({...k, type: 'PKS'})),
        ...kontrakMou.map(m => ({...m, id: m.id, type: 'MoU', nomorKontrakPeruri: m.nomorMouPeruri, judulKontrak: m.isiMou}))
    ];

    return fulfillments
      .map(fulfillment => {
        const contract = allContracts.find(k => k.id === fulfillment.kontrakId);
        if (!contract) return null;

        const kl = instansi.find(i => i.id === contract.instansiId);
        if (!kl) return null;

        const currentStep = fulfillment.steps[fulfillment.currentStep];
        if (!currentStep) return null;

        const completedCount = fulfillment.steps.filter(s => s.status === 'completed').length;
        const progress = Math.round((completedCount / fulfillment.steps.length) * 100);
        
        return {
          id: fulfillment.id,
          contractNumber: contract.nomorKontrakPeruri,
          kodeInstansi: kl.kodeInstansi,
          status: currentStep.name,
          progress: progress,
          isTermin: currentStep.name.startsWith('Termin'),
          lastUpdatedAt: fulfillment.lastUpdatedAt,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.lastUpdatedAt.getTime() - a!.lastUpdatedAt.getTime())
      .slice(0, 5);
  }, [fulfillments, kontrakPks, kontrakMou, instansi]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Monitoring Status Invoice Terkini
        </CardTitle>
        <CardDescription>
          Menampilkan progres termin dan penagihan 5 kontrak terakhir.
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
                <TableHead>K/L</TableHead>
                <TableHead>Nomor Kontrak</TableHead>
                <TableHead>Posisi Saat Ini</TableHead>
                <TableHead className="text-right">Progres Alur</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {trackedContracts.length > 0 ? trackedContracts.map((item) => (
                <TableRow key={item!.id}>
                    <TableCell>
                        <Badge variant="outline" className="font-bold">{item!.kodeInstansi}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-xs md:text-sm">{item!.contractNumber}</TableCell>
                    <TableCell>
                        <Badge variant={item!.isTermin ? 'secondary' : 'default'} className={cn(item!.status === 'End Of Contract' && 'bg-green-500 text-white')}>
                            {item!.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xs font-bold">{item!.progress}%</span>
                            <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all" 
                                    style={{ width: `${item!.progress}%` }} 
                                />
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                            Belum ada alur pelacakan yang dikonfigurasi.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button asChild variant="ghost" className="w-full md:w-auto ml-auto text-primary">
          <Link href="/dashboard/fulfillment">
            Kelola Pelacakan Lengkap
            <ChevronsRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Loader2, Link as LinkIcon, Settings2, Handshake, Info } from "lucide-react";
import { useData } from "@/context/data-context";
import { cn } from "@/lib/utils";
import type { Fulfillment, WorkflowStep } from "@/lib/types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";

export function FulfillmentTracker() {
  const { instansi, kontrakPks, kontrakMou, getFulfillment, initializeFulfillment, updateFulfillmentStep, loading } = useData();
  const [selectedInstansiId, setSelectedInstansiId] = useState<string | null>(null);
  const [selectedKontrakId, setSelectedKontrakId] = useState<string | null>(null);
  const [activeFulfillment, setActiveFulfillment] = useState<Fulfillment | null>(null);
  const [isLoadingFulfillment, setIsLoadingFulfillment] = useState(false);
  
  // Setup State
  const [terminCount, setTerminCount] = useState<number>(1);
  const [isInitializing, setIsInitializing] = useState(false);

  // Completion State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [isSavingStep, setIsSavingStep] = useState(false);

  const [refNumber, setRefNumber] = useState("");
  const [linkDokumen, setLinkDokumen] = useState("");
  const [billingAmount, setBillingAmount] = useState<string>("");
  const { toast } = useToast();

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleInstansiChange = (instansiId: string) => {
    setSelectedInstansiId(instansiId);
    setSelectedKontrakId(null);
    setActiveFulfillment(null);
  }
  
  const handleContractChange = useCallback(async (kontrakId: string) => {
    if (!kontrakId) return;
    setSelectedKontrakId(kontrakId);
    setIsLoadingFulfillment(true);
    setActiveFulfillment(null);
    try {
      const fulfillmentData = await getFulfillment(kontrakId);
      setActiveFulfillment(fulfillmentData);
    } catch (error) {
      console.error("Failed to load fulfillment data:", error);
    } finally {
      setIsLoadingFulfillment(false);
    }
  }, [getFulfillment]);

  const allActiveContracts = useMemo(() => {
    const pks = kontrakPks.filter(k => k.statusKontrak === 'Aktif').map(k => ({ ...k, type: 'PKS' as const }));
    const mou = kontrakMou.filter(m => m.statusKontrak === 'Aktif').map(m => ({ ...m, type: 'MoU' as const, nominal: 0, judulKontrak: m.isiMou, nomorKontrakPeruri: m.nomorMouPeruri, nomorKontrakKl: m.nomorMouKl }));
    return [...pks, ...mou];
  }, [kontrakPks, kontrakMou]);

  const availableContracts = useMemo(() => {
    if (!selectedInstansiId) return [];
    return allActiveContracts.filter(k => k.instansiId === selectedInstansiId);
  }, [selectedInstansiId, allActiveContracts]);

  const instansiWithActiveContracts = useMemo(() => {
    const instansiIds = new Set(allActiveContracts.map(k => k.instansiId));
    return instansi.filter(i => instansiIds.has(i.id));
  }, [instansi, allActiveContracts]);

  const selectedContractInfo = useMemo(() => {
    if (!selectedKontrakId) return null;
    return allActiveContracts.find(k => k.id === selectedKontrakId);
  }, [selectedKontrakId, allActiveContracts]);

  const handleInitialize = async () => {
    if (!selectedKontrakId) return;
    setIsInitializing(true);
    try {
      const data = await initializeFulfillment(selectedKontrakId, terminCount);
      setActiveFulfillment(data);
    } catch (error) {
      console.error("Initialization failed:", error);
    } finally {
      setIsInitializing(false);
    }
  }

  const handleStepClick = (step: WorkflowStep, index: number) => {
    if (step.status === 'pending') {
        const prevStep = index > 0 ? activeFulfillment?.steps[index-1] : null;
        if (prevStep?.status !== 'completed') return;
    }
    
    setSelectedStep(step);
    setSelectedStepIndex(index);
    setRefNumber(step.refNumber || "");
    setLinkDokumen(step.linkDokumen || "");
    setBillingAmount(step.billingAmount?.toString() || "");
    setIsModalOpen(true);
  };
  
  const handleCompleteStep = async () => {
    if (selectedKontrakId === null || selectedStepIndex === null) return;

    if (selectedStep?.name !== 'Kontrak K/L' && !refNumber) {
      toast({
        variant: "destructive",
        title: "Data Diperlukan",
        description: "Harap isi nomor referensi invoice untuk menyelesaikan langkah ini.",
      });
      return;
    }

    setIsSavingStep(true);
    try {
      const amount = billingAmount ? parseFloat(billingAmount) : null;
      await updateFulfillmentStep(selectedKontrakId, selectedStepIndex, { refNumber, notes: "", linkDokumen, billingAmount: amount });
      setIsModalOpen(false);
      handleContractChange(selectedKontrakId);
    } catch (error) {
      console.error("Failed to complete step:", error);
    } finally {
      setIsSavingStep(false);
    }
  }

  const fulfillmentHistory = activeFulfillment?.steps
    .filter(step => step.status === 'completed')
    .sort((a,b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
                <CardTitle>Status Kontrak</CardTitle>
                <CardDescription>Atur alur termin dan monitor progres kontrak aktif.</CardDescription>
            </div>
             <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedInstansiId || ""} onValueChange={handleInstansiChange} disabled={loading}>
                <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Pilih K/L..." />
                </SelectTrigger>
                <SelectContent>
                    {instansiWithActiveContracts.map(i => (
                        <SelectItem key={i.id} value={i.id}>{i.kodeInstansi}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Select 
                    value={selectedKontrakId || ""} 
                    onValueChange={handleContractChange} 
                    disabled={!selectedInstansiId || loading || availableContracts.length === 0}
                >
                <SelectTrigger className="w-full md:w-[350px]">
                    <SelectValue 
                        placeholder={
                            !selectedInstansiId 
                            ? "Pilih K/L dulu" 
                            : availableContracts.length === 0
                            ? "Tidak ada kontrak aktif"
                            : "Pilih Kontrak Aktif..."
                        } 
                    />
                </SelectTrigger>
                <SelectContent>
                    {availableContracts.length > 0 ? (
                        availableContracts.map(k => (
                            <SelectItem key={k.id} value={k.id}>
                              {k.nomorKontrakPeruri || k.nomorKontrakKl}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">Tidak ada kontrak aktif.</div>
                    )}
                </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingFulfillment && (
            <div className="flex flex-col items-center justify-center p-16 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Memuat alur kerja...</p>
            </div>
          )}
          
          {!selectedKontrakId && !isLoadingFulfillment && (
             <div className="text-center text-muted-foreground py-16">
              <p>Silakan pilih K/L dan kontrak yang aktif untuk melihat atau membuat alur kerja.</p>
            </div>
          )}

          {selectedKontrakId && !isLoadingFulfillment && !activeFulfillment && (
             <div className="max-w-2xl mx-auto py-8">
                <Card className="border-accent/20 bg-accent/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings2 className="text-accent h-5 w-5"/>
                            Konfigurasi Alur Kontrak Baru
                        </CardTitle>
                        <CardDescription>Kontrak ini belum memiliki alur. Tentukan jumlah termin penagihan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-background p-4 rounded-md border">
                            <div>
                                <p className="text-muted-foreground">Nomor Kontrak Peruri</p>
                                <p className="font-semibold">{selectedContractInfo?.nomorKontrakPeruri || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Nomor Kontrak K/L</p>
                                <p className="font-semibold">{selectedContractInfo?.nomorKontrakKl}</p>
                            </div>
                            <div className="md:col-span-2 pt-2 border-t mt-2">
                                <p className="text-muted-foreground">Nominal Kontrak</p>
                                <p className="text-xl font-bold text-primary">{selectedContractInfo ? formatRupiah(selectedContractInfo.nominal) : 'Rp 0'}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Jumlah Termin Pembayaran</label>
                            <div className="flex items-center gap-4">
                                <Input 
                                    type="number" 
                                    min="1" 
                                    max="12" 
                                    value={terminCount} 
                                    onChange={(e) => setTerminCount(parseInt(e.target.value) || 1)}
                                    className="w-24"
                                />
                                <p className="text-xs text-muted-foreground italic">
                                    Akan menghasilkan alur: Kontrak K/L → {Array.from({length: terminCount}).map((_, i) => `Termin ${i+1}`).join(' → ')} → End Of Contract
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleInitialize} className="w-full" disabled={isInitializing}>
                            {isInitializing ? <Loader2 className="animate-spin mr-2"/> : <Handshake className="mr-2 h-4 w-4" />}
                            Generate Stepper Alur
                        </Button>
                    </CardFooter>
                </Card>
             </div>
          )}

          {activeFulfillment && !isLoadingFulfillment && (
            <>
                <div className="mb-6 p-4 rounded-lg bg-primary/5 border flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-4 items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Handshake className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                             <p className="text-sm font-semibold">{selectedContractInfo?.judulKontrak}</p>
                             <p className="text-xs text-muted-foreground">{selectedContractInfo?.nomorKontrakPeruri} | {selectedContractInfo?.nomorKontrakKl}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Nominal</p>
                        <p className="font-bold text-primary">{selectedContractInfo ? formatRupiah(selectedContractInfo.nominal) : '-'}</p>
                    </div>
                </div>

                <div className="w-full overflow-x-auto pb-6">
                    <div className="relative flex items-start pt-6 min-w-max">
                    {activeFulfillment.steps.map((step, index) => {
                        const isAccessible = index === 0 || activeFulfillment.steps[index-1].status === 'completed' || step.status === 'completed';
                        
                        return (
                        <div key={step.name} className="flex-1 flex flex-col items-center relative">
                        <div
                            className={cn(
                                "flex flex-col items-center gap-2 transition-all duration-200",
                                !isAccessible ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer group z-10'
                            )}
                            onClick={() => isAccessible && handleStepClick(step, index)}
                        >
                            <div
                            className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all bg-background z-10",
                                step.status === "completed" && "bg-primary border-primary text-primary-foreground",
                                step.status === "active" && "bg-accent border-accent text-accent-foreground ring-4 ring-accent/20",
                                step.status === "pending" && "bg-muted border-border text-muted-foreground"
                            )}
                            >
                            {step.status === "completed" ? (
                                <CheckCircle className="h-6 w-6" />
                            ) : (
                                <Circle className="h-6 w-6" />
                            )}
                            </div>
                            <div className="text-center w-24">
                                <p className={cn("text-xs font-bold", step.status === 'active' ? 'text-accent' : 'text-foreground')}>
                                    {step.name}
                                </p>
                            </div>
                        </div>
                        {index < activeFulfillment.steps.length - 1 && (
                            <div
                                className={cn(
                                "absolute h-0.5 top-[24px] left-1/2 w-full -z-0",
                                step.status === 'completed' ? 'bg-primary' : 'bg-border'
                                )}
                            />
                        )}
                        </div>
                    )})}
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Riwayat Aktivitas Alur
                    </h3>
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Langkah</TableHead>
                            <TableHead>Selesai Pada</TableHead>
                            <TableHead>No. Referensi / Detail</TableHead>
                            <TableHead>Nominal Penagihan</TableHead>
                            <TableHead className="text-center">Dokumen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fulfillmentHistory && fulfillmentHistory.length > 0 ? (
                                fulfillmentHistory.map((item) => (
                                <TableRow key={item.name}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.completedAt ? format(item.completedAt, 'dd MMM yyyy, HH:mm') : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono">
                                          {item.name === 'Kontrak K/L' ? 'Data Kontrak Terverifikasi' : item.refNumber}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {item.billingAmount ? formatRupiah(item.billingAmount) : '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                    <Button variant="ghost" size="icon" asChild disabled={!item.linkDokumen}>
                                        <a href={item.linkDokumen!} target="_blank" rel="noopener noreferrer">
                                        <LinkIcon className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Belum ada langkah yang diselesaikan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progres: {selectedStep?.name}</DialogTitle>
            <DialogDescription>
              {selectedStep?.name === 'Kontrak K/L' 
                ? "Verifikasi informasi kontrak berikut untuk melanjutkan alur." 
                : "Masukkan detail penagihan sesuai progres termin."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             {selectedStep?.name === 'Kontrak K/L' ? (
                <div className="bg-muted p-4 rounded-lg space-y-3">
                   <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="text-sm space-y-2">
                         <p className="font-bold">Informasi Kontrak:</p>
                         <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <span className="text-muted-foreground">Nomor Peruri:</span>
                            <span className="font-mono">{selectedContractInfo?.nomorKontrakPeruri || 'N/A'}</span>
                            <span className="text-muted-foreground">Nomor K/L:</span>
                            <span className="font-mono">{selectedContractInfo?.nomorKontrakKl}</span>
                            <span className="text-muted-foreground">Nominal:</span>
                            <span className="font-bold text-primary">{selectedContractInfo ? formatRupiah(selectedContractInfo.nominal) : '-'}</span>
                         </div>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="ref" className="text-sm font-medium">Nomor Referensi / Invoice</label>
                    <Input id="ref" value={refNumber} onChange={(e) => setRefNumber(e.target.value)} className="w-full mt-1" placeholder="Contoh: INV/2025/123"/>
                  </div>
                  <div>
                    <label htmlFor="amount" className="text-sm font-medium">Nominal Penagihan (Rp)</label>
                    <Input id="amount" type="number" value={billingAmount} onChange={(e) => setBillingAmount(e.target.value)} className="w-full mt-1" placeholder="Contoh: 50000000"/>
                  </div>
                  <div>
                    <label htmlFor="link" className="text-sm font-medium">Link Dokumen Invoice</label>
                    <Input id="link" value={linkDokumen} onChange={(e) => setLinkDokumen(e.target.value)} className="w-full mt-1" placeholder="https://link-dokumen-invoice.com/..."/>
                  </div>
                </div>
             )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleCompleteStep} disabled={isSavingStep}>
                {isSavingStep ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                {selectedStep?.name === 'Kontrak K/L' ? 'Konfirmasi & Mulai Termin' : 'Konfirmasi Selesai'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}



"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { CheckCircle, Circle, Loader2, Link as LinkIcon, Upload, FileText } from "lucide-react";
import { useData } from "@/context/data-context";
import { cn } from "@/lib/utils";
import type { Fulfillment, WorkflowStep } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function FulfillmentTracker() {
  const { currentUser, instansi, kontrakPks, users, getOrCreateFulfillment, updateFulfillmentStep, loading } = useData();
  const [selectedInstansiId, setSelectedInstansiId] = useState<string | null>(null);
  const [selectedKontrakId, setSelectedKontrakId] = useState<string | null>(null);
  const [activeFulfillment, setActiveFulfillment] = useState<Fulfillment | null>(null);
  const [isLoadingFulfillment, setIsLoadingFulfillment] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [isSavingStep, setIsSavingStep] = useState(false);

  const [refNumber, setRefNumber] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

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
      const fulfillmentData = await getOrCreateFulfillment(kontrakId);
      setActiveFulfillment(fulfillmentData);
    } catch (error) {
      console.error("Failed to load fulfillment data:", error);
    } finally {
      setIsLoadingFulfillment(false);
    }
  }, [getOrCreateFulfillment]);

  const availableContracts = useMemo(() => {
    if (!selectedInstansiId) return [];
    return kontrakPks.filter(k => k.instansiId === selectedInstansiId && k.statusKontrak === 'Aktif');
  }, [selectedInstansiId, kontrakPks]);

  const handleStepClick = (step: WorkflowStep, index: number) => {
    setSelectedStep(step);
    setSelectedStepIndex(index);
    setRefNumber(step.refNumber || "");
    setNotes(step.notes || "");
    setIsModalOpen(true);
  };
  
  const canCompleteStep = currentUser?.role === selectedStep?.role;

  const handleCompleteStep = async () => {
    if (!canCompleteStep || selectedKontrakId === null || selectedStepIndex === null) return;

    if (!refNumber) {
      toast({
        variant: "destructive",
        title: "Nomor Referensi Diperlukan",
        description: "Harap isi nomor referensi untuk menyelesaikan langkah ini.",
      });
      return;
    }

    setIsSavingStep(true);
    try {
      await updateFulfillmentStep(selectedKontrakId, selectedStepIndex, { refNumber, notes });
      setIsModalOpen(false);
      // Refetch data for the current contract to show updates
      handleContractChange(selectedKontrakId);
    } catch (error) {
      console.error("Failed to complete step:", error);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat memperbarui langkah alur kerja."
      })
    } finally {
      setIsSavingStep(false);
    }
  }

  const fulfillmentHistory = activeFulfillment?.steps
    .filter(step => step.status === 'completed')
    .map(step => {
        const pic = users.find(u => u.id === step.completedBy);
        return {
            ...step,
            picName: pic?.nama || 'N/A',
        };
    })
    .sort((a,b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
                <CardTitle>Pelacakan Alur Pemenuhan Kontrak</CardTitle>
                <CardDescription>Pilih K/L dan kontrak untuk melihat progres aktivitasnya.</CardDescription>
            </div>
             <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedInstansiId || ""} onValueChange={handleInstansiChange} disabled={loading}>
                <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Pilih K/L..." />
                </SelectTrigger>
                <SelectContent>
                    {instansi.map(i => (
                        <SelectItem key={i.id} value={i.id}>{i.kodeInstansi}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Select 
                    value={selectedKontrakId || ""} 
                    onValueChange={handleContractChange} 
                    disabled={!selectedInstansiId || loading || availableContracts.length === 0}
                >
                <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue 
                        placeholder={
                            !selectedInstansiId 
                            ? "Pilih K/L dulu" 
                            : availableContracts.length === 0
                            ? "Tidak ada kontrak aktif"
                            : "Pilih nomor kontrak..."
                        } 
                    />
                </SelectTrigger>
                <SelectContent>
                    {availableContracts.length > 0 ? (
                        availableContracts.map(k => (
                            <SelectItem key={k.id} value={k.id}>{k.nomorKontrakPeruri}</SelectItem>
                        ))
                    ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">K/L ini tidak memiliki kontrak PKS aktif untuk dilacak.</div>
                    )}
                </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingFulfillment && (
            <div className="flex flex-col items-center justify-center p-8 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Memuat data alur kerja...</p>
            </div>
          )}
          {!selectedKontrakId && !isLoadingFulfillment && (
             <div className="text-center text-muted-foreground py-16">
              <p>Silakan pilih kontrak PKS yang aktif untuk memulai.</p>
            </div>
          )}
          {activeFulfillment && !isLoadingFulfillment && (
            <>
                {/* Visual Workflow Tracker */}
                <div className="w-full overflow-x-auto pb-4">
                    <div className="relative flex items-start pt-6 min-w-max">
                    {activeFulfillment.steps.map((step, index) => (
                        <div key={step.name} className="flex-1 flex flex-col items-center relative">
                        <div
                            className={cn(
                                "flex flex-col items-center gap-2 cursor-pointer group z-10",
                                step.status === 'pending' && 'opacity-50'
                            )}
                            onClick={() => handleStepClick(step, index)}
                        >
                            <div
                            className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all bg-background z-10",
                                step.status === "completed" && "bg-primary border-primary text-primary-foreground",
                                step.status === "active" && "bg-accent border-accent text-accent-foreground animate-pulse",
                                step.status === "pending" && "bg-muted border-border text-muted-foreground"
                            )}
                            >
                            {step.status === "completed" ? (
                                <CheckCircle className="h-6 w-6" />
                            ) : (
                                <Circle className="h-6 w-6" />
                            )}
                            </div>
                            <div className="text-center text-xs w-24">
                            <p className="font-semibold text-foreground">{step.name}</p>
                            <p className="text-muted-foreground group-hover:text-foreground transition-colors">{step.role}</p>
                            </div>
                        </div>
                        {index < activeFulfillment.steps.length - 1 && (
                            <div
                                className={cn(
                                "absolute h-1 top-[22px] left-1/2 w-full -z-1",
                                step.status === 'completed' ? 'bg-primary' : 'bg-border'
                                )}
                            />
                        )}
                        </div>
                    ))}
                    </div>
                </div>

                {/* Activity History Table */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Riwayat Aktivitas</h3>
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Aktivitas</TableHead>
                            <TableHead>PIC</TableHead>
                            <TableHead>Tanggal Selesai</TableHead>
                            <TableHead>No. Referensi</TableHead>
                            <TableHead className="text-center">Dokumen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fulfillmentHistory && fulfillmentHistory.length > 0 ? (
                                fulfillmentHistory.map((item) => (
                                <TableRow key={item.name}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.picName} ({item.role})</TableCell>
                                    <TableCell>{item.completedAt ? format(item.completedAt, 'dd MMM yyyy, HH:mm') : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.refNumber}</Badge>
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
                                        Belum ada aktivitas yang selesai.
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

      {/* Modal for Step Completion */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Langkah: {selectedStep?.name}</DialogTitle>
            <DialogDescription>
              Lengkapi informasi di bawah ini untuk menyelesaikan langkah.
              PIC yang bertanggung jawab untuk langkah ini adalah: <strong>Tim {selectedStep?.role}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div>
                <label htmlFor="ref" className="text-sm font-medium">Nomor Referensi</label>
                <Input id="ref" value={refNumber} onChange={(e) => setRefNumber(e.target.value)} className="w-full mt-1" readOnly={!canCompleteStep} placeholder="Contoh: SO/2025/123"/>
             </div>
              <div>
                <label htmlFor="notes" className="text-sm font-medium">Catatan (Opsional)</label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full mt-1" rows={3} readOnly={!canCompleteStep} placeholder="Informasi tambahan..."/>
             </div>
             <div>
                <label htmlFor="doc" className="text-sm font-medium">Dokumen Pendukung</label>
                 <div className="mt-1">
                    <Button variant="outline" asChild disabled={!canCompleteStep} className="w-full">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4"/> Unggah Dokumen
                      </label>
                    </Button>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                 </div>
             </div>
          </div>
          <DialogFooter>
             {!canCompleteStep && selectedStep?.status !== 'completed' && (
                <p className="text-sm text-destructive mr-auto">Anda tidak memiliki izin untuk menyelesaikan langkah ini.</p>
             )}
             {selectedStep?.status === 'completed' && (
                <p className="text-sm text-muted-foreground mr-auto">Langkah ini sudah selesai.</p>
             )}
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleCompleteStep} disabled={!canCompleteStep || isSavingStep || selectedStep?.status === 'completed'}>
                {isSavingStep ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                Selesaikan Langkah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


"use client";

import { useState } from "react";
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
import { CheckCircle, Circle, Loader2, Link as LinkIcon, FileText, Upload } from "lucide-react";
import { useData } from "@/context/data-context";
import { cn } from "@/lib/utils";

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
      { "name": "SPK", "role": "BA", "status": "pending" },
      { "name": "GR", "role": "BA", "status": "pending" },
      { "name": "STTJ", "role": "GA", "status": "pending" },
      { "name": "DO", "role": "GA", "status": "pending" },
      { "name": "Invoicing", "role": "GA", "status": "pending" }
    ],
    "history": [
      { "id": 1, "activity": "Sales Order (SO)", "pic": "Andini - GA", "date": "2025-08-20", "ref": "SO/2025/123", "link": "#" },
      { "id": 2, "activity": "Kode Produk", "pic": "Rahmat - GA", "date": "2025-08-18", "ref": "PROD/XYZ/001", "link": "#" },
      { "id": 3, "activity": "Kontrak K/L", "pic": "Andini - GA", "date": "2025-08-15", "ref": "PKS/01/2025", "link": "#" },
    ]
  }
};

type WorkflowStep = typeof sampleData.workflow.steps[0];


export function FulfillmentTracker() {
  const { currentUser } = useData();
  const [selectedContract, setSelectedContract] = useState("PKS_KEMENKEU_2025");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);

  const handleStepClick = (step: WorkflowStep) => {
    setSelectedStep(step);
    setIsModalOpen(true);
  };
  
  const canCompleteStep = currentUser?.role === selectedStep?.role;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
                <CardTitle>Pelacakan Alur Pemenuhan Kontrak</CardTitle>
                <CardDescription>Pilih kontrak untuk melihat progres dan riwayat aktivitasnya.</CardDescription>
            </div>
            <div className="w-full md:w-auto md:min-w-[300px]">
                <Select value={selectedContract} onValueChange={setSelectedContract}>
                <SelectTrigger>
                    <SelectValue placeholder="Pilih kontrak..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PKS_KEMENKEU_2025">PKS Kemenkeu 2025</SelectItem>
                    <SelectItem value="MOU_BSSN_2024">MoU BSSN 2024</SelectItem>
                    <SelectItem value="PKS_OJK_2024">PKS OJK 2024</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Visual Workflow Tracker */}
          <div className="w-full overflow-x-auto pb-4">
            <div className="relative flex items-center min-w-max">
              {sampleData.workflow.steps.map((step, index) => (
                <div key={step.name} className="flex items-center z-10">
                  <div
                    className={cn(
                        "flex flex-col items-center gap-2 cursor-pointer group",
                         step.status === 'pending' && 'opacity-50'
                    )}
                    onClick={() => handleStepClick(step)}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
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
                    <div className="text-center text-xs w-20">
                      <p className="font-semibold text-foreground">{step.name}</p>
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors">{step.role}</p>
                    </div>
                  </div>
                  {index < sampleData.workflow.steps.length - 1 && (
                     <div
                        className={cn(
                          "h-1 w-16 transition-colors",
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
                    <TableHead>No.</TableHead>
                    <TableHead>Aktivitas</TableHead>
                    <TableHead>PIC</TableHead>
                    <TableHead>Tanggal Selesai</TableHead>
                    <TableHead>No. Referensi</TableHead>
                    <TableHead className="text-center">Dokumen</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sampleData.workflow.history.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.activity}</TableCell>
                        <TableCell>{item.pic}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                        <Badge variant="outline">{item.ref}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                        <Button variant="ghost" size="icon" asChild>
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="h-4 w-4" />
                            </a>
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          </div>
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
                <input id="ref" className="w-full mt-1 p-2 border rounded-md" readOnly={!canCompleteStep} placeholder="Contoh: SO/2025/123"/>
             </div>
              <div>
                <label htmlFor="notes" className="text-sm font-medium">Catatan (Opsional)</label>
                <textarea id="notes" className="w-full mt-1 p-2 border rounded-md" rows={3} readOnly={!canCompleteStep} placeholder="Informasi tambahan..."/>
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
             {!canCompleteStep && (
                <p className="text-sm text-destructive mr-auto">Anda tidak memiliki izin untuk menyelesaikan langkah ini.</p>
             )}
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button disabled={!canCompleteStep}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Selesaikan Langkah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// src/components/fulfillment/step-completion-form.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Step = {
    name: string;
    role: "GA" | "BA";
    status: "completed" | "active" | "pending";
};

type StepCompletionFormProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    step: Step;
    isReadOnly: boolean;
};

export function StepCompletionForm({ isOpen, setIsOpen, step, isReadOnly }: StepCompletionFormProps) {
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Langkah: {step.name}</DialogTitle>
                    <DialogDescription>
                        {isReadOnly 
                            ? "Lihat detail untuk langkah ini." 
                            : "Isi detail di bawah ini untuk menyelesaikan langkah ini."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ref-number" className="text-right">
                            No. Referensi
                        </Label>
                        <Input id="ref-number" placeholder="Contoh: PR/2025/456" className="col-span-3" readOnly={isReadOnly} />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="doc-link" className="text-right">
                            Link Dokumen
                        </Label>
                        <Input id="doc-link" placeholder="https://..." className="col-span-3" readOnly={isReadOnly} />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="notes" className="text-right pt-2">
                            Catatan
                        </Label>
                        <Textarea id="notes" placeholder="Catatan tambahan (opsional)..." className="col-span-3" readOnly={isReadOnly} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        {isReadOnly ? "Tutup" : "Batal"}
                    </Button>
                    {!isReadOnly && <Button type="submit">Selesaikan Langkah</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

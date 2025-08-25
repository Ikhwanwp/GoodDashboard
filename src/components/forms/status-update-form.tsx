
"use client";

import { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Loader2, PlusCircle, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { classifyUpdateAction } from "@/lib/actions";
import type { StatusPekerjaan, KontrakPks, KontrakMou } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const judulUpdateOptions = [
  "Penawaran",
  "Pembahasan",
  "Finalisasi",
  "Sirkulasi",
  "Lainnya",
];

const formSchema = z.object({
  instansiId: z.string().min(1, "Instansi harus dipilih"),
  kontrakId: z.string().optional(),
  judulUpdate: z.string().min(1, "Judul update harus dipilih"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  tanggalEvent: z.date({ required_error: "Tanggal event harus diisi." }),
  linkMom: z.string().url().optional().or(z.literal('')),
  type: z.string().optional(),
  subject: z.string().optional(),
});

type StatusUpdateFormProps = {
  children?: React.ReactNode;
  updateToEdit?: StatusPekerjaan;
}

export function StatusUpdateForm({ children, updateToEdit }: StatusUpdateFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const { toast } = useToast();
  const { instansi, kontrakPks, kontrakMou, addStatusPekerjaan, updateStatusPekerjaan } = useData();
  const isEditMode = !!updateToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instansiId: "",
      kontrakId: "",
      judulUpdate: "",
      deskripsi: "",
      linkMom: "",
      type: "",
      subject: "",
    }
  });

  const selectedInstansiId = form.watch("instansiId");

  const availableContracts = useMemo(() => {
    if (!selectedInstansiId) return [];
    const pksContracts = kontrakPks
      .filter(k => k.instansiId === selectedInstansiId)
      .map(k => ({ id: k.id, name: `PKS: ${k.judulKontrak}` }));
    const mouContracts = kontrakMou
      .filter(m => m.instansiId === selectedInstansiId)
      .map(m => ({ id: m.id, name: `MoU: ${m.isiMou}` }));
    return [...pksContracts, ...mouContracts];
  }, [selectedInstansiId, kontrakPks, kontrakMou]);

  useEffect(() => {
    if (open) {
      if(isEditMode && updateToEdit) {
        form.reset({
          ...updateToEdit,
          kontrakId: updateToEdit.kontrakId || "",
          linkMom: updateToEdit.linkMom || "",
          type: updateToEdit.type || "",
          subject: updateToEdit.subject || "",
          tanggalEvent: new Date(updateToEdit.tanggalEvent)
        });
      } else {
        form.reset({
          instansiId: "",
          kontrakId: "",
          judulUpdate: "",
          deskripsi: "",
          tanggalEvent: new Date(),
          linkMom: "",
          type: "",
          subject: "",
        });
      }
    }
  }, [open, isEditMode, updateToEdit, form]);

  useEffect(() => {
    if (selectedInstansiId && !isEditMode) {
      form.setValue("kontrakId", "");
    }
  }, [selectedInstansiId, form, isEditMode]);


  const handleClassify = async () => {
    const isValid = await form.trigger(["judulUpdate", "deskripsi"]);
    if (!isValid) {
         toast({
            variant: "destructive",
            title: "Input Kurang",
            description: "Judul dan Deskripsi harus diisi untuk melakukan klasifikasi AI.",
        });
      return;
    }
    
    setIsClassifying(true);
    const { judulUpdate, deskripsi } = form.getValues();
    
    const result = await classifyUpdateAction({ title: judulUpdate, description: deskripsi });

    if (result.success && result.data) {
      form.setValue("type", result.data.type, { shouldValidate: true });
      form.setValue("subject", result.data.subject, { shouldValidate: true });
      toast({
        title: "Klasifikasi AI Berhasil",
        description: "Tipe dan subjek update telah diisi otomatis.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Klasifikasi AI Gagal",
        description: result.error || "Terjadi kesalahan pada server AI.",
      });
    }
    setIsClassifying(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    const dataToSubmit = {
      ...values,
      kontrakId: values.kontrakId === "none" ? "" : values.kontrakId || "",
      linkMom: values.linkMom || "",
      type: values.type || "",
      subject: values.subject || "",
    };

    try {
      if (isEditMode && updateToEdit) {
        await updateStatusPekerjaan(updateToEdit.id, dataToSubmit);
      } else {
        await addStatusPekerjaan(dataToSubmit as Omit<StatusPekerjaan, 'id' | 'tanggalUpdate'>);
      }
      setOpen(false);
    } finally {
      setIsSaving(false);
    }
  }

  const trigger = children ? (
    <div onClick={() => setOpen(true)} className="w-full">
      {children}
    </div>
  ) : (
    <Button className="bg-primary hover:bg-primary/90">
      <PlusCircle className="mr-2 h-4 w-4" />
      Tambah Update
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Status Pekerjaan' : 'Tambah Status Pekerjaan'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Ubah detail update pekerjaan yang sudah ada.' : 'Isi detail update pekerjaan terbaru. Gunakan AI untuk klasifikasi otomatis.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="status-update-form" onSubmit={form.handleSubmit(onSubmit)} className="flex-grow overflow-auto">
            <ScrollArea className="h-full pr-6 -mr-6">
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="instansiId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instansi</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih instansi terkait" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {instansi.map(inst => (
                              <SelectItem key={inst.id} value={inst.id}>
                                {inst.kodeInstansi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kontrakId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kontrak Terkait (Opsional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedInstansiId}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                !selectedInstansiId 
                                ? "Pilih instansi dulu" 
                                : availableContracts.length === 0 
                                ? "Tidak ada kontrak"
                                : "Pilih kontrak"
                              } />
                            </SelectTrigger>
                          </FormControl>
                           <SelectContent>
                            <SelectItem value="none">Umum (Tidak terikat kontrak)</SelectItem>
                            {availableContracts.map(c => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="judulUpdate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Update</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih judul" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {judulUpdateOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tanggalEvent"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Event</FormLabel>
                        <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <DialogPortal>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setDatePickerOpen(false);
                                }}
                                captionLayout="dropdown-buttons"
                                fromYear={2015}
                                toYear={new Date().getFullYear() + 5}
                                initialFocus
                                />
                            </PopoverContent>
                          </DialogPortal>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="deskripsi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Jelaskan detail update pekerjaan di sini..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/*
                <Card className="bg-muted/30">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <h4 className="font-semibold text-card-foreground">Asisten AI</h4>
                                <p className="text-sm text-muted-foreground">Klik tombol untuk mengklasifikasikan tipe dan subjek secara otomatis.</p>
                            </div>
                            <Button type="button" variant="outline" onClick={handleClassify} disabled={isClassifying} className="shrink-0 bg-background">
                                {isClassifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                                Klasifikasi dengan AI
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipe (AI)</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Akan diisi oleh AI" {...field} readOnly className="bg-background" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subjek (AI)</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Akan diisi oleh AI" {...field} readOnly className="bg-background" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
                */}

                <FormField
                  control={form.control}
                  name="linkMom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link MoM (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://docs.google.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
          </form>
        </Form>
        <DialogFooter className="mt-auto shrink-0 border-t pt-4">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          <Button type="submit" form="status-update-form" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

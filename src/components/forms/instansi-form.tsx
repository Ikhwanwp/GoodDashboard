
"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useData } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Instansi } from "@/lib/types";
import { format } from "date-fns";
import { getPejabatTerkaitAction } from "@/lib/actions";

const formSchema = z.object({
  namaInstansi: z.string().min(3, "Nama instansi minimal 3 karakter"),
  kodeInstansi: z.string().min(2, "Kode instansi minimal 2 karakter").max(20, "Kode instansi maksimal 20 karakter"),
  pejabatTerkait: z.string().optional(),
  tanggalUlangTahun: z.date().optional(),
  statusKementrian: z.enum(["STG Prioritas", "Non Prioritas"], { required_error: "Status kementrian harus dipilih" }),
  jenisLayanan: z.string().optional(),
});

type InstansiFormProps = {
  children?: React.ReactNode;
  instansiToEdit?: Instansi;
};

export function InstansiForm({ children, instansiToEdit }: InstansiFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isGeneratingPejabat, setIsGeneratingPejabat] = useState(false);

  const { instansi, addInstansi, updateInstansi } = useData();
  const { toast } = useToast();
  const isEditMode = !!instansiToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const namaInstansiValue = form.watch("namaInstansi");

  useEffect(() => {
    if (!open) return;
    if (isEditMode && instansiToEdit) {
      form.reset({
        ...instansiToEdit,
        pejabatTerkait: instansiToEdit.pejabatTerkait || '',
        jenisLayanan: instansiToEdit.jenisLayanan || '',
        tanggalUlangTahun: instansiToEdit.tanggalUlangTahun ? new Date(instansiToEdit.tanggalUlangTahun) : undefined,
      });
    } else {
      form.reset({
        namaInstansi: "",
        kodeInstansi: "",
        pejabatTerkait: "",
        jenisLayanan: "",
        statusKementrian: undefined,
        tanggalUlangTahun: undefined,
      } as any);
    }
  }, [open, isEditMode, instansiToEdit, form]);

  const handleGeneratePejabat = async () => {
    if (!namaInstansiValue) {
      toast({
        variant: "destructive",
        title: "Nama Instansi Diperlukan",
        description: "Harap isi nama instansi terlebih dahulu untuk menggunakan AI.",
      });
      return;
    }

    setIsGeneratingPejabat(true);
    const result = await getPejabatTerkaitAction({ namaInstansi: namaInstansiValue });
    
    if (result.success && result.data) {
      form.setValue("pejabatTerkait", result.data.namaPejabat, { shouldValidate: true });
      toast({
        title: "Berhasil!",
        description: `Pejabat untuk ${namaInstansiValue} berhasil ditemukan.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Gagal Menghasilkan Nama Pejabat",
        description: result.error || "Terjadi kesalahan pada server AI.",
      });
    }
    setIsGeneratingPejabat(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);

    const isCodeTaken = instansi.some(
      (item) => item.kodeInstansi.toLowerCase() === values.kodeInstansi.toLowerCase() && item.id !== instansiToEdit?.id
    );

    if (isCodeTaken) {
      form.setError("kodeInstansi", {
        type: "manual",
        message: "Kode instansi ini sudah digunakan. Harap gunakan kode lain.",
      });
      setIsSaving(false);
      return;
    }

    if (isEditMode && instansiToEdit) {
      await updateInstansi(instansiToEdit.id, values);
    } else {
      await addInstansi(values);
    }
    setIsSaving(false);
    setOpen(false);
  }

  const trigger = children ? (
    <div onClick={() => setOpen(true)} className="w-full">
      {children}
    </div>
  ) : (
    <Button className="bg-primary hover:bg-primary/90">
      <PlusCircle className="mr-2 h-4 w-4" />
      Tambah Instansi
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg h-[85vh] overflow-hidden p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{isEditMode ? "Edit Instansi" : "Tambah Instansi Baru"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Ubah detail untuk instansi atau K/L yang sudah ada."
              : "Isi detail untuk instansi atau K/L yang baru."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="instansi-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 min-h-0 overflow-hidden"
          >
            <ScrollArea className="h-full">
              <div className="space-y-4 py-4 pr-6 pl-6">
                <FormField
                  control={form.control}
                  name="namaInstansi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Instansi</FormLabel>
                      <FormControl>
                        <Input placeholder="cth: Kementerian Keuangan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kodeInstansi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Instansi</FormLabel>
                      <FormControl>
                        <Input placeholder="cth: KEMENKEU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pejabatTerkait"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pejabat Terkait (Opsional)</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input placeholder="cth: Sri Mulyani Indrawati" {...field} className="pr-10" />
                        </FormControl>
                         <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-accent hover:text-accent/90"
                            onClick={handleGeneratePejabat}
                            disabled={isGeneratingPejabat || !namaInstansiValue}
                            title="Generate with AI"
                        >
                            {isGeneratingPejabat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jenisLayanan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Layanan (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="cth: Digital Seal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statusKementrian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Kementrian</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="STG Prioritas">STG Prioritas</SelectItem>
                          <SelectItem value="Non Prioritas">Non Prioritas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tanggalUlangTahun"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Ulang Tahun (Opsional)</FormLabel>
                      <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Pilih tanggal"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setDatePickerOpen(false);
                            }}
                            captionLayout="dropdown-buttons"
                            fromDate={new Date("1945-01-01")}
                            toDate={new Date()}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
          </form>
        </Form>

        <DialogFooter className="mt-auto border-t px-6 py-4">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button type="submit" form="instansi-form" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

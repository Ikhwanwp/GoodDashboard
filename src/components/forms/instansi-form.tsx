
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Loader2, PlusCircle } from "lucide-react";

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
import { cn } from "@/lib/utils";
import type { Instansi } from "@/lib/types";
import { format } from "date-fns";

const formSchema = z.object({
  namaInstansi: z.string().min(3, "Nama instansi minimal 3 karakter"),
  kodeInstansi: z.string().min(2, "Kode instansi minimal 2 karakter").max(20, "Kode instansi maksimal 20 karakter"),
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

  const { addInstansi, updateInstansi } = useData();
  const isEditMode = !!instansiToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!open) return;
    if (isEditMode && instansiToEdit) {
      form.reset({
        ...instansiToEdit,
        tanggalUlangTahun: instansiToEdit.tanggalUlangTahun ? new Date(instansiToEdit.tanggalUlangTahun) : undefined,
      });
    } else {
      form.reset({
        namaInstansi: "",
        kodeInstansi: "",
        jenisLayanan: "",
        statusKementrian: undefined,
        tanggalUlangTahun: undefined,
      } as any);
    }
  }, [open, isEditMode, instansiToEdit, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
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

      {/* batas tinggi + layout kolom bersih */}
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
          {/* container tengah harus bisa menyusut */}
          <form
            id="instansi-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 min-h-0 overflow-hidden"
          >
            {/* hanya ScrollArea yang pegang scroll */}
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
                        {/* popover compact + calendar minimal */}
                        <PopoverContent align="start" sideOffset={6} className="w-[280px] p-0 rounded-xl shadow-lg">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setDatePickerOpen(false);
                            }}
                            captionLayout="buttons"     // header ringkas (tanpa Month/Year labels)
                            showOutsideDays={false}     // hanya tanggal dalam bulan
                            fromYear={1945}
                            toYear={new Date().getFullYear()}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className="p-2"
                            classNames={{
                              months: "flex",
                              month: "space-y-2",
                              caption: "flex items-center justify-between px-1",
                              caption_label: "text-sm font-medium",
                              nav: "flex items-center gap-1",
                              nav_button:
                                "h-7 w-7 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring",
                              table: "w-full border-collapse",
                              head_row: "grid grid-cols-7 px-1",
                              head_cell:
                                "text-[11px] font-medium text-muted-foreground text-center py-1",
                              row: "grid grid-cols-7 gap-y-1",
                              cell: "text-center",
                              day:
                                "h-8 w-8 rounded-md text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring",
                              day_today: "ring-1 ring-primary",
                              day_selected:
                                "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary",
                              day_outside: "opacity-40",
                              day_disabled: "opacity-40",
                            }}
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

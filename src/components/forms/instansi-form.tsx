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
import { useData } from "@/context/data-context";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Instansi } from "@/lib/types";

const formSchema = z.object({
  namaInstansi: z.string().min(3, "Nama instansi minimal 3 karakter"),
  kodeInstansi: z.string().min(2, "Kode instansi minimal 2 karakter").max(10, "Kode instansi maksimal 10 karakter"),
  tanggalUlangTahun: z.date({ required_error: "Tanggal ulang tahun harus diisi" }),
  statusKementrian: z.enum(["STG Prioritas", "Non Prioritas"], { required_error: "Status kementrian harus dipilih"}),
  jenisLayanan: z.string().min(3, "Jenis layanan minimal 3 karakter"),
});

type InstansiFormProps = {
  children?: React.ReactNode;
  instansiToEdit?: Instansi;
};

export function InstansiForm({ children, instansiToEdit }: InstansiFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { addInstansi, updateInstansi } = useData();
  const isEditMode = !!instansiToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && instansiToEdit) {
        form.reset({
          ...instansiToEdit,
          tanggalUlangTahun: new Date(instansiToEdit.tanggalUlangTahun),
        });
      } else {
        form.reset({
          namaInstansi: "",
          kodeInstansi: "",
          jenisLayanan: "",
          statusKementrian: undefined,
          tanggalUlangTahun: undefined
        });
      }
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
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Instansi" : "Tambah Instansi Baru"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Ubah detail untuk instansi atau K/L yang sudah ada." : "Isi detail untuk instansi atau K/L yang baru."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormLabel>Jenis Layanan</FormLabel>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormLabel>Tanggal Ulang Tahun</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? (format(field.value, "PPP")) : (<span>Pilih tanggal</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

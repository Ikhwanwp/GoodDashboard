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
import { useData } from "@/context/data-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { DokumenSph } from "@/lib/types";

const formSchema = z.object({
  instansiId: z.string().min(1, "Instansi harus dipilih"),
  nomorSuratPeruri: z.string().min(1, "Nomor SPH harus diisi"),
  perihal: z.string().min(3, "Perihal minimal 3 karakter"),
  tanggal: z.date({ required_error: "Tanggal SPH harus diisi" }),
  linkDokumen: z.string().url().optional().or(z.literal('')),
});

type SphFormProps = {
  children?: React.ReactNode;
  sphToEdit?: DokumenSph;
};

export function SphForm({ children, sphToEdit }: SphFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { instansi, addDokumenSph, updateDokumenSph } = useData();
  const isEditMode = !!sphToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && sphToEdit) {
        form.reset({
          ...sphToEdit,
          tanggal: new Date(sphToEdit.tanggal),
        });
      } else {
        form.reset({
          instansiId: "",
          nomorSuratPeruri: "",
          perihal: "",
          linkDokumen: "",
        });
      }
    }
  }, [open, isEditMode, sphToEdit, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    const dataToSubmit = { ...values, linkDokumen: values.linkDokumen || "" };
    
    try {
        if (isEditMode && sphToEdit) {
            await updateDokumenSph(sphToEdit.id, dataToSubmit);
        } else {
            await addDokumenSph(dataToSubmit);
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
    <Button variant="outline" className="bg-background">
      <PlusCircle className="mr-2 h-4 w-4" />
      Tambah SPH
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Dokumen SPH" : "Tambah Dokumen SPH Baru"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Ubah detail untuk SPH yang sudah ada." : "Isi detail untuk SPH yang baru."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="instansiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instansi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih instansi terkait" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {instansi.map(inst => (
                        <SelectItem key={inst.id} value={inst.id}>
                          {inst.namaInstansi}
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
              name="nomorSuratPeruri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor SPH Peruri</FormLabel>
                  <FormControl><Input placeholder="SPH/001/2024" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="perihal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perihal SPH</FormLabel>
                  <FormControl><Input placeholder="cth: Penawaran Harga Layanan X" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Tanggal SPH</FormLabel>
                    <Popover><PopoverTrigger asChild>
                    <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? (format(field.value, "PPP")) : (<span>Pilih tanggal</span>)}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkDokumen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Dokumen (Opsional)</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Simpan Perubahan" : "Simpan SPH"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

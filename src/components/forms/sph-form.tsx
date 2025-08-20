
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Loader2, PlusCircle, Check, ChevronsUpDown } from "lucide-react";
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
import { useData } from "@/context/data-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { DokumenSph } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  instansiId: z.string().min(1, "Instansi harus dipilih"),
  nomorSuratPeruri: z.string().min(1, "Nomor Surat harus diisi"),
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
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [instansiOpen, setInstansiOpen] = useState(false);
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
          linkDokumen: sphToEdit.linkDokumen || '',
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
      <DialogContent className="sm:max-w-lg flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Dokumen SPH" : "Tambah Dokumen SPH Baru"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Ubah detail untuk SPH yang sudah ada." : "Isi detail untuk SPH yang baru."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="sph-form" onSubmit={form.handleSubmit(onSubmit)} className="flex-grow overflow-auto">
            <ScrollArea className="h-full">
              <div className="space-y-4 py-4 pr-6 pl-6">
                <FormField
                  control={form.control}
                  name="instansiId"
                  render={({ field }) => (
                     <FormItem className="flex flex-col">
                      <FormLabel>Instansi</FormLabel>
                      <Popover open={instansiOpen} onOpenChange={setInstansiOpen}>
                          <PopoverTrigger asChild>
                          <FormControl>
                              <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                              )}
                              >
                              {field.value
                                  ? instansi.find(
                                      (item) => item.id === field.value
                                  )?.kodeInstansi
                                  : "Pilih instansi"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                          </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                              <Command>
                                  <CommandInput placeholder="Cari instansi..." />
                                  <CommandList>
                                      <CommandEmpty>Instansi tidak ditemukan.</CommandEmpty>
                                      <CommandGroup>
                                          {instansi.map((item) => (
                                          <CommandItem
                                              value={item.kodeInstansi}
                                              key={item.id}
                                              onSelect={() => {
                                                  form.setValue("instansiId", item.id);
                                                  setInstansiOpen(false);
                                              }}
                                          >
                                              <Check
                                              className={cn(
                                                  "mr-2 h-4 w-4",
                                                  item.id === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                              />
                                              {item.kodeInstansi}
                                          </CommandItem>
                                          ))}
                                      </CommandGroup>
                                  </CommandList>
                              </Command>
                          </PopoverContent>
                      </Popover>
                      <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomorSuratPeruri"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Surat</FormLabel>
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
                        <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (format(field.value, "PPP")) : (<span>Pilih tanggal</span>)}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
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
                                initialFocus />
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
              </div>
            </ScrollArea>
          </form>
        </Form>
         <DialogFooter className="mt-auto pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" form="sph-form" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Simpan Perubahan" : "Simpan SPH"}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

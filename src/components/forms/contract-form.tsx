"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pksSchema = z.object({
  instansiId: z.string().min(1, "Instansi harus dipilih"),
  nomorKontrakPeruri: z.string().min(1, "Nomor Kontrak Peruri harus diisi"),
  nomorKontrakKl: z.string().min(1, "Nomor Kontrak K/L harus diisi"),
  judulKontrak: z.string().min(3, "Judul minimal 3 karakter"),
  tanggalMulai: z.date({ required_error: "Tanggal mulai harus diisi" }),
  tanggalBerakhir: z.date({ required_error: "Tanggal berakhir harus diisi" }),
  ruangLingkup: z.string().min(1, "Ruang lingkup harus diisi"),
  keterangan: z.string().optional(),
});

const mouSchema = z.object({
    instansiId: z.string().min(1, "Instansi harus dipilih"),
    nomorMouPeruri: z.string().min(1, "Nomor MoU harus diisi"),
    isiMou: z.string().min(10, "Isi MoU minimal 10 karakter"),
    tanggalMulai: z.date({ required_error: "Tanggal mulai harus diisi" }),
    tanggalBerakhir: z.date({ required_error: "Tanggal berakhir harus diisi" }),
    ruangLingkup: z.string().min(1, "Ruang lingkup harus diisi"),
    keterangan: z.string().optional(),
});

export function ContractForm() {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { instansi, addKontrakPks, addKontrakMou, users } = useData();
  const picGa = users.find(u => u.role === "PIC GA");

  const pksForm = useForm<z.infer<typeof pksSchema>>({
    resolver: zodResolver(pksSchema),
    defaultValues: {
      instansiId: "",
      nomorKontrakPeruri: "",
      nomorKontrakKl: "",
      judulKontrak: "",
      ruangLingkup: "",
      keterangan: "",
    },
  });

  const mouForm = useForm<z.infer<typeof mouSchema>>({
    resolver: zodResolver(mouSchema),
    defaultValues: {
        instansiId: "",
        nomorMouPeruri: "",
        isiMou: "",
        ruangLingkup: "",
        keterangan: "",
    },
  });

  async function onPksSubmit(values: z.infer<typeof pksSchema>) {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addKontrakPks({
      id: `pks-${new Date().getTime()}`,
      picGaId: picGa?.id || 'user-2',
      statusKontrak: 'Aktif',
      ...values,
    });
    
    toast({
      title: "Kontrak PKS Disimpan",
      description: "Kontrak PKS baru telah berhasil ditambahkan.",
    });
    
    setIsSaving(false);
    setOpen(false);
    pksForm.reset();
  }

  async function onMouSubmit(values: z.infer<typeof mouSchema>) {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addKontrakMou({
      id: `mou-${new Date().getTime()}`,
      picGaId: picGa?.id || 'user-2',
      ...values,
    });
    
    toast({
      title: "Kontrak MoU Disimpan",
      description: "Kontrak MoU baru telah berhasil ditambahkan.",
    });
    
    setIsSaving(false);
    setOpen(false);
    mouForm.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Kontrak
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Tambah Kontrak Baru</DialogTitle>
          <DialogDescription>
            Pilih jenis kontrak (PKS atau MoU) dan isi detailnya.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="pks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pks">Kontrak PKS</TabsTrigger>
                <TabsTrigger value="mou">Kontrak MoU</TabsTrigger>
            </TabsList>
            <TabsContent value="pks">
                 <Form {...pksForm}>
                    <form onSubmit={pksForm.handleSubmit(onPksSubmit)} className="grid grid-cols-2 gap-4 py-4">
                       <FormField
                          control={pksForm.control}
                          name="instansiId"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
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
                          control={pksForm.control}
                          name="judulKontrak"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Judul Kontrak</FormLabel>
                              <FormControl><Input placeholder="cth: Penyediaan Meterai Elektronik" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={pksForm.control}
                          name="nomorKontrakPeruri"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor Kontrak Peruri</FormLabel>
                              <FormControl><Input placeholder="PKS/001/2024" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={pksForm.control}
                          name="nomorKontrakKl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor Kontrak K/L</FormLabel>
                              <FormControl><Input placeholder="KL/XYZ/001" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={pksForm.control}
                          name="tanggalMulai"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tanggal Mulai</FormLabel>
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
                          control={pksForm.control}
                          name="tanggalBerakhir"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tanggal Berakhir</FormLabel>
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
                          control={pksForm.control}
                          name="ruangLingkup"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Ruang Lingkup</FormLabel>
                              <FormControl><Textarea placeholder="Jelaskan ruang lingkup pekerjaan..." {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={pksForm.control}
                          name="keterangan"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Keterangan (Opsional)</FormLabel>
                              <FormControl><Textarea placeholder="Informasi tambahan..." {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter className="col-span-2 mt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan PKS
                            </Button>
                        </DialogFooter>
                    </form>
                 </Form>
            </TabsContent>
            <TabsContent value="mou">
                 <Form {...mouForm}>
                    <form onSubmit={mouForm.handleSubmit(onMouSubmit)} className="grid grid-cols-2 gap-4 py-4">
                         <FormField
                          control={mouForm.control}
                          name="instansiId"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
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
                          control={mouForm.control}
                          name="isiMou"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Isi / Tentang MoU</FormLabel>
                              <FormControl><Input placeholder="cth: Kerja Sama Strategis Sektor Keuangan" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={mouForm.control}
                          name="nomorMouPeruri"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Nomor MoU Peruri</FormLabel>
                              <FormControl><Input placeholder="MOU/01/2024" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={mouForm.control}
                          name="tanggalMulai"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tanggal Mulai</FormLabel>
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
                          control={mouForm.control}
                          name="tanggalBerakhir"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tanggal Berakhir</FormLabel>
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
                          control={mouForm.control}
                          name="ruangLingkup"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Ruang Lingkup</FormLabel>
                              <FormControl><Textarea placeholder="Jelaskan ruang lingkup MoU..." {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={mouForm.control}
                          name="keterangan"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Keterangan (Opsional)</FormLabel>
                              <FormControl><Textarea placeholder="Informasi tambahan..." {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <DialogFooter className="col-span-2 mt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan MoU
                            </Button>
                        </DialogFooter>
                    </form>
                 </Form>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}


"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldName } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Loader2, PlusCircle, ArrowLeft } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { KontrakPks, KontrakMou } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const pksSchema = z.object({
  instansiId: z.string().min(1, "Instansi harus dipilih"),
  nomorKontrakPeruri: z.string().min(1, "Nomor Kontrak Peruri harus diisi"),
  nomorKontrakKl: z.string().min(1, "Nomor Kontrak K/L harus diisi"),
  judulKontrak: z.string().min(3, "Judul minimal 3 karakter"),
  tanggalMulai: z.date({ required_error: "Tanggal mulai harus diisi" }),
  tanggalBerakhir: z.date({ required_error: "Tanggal berakhir harus diisi" }),
  picGaId: z.string().min(1, "PIC GA harus dipilih"),
  ruangLingkup: z.string().min(1, "Ruang lingkup harus diisi"),
  keterangan: z.string().optional(),
  linkDokumen: z.string().url().optional().or(z.literal('')),
});

const mouSchema = z.object({
  instansiId: z.string().min(1, "Instansi harus dipilih"),
  nomorMouPeruri: z.string().min(1, "Nomor MoU harus diisi"),
  isiMou: z.string().min(10, "Isi MoU minimal 10 karakter"),
  tanggalMulai: z.date({ required_error: "Tanggal mulai harus diisi" }),
  tanggalBerakhir: z.date({ required_error: "Tanggal berakhir harus diisi" }),
  picGaId: z.string().min(1, "PIC GA harus dipilih"),
  ruangLingkup: z.string().min(1, "Ruang lingkup harus diisi"),
  keterangan: z.string().optional(),
});

type ContractFormProps = {
  children?: React.ReactNode;
  contractToEdit?: KontrakPks | KontrakMou;
  contractType?: 'pks' | 'mou';
}

export function ContractForm({ children, contractToEdit, contractType }: ContractFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { instansi, users, addKontrakPks, addKontrakMou, updateKontrakPks, updateKontrakMou } = useData();
  const isEditMode = !!contractToEdit;
  const picGaUsers = users.filter(u => u.role === 'PIC GA');
  const [activeTab, setActiveTab] = useState(contractType || 'pks');

  const pksForm = useForm<z.infer<typeof pksSchema>>({
    resolver: zodResolver(pksSchema),
    mode: "onChange",
  });

  const mouForm = useForm<z.infer<typeof mouSchema>>({
    resolver: zodResolver(mouSchema),
  });

  const resetForms = () => {
    pksForm.reset({
        instansiId: "",
        nomorKontrakPeruri: "",
        nomorKontrakKl: "",
        judulKontrak: "",
        ruangLingkup: "",
        keterangan: "",
        linkDokumen: "",
        picGaId: "",
    });
    mouForm.reset({
        instansiId: "",
        nomorMouPeruri: "",
        isiMou: "",
        ruangLingkup: "",
        keterangan: "",
        picGaId: "",
    });
  }

  useEffect(() => {
    if (open) {
      if (isEditMode && contractToEdit) {
        if ('judulKontrak' in contractToEdit) {
          setActiveTab('pks');
          pksForm.reset(contractToEdit);
        }
        if ('isiMou' in contractToEdit) {
          setActiveTab('mou');
          mouForm.reset(contractToEdit);
        }
      } else {
        resetForms();
      }
    }
  }, [open, isEditMode, contractToEdit, pksForm, mouForm]);

  async function onPksSubmit(values: z.infer<typeof pksSchema>) {
    setIsSaving(true);
    const dataToSubmit = { ...values, keterangan: values.keterangan || "", linkDokumen: values.linkDokumen || "" };
    
    try {
      if (isEditMode && 'judulKontrak' in contractToEdit) {
        await updateKontrakPks(contractToEdit.id, dataToSubmit);
      } else {
        await addKontrakPks(dataToSubmit);
      }
      setOpen(false);
    } finally {
      setIsSaving(false);
    }
  }

  async function onMouSubmit(values: z.infer<typeof mouSchema>) {
    setIsSaving(true);
    const dataToSubmit = { ...values, keterangan: values.keterangan || "" };

    try {
      if (isEditMode && 'isiMou' in contractToEdit) {
        await updateKontrakMou(contractToEdit.id, dataToSubmit);
      } else {
        await addKontrakMou(dataToSubmit);
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
        Tambah Kontrak
      </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Kontrak" : "Tambah Kontrak Baru"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Ubah detail kontrak yang sudah ada." : "Pilih jenis kontrak (PKS atau MoU) dan isi detailnya."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(tab) => { setActiveTab(tab); resetForms(); }} className="w-full flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pks" disabled={isEditMode && contractType === 'mou'}>Kontrak PKS</TabsTrigger>
                <TabsTrigger value="mou" disabled={isEditMode && contractType === 'pks'}>Kontrak MoU</TabsTrigger>
            </TabsList>
            <TabsContent value="pks" className="mt-4 flex-grow">
              <Form {...pksForm}>
                <form id="pks-form" onSubmit={pksForm.handleSubmit(onPksSubmit)} className="flex flex-col h-full">
                  <ScrollArea className="flex-grow pr-6 -mr-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={pksForm.control}
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
                            control={pksForm.control}
                            name="picGaId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>PIC GA</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih PIC GA" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {picGaUsers.map(user => (
                                        <SelectItem key={user.id} value={user.id}>
                                        {user.nama}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
                      <FormField
                          control={pksForm.control}
                          name="judulKontrak"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Judul Kontrak</FormLabel>
                              <FormControl><Input placeholder="cth: Penyediaan Meterai Elektronik" {...field} /></FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                          control={pksForm.control}
                          name="tanggalMulai"
                          render={({ field }) => (
                              <FormItem className="flex flex-col">
                              <FormLabel>Tanggal Mulai</FormLabel>
                              <Popover>
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
                                  <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                  />
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
                              <FormItem className="flex flex-col">
                              <FormLabel>Tanggal Berakhir</FormLabel>
                              <Popover>
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
                                  <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                  />
                                  </PopoverContent>
                              </Popover>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                      </div>
                      <FormField
                          control={pksForm.control}
                          name="ruangLingkup"
                          render={({ field }) => (
                          <FormItem>
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
                          <FormItem>
                              <FormLabel>Keterangan (Opsional)</FormLabel>
                              <FormControl><Textarea placeholder="Informasi tambahan..." {...field} /></FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <FormField
                          control={pksForm.control}
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
            </TabsContent>
            <TabsContent value="mou" className="mt-4 flex-grow">
                <Form {...mouForm}>
                    <form id="mou-form" onSubmit={mouForm.handleSubmit(onMouSubmit)} className="flex flex-col h-full">
                       <ScrollArea className="flex-grow pr-6 -mr-6">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                      control={mouForm.control}
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
                                      control={mouForm.control}
                                      name="picGaId"
                                      render={({ field }) => (
                                          <FormItem>
                                          <FormLabel>PIC GA</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Pilih PIC GA" />
                                              </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                              {picGaUsers.map(user => (
                                                  <SelectItem key={user.id} value={user.id}>
                                                  {user.nama}
                                                  </SelectItem>
                                              ))}
                                              </SelectContent>
                                          </Select>
                                          <FormMessage />
                                          </FormItem>
                                      )}
                                  />
                              </div>
                              <FormField
                                  control={mouForm.control}
                                  name="isiMou"
                                  render={({ field }) => (
                                  <FormItem>
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
                                  <FormItem>
                                      <FormLabel>Nomor MoU Peruri</FormLabel>
                                      <FormControl><Input placeholder="MOU/01/2024" {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                      control={mouForm.control}
                                      name="tanggalMulai"
                                      render={({ field }) => (
                                          <FormItem className="flex flex-col">
                                              <FormLabel>Tanggal Mulai</FormLabel>
                                              <Popover><PopoverTrigger asChild>
                                              <FormControl>
                                                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (format(field.value, "PPP")) : (<span>Pilih tanggal</span>)}
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
                                          <FormItem className="flex flex-col">
                                              <FormLabel>Tanggal Berakhir</FormLabel>
                                              <Popover><PopoverTrigger asChild>
                                              <FormControl>
                                                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (format(field.value, "PPP")) : (<span>Pilih tanggal</span>)}
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
                              </div>
                              <FormField
                                  control={mouForm.control}
                                  name="ruangLingkup"
                                  render={({ field }) => (
                                  <FormItem>
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
                                  <FormItem>
                                      <FormLabel>Keterangan (Opsional)</FormLabel>
                                      <FormControl><Textarea placeholder="Informasi tambahan..." {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
                            </div>
                        </ScrollArea>
                    </form>
                </Form>
            </TabsContent>
        </Tabs>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            {activeTab === 'pks' && (
                 <Button type="submit" form="pks-form" disabled={isSaving}>
                     {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditMode ? "Simpan Perubahan" : "Simpan PKS")}
                 </Button>
            )}

            {activeTab === 'mou' && (
                 <Button type="submit" form="mou-form" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditMode ? "Simpan Perubahan" : "Simpan MoU"}
                 </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

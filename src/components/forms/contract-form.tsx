
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldName, type UseFormTrigger } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Loader2, PlusCircle, ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
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
import { useData } from "@/context/data-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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

type PksFormValues = z.infer<typeof pksSchema>;
type MouFormValues = z.infer<typeof mouSchema>;

type PksStepFields = {
  [key: number]: FieldName<PksFormValues>[];
};

const pksStepFields: PksStepFields = {
  1: ["instansiId", "picGaId", "judulKontrak", "nomorKontrakPeruri", "nomorKontrakKl"],
  2: ["tanggalMulai", "tanggalBerakhir", "ruangLingkup", "keterangan", "linkDokumen"],
};

type MouStepFields = {
  [key: number]: FieldName<MouFormValues>[];
};

const mouStepFields: MouStepFields = {
  1: ["instansiId", "picGaId", "isiMou", "nomorMouPeruri"],
  2: ["tanggalMulai", "tanggalBerakhir", "ruangLingkup", "keterangan"],
};


export function ContractForm({ children, contractToEdit, contractType }: {
  children?: React.ReactNode;
  contractToEdit?: KontrakPks | KontrakMou;
  contractType?: 'pks' | 'mou';
}) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pksTglMulaiOpen, setPksTglMulaiOpen] = useState(false);
  const [pksTglBerakhirOpen, setPksTglBerakhirOpen] = useState(false);
  const [mouTglMulaiOpen, setMouTglMulaiOpen] = useState(false);
  const [mouTglBerakhirOpen, setMouTglBerakhirOpen] = useState(false);
  const { instansi, users, addKontrakPks, addKontrakMou, updateKontrakPks, updateKontrakMou } = useData();
  const isEditMode = !!contractToEdit;
  const picGaUsers = users.filter(u => u.role === 'GA');
  const [activeTab, setActiveTab] = useState(contractType || 'pks');
  const [currentStep, setCurrentStep] = useState(1);

  const pksForm = useForm<PksFormValues>({
    resolver: zodResolver(pksSchema),
    mode: "onChange",
  });

  const mouForm = useForm<MouFormValues>({
    resolver: zodResolver(mouSchema),
    mode: "onChange",
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
    setCurrentStep(1);
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


  const handleNextStep = async (trigger: UseFormTrigger<any>, fields: FieldName<any>[]) => {
    const isValid = await trigger(fields);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  async function onPksSubmit(values: PksFormValues) {
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

  async function onMouSubmit(values: MouFormValues) {
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

  const totalSteps = activeTab === 'pks' ? Object.keys(pksStepFields).length : Object.keys(mouStepFields).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Kontrak" : "Tambah Kontrak Baru"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Ubah detail kontrak yang sudah ada." : "Pilih jenis kontrak (PKS atau MoU) dan isi detailnya."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(tab) => { setActiveTab(tab); resetForms(); }} className="w-full flex-grow flex flex-col overflow-auto">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pks" disabled={isEditMode && contractType === 'mou'}>Kontrak PKS</TabsTrigger>
                <TabsTrigger value="mou" disabled={isEditMode && contractType === 'pks'}>Kontrak MoU</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pks" className="mt-0 flex-grow">
              <Form {...pksForm}>
                <form id="pks-form" onSubmit={pksForm.handleSubmit(onPksSubmit)} className="h-full flex flex-col">
                  <ScrollArea className="flex-grow">
                    <div className="space-y-4 py-4 pr-6">
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField
                                control={pksForm.control}
                                name="instansiId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Instansi</FormLabel>
                                    <Popover>
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
                                                                pksForm.setValue("instansiId", item.id)
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
                                control={pksForm.control}
                                name="picGaId"
                                render={({ field }) => (
                                     <FormItem className="flex flex-col">
                                    <FormLabel>PIC Government Account</FormLabel>
                                    <Popover>
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
                                                ? picGaUsers.find(
                                                    (item) => item.id === field.value
                                                )?.nama
                                                : "Pilih PIC"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari PIC..." />
                                                <CommandList>
                                                    <CommandEmpty>PIC tidak ditemukan.</CommandEmpty>
                                                    <CommandGroup>
                                                        {picGaUsers.map((item) => (
                                                        <CommandItem
                                                            value={item.nama}
                                                            key={item.id}
                                                            onSelect={() => {
                                                                pksForm.setValue("picGaId", item.id)
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
                                                            {item.nama}
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
                          </div>
                          <FormField control={pksForm.control} name="judulKontrak" render={({ field }) => (<FormItem><FormLabel>Judul Kontrak</FormLabel><FormControl><Input placeholder="cth: Penyediaan Meterai Elektronik" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={pksForm.control} name="nomorKontrakPeruri" render={({ field }) => (<FormItem><FormLabel>Nomor Kontrak Peruri</FormLabel><FormControl><Input placeholder="PKS/001/2024" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={pksForm.control} name="nomorKontrakKl" render={({ field }) => (<FormItem><FormLabel>Nomor Kontrak K/L</FormLabel><FormControl><Input placeholder="KL/XYZ/001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          </div>
                        </div>
                      )}
                      {currentStep === 2 && (
                         <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={pksForm.control} name="tanggalMulai" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Tanggal Mulai</FormLabel><Popover open={pksTglMulaiOpen} onOpenChange={setPksTglMulaiOpen}><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? (format(field.value, "PPP")) : (<span>Pilih tanggal</span>)}</Button></FormControl></PopoverTrigger><DialogPortal><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); setPksTglMulaiOpen(false);}} captionLayout="dropdown-buttons" fromYear={2015} toYear={new Date().getFullYear() + 10} initialFocus /></PopoverContent></DialogPortal></Popover><FormMessage /></FormItem>)} />
                            <FormField control={pksForm.control} name="tanggalBerakhir" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Tanggal Berakhir</FormLabel><Popover open={pksTglBerakhirOpen} onOpenChange={setPksTglBerakhirOpen}><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? (format(field.value, "PPP")) : (<span>Pilih tanggal</span>)}</Button></FormControl></PopoverTrigger><DialogPortal><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); setPksTglBerakhirOpen(false);}} captionLayout="dropdown-buttons" fromYear={2015} toYear={new Date().getFullYear() + 10} initialFocus /></PopoverContent></DialogPortal></Popover><FormMessage /></FormItem>)} />
                          </div>
                          <FormField control={pksForm.control} name="ruangLingkup" render={({ field }) => (<FormItem><FormLabel>Ruang Lingkup</FormLabel><FormControl><Textarea placeholder="Jelaskan ruang lingkup pekerjaan..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={pksForm.control} name="keterangan" render={({ field }) => (<FormItem><FormLabel>Keterangan (Opsional)</FormLabel><FormControl><Textarea placeholder="Informasi tambahan..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={pksForm.control} name="linkDokumen" render={({ field }) => (<FormItem><FormLabel>Link Dokumen (Opsional)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="mou" className="mt-0 flex-grow">
                 <Form {...mouForm}>
                    <form id="mou-form" onSubmit={mouForm.handleSubmit(onMouSubmit)} className="h-full flex flex-col">
                       <ScrollArea className="flex-grow">
                         <div className="space-y-4 py-4 pr-6">
                            {currentStep === 1 && (
                               <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={mouForm.control}
                                        name="instansiId"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                            <FormLabel>Instansi</FormLabel>
                                            <Popover>
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
                                                                        mouForm.setValue("instansiId", item.id)
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
                                        control={mouForm.control}
                                        name="picGaId"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                            <FormLabel>PIC Government Account</FormLabel>
                                            <Popover>
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
                                                        ? picGaUsers.find(
                                                            (item) => item.id === field.value
                                                        )?.nama
                                                        : "Pilih PIC"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Cari PIC..." />
                                                        <CommandList>
                                                            <CommandEmpty>PIC tidak ditemukan.</CommandEmpty>
                                                            <CommandGroup>
                                                                {picGaUsers.map((item) => (
                                                                <CommandItem
                                                                    value={item.nama}
                                                                    key={item.id}
                                                                    onSelect={() => {
                                                                        mouForm.setValue("picGaId", item.id)
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
                                                                    {item.nama}
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
                                </div>
                                <FormField control={mouForm.control} name="isiMou" render={({ field }) => (<FormItem><FormLabel>Isi / Tentang MoU</FormLabel><FormControl><Input placeholder="cth: Kerja Sama Strategis Sektor Keuangan" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={mouForm.control} name="nomorMouPeruri" render={({ field }) => (<FormItem><FormLabel>Nomor MoU Peruri</FormLabel><FormControl><Input placeholder="MOU/01/2024" {...field} /></FormControl><FormMessage /></FormItem>)} />
                               </div>
                            )}
                             {currentStep === 2 && (
                                <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={mouForm.control} name="tanggalMulai" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Tanggal Mulai</FormLabel><Popover open={mouTglMulaiOpen} onOpenChange={setMouTglMulaiOpen}><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? (format(field.value, "PPP")) : (<span>Pilih tanggal</span>)}</Button></FormControl></PopoverTrigger><DialogPortal><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); setMouTglMulaiOpen(false);}} captionLayout="dropdown-buttons" fromYear={2015} toYear={new Date().getFullYear() + 10} initialFocus /></PopoverContent></DialogPortal></Popover><FormMessage /></FormItem>)} />
                                    <FormField control={mouForm.control} name="tanggalBerakhir" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Tanggal Berakhir</FormLabel><Popover open={mouTglBerakhirOpen} onOpenChange={setMouTglBerakhirOpen}><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? (format(field.value, "PPP")) : (<span>Pilih tanggal</span>)}</Button></FormControl></PopoverTrigger><DialogPortal><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); setMouTglBerakhirOpen(false);}} captionLayout="dropdown-buttons" fromYear={2015} toYear={new Date().getFullYear() + 10} initialFocus /></PopoverContent></DialogPortal></Popover><FormMessage /></FormItem>)} />
                                </div>
                                <FormField control={mouForm.control} name="ruangLingkup" render={({ field }) => (<FormItem><FormLabel>Ruang Lingkup</FormLabel><FormControl><Textarea placeholder="Jelaskan ruang lingkup MoU..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={mouForm.control} name="keterangan" render={({ field }) => (<FormItem><FormLabel>Keterangan (Opsional)</FormLabel><FormControl><Textarea placeholder="Informasi tambahan..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                               </div>
                            )}
                         </div>
                       </ScrollArea>
                    </form>
                 </Form>
            </TabsContent>
        </Tabs>
        <DialogFooter className="mt-auto pt-4 border-t">
            <div className="w-full flex justify-between items-center">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                
                <div className="flex items-center gap-2">
                     {currentStep > 1 && (
                        <Button type="button" variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    )}
                    
                    {currentStep < totalSteps && (
                         <Button type="button" onClick={() => handleNextStep(activeTab === 'pks' ? pksForm.trigger : mouForm.trigger, activeTab === 'pks' ? pksStepFields[currentStep] : mouStepFields[currentStep])}>
                            Selanjutnya
                        </Button>
                    )}

                    {currentStep === totalSteps && (
                         <Button type="submit" form={activeTab === 'pks' ? 'pks-form' : 'mou-form'} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditMode ? "Simpan Perubahan" : "Simpan Kontrak")}
                        </Button>
                    )}
                </div>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

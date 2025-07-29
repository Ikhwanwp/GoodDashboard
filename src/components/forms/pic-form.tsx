
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, PlusCircle } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useData } from "@/context/data-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User, PicEksternal } from "@/lib/types";
import { cn } from "@/lib/utils";

const internalPicSchema = z.object({
  nama: z.string().min(3, "Nama harus diisi"),
  email: z.string().email("Format email tidak valid"),
  noHp: z.string().min(10, "Nomor HP minimal 10 digit"),
  role: z.enum(["Admin", "PIC GA", "Viewer"], { required_error: "Role harus dipilih" }),
  handledInstansiIds: z.array(z.string()).optional(),
});

const externalPicSchema = z.object({
  namaPic: z.string().min(3, "Nama harus diisi"),
  instansiId: z.string().min(1, "Instansi harus dipilih"),
  jabatan: z.string().min(3, "Jabatan harus diisi"),
  noHp: z.string().min(10, "Nomor HP minimal 10 digit"),
  email: z.string().email("Format email tidak valid"),
});

type PicFormProps = {
  children?: React.ReactNode;
  picToEdit?: User | PicEksternal;
  picType?: 'internal' | 'external';
}

export function PicForm({ children, picToEdit, picType }: PicFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { instansi, users, addUser, updateUser, addPicEksternal, updatePicEksternal } = useData();
  const isEditMode = !!picToEdit;

  const internalForm = useForm<z.infer<typeof internalPicSchema>>({
    resolver: zodResolver(internalPicSchema),
  });

  const externalForm = useForm<z.infer<typeof externalPicSchema>>({
    resolver: zodResolver(externalPicSchema),
  });
  
  const watchedRole = internalForm.watch("role");

  useEffect(() => {
    if (open) {
      if (isEditMode && picToEdit) {
        if (picType === 'internal' && 'role' in picToEdit) {
          const handledIds = instansi
            .filter(i => i.internalPicId === picToEdit.id)
            .map(i => i.id);
          
          internalForm.reset({
            ...(picToEdit as User),
            handledInstansiIds: handledIds,
          });
        } else if (picType === 'external' && 'namaPic' in picToEdit) {
          externalForm.reset(picToEdit as PicEksternal);
        }
      } else {
        internalForm.reset({
            nama: "",
            email: "",
            noHp: "",
            role: undefined,
            handledInstansiIds: [],
        });
        externalForm.reset({
            namaPic: "",
            instansiId: "",
            jabatan: "",
            noHp: "",
            email: "",
        });
      }
    }
  }, [isEditMode, picToEdit, picType, internalForm, externalForm, open, instansi]);

  async function onInternalSubmit(values: z.infer<typeof internalPicSchema>) {
    setIsSaving(true);
    
    try {
        if (isEditMode && picToEdit && 'role' in picToEdit) {
          await updateUser(picToEdit.id, values);
        } else {
          await addUser(values);
        }
        setOpen(false);
    } finally {
        setIsSaving(false);
    }
  }

  async function onExternalSubmit(values: z.infer<typeof externalPicSchema>) {
    setIsSaving(true);
    
    try {
        if (isEditMode && picToEdit && 'namaPic' in picToEdit) {
        await updatePicEksternal(picToEdit.id, values);
        } else {
        await addPicEksternal(values);
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
      Tambah PIC
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit PIC" : "Tambah PIC Baru"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Ubah detail PIC yang sudah ada." : "Pilih jenis PIC (Internal atau Eksternal) dan isi detailnya."}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={picType || 'internal'} className="w-full flex flex-col overflow-hidden flex-grow">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="internal" disabled={isEditMode && picType === 'external'}>PIC Internal</TabsTrigger>
                <TabsTrigger value="external" disabled={isEditMode && picType === 'internal'}>PIC Eksternal</TabsTrigger>
            </TabsList>
            <TabsContent value="internal" className="flex-grow overflow-auto -mx-6">
                 <Form {...internalForm}>
                    <form onSubmit={internalForm.handleSubmit(onInternalSubmit)} className="flex flex-col h-full">
                      <ScrollArea className="flex-grow px-6">
                        <div className="space-y-4 py-4">
                            <FormField
                                control={internalForm.control}
                                name="nama"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nama Lengkap</FormLabel>
                                    <FormControl><Input placeholder="cth: Genta Anugrah" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={internalForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input placeholder="cth: genta@peruri.co.id" {...field} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={internalForm.control}
                                    name="noHp"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>No. HP</FormLabel>
                                        <FormControl><Input placeholder="cth: 081234567890" {...field} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={internalForm.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role untuk user" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PIC GA">PIC GA</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {watchedRole === 'PIC GA' && (
                                <FormField
                                    control={internalForm.control}
                                    name="handledInstansiIds"
                                    render={() => (
                                        <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Handle Instansi</FormLabel>
                                        </div>
                                        <ScrollArea className="h-40 rounded-md border p-4">
                                            <div className="space-y-2">
                                            {instansi.map((item) => (
                                                <FormField
                                                key={item.id}
                                                control={internalForm.control}
                                                name="handledInstansiIds"
                                                render={({ field }) => {
                                                    const otherPic = instansi.find(i => i.id === item.id)?.internalPicId;
                                                    const isDisabled = otherPic && (!picToEdit || otherPic !== picToEdit.id);
                                                    const picName = users.find(u => u.id === otherPic)?.nama;

                                                    return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                    (value) => value !== item.id
                                                                    )
                                                                )
                                                            }}
                                                            disabled={isDisabled}
                                                        />
                                                        </FormControl>
                                                        <div className="flex flex-col">
                                                            <FormLabel className={cn("font-normal", isDisabled && "text-muted-foreground")}>
                                                                {item.namaInstansi} ({item.kodeInstansi})
                                                            </FormLabel>
                                                            {isDisabled && picName && <p className="text-xs text-muted-foreground">Dihandle oleh {picName}</p>}
                                                        </div>
                                                    </FormItem>
                                                    )
                                                }}
                                                />
                                            ))}
                                            </div>
                                        </ScrollArea>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                      </ScrollArea>
                      <DialogFooter className="px-6 pb-6">
                          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
                          <Button type="submit" disabled={isSaving}>
                              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              {isEditMode ? "Simpan Perubahan" : "Simpan PIC"}
                          </Button>
                      </DialogFooter>
                    </form>
                 </Form>
            </TabsContent>
            <TabsContent value="external" className="flex-grow overflow-auto -mx-6">
                 <Form {...externalForm}>
                    <form onSubmit={externalForm.handleSubmit(onExternalSubmit)} className="flex flex-col h-full">
                       <ScrollArea className="flex-grow px-6">
                        <div className="space-y-4 py-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <FormField
                                    control={externalForm.control}
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
                            </div>
                            <FormField
                                control={externalForm.control}
                                name="namaPic"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nama Lengkap</FormLabel>
                                    <FormControl><Input placeholder="cth: Budi Santoso" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={externalForm.control}
                                name="jabatan"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Jabatan</FormLabel>
                                    <FormControl><Input placeholder="cth: Kepala Divisi IT" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={externalForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="cth: budi.s@kemenkeu.go.id" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={externalForm.control}
                                name="noHp"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>No. HP</FormLabel>
                                    <FormControl><Input placeholder="cth: 081122334455" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        </div>
                       </ScrollArea>
                        <DialogFooter className="px-6 pb-6">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? "Simpan Perubahan" : "Simpan PIC"}
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

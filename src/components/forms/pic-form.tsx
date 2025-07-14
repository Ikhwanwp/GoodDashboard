
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
import { useData } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User, PicEksternal } from "@/lib/types";

const internalPicSchema = z.object({
  nama: z.string().min(3, "Nama harus diisi"),
  email: z.string().email("Format email tidak valid"),
  noHp: z.string().min(10, "Nomor HP minimal 10 digit"),
  role: z.enum(["Admin", "PIC GA", "Viewer"], { required_error: "Role harus dipilih" }),
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
  const { toast } = useToast();
  const { instansi, addUser, updateUser, addPicEksternal, updatePicEksternal } = useData();
  const isEditMode = !!picToEdit;

  const internalForm = useForm<z.infer<typeof internalPicSchema>>({
    resolver: zodResolver(internalPicSchema),
    defaultValues: isEditMode && picType === 'internal' ? picToEdit as User : {
      nama: "",
      email: "",
      noHp: "",
    },
  });

  const externalForm = useForm<z.infer<typeof externalPicSchema>>({
    resolver: zodResolver(externalPicSchema),
    defaultValues: isEditMode && picType === 'external' ? picToEdit as PicEksternal : {
        namaPic: "",
        instansiId: "",
        jabatan: "",
        noHp: "",
        email: "",
    },
  });

  useEffect(() => {
    if (isEditMode && picToEdit) {
      if (picType === 'internal') {
        internalForm.reset(picToEdit as User);
      }
      if (picType === 'external') {
        externalForm.reset(picToEdit as PicEksternal);
      }
    }
  }, [isEditMode, picToEdit, picType, internalForm, externalForm]);


  async function onInternalSubmit(values: z.infer<typeof internalPicSchema>) {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isEditMode && 'nama' in picToEdit) {
      updateUser(picToEdit.id, values);
      toast({
        title: "PIC Internal Diperbarui",
        description: "Perubahan pada data PIC internal telah disimpan.",
      });
    } else {
      addUser({
        id: `user-${new Date().getTime()}`,
        ...values,
      });
      toast({
        title: "PIC Internal Disimpan",
        description: "PIC internal baru telah berhasil ditambahkan.",
      });
    }
    
    setIsSaving(false);
    setOpen(false);
    if (!isEditMode) internalForm.reset();
  }

  async function onExternalSubmit(values: z.infer<typeof externalPicSchema>) {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isEditMode && 'namaPic' in picToEdit) {
      updatePicEksternal(picToEdit.id, values);
       toast({
        title: "PIC Eksternal Diperbarui",
        description: "Perubahan pada data PIC eksternal telah disimpan.",
      });
    } else {
       addPicEksternal({
        id: `pic-ext-${new Date().getTime()}`,
        ...values,
      });
      toast({
        title: "PIC Eksternal Disimpan",
        description: "PIC eksternal baru telah berhasil ditambahkan.",
      });
    }
    
    setIsSaving(false);
    setOpen(false);
    if (!isEditMode) externalForm.reset();
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
        <Tabs defaultValue={picType || 'internal'} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="internal" disabled={isEditMode && picType === 'external'}>PIC Internal</TabsTrigger>
                <TabsTrigger value="external" disabled={isEditMode && picType === 'internal'}>PIC Eksternal</TabsTrigger>
            </TabsList>
            <TabsContent value="internal">
                 <Form {...internalForm}>
                    <form onSubmit={internalForm.handleSubmit(onInternalSubmit)} className="space-y-4 py-4">
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
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? "Simpan Perubahan" : "Simpan PIC"}
                            </Button>
                        </DialogFooter>
                    </form>
                 </Form>
            </TabsContent>
            <TabsContent value="external">
                 <Form {...externalForm}>
                    <form onSubmit={externalForm.handleSubmit(onExternalSubmit)} className="space-y-4 py-4">
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
                         <DialogFooter className="pt-4">
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

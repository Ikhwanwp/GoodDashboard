
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { classifyUpdateAction } from "@/lib/actions";
import type { StatusPekerjaan } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const judulUpdateOptions = [
  "Penawaran",
  "Pembahasan",
  "Finalisasi",
  "Sirkulasi",
  "Lainnya",
];

const formSchema = z.object({
  instansiId: z.string().min(1, "Instansi harus dipilih"),
  judulUpdate: z.string().min(1, "Judul update harus dipilih"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  tanggalEvent: z.date({ required_error: "Tanggal event harus diisi." }),
  linkMom: z.string().url().optional().or(z.literal('')),
  type: z.string().optional(),
  subject: z.string().optional(),
});

type StatusUpdateFormProps = {
  children?: React.ReactNode;
  updateToEdit?: StatusPekerjaan;
}

export function StatusUpdateForm({ children, updateToEdit }: StatusUpdateFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const { toast } = useToast();
  const { instansi, addStatusPekerjaan, updateStatusPekerjaan } = useData();
  const isEditMode = !!updateToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      if(isEditMode && updateToEdit) {
        form.reset({
          ...updateToEdit,
          tanggalEvent: new Date(updateToEdit.tanggalEvent)
        });
      } else {
        form.reset({
          instansiId: "",
          judulUpdate: "",
          deskripsi: "",
          tanggalEvent: new Date(),
          linkMom: "",
          type: "",
          subject: "",
        });
      }
    }
  }, [open, isEditMode, updateToEdit, form]);

  const handleClassify = async () => {
    setIsClassifying(true);
    const { deskripsi } = form.getValues();
    const judulUpdate = form.getValues().judulUpdate || "Update"; // Use a default title if not set
    if (!deskripsi) {
      toast({
        variant: "destructive",
        title: "Input Kurang",
        description: "Deskripsi harus diisi untuk melakukan klasifikasi AI.",
      });
      setIsClassifying(false);
      return;
    }
    
    const result = await classifyUpdateAction({ title: judulUpdate, description: deskripsi });

    if (result.success && result.data) {
      form.setValue("type", result.data.type);
      form.setValue("subject", result.data.subject);
      toast({
        title: "Klasifikasi AI Berhasil",
        description: "Tipe dan subjek update telah diisi otomatis.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Klasifikasi AI Gagal",
        description: result.error || "Terjadi kesalahan.",
      });
    }
    setIsClassifying(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    const dataToSubmit = {
      ...values,
      linkMom: values.linkMom || "",
      type: values.type || "",
      subject: values.subject || "",
    };

    if (isEditMode && updateToEdit) {
      await updateStatusPekerjaan(updateToEdit.id, dataToSubmit);
    } else {
      await addStatusPekerjaan(dataToSubmit as Omit<StatusPekerjaan, 'id' | 'tanggalUpdate'>);
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
      Tambah Update
    </Button>
  );


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Status Pekerjaan' : 'Tambah Status Pekerjaan'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Ubah detail update pekerjaan yang sudah ada.' : 'Isi detail update pekerjaan terbaru. Gunakan AI untuk klasifikasi otomatis.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
             <ScrollArea className="h-auto max-h-[65vh] pr-6">
                <div className="space-y-4 py-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="judulUpdate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Judul Update</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih judul" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {judulUpdateOptions.map(option => (
                                    <SelectItem key={option} value={option}>
                                      {option}
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
                            name="tanggalEvent"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Tanggal Event</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pilih tanggal</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      captionLayout="dropdown-buttons"
                                      fromYear={2015}
                                      toYear={new Date().getFullYear() + 5}
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
                      control={form.control}
                      name="deskripsi"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Deskripsi</FormLabel>
                          <FormControl>
                              <Textarea rows={4} placeholder="Jelaskan detail update pekerjaan di sini..." {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    
                    <Card className="bg-secondary/50">
                    <CardContent className="p-4 space-y-4">
                        <Button type="button" variant="outline" onClick={handleClassify} disabled={isClassifying}>
                        {isClassifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                        Klasifikasi dengan AI
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tipe (AI)</FormLabel>
                                <FormControl>
                                    <Input placeholder="cth: Project Update" {...field} readOnly className="bg-background"/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Subjek (AI)</FormLabel>
                                <FormControl>
                                    <Input placeholder="cth: Project Kick-off" {...field} readOnly className="bg-background"/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </CardContent>
                    </Card>

                    <FormField
                    control={form.control}
                    name="linkMom"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Link MoM (Opsional)</FormLabel>
                        <FormControl>
                            <Input placeholder="https://docs.google.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
             </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Simpan Perubahan' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

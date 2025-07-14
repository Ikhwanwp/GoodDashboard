"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, PlusCircle, Sparkles } from "lucide-react";
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

const formSchema = z.object({
  instansiId: z.string().min(1, "Instansi harus dipilih"),
  judulUpdate: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  linkMom: z.string().url().optional().or(z.literal('')),
  // AI fields
  type: z.string().optional(),
  subject: z.string().optional(),
});

export function StatusUpdateForm() {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const { toast } = useToast();
  const { instansi, addStatusPekerjaan } = useData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instansiId: "",
      judulUpdate: "",
      deskripsi: "",
      linkMom: "",
      type: "",
      subject: "",
    },
  });

  const handleClassify = async () => {
    setIsClassifying(true);
    const { judulUpdate, deskripsi } = form.getValues();
    if (!judulUpdate || !deskripsi) {
      toast({
        variant: "destructive",
        title: "Input Kurang",
        description: "Judul dan deskripsi harus diisi untuk melakukan klasifikasi AI.",
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
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addStatusPekerjaan({
      id: `stat-${new Date().getTime()}`,
      tanggalUpdate: new Date(),
      ...values,
    });
    
    toast({
      title: "Update Disimpan",
      description: "Status pekerjaan baru telah berhasil ditambahkan.",
    });
    
    setIsSaving(false);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tambah Status Pekerjaan</DialogTitle>
          <DialogDescription>
            Isi detail update pekerjaan terbaru. Gunakan AI untuk klasifikasi otomatis.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="judulUpdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Update</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Kick-off Meeting Proyek X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

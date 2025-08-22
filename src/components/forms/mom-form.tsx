
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Instansi } from "@/lib/types";
import {
  CalendarIcon,
  Loader2,
  Trash2,
  Plus,
  Save,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "../ui/scroll-area";


const actionItemSchema = z.object({
  tugas: z.string().min(1, "Tugas harus diisi"),
  pic: z.string().min(1, "PIC harus diisi"),
  deadline: z.date().optional(),
});

const momSchema = z.object({
  instansiId: z.string(),
  tanggalRapat: z.date({ required_error: "Tanggal rapat harus diisi" }),
  pesertaRapat: z.string().min(3, "Peserta rapat harus diisi"),
  poinDiskusi: z.string().min(10, "Poin diskusi minimal 10 karakter"),
  actionItems: z.array(actionItemSchema),
});

type MomFormValues = z.infer<typeof momSchema>;
type ActionItem = z.infer<typeof actionItemSchema>;

interface MomFormProps {
  children: React.ReactNode;
  instansi: Instansi;
}

export function MomForm({ children, instansi }: MomFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<MomFormValues>({
    resolver: zodResolver(momSchema),
    defaultValues: {
      instansiId: instansi.id,
      tanggalRapat: new Date(),
      pesertaRapat: "",
      poinDiskusi: "",
      actionItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "actionItems",
  });

  const addActionItem = () => {
    append({ tugas: "", pic: "", deadline: undefined });
  };
  
  const onSubmit = async (values: MomFormValues) => {
    setIsSaving(true);
    console.log("Submitting MoM Data:", values);
    toast({
        title: "Membuat Dokumen MoM...",
        description: "Dokumen sedang diproses dan akan disimpan ke GDrive."
    });

    // --- Placeholder for actual GDrive integration ---
    await new Promise(resolve => setTimeout(resolve, 2500));
    // --- End placeholder ---
    
    setIsSaving(false);
    setOpen(false);
    toast({
        title: "Sukses!",
        description: `Dokumen MoM untuk ${instansi.namaInstansi} berhasil dibuat.`
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Buat MoM Baru untuk: {instansi.namaInstansi}</DialogTitle>
          <DialogDescription>
            Isi detail rapat, poin diskusi, dan action items. Dokumen akan
            dihasilkan dan disimpan di Google Drive secara otomatis.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tanggalRapat"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Rapat</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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
                control={form.control}
                name="pesertaRapat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peserta Rapat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Budi (Peruri), Ani (Kemenkeu), ... Pisahkan dengan koma atau baris baru."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="poinDiskusi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poin-Poin Diskusi & Keputusan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tuliskan semua poin penting yang didiskusikan dan keputusan yang diambil selama rapat di sini..."
                      className="min-h-[250px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Action Items</FormLabel>
              <div className="mt-2 rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-2/5">Tugas</TableHead>
                      <TableHead className="w-1/5">PIC</TableHead>
                      <TableHead className="w-1/5">Deadline</TableHead>
                      <TableHead className="w-[50px] text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`actionItems.${index}.tugas`}
                            render={({ field }) => (
                              <Input placeholder="Deskripsi tugas..." {...field} />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                           <FormField
                            control={form.control}
                            name={`actionItems.${index}.pic`}
                            render={({ field }) => (
                              <Input placeholder="Nama PIC" {...field} />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                           <FormField
                            control={form.control}
                            name={`actionItems.${index}.deadline`}
                            render={({ field }) => (
                               <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal text-xs h-9">
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                        {field.value ? format(field.value, "dd/MM/yy") : "Pilih"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                </PopoverContent>
                               </Popover>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addActionItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Baris
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter className="p-6 pt-2 mt-auto border-t">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          <Button type="submit" form="mom-form" disabled={isSaving} className="bg-primary hover:bg-primary/90">
             {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
             Simpan & Buat Dokumen di GDrive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/data-context";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  UploadCloud,
  File as FileIcon,
  X,
  Loader2,
  Archive,
  CalendarIcon,
  ChevronsUpDown,
  Check,
} from "lucide-react";

const archiveSchema = z.object({
  documentType: z.enum(["PKS", "MoU", "SPH", "MoM"], {
    required_error: "Tipe dokumen harus dipilih.",
  }),
  instansiId: z.string().min(1, "K/L Terkait harus dipilih."),
  documentDate: z.date({
    required_error: "Tanggal dokumen harus diisi.",
  }),
});

type ArchiveFormValues = z.infer<typeof archiveSchema>;

export function ArchiveDocumentModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [klPopoverOpen, setKlPopoverOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const { instansi } = useData();
  const { toast } = useToast();

  const form = useForm<ArchiveFormValues>({
    resolver: zodResolver(archiveSchema),
    mode: "onChange",
  });

  const { formState } = form;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  });
  
  const isFormComplete = formState.isValid && file;

  const resetFormAndState = () => {
    form.reset();
    setFile(null);
    setIsSaving(false);
  }
  
  useEffect(() => {
    if (!open) {
      resetFormAndState();
    }
  }, [open]);

  const handleSubmit = async (values: ArchiveFormValues) => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "File Belum Dipilih",
        description: "Harap pilih atau seret file untuk diunggah.",
      });
      return;
    }

    setIsSaving(true);
    toast({
      title: "Mengunggah Dokumen...",
      description: `File "${file.name}" sedang diproses.`,
    });

    // --- Placeholder for actual upload logic ---
    // In a real application, you would upload the 'file' to a storage service (like Firebase Storage)
    // and then save the metadata (form values + file URL) to your database.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // --- End of placeholder ---

    setIsSaving(false);
    setOpen(false);

    toast({
      title: "Sukses!",
      description: `Dokumen "${values.documentType}" untuk K/L terkait berhasil diarsipkan.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Archive className="mr-2 h-4 w-4" />
          Arsipkan Dokumen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload &amp; Arsipkan Dokumen Baru</DialogTitle>
          <DialogDescription>
            Seret file ke dalam area di bawah atau klik untuk memilih file, lalu
            lengkapi detail dokumen.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors",
              isDragActive && "border-primary bg-primary/10"
            )}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <FileIcon className="w-12 h-12 text-primary mb-2" />
                <p className="font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X className="mr-2 h-4 w-4" /> Hapus File
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <UploadCloud
                  className={cn(
                    "w-10 h-10 mb-3 text-muted-foreground",
                    isDragActive && "text-primary"
                  )}
                />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">
                    Klik untuk upload
                  </span>{" "}
                  atau seret file ke sini
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOCX, PNG, JPG (MAX. 5MB)
                </p>
              </div>
            )}
          </div>

          <Form {...form}>
            <form id="archive-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Dokumen</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe dokumen..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PKS">PKS (Perjanjian Kerja Sama)</SelectItem>
                          <SelectItem value="MoU">MoU (Memorandum of Understanding)</SelectItem>
                          <SelectItem value="SPH">SPH (Surat Penawaran Harga)</SelectItem>
                          <SelectItem value="MoM">MoM (Minutes of Meeting)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="documentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Dokumen</FormLabel>
                        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
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
                              onSelect={(date) => {
                                  field.onChange(date);
                                  setDatePickerOpen(false);
                              }}
                              disabled={(date) =>
                                date > new Date() || date < new Date("2000-01-01")
                              }
                              initialFocus
                              captionLayout="dropdown-buttons"
                              fromYear={2015}
                              toYear={new Date().getFullYear() + 5}
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
                  name="instansiId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>K/L Terkait</FormLabel>
                      <Popover open={klPopoverOpen} onOpenChange={setKlPopoverOpen}>
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
                                  )?.namaInstansi
                                : "Pilih K/L..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Cari K/L..." />
                            <CommandList>
                              <CommandEmpty>K/L tidak ditemukan.</CommandEmpty>
                              <CommandGroup>
                                {instansi.map((item) => (
                                  <CommandItem
                                    value={item.namaInstansi}
                                    key={item.id}
                                    onSelect={() => {
                                      form.setValue("instansiId", item.id);
                                      setKlPopoverOpen(false);
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
                                    {item.namaInstansi}
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
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            form="archive-form"
            disabled={!isFormComplete || isSaving}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            Upload &amp; Arsipkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

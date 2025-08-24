
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useData } from "@/context/data-context";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  handledInstansiIds: z.array(z.string()).optional(),
});

type AssignInstansiFormProps = {
  children: React.ReactNode;
  pic: User;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
};

export function AssignInstansiForm({ children, pic, updateUser }: AssignInstansiFormProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { instansi, users } = useData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handledInstansiIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      const handledIds = instansi
        .filter(i => i.internalPicId === pic.id)
        .map(i => i.id);
      form.reset({ handledInstansiIds: handledIds });
    }
  }, [open, pic, instansi, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      await updateUser(pic.id, { handledInstansiIds: values.handledInstansiIds });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update user assignments:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)} className="w-full">{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col">
        <DialogHeader>
          <DialogTitle>Atur Penugasan Instansi</DialogTitle>
          <DialogDescription>Pilih instansi yang akan ditangani oleh {pic.nama}.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form id="assign-form" onSubmit={form.handleSubmit(onSubmit)} className="flex-grow overflow-auto pr-2 -mr-6">
            <ScrollArea className="h-full pr-4">
              <FormField
                control={form.control}
                name="handledInstansiIds"
                render={() => (
                  <FormItem>
                    <div className="space-y-2">
                      {instansi.map((item) => {
                        const otherPicId = item.internalPicId;
                        const isHandledByOther = otherPicId && otherPicId !== pic.id;
                        const otherPicName = isHandledByOther ? users.find(u => u.id === otherPicId)?.nama : null;

                        return (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="handledInstansiIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  className={cn(
                                    "flex flex-row items-start space-x-3 space-y-0 p-3 rounded-md border",
                                    isHandledByOther && "bg-muted/50 border-dashed"
                                  )}
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(field.value?.filter((value) => value !== item.id));
                                      }}
                                      disabled={isHandledByOther}
                                    />
                                  </FormControl>
                                  <div className="flex flex-col">
                                    <FormLabel className={cn("font-normal", isHandledByOther && "text-muted-foreground")}>
                                      {item.namaInstansi} ({item.kodeInstansi})
                                    </FormLabel>
                                    {isHandledByOther && otherPicName && (
                                      <p className="text-xs text-muted-foreground">
                                        Saat ini ditangani oleh: {otherPicName}
                                      </p>
                                    )}
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        );
                      })}
                    </div>
                  </FormItem>
                )}
              />
            </ScrollArea>
          </form>
        </Form>
        
        <DialogFooter className="mt-auto shrink-0 border-t pt-4">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          <Button type="submit" form="assign-form" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

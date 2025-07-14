// src/app/dashboard/pic/page.tsx
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useData } from "@/context/data-context";
import type { User, Instansi, PicEksternal } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InternalPicTable } from "./internal-pic-table";
import { internalPicColumns } from "./internal-pic-columns";
import { ExternalPicTable } from "./external-pic-table";
import { externalPicColumns } from "./external-pic-columns";
import { PicForm } from "@/components/forms/pic-form";

export default function PicPage() {
  const { users, instansi, picEksternal } = useData();
  const picGaUsers = users.filter(user => user.role === "PIC GA");
  const internalPics = users;
  const externalPics = picEksternal;

  const getInstansiByPic = (picId: string): Instansi[] => {
    return instansi.filter(i => i.internalPicId === picId);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Penanggung Jawab (PIC)">
        <PicForm />
      </PageHeader>

      <section>
        <h2 className="text-2xl font-semibold mb-4">PIC General Affairs (GA)</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {picGaUsers.map(pic => (
            <Card key={pic.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://placehold.co/48x48.png`} data-ai-hint="profile picture" />
                  <AvatarFallback>{pic.nama.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{pic.nama}</CardTitle>
                  <CardDescription>{pic.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Bertanggung Jawab atas K/L:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {getInstansiByPic(pic.id).length > 0 ? (
                    getInstansiByPic(pic.id).map(inst => <li key={inst.id}>{inst.namaInstansi}</li>)
                  ) : (
                    <li>Belum ada K/L yang ditugaskan.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Tabel Internal PIC</CardTitle>
            <CardDescription>Daftar penanggung jawab internal dari Peruri.</CardDescription>
          </CardHeader>
          <CardContent>
            <InternalPicTable columns={internalPicColumns} data={internalPics} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabel Instansi PIC</CardTitle>
            <CardDescription>Daftar penanggung jawab eksternal dari Kementrian/Lembaga.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExternalPicTable columns={externalPicColumns} data={externalPics} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

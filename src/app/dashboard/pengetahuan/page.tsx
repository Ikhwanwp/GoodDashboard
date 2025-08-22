
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, Book, ExternalLink, FileText, Bot, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Placeholder data
const recentArticles = [
  { id: 1, title: "Panduan Pengisian Kontrak PKS untuk K/L", author: "Genta Anugrah", date: "15 Juli 2024", category: "SOP" },
  { id: 2, title: "Cara Mengarsipkan Dokumen MoU", author: "Andini Putri", date: "12 Juli 2024", category: "Panduan" },
  { id: 3, title: "Best Practice Follow-up K/L Prioritas", author: "Rahmat Hidayat", date: "10 Juli 2024", category: "Strategi" },
  { id: 4, title: "Update Kebijakan Tanda Tangan Digital", author: "Tim Legal", date: "8 Juli 2024", category: "Kebijakan" },
];

const importantLinks = [
    { label: "Regulasi Tanda Tangan Digital", url: "#" },
    { label: "Website Resmi Peruri", url: "#" },
    { label: "Sistem Helpdesk Internal", url: "#" },
];

const flowcharts = [
    { id: 1, title: "Alur Pemenuhan Kontrak PKS", imageUrl: "https://placehold.co/400x300.png", hint: "flowchart diagram" },
    { id: 2, title: "Proses Onboarding K/L Baru", imageUrl: "https://placehold.co/400x300.png", hint: "process diagram" },
    { id: 3, title: "Alur Eskalasi Masalah Teknis", imageUrl: "https://placehold.co/400x300.png", hint: "process flowchart" },
    { id: 4, title: "Siklus Penagihan & Pembayaran", imageUrl: "https://placehold.co/400x300.png", hint: "flowchart finance" },
];

const myNotes = [
    { id: 1, title: "Catatan Rapat Kemenkeu 10/07", date: "10 Juli 2024", snippet: "Poin utama: mereka butuh integrasi API sebelum Q4..." },
    { id: 2, title: "Draft Email Follow-up BSSN", date: "9 Juli 2024", snippet: "Tanyakan progress dari PIC internal mereka terkait..." },
    { id: 3, title: "Ide Peningkatan Layanan", date: "5 Juli 2024", snippet: "Otomatisasi laporan bulanan untuk K/L Prioritas..." },
]

export default function KnowledgeCenterPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-8">
      <PageHeader title="Pusat Pengetahuan" />
      
      <div className="py-2">
        <Tabs defaultValue="articles" className="mt-2">
          <TabsList>
            <TabsTrigger value="articles">Artikel & SOP</TabsTrigger>
            <TabsTrigger value="flowcharts">Flowchart Proses</TabsTrigger>
            <TabsTrigger value="notes">Catatan Saya</TabsTrigger>
          </TabsList>
          
          {/* Tab 1: Artikel & SOP */}
          <TabsContent value="articles" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari artikel, panduan, atau SOP..." className="pl-9" />
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tulis Artikel Baru
                        </Button>
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-4">Artikel Terbaru</h2>
                    <div className="space-y-4">
                        {recentArticles.map(article => (
                             <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4 flex items-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mr-4 shrink-0">
                                       <Book className="h-6 w-6"/>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-primary">{article.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Oleh {article.author} • {article.date}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <span className="text-xs font-medium bg-secondary text-secondary-foreground py-1 px-2 rounded-full">{article.category}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Tanya AI</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground mb-4">Tidak menemukan yang Anda cari? Tanyakan pada asisten AI kami.</p>
                           <Button variant="outline" className="w-full">
                               <Bot className="mr-2 h-4 w-4" />
                               Mulai Percakapan
                           </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Link Penting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {importantLinks.map(link => (
                                    <li key={link.label}>
                                        <a href={link.url} className="flex items-center text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
          </TabsContent>
          
          {/* Tab 2: Flowchart Proses */}
          <TabsContent value="flowcharts" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {flowcharts.map(flow => (
                    <Card key={flow.id} className="overflow-hidden group cursor-pointer">
                        <div className="relative aspect-[4/3] bg-muted">
                           <Image src={flow.imageUrl} alt={flow.title} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={flow.hint} />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base leading-tight">{flow.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
          </TabsContent>
          
          {/* Tab 3: Catatan Saya */}
          <TabsContent value="notes" className="mt-6">
            <Card className="h-[65vh] flex">
                <div className="w-1/3 border-r">
                   <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Semua Catatan</h2>
                        <p className="text-sm text-muted-foreground">Catatan pribadi Anda.</p>
                   </div>
                    <ScrollArea className="h-[calc(65vh-73px)]">
                        <div className="p-2">
                           {myNotes.map(note => (
                            <div key={note.id} className="p-3 rounded-md hover:bg-secondary cursor-pointer">
                                <p className="font-semibold truncate">{note.title}</p>
                                <p className="text-xs text-muted-foreground">{note.date}</p>
                                <p className="text-xs text-muted-foreground truncate mt-1">{note.snippet}</p>
                            </div>
                           ))}
                        </div>
                    </ScrollArea>
                </div>
                <div className="w-2/3 flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold">Catatan Rapat Kemenkeu 10/07</h2>
                            <p className="text-sm text-muted-foreground">Terakhir diubah: 1 jam yang lalu</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    <div className="p-6 flex-1">
                        <h3 className="font-semibold text-lg">Detail Rapat:</h3>
                        <p className="text-sm">Tanggal: 10 Juli 2024</p>
                        <p className="text-sm mb-4">Peserta: Budi (Peruri), Ani (Kemenkeu)</p>
                        <Separator className="my-4"/>
                        <h3 className="font-semibold text-lg">Poin Pembahasan:</h3>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Kebutuhan integrasi API untuk layanan Digital Seal.</li>
                            <li>Target penyelesaian integrasi di Q4 2024.</li>
                            <li>Diskusi awal mengenai potensi perluasan kontrak di tahun 2025.</li>
                        </ul>
                         <Separator className="my-4"/>
                        <h3 className="font-semibold text-lg">Action Items:</h3>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li><span className="font-semibold">[Peruri]</span> Kirim dokumentasi teknis API. PIC: Tim Teknis. Deadline: 15 Juli 2024.</li>
                            <li><span className="font-semibold">[Kemenkeu]</span> Review dokumentasi dan berikan feedback. PIC: Ani. Deadline: 22 Juli 2024.</li>
                        </ul>
                    </div>
                </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

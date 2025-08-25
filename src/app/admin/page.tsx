
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Users, UserCheck, UserCog, History, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useData } from "@/context/data-context";
import { PicForm } from "@/components/forms/pic-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { format } from 'date-fns';
import { useMemo } from "react";
import { DeleteConfirmation } from "@/components/shared/delete-confirmation";


export default function AdminCommandCenterPage() {
    const { users, loading, deleteUser } = useData();

    // PENTING: Data `sampleAuditLog` di bawah ini adalah data sampel (dummy data) untuk tujuan demonstrasi.
    // Data ini tidak mencerminkan aktivitas pengguna yang sebenarnya.
    // Dalam implementasi penuh, data ini seharusnya diambil dari koleksi "auditLog" di Firestore.
    const sampleAuditLog = useMemo(() => {
        if (!users || users.length === 0) return [];
        
        const actions = [
            { action: "Kontrak PKS Dibuat", detail: "PKS/01/2025 untuk Kemenkeu" },
            { action: "Peran Diubah", detail: "Mengubah peran salah satu user dari GA ke Admin" },
            { action: "Status Update", detail: "Finalisasi untuk MoU BSSN" },
            { action: "SPH Dihapus", detail: "Menghapus SPH/03/2024" },
            { action: "Login", detail: "Berhasil login dari perangkat baru" },
            { action: "Instansi Ditambahkan", detail: "Menambahkan instansi baru: Kemenparekraf" },
            { action: "PIC Eksternal Diedit", detail: "Memperbarui kontak PIC dari BSSN" },
        ];

        return Array.from({ length: 7 }, (_, i) => {
            const user = users[i % users.length]; // Cycle through real users
            const action = actions[i % actions.length];
            return {
                id: i + 1,
                user: user.nama,
                action: action.action,
                detail: action.detail,
                // Timestamp di-generate secara acak untuk demonstrasi
                timestamp: new Date(Date.now() - (i + 1) * 3600000 * Math.random()) 
            };
        }).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

    }, [users]);
    
    const totalUsers = users.length;
    const gaUsers = users.filter(u => u.role === 'GA').length;
    const baUsers = users.filter(u => u.role === 'BA').length;
    const activityLast24h = sampleAuditLog.filter(log => log.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <PageHeader title="Admin Command Center" />

            {/* User & System Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard title="Total Pengguna Aktif" value={totalUsers.toString()} icon={Users} />
                <SummaryCard title="Peran GA" value={gaUsers.toString()} icon={UserCheck} />
                <SummaryCard title="Peran BA" value={baUsers.toString()} icon={UserCog} />
                <SummaryCard title="Aktivitas 24 Jam Terakhir" value={activityLast24h.toString()} icon={History} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Log */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Log Aktivitas Terbaru</CardTitle>
                                <CardDescription>Aktivitas terakhir di sistem.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <a href="#audit-log">Lihat Semua</a>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {sampleAuditLog.slice(0, 5).map(log => (
                                    <li key={log.id} className="text-sm">
                                        <p className="font-medium">
                                            Pengguna <span className="text-primary">{log.user}</span> telah <span className="font-semibold">{log.action}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">{format(log.timestamp, "dd MMM yyyy, HH:mm")}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Platform Management Tabs */}
                <div className="lg:col-span-2" id="audit-log">
                    <Tabs defaultValue="user-management">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="user-management">Manajemen Pengguna</TabsTrigger>
                            <TabsTrigger value="audit-trail">Jejak Audit Lengkap</TabsTrigger>
                        </TabsList>

                        {/* User Management Tab */}
                        <TabsContent value="user-management">
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle>Daftar Pengguna</CardTitle>
                                            <CardDescription>Tambah, edit, atau hapus pengguna.</CardDescription>
                                        </div>
                                        <PicForm picType="internal">
                                            <Button>
                                                <PlusCircle /> Tambah Pengguna Baru
                                            </Button>
                                        </PicForm>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nama</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead className="text-center">Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.map(user => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="font-medium">{user.nama}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                                                        <TableCell className="text-center">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <PicForm picToEdit={user} picType="internal">
                                                                        <DropdownMenuItem onSelect={e => e.preventDefault()}><Edit className="mr-2" /> Edit Peran</DropdownMenuItem>
                                                                    </PicForm>
                                                                     <DeleteConfirmation 
                                                                        onConfirm={() => deleteUser(user.id)}
                                                                        itemName={`pengguna ${user.nama}`}
                                                                    >
                                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Hapus Akun
                                                                        </DropdownMenuItem>
                                                                    </DeleteConfirmation>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Audit Trail Tab */}
                        <TabsContent value="audit-trail">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Jejak Audit Lengkap</CardTitle>
                                    <CardDescription>Lacak semua aktivitas yang terjadi di platform.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        <Input placeholder="Filter pengguna..." className="flex-1" />
                                        <Input type="date" placeholder="Filter tanggal..." className="flex-1" />
                                    </div>
                                     <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Timestamp</TableHead>
                                                    <TableHead>Pengguna</TableHead>
                                                    <TableHead>Aksi</TableHead>
                                                    <TableHead>Detail</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {sampleAuditLog.map(log => (
                                                    <TableRow key={log.id}>
                                                        <TableCell className="whitespace-nowrap">{format(log.timestamp, "dd MMM yyyy, HH:mm:ss")}</TableCell>
                                                        <TableCell>{log.user}</TableCell>
                                                        <TableCell><Badge>{log.action}</Badge></TableCell>
                                                        <TableCell>{log.detail}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}

    
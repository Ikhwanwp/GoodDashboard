
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Users, UserCheck, UserCog, Edit, Trash2, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/data-context";
import { PicForm } from "@/components/forms/pic-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { DeleteConfirmation } from "@/components/shared/delete-confirmation";


export default function AdminCommandCenterPage() {
    const { users, deleteUser } = useData();
    
    const totalUsers = users.length;
    const gaUsers = users.filter(u => u.role === 'GA').length;
    const baUsers = users.filter(u => u.role === 'BA').length;

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <PageHeader title="Admin Command Center" />

            {/* User & System Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SummaryCard title="Total Pengguna Aktif" value={totalUsers.toString()} icon={Users} />
                <SummaryCard title="Peran GA" value={gaUsers.toString()} icon={UserCheck} />
                <SummaryCard title="Peran BA" value={baUsers.toString()} icon={UserCog} />
            </div>

            <div className="mt-8">
                {/* User Management Card */}
                 <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Manajemen Pengguna</CardTitle>
                                <CardDescription>Tambah, edit, atau hapus pengguna sistem.</CardDescription>
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
            </div>
        </main>
    );
}

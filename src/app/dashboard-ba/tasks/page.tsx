
"use client"
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function TasksPage() {
    const dummyTasks = [
        { id: 1, task: "Kick-off Meeting", project: "Implementasi E-Sign", status: "Selesai", dueDate: "2024-07-01" },
        { id: 2, task: "Development Modul A", project: "Implementasi E-Sign", status: "Berjalan", dueDate: "2024-08-15" },
        { id: 3, task: "Pengiriman Server", project: "Pengadaan Server", status: "Selesai", dueDate: "2024-06-20" },
        { id: 4, task: "Analisis Kebutuhan", project: "Konsultasi Keamanan Siber", status: "Tertunda", dueDate: "2024-07-30" },
    ];
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Status Task">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Update Task
        </Button>
      </PageHeader>
       <Card>
        <CardHeader>
            <CardTitle>Daftar Task Proyek</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Proyek</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyTasks.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.task}</TableCell>
                    <TableCell>{item.project}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </main>
  );
}

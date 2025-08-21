// src/components/fulfillment/activity-history-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';

type HistoryItem = {
    no: number;
    activity: string;
    pic: string;
    date: string;
    ref: string;
    link: string;
};

type ActivityHistoryTableProps = {
    history: HistoryItem[];
};

export function ActivityHistoryTable({ history }: ActivityHistoryTableProps) {
    return (
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Aktivitas</TableHead>
              <TableHead>PIC</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead>No. Referensi</TableHead>
              <TableHead className="text-center">Dokumen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.no}>
                <TableCell>{item.no}</TableCell>
                <TableCell className="font-medium">{item.activity}</TableCell>
                <TableCell>{item.pic}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.ref}</TableCell>
                <TableCell className="text-center">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={item.link}><LinkIcon /></Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
    );
}

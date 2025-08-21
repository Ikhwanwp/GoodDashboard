// src/components/fulfillment/fulfillment-view.tsx
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkflowTracker } from './workflow-tracker';
import { ActivityHistoryTable } from './activity-history-table';

const sampleData = {
  loggedInUserRole: "GA",
  workflow: {
    selectedContract: "PKS_KEMENKEU_2025",
    currentStep: 4,
    steps: [
      { "name": "Kontrak K/L", "role": "GA", "status": "completed" },
      { "name": "Kode Produk", "role": "GA", "status": "completed" },
      { "name": "Sales Order (SO)", "role": "GA", "status": "completed" },
      { "name": "Purchase Req. (PR)", "role": "BA", "status": "active" },
      { "name": "Purchase Order (PO)", "role": "BA", "status": "pending" },
      { "name": "SPK", "role": "BA", "status": "pending" },
      { "name": "GR", "role": "BA", "status": "pending" },
      { "name": "STTJ", "role": "GA", "status": "pending" },
      { "name": "DO", "role": "GA", "status": "pending" },
      { "name": "Invoicing", "role": "GA", "status": "pending" }
    ],
    history: [
      { "no": 1, "activity": "Kontrak K/L", "pic": "Rina - GA", "date": "2025-08-10", "ref": "PKS/001/2025", "link": "#" },
      { "no": 2, "activity": "Kode Produk", "pic": "Rina - GA", "date": "2025-08-12", "ref": "PROD-XYZ", "link": "#" },
      { "no": 3, "activity": "Sales Order (SO)", "pic": "Andini - GA", "date": "2025-08-20", "ref": "SO/2025/123", "link": "#" }
    ]
  }
};


export function FulfillmentView() {
    const [workflowData, setWorkflowData] = useState(sampleData.workflow);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <PageHeader title="Pelacakan Alur Pemenuhan Kontrak" />

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Pemilih Kontrak</CardTitle>
                        <CardDescription>Pilih kontrak untuk melihat detail progres pemenuhannya.</CardDescription>
                        <div className="pt-2">
                             <Select defaultValue={workflowData.selectedContract}>
                                <SelectTrigger className="w-full md:w-[400px]">
                                    <SelectValue placeholder="Pilih Kontrak..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PKS_KEMENKEU_2025">PKS KEMENKEU 2025 - Digital Seal</SelectItem>
                                    <SelectItem value="PKS_BSSN_2024">PKS BSSN 2024 - Tanda Tangan Digital</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pelacak Alur Visual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <WorkflowTracker 
                            steps={workflowData.steps} 
                            currentStepIndex={workflowData.currentStep - 1} 
                            loggedInUserRole={sampleData.loggedInUserRole}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Aktivitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ActivityHistoryTable history={workflowData.history} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

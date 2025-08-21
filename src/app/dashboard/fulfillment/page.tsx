
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { FulfillmentTracker } from "@/components/dashboard/fulfillment-tracker";

export default function FulfillmentPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-hidden">
      <PageHeader title="Pelacakan Alur Pemenuhan Kontrak" />
      <FulfillmentTracker />
    </main>
  );
}

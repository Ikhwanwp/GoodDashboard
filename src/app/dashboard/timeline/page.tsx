"use client";

import { PageHeader } from "@/components/shared/page-header";
import { TimelineView } from "@/components/timeline/timeline-view";
import { useData } from "@/context/data-context";

export default function TimelinePage() {
  const { instansi } = useData();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Timeline Pekerjaan" />
      
      <div className="container mx-auto py-2">
        <TimelineView instansiList={instansi} />
      </div>
    </main>
  );
}

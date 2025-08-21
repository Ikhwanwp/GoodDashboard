
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { TimelineView } from "@/components/timeline/timeline-view";
import { useData } from "@/context/data-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function TimelinePage() {
  const { instansi, loading } = useData();

  if (loading) {
    return (
       <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <PageHeader title="Timeline Pekerjaan" />
        <div className="py-2">
            <Skeleton className="h-24 w-full md:w-[300px] mb-4" />
            <Skeleton className="h-[500px] w-full" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Timeline Pekerjaan" />
      
      <div className="py-2">
        <TimelineView instansiList={instansi} />
      </div>
    </main>
  );
}

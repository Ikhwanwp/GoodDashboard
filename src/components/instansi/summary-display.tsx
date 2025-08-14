'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CheckCircle, List, FileText } from 'lucide-react';
import type { SummarizeInstansiOutput } from '@/ai/flows/summarize-instansi-flow';

type SummaryDisplayProps = {
  summary: SummarizeInstansiOutput | null;
  error: string | null;
  isGenerating: boolean;
};

export function SummaryDisplay({ summary, error, isGenerating }: SummaryDisplayProps) {
  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Gagal Menghasilkan Ringkasan</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!summary) {
    return null; // Don't render anything if there's no summary, error, or loading state
  }

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-primary"/>
            Ringkasan Eksekutif AI
        </CardTitle>
        <CardDescription>
          Ringkasan ini dihasilkan oleh AI berdasarkan data terbaru yang tersedia untuk instansi ini.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5"/>
                Narasi
            </h3>
            <div className="prose prose-sm text-foreground/90 max-w-none">
            {summary.summary.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
            </div>
        </div>
         <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                <List className="h-5 w-5"/>
                Poin Kunci
            </h3>
            <ul className="space-y-2 list-disc list-inside text-foreground/90">
                {summary.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}

'use server';

import { classifyStatusUpdate } from '@/ai/flows/classify-status-update';
import { summarizeInstansi } from '@/ai/flows/summarize-instansi-flow';
import { z } from 'zod';

const classifySchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
});

export async function classifyUpdateAction(data: { title: string; description: string }) {
  const validation = classifySchema.safeParse(data);

  if (!validation.success) {
    const error = validation.error.flatten().fieldErrors;
    const errorMessage = Object.values(error).flat().join(' ');
    return { success: false, error: errorMessage || 'Invalid input.' };
  }

  try {
    const result = await classifyStatusUpdate(validation.data);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to classify the update using AI: ${errorMessage}` };
  }
}

const summarizeSchema = z.object({
    namaInstansi: z.string(),
    detailInstansi: z.string(),
    kontrakPks: z.string(),
    kontrakMou: z.string(),
    statusPekerjaan: z.string(),
    picEksternal: z.string(),
});

export async function summarizeInstansiAction(data: z.infer<typeof summarizeSchema>) {
    const validation = summarizeSchema.safeParse(data);

    if (!validation.success) {
        const error = validation.error.flatten().fieldErrors;
        const errorMessage = Object.values(error).flat().join(' ');
        return { success: false, error: errorMessage || 'Invalid input for summary.' };
    }

    try {
        const result = await summarizeInstansi(validation.data);
        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to generate summary using AI: ${errorMessage}` };
    }
}

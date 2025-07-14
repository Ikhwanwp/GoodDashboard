'use server';

import { classifyStatusUpdate } from '@/ai/flows/classify-status-update';
import { z } from 'zod';

const classifySchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
});

export async function classifyUpdateAction(data: { title: string; description: string }) {
  const validation = classifySchema.safeParse(data);

  if (!validation.success) {
    const error = validation.error.flatten().fieldErrors;
    return { success: false, error: error.title?.[0] || error.description?.[0] };
  }

  try {
    const result = await classifyStatusUpdate(validation.data);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to classify the update using AI.' };
  }
}

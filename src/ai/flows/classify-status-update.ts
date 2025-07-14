'use server';

/**
 * @fileOverview AI tool to automatically classify status updates for improved search and timeline generation.
 *
 * - classifyStatusUpdate - A function that handles the classification of status updates.
 * - ClassifyStatusUpdateInput - The input type for the classifyStatusUpdate function.
 * - ClassifyStatusUpdateOutput - The return type for the classifyStatusUpdate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyStatusUpdateInputSchema = z.object({
  title: z.string().describe('The title of the status update.'),
  description: z.string().describe('The detailed description of the status update.'),
});

export type ClassifyStatusUpdateInput = z.infer<typeof ClassifyStatusUpdateInputSchema>;

const ClassifyStatusUpdateOutputSchema = z.object({
  type: z
    .string()
    .describe(
      'The type of status update (e.g., Project Update, Contract Renewal, Issue Resolution)'
    ),
  subject: z
    .string()
    .describe('A short summary of the main subject of the status update.'),
});

export type ClassifyStatusUpdateOutput = z.infer<typeof ClassifyStatusUpdateOutputSchema>;

export async function classifyStatusUpdate(
  input: ClassifyStatusUpdateInput
): Promise<ClassifyStatusUpdateOutput> {
  return classifyStatusUpdateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyStatusUpdatePrompt',
  input: {schema: ClassifyStatusUpdateInputSchema},
  output: {schema: ClassifyStatusUpdateOutputSchema},
  prompt: `You are an AI assistant helping to classify status updates.

  Given the title and description of a status update, classify its type and summarize its subject.

  Title: {{{title}}}
  Description: {{{description}}}

  Type (e.g., Project Update, Contract Renewal, Issue Resolution):
  Subject:`, // No Handlebars for output, as it's defined in the schema.
});

const classifyStatusUpdateFlow = ai.defineFlow(
  {
    name: 'classifyStatusUpdateFlow',
    inputSchema: ClassifyStatusUpdateInputSchema,
    outputSchema: ClassifyStatusUpdateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

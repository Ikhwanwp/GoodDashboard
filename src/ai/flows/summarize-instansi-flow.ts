'use server';
/**
 * @fileOverview An AI flow to generate an executive summary for an institution.
 *
 * - summarizeInstansi - A function that handles the summarization process.
 * - SummarizeInstansiInput - The input type for the summarizeInstansi function.
 * - SummarizeInstansiOutput - The return type for the summarizeInstansi function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeInstansiInputSchema = z.object({
  namaInstansi: z.string().describe('The name of the institution.'),
  detailInstansi: z.string().describe('JSON string of the institution details.'),
  kontrakPks: z.string().describe('JSON string of the PKS contracts related to the institution.'),
  kontrakMou: z.string().describe('JSON string of the MoU contracts related to the institution.'),
  statusPekerjaan: z.string().describe('JSON string of the latest status updates.'),
  picEksternal: z.string().describe('JSON string of the external PICs.'),
});
export type SummarizeInstansiInput = z.infer<typeof SummarizeInstansiInputSchema>;

const SummarizeInstansiOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise executive summary in Indonesian, formatted as a single string with paragraphs separated by \n\n.'),
  keyPoints: z
    .array(z.string())
    .describe('An array of 3-5 key bullet points highlighting the most important information.'),
});
export type SummarizeInstansiOutput = z.infer<typeof SummarizeInstansiOutputSchema>;

export async function summarizeInstansi(input: SummarizeInstansiInput): Promise<SummarizeInstansiOutput> {
  return summarizeInstansiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInstansiPrompt',
  input: { schema: SummarizeInstansiInputSchema },
  output: { schema: SummarizeInstansiOutputSchema },
  prompt: `You are an expert government relations analyst. Your task is to create a concise executive summary for an institution based on the provided data.

Analyze the following data for the institution: {{namaInstansi}}

**Institution Details:**
{{{detailInstansi}}}

**Active PKS Contracts:**
{{{kontrakPks}}}

**Active MoU Contracts:**
{{{kontrakMou}}}

**Recent Status Updates:**
{{{statusPekerjaan}}}

**External PICs:**
{{{picEksternal}}}

Based on the data, generate:
1.  **Summary**: A professional, narrative summary in Bahasa Indonesia. The summary should cover the institution's profile, the state of its active contracts (PKS and MoU), and recent activities. Mention any potential risks or opportunities implicitly from the data. Separate paragraphs with double newlines (\n\n).
2.  **Key Points**: A list of 3 to 5 crucial bullet points (e.g., "Total PKS Aktif: 5", "Update Terakhir: Finalisasi Desain Modul A", "Kontrak akan berakhir dalam 90 hari: 2").

Provide the output in the specified JSON format.`,
});

const summarizeInstansiFlow = ai.defineFlow(
  {
    name: 'summarizeInstansiFlow',
    inputSchema: SummarizeInstansiInputSchema,
    outputSchema: SummarizeInstansiOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);

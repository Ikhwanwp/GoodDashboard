'use server';

/**
 * @fileOverview AI tool to automatically find the relevant official for a given institution.
 *
 * - getPejabatTerkait - A function that handles finding the relevant official.
 * - GetPejabatTerkaitInput - The input type for the getPejabatTerkait function.
 * - GetPejabatTerkaitOutput - The return type for the getPejabatTerkait function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPejabatTerkaitInputSchema = z.object({
  namaInstansi: z.string().describe('The name of the Indonesian ministry or government institution (Kementerian/Lembaga).'),
});

export type GetPejabatTerkaitInput = z.infer<typeof GetPejabatTerkaitInputSchema>;

const GetPejabatTerkaitOutputSchema = z.object({
  namaPejabat: z
    .string()
    .describe('The full name of the current minister or head of the institution.'),
});

export type GetPejabatTerkaitOutput = z.infer<typeof GetPejabatTerkaitOutputSchema>;

export async function getPejabatTerkait(
  input: GetPejabatTerkaitInput
): Promise<GetPejabatTerkaitOutput> {
  return getPejabatTerkaitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPejabatTerkaitPrompt',
  input: {schema: GetPejabatTerkaitInputSchema},
  output: {schema: GetPejabatTerkaitOutputSchema},
  prompt: `You are an expert on the Indonesian government structure. Your knowledge is based on data available up to your last training and may not be real-time.
Given the name of a ministry or government institution (Kementerian/Lembaga), provide the full name of the most current minister or head of that institution according to your latest information. 
Acknowledge that government cabinets can change and that your information might not reflect the most recent appointments. For example, if the information is not recent, you can add a note like "(berdasarkan data hingga [tanggal terakhir data])".

Institution Name: {{{namaInstansi}}}

Current Minister/Head based on latest available data:`,
});

const getPejabatTerkaitFlow = ai.defineFlow(
  {
    name: 'getPejabatTerkaitFlow',
    inputSchema: GetPejabatTerkaitInputSchema,
    outputSchema: GetPejabatTerkaitOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

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
  prompt: `You are an expert on the current structure of the Indonesian government.
Given the name of a ministry or government institution (Kementerian/Lembaga), provide the full name of the current minister or head of that institution.

Institution Name: {{{namaInstansi}}}

Current Minister/Head:`,
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

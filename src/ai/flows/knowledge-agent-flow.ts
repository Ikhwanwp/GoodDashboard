'use server';
/**
 * @fileOverview An AI agent that can answer questions about the application's data.
 * It uses tools to fetch data from Firestore and then synthesizes an answer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export async function askKnowledgeAgent(question: string): Promise<string> {
  return knowledgeAgentFlow(question);
}

// In a real application, these tools would be more robust.
// They would fetch data directly from your database services.
// For now, we'll define them with placeholder logic.
const getInstansiListTool = ai.defineTool(
    {
        name: 'getInstansiList',
        description: 'Get a list of all institutions (K/L).',
        inputSchema: z.object({}),
        outputSchema: z.array(z.string()),
    },
    async () => {
        // In a real app, you would call:
        // const instansi = await getInstansi();
        // return instansi.map(i => i.namaInstansi);
        console.log("TOOL: getInstansiList called");
        return ["Kementerian Keuangan", "Kementerian Hukum dan HAM", "BSSN"];
    }
);

const getActivePksContractsTool = ai.defineTool(
    {
        name: 'getActivePksContracts',
        description: 'Get a list of all active PKS contracts.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({ instansi: z.string(), judul: z.string(), tanggalBerakhir: z.string() })),
    },
    async () => {
         // In a real app, you would fetch and filter from Firestore.
         console.log("TOOL: getActivePksContracts called");
         return [
            { instansi: "Kementerian Keuangan", judul: "Penyediaan Meterai Elektronik", tanggalBerakhir: "2025-12-31" },
            { instansi: "Kementerian Hukum dan HAM", judul: "Layanan Digital Signature", tanggalBerakhir: "2024-10-01" },
         ];
    }
);


const knowledgeAgentFlow = ai.defineFlow(
  {
    name: 'knowledgeAgentFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (question) => {
    const llmResponse = await ai.generate({
      prompt: `You are a helpful AI assistant for the Govtech Dashboard application.
      Your goal is to answer the user's question based on the data you can access through tools.
      If you don't have a tool to answer the question, say so.
      Formulate your answer in Bahasa Indonesia and in Markdown format.

      User question: "${question}"
      `,
      tools: [getInstansiListTool, getActivePksContractsTool],
      model: 'googleai/gemini-2.0-flash'
    });
    
    return llmResponse.text();
  }
);

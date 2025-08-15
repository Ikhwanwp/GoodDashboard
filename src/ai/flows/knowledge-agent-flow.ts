'use server';
/**
 * @fileOverview An AI agent that can answer questions about the application's data.
 * It uses tools to fetch data from Firestore and then synthesizes an answer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getInstansi, getKontrakPks } from '@/lib/firebase-services';
import { format } from 'date-fns';

export async function askKnowledgeAgent(question: string): Promise<string> {
  return knowledgeAgentFlow(question);
}

// This tool now fetches real data from Firestore.
const getInstansiListTool = ai.defineTool(
    {
        name: 'getInstansiList',
        description: 'Get a list of all institutions (K/L).',
        inputSchema: z.object({}),
        outputSchema: z.array(z.string()),
    },
    async () => {
        console.log("TOOL: getInstansiList called - fetching from Firestore");
        const instansi = await getInstansi();
        return instansi.map(i => i.namaInstansi);
    }
);

// This tool now fetches and filters real data from Firestore.
const getActivePksContractsTool = ai.defineTool(
    {
        name: 'getActivePksContracts',
        description: 'Get a list of all active PKS contracts, including their title, associated institution, and expiration date.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({ instansi: z.string(), judul: z.string(), tanggalBerakhir: z.string() })),
    },
    async () => {
        console.log("TOOL: getActivePksContracts called - fetching from Firestore");
        const allPks = await getKontrakPks();
        const allInstansi = await getInstansi();
        
        const activeContracts = allPks.filter(pks => pks.statusKontrak === 'Aktif');

        return activeContracts.map(pks => {
            const instansi = allInstansi.find(i => i.id === pks.instansiId);
            return {
                instansi: instansi?.namaInstansi || 'Instansi Tidak Ditemukan',
                judul: pks.judulKontrak,
                tanggalBerakhir: format(pks.tanggalBerakhir, "yyyy-MM-dd"),
            };
        });
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
      Your primary goal is to answer the user's question based on the data you can access through the available tools.
      
      - First, check if any of the provided tools can help answer the user's question. If so, use them.
      - If the user's question is NOT related to the app's data (e.g., a math question, a general knowledge question), answer it directly using your own knowledge.
      - If you don't have a tool to answer a data-related question, say so politely.
      - Formulate your answer in Bahasa Indonesia and use Markdown format for readability.

      User question: "${question}"
      `,
      tools: [getInstansiListTool, getActivePksContractsTool],
      model: 'googleai/gemini-2.0-flash'
    });
    
    return llmResponse.text;
  }
);

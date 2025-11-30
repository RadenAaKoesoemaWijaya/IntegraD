import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import { retrieveContext } from '../retriever';
import { ai } from '../genkit';

export const askHealthDataFlow = defineFlow(
    {
        name: 'askHealthDataFlow',
        inputSchema: z.object({
            question: z.string(),
        }),
        outputSchema: z.object({
            answer: z.string(),
            contextUsed: z.array(z.any()).optional(),
        }),
    },
    async (input) => {
        const { question } = input;

        // 1. Retrieve relevant data
        const context = await retrieveContext(question);

        // 2. Construct prompt
        const prompt = `
      You are a helpful health data analyst assistant.
      Use the following health data context to answer the user's question.
      If the answer is not in the context, say you don't know based on the available data.
      
      Context:
      ${JSON.stringify(context.healthData, null, 2)}
      
      Question: ${question}
    `;

        // 3. Generate answer using the AI model
        const response = await ai.generate({
            prompt: prompt,
        });

        return {
            answer: response.text,
            contextUsed: context.healthData,
        };
    }
);

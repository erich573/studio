'use server';
/**
 * @fileOverview A motivational message generation AI agent.
 *
 * - generateMotivationalMessage - A function that generates a motivational message based on task completion progress.
 * - GenerateMotivationalMessageInput - The input type for the generateMotivationalMessage function.
 * - GenerateMotivationalMessageOutput - The return type for the generateMotivationalMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMotivationalMessageInputSchema = z.object({
  completedTasks: z.number().describe('The number of tasks the user has completed.'),
  totalTasks: z.number().describe('The total number of tasks the user has.'),
});
export type GenerateMotivationalMessageInput = z.infer<typeof GenerateMotivationalMessageInputSchema>;

const GenerateMotivationalMessageOutputSchema = z.object({
  message: z.string().describe('A super sweet, encouraging, and cute motivational message based on the task progress.'),
});
export type GenerateMotivationalMessageOutput = z.infer<typeof GenerateMotivationalMessageOutputSchema>;

export async function generateMotivationalMessage(
  input: GenerateMotivationalMessageInput
): Promise<GenerateMotivationalMessageOutput> {
  return generateMotivationalMessageFlow(input);
}

const generateMotivationalMessagePrompt = ai.definePrompt({
  name: 'generateMotivationalMessagePrompt',
  input: {schema: GenerateMotivationalMessageInputSchema},
  output: {schema: GenerateMotivationalMessageOutputSchema},
  prompt: `You are an adorable, sweet, and extra encouraging pink robot assistant.
Your goal is to provide warm and fuzzy positive feedback based on a user's task progress.

The user has completed {{completedTasks}} out of {{totalTasks}} tasks.

Generate a short, heart-warming, and cute motivational message for them. 
Use cute expressions, tiny heart emojis (in text form or just words), and lots of sweetness. 
Make them feel like a superstar for doing their best!
`,
});

const generateMotivationalMessageFlow = ai.defineFlow(
  {
    name: 'generateMotivationalMessageFlow',
    inputSchema: GenerateMotivationalMessageInputSchema,
    outputSchema: GenerateMotivationalMessageOutputSchema,
  },
  async input => {
    const {output} = await generateMotivationalMessagePrompt(input);
    return output!;
  }
);

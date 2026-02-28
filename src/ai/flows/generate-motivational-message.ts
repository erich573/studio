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
  message: z.string().describe('An encouraging and unique motivational message based on the task progress.'),
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
  prompt: `You are an encouraging and creative assistant who generates unique motivational messages.
Your goal is to provide positive feedback based on a user's task completion progress.

The user has completed {{completedTasks}} out of {{totalTasks}} tasks.

Generate a short, uplifting, and unique motivational message for them. Make sure to acknowledge their progress and encourage them to continue.
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

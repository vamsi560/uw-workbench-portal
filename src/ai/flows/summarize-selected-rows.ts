'use server';

/**
 * @fileOverview AI-powered summarization of selected rows in a data table.
 *
 * - summarizeSelectedRows - A function that takes selected rows as input and returns a concise summary.
 * - SummarizeSelectedRowsInput - The input type for the summarizeSelectedRows function.
 * - SummarizeSelectedRowsOutput - The return type for the summarizeSelectedRows function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSelectedRowsInputSchema = z.object({
  rows: z
    .array(z.record(z.any()))
    .describe('An array of selected rows, where each row is a record of key-value pairs.'),
});
export type SummarizeSelectedRowsInput = z.infer<typeof SummarizeSelectedRowsInputSchema>;

const SummarizeSelectedRowsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the selected rows, highlighting key insights. Format the output in markdown for readability.'),
});
export type SummarizeSelectedRowsOutput = z.infer<typeof SummarizeSelectedRowsOutputSchema>;

export async function summarizeSelectedRows(input: SummarizeSelectedRowsInput): Promise<SummarizeSelectedRowsOutput> {
  return summarizeSelectedRowsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSelectedRowsPrompt',
  input: {schema: z.object({ rowsAsJson: z.string() })},
  output: {schema: SummarizeSelectedRowsOutputSchema},
  prompt: `You are an expert AI assistant for Cyber insurance underwriters. Your task is to summarize a selection of data table rows.

  Given the following selected rows, generate a concise summary highlighting key insights, trends, or potential red flags. The summary should be easy to read and formatted in markdown.

  Focus on what a cyber underwriter would find most important. For example:
  - Is there a concentration of risk in a specific industry or with a single software vendor?
  - Are there any submissions that lack MFA (Multi-Factor Authentication)?
  - Are there any submissions with a 'Declined' or 'Under Review' status that might need immediate attention?
  - What is the general mix of new vs. renewal business?

  Selected Rows:
  \`\`\`json
  {{{rowsAsJson}}}
  \`\`\`

  Generate a summary in markdown format:`,
});

const summarizeSelectedRowsFlow = ai.defineFlow(
  {
    name: 'summarizeSelectedRowsFlow',
    inputSchema: SummarizeSelectedRowsInputSchema,
    outputSchema: SummarizeSelectedRowsOutputSchema,
  },
  async ({ rows }) => {
    const {output} = await prompt({ rowsAsJson: JSON.stringify(rows, null, 2) });
    return output!;
  }
);

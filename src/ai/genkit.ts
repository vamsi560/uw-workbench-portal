
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Hardcoded Gemini API key for testing
export const ai = genkit({
  plugins: [googleAI({ apiKey: 'YOUR_GEMINI_API_KEY' })],
  model: 'googleai/gemini-2.5-flash',
});

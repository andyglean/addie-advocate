import OpenAI from "openai";
import { config } from 'dotenv';
import path from 'path';

// Load .env.local explicitly
config({ path: path.join(process.cwd(), '.env.local') });

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



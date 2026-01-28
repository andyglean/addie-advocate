import 'dotenv/config';
import fs from "node:fs";
import path from "node:path";
import { openai } from "../lib/openai";
import { supabaseAdmin } from "../lib/supabase";

async function embed(text: string) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });
  const embedding = res.data[0]?.embedding;
  if (!embedding) {
    throw new Error("Failed to generate embedding");
  }
  return embedding as unknown as number[];
}

function chunkText(text: string, maxChars = 3000, overlap = 400) {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + maxChars, text.length);
    chunks.push(text.slice(i, end));
    i = end - overlap;
    if (i < 0) i = 0;
    if (i >= text.length) break;
    if (end === text.length) break;
  }
  return chunks;
}

async function main() {
  const base = path.join(process.cwd(), "knowledge", "tx");
  const files = fs.readdirSync(base).filter((f) => f.endsWith(".md"));
  console.log("Seeding files:", files);
  for (const file of files) {
    const full = path.join(base, file);
    const content = fs.readFileSync(full, "utf8");
    const chunks = chunkText(content);
    for (const chunk of chunks) {
      const embedding = await embed(chunk);
      const { error } = await supabaseAdmin.from("knowledge_chunks").insert({
        source: `TX Guide – ${file}`,
        chunk,
        embedding
      });
      if (error) throw error;
    }
    console.log("Seeded:", file);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



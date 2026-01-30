import 'dotenv/config';
import fs from "node:fs";
import path from "node:path";
import { openai } from "../lib/openai";
import { supabaseAdmin } from "../lib/supabase";

// PDF parsing
const { extractText } = require('unpdf');

async function extractPdfText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const uint8Array = new Uint8Array(buffer);
  const result = await extractText(uint8Array);
  // result.text is an array of strings (one per page)
  const text = Array.isArray(result.text) ? result.text.join('\n\n') : String(result.text);
  return text;
}

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

function chunkText(text: string, maxChars = 2500, overlap = 300) {
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

async function seedMarkdownFiles() {
  const base = path.join(process.cwd(), "knowledge", "tx");
  if (!fs.existsSync(base)) {
    console.log("No markdown knowledge folder found, skipping...");
    return;
  }
  
  const files = fs.readdirSync(base).filter((f) => f.endsWith(".md"));
  console.log("Seeding markdown files:", files);
  
  for (const file of files) {
    const full = path.join(base, file);
    const content = fs.readFileSync(full, "utf8");
    const chunks = chunkText(content);
    
    for (const chunk of chunks) {
      const embedding = await embed(chunk);
      const { error } = await supabaseAdmin.from("knowledge_chunks").insert({
        source: `TX Guide – ${file}`,
        chunk,
        embedding,
        is_authoritative: false
      });
      if (error) {
        console.error(`Error inserting chunk from ${file}:`, error);
      }
    }
    console.log("✓ Seeded markdown:", file);
  }
}

async function seedTrainingPDFs() {
  const trainingDir = path.join(process.cwd(), "TRAINING");
  if (!fs.existsSync(trainingDir)) {
    console.log("No TRAINING folder found, skipping...");
    return;
  }
  
  const pdfFiles = fs.readdirSync(trainingDir).filter((f) => f.endsWith(".pdf"));
  console.log("\n📚 SEEDING AUTHORITATIVE TRAINING DOCUMENTS:");
  console.log("These documents are DOCTRINE - Addie must never contradict them.\n");
  console.log("Found PDFs:", pdfFiles);
  
  for (const file of pdfFiles) {
    const full = path.join(trainingDir, file);
    console.log(`\nProcessing: ${file}...`);
    
    try {
      const text = await extractPdfText(full);
      
      if (!text || text.trim().length < 50) {
        console.warn(`⚠ Warning: ${file} appears empty or unreadable`);
        continue;
      }
      
      const chunks = chunkText(text);
      console.log(`  → Extracted ${text.length} chars, split into ${chunks.length} chunks`);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]!;
        const embedding = await embed(chunk);
        
        // Create source name that clearly marks this as authoritative
        const sourceName = `[AUTHORITATIVE DOCTRINE] ${file.replace('.pdf', '')}`;
        
        const { error } = await supabaseAdmin.from("knowledge_chunks").insert({
          source: sourceName,
          chunk,
          embedding,
          is_authoritative: true
        });
        
        if (error) {
          console.error(`  ✗ Error inserting chunk ${i + 1}:`, error);
        } else {
          process.stdout.write(`  ✓ Chunk ${i + 1}/${chunks.length}\r`);
        }
      }
      console.log(`\n✅ Seeded: ${file}`);
    } catch (err) {
      console.error(`✗ Failed to process ${file}:`, err);
    }
  }
}

async function seedDocsFolder() {
  const docsDir = path.join(process.cwd(), "DOCS");
  if (!fs.existsSync(docsDir)) {
    console.log("No DOCS folder found, skipping...");
    return;
  }
  
  const pdfFiles = fs.readdirSync(docsDir).filter((f) => f.endsWith(".pdf"));
  console.log("\n📄 Seeding DOCS folder PDFs:", pdfFiles);
  
  for (const file of pdfFiles) {
    const full = path.join(docsDir, file);
    console.log(`Processing: ${file}...`);
    
    try {
      const text = await extractPdfText(full);
      
      if (!text || text.trim().length < 50) {
        console.warn(`⚠ Warning: ${file} appears empty or unreadable`);
        continue;
      }
      
      const chunks = chunkText(text);
      console.log(`  → Extracted ${text.length} chars, split into ${chunks.length} chunks`);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]!;
        const embedding = await embed(chunk);
        
        const sourceName = `[AUTHORITATIVE DOCTRINE] ${file.replace('.pdf', '')}`;
        
        const { error } = await supabaseAdmin.from("knowledge_chunks").insert({
          source: sourceName,
          chunk,
          embedding,
          is_authoritative: true
        });
        
        if (error) {
          console.error(`  ✗ Error inserting chunk ${i + 1}:`, error);
        }
      }
      console.log(`✅ Seeded: ${file}`);
    } catch (err) {
      console.error(`✗ Failed to process ${file}:`, err);
    }
  }
}

async function main() {
  console.log("🚀 ADDIE KNOWLEDGE BASE SEEDING\n");
  console.log("=" .repeat(50));
  
  // Clear existing knowledge (optional - comment out to append)
  console.log("\n🗑️  Clearing existing knowledge chunks...");
  const { error: deleteError } = await supabaseAdmin
    .from("knowledge_chunks")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all
  
  if (deleteError) {
    console.error("Warning: Could not clear existing chunks:", deleteError);
  } else {
    console.log("✓ Cleared existing knowledge\n");
  }
  
  // Seed all sources
  await seedMarkdownFiles();
  await seedTrainingPDFs();
  await seedDocsFolder();
  
  console.log("\n" + "=".repeat(50));
  console.log("✅ KNOWLEDGE BASE SEEDING COMPLETE");
  console.log("=".repeat(50));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

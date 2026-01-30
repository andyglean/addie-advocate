import { supabaseAdmin } from "./supabase";
import { openai } from "./openai";

export async function embedText(text: string): Promise<number[]> {
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

interface KnowledgeChunk {
	id: string;
	source: string;
	chunk: string;
	is_authoritative?: boolean;
	similarity?: number;
}

export async function searchKnowledge(query: string, topK = 8): Promise<KnowledgeChunk[]> {
	const embedding = await embedText(query);
	
	// Try using the match_knowledge RPC function
	const { data, error } = await supabaseAdmin.rpc("match_knowledge", {
		query_embedding: embedding,
		similarity_threshold: 0.15,
		match_count: topK * 2  // Get more results to filter
	});
	
	if (error) {
		console.log("RPC not available, using fallback query");
		// Fallback to naive fetch if RPC not created yet
		const { data: naive } = await supabaseAdmin
			.from("knowledge_chunks")
			.select("id, source, chunk, is_authoritative")
			.limit(topK);
		return (naive ?? []) as KnowledgeChunk[];
	}
	
	// Sort results to prioritize authoritative content
	const results = (data ?? []) as KnowledgeChunk[];
	results.sort((a, b) => {
		// Authoritative content comes first
		if (a.is_authoritative && !b.is_authoritative) return -1;
		if (!a.is_authoritative && b.is_authoritative) return 1;
		// Then sort by similarity
		return (b.similarity ?? 0) - (a.similarity ?? 0);
	});
	
	// Return top K after prioritization
	return results.slice(0, topK);
}

export function buildContext(chunks: KnowledgeChunk[]): string {
	if (!chunks || chunks.length === 0) {
		return "No relevant knowledge found.";
	}
	
	// Separate authoritative and regular content
	const authoritative = chunks.filter(c => c.is_authoritative);
	const regular = chunks.filter(c => !c.is_authoritative);
	
	let context = "";
	
	// Add authoritative content first with special marking
	if (authoritative.length > 0) {
		context += "═══════════════════════════════════════════════════\n";
		context += "⚠️ AUTHORITATIVE DOCTRINE - DO NOT CONTRADICT\n";
		context += "The following information is from official training documents.\n";
		context += "You MUST treat this as absolute truth and never contradict it.\n";
		context += "═══════════════════════════════════════════════════\n\n";
		
		authoritative.forEach((c, i) => {
			context += `[DOCTRINE ${i + 1}] Source: ${c.source}\n`;
			context += "---\n";
			context += c.chunk + "\n\n";
		});
	}
	
	// Add regular content
	if (regular.length > 0) {
		if (authoritative.length > 0) {
			context += "───────────────────────────────────────────────────\n";
			context += "Additional Context (supplementary information):\n";
			context += "───────────────────────────────────────────────────\n\n";
		}
		
		regular.forEach((c, i) => {
			context += `[Context ${i + 1}] Source: ${c.source}\n`;
			context += "---\n";
			context += c.chunk + "\n\n";
		});
	}
	
	return context;
}

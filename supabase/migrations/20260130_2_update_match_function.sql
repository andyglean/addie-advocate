-- Update the match_knowledge function to return is_authoritative
-- Drop existing function first
DROP FUNCTION IF EXISTS match_knowledge(vector(1536), float, int);

CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.2,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  source text,
  chunk text,
  is_authoritative boolean,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_chunks.id,
    knowledge_chunks.source,
    knowledge_chunks.chunk,
    knowledge_chunks.is_authoritative,
    1 - (knowledge_chunks.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks
  WHERE 1 - (knowledge_chunks.embedding <=> query_embedding) > similarity_threshold
  ORDER BY 
    knowledge_chunks.is_authoritative DESC,  -- Authoritative first
    similarity DESC
  LIMIT match_count;
END;
$$;

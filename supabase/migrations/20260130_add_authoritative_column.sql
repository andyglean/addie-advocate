-- Add is_authoritative column to knowledge_chunks table
-- This marks documents as authoritative doctrine that Addie must never contradict

ALTER TABLE knowledge_chunks 
ADD COLUMN IF NOT EXISTS is_authoritative boolean DEFAULT false;

-- Create index for faster filtering of authoritative content
CREATE INDEX IF NOT EXISTS idx_knowledge_authoritative 
ON knowledge_chunks(is_authoritative) 
WHERE is_authoritative = true;

COMMENT ON COLUMN knowledge_chunks.is_authoritative IS 
'When true, this content is considered authoritative doctrine. Addie must never contradict information from authoritative sources.';

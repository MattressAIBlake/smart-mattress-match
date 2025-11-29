-- Create mattress_comparisons table for shareable comparison links
CREATE TABLE IF NOT EXISTS public.mattress_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT,
  sender_email TEXT,
  personal_note TEXT,
  profile_data JSONB NOT NULL,
  compared_products JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  views_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.mattress_comparisons ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view comparisons (public shareable links)
CREATE POLICY "Anyone can view comparisons"
  ON public.mattress_comparisons
  FOR SELECT
  USING (true);

-- Allow anyone to create comparisons
CREATE POLICY "Anyone can create comparisons"
  ON public.mattress_comparisons
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_mattress_comparisons_created_at ON public.mattress_comparisons(created_at DESC);
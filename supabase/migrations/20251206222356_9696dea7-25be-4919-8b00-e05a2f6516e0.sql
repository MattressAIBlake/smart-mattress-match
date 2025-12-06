-- Add RLS policy to allow incrementing views_count on mattress_comparisons
CREATE POLICY "Anyone can increment views count" 
ON public.mattress_comparisons 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Create a function to safely increment views count (prevents race conditions)
CREATE OR REPLACE FUNCTION public.increment_comparison_views(comparison_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.mattress_comparisons
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = comparison_id;
END;
$$;
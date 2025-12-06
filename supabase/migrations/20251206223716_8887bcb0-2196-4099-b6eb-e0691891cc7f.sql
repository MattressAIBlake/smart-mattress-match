-- Fix #1: Remove public access to mattress_comparisons table
-- Replace the overly permissive SELECT policy with a SECURITY DEFINER function approach

-- Drop the existing permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view comparisons" ON public.mattress_comparisons;

-- Create a secure function to get comparison by ID (acts as access-token-based retrieval)
-- This function only returns a single comparison when you know the exact UUID
-- The UUID acts as a secret access token - if you don't know it, you can't access anything
CREATE OR REPLACE FUNCTION public.get_comparison_by_id(comparison_uuid uuid)
RETURNS TABLE (
  id uuid,
  profile_data jsonb,
  compared_products jsonb,
  created_at timestamptz,
  views_count integer,
  personal_note text,
  sender_name text
  -- Note: sender_email is intentionally EXCLUDED from the return to prevent PII exposure
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id,
    mc.profile_data,
    mc.compared_products,
    mc.created_at,
    mc.views_count,
    mc.personal_note,
    mc.sender_name
    -- sender_email excluded - no longer exposed publicly
  FROM public.mattress_comparisons mc
  WHERE mc.id = comparison_uuid;
END;
$$;
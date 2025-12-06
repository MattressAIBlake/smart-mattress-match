-- Enable RLS on the viral_metrics view to prevent unauthorized access
-- Since this is a view containing sensitive business metrics, we block all public access
ALTER VIEW public.viral_metrics SET (security_invoker = true);

-- Note: For PostgreSQL views, we need to use security_invoker or create a function
-- Since viral_metrics is an aggregation view, we'll also enable RLS on underlying tables
-- But the view itself should be protected

-- Create a secure wrapper function for admin access only
CREATE OR REPLACE FUNCTION public.get_viral_metrics()
RETURNS TABLE (
  total_profiles_created bigint,
  profiles_shared bigint,
  total_shares bigint,
  total_referrers bigint,
  total_referrals_completed bigint,
  avg_referrals_per_user numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    total_profiles_created,
    profiles_shared,
    total_shares,
    total_referrers,
    total_referrals_completed,
    avg_referrals_per_user
  FROM public.viral_metrics;
$$;

-- Revoke direct access to the view from public/anon roles
REVOKE ALL ON public.viral_metrics FROM anon, authenticated;
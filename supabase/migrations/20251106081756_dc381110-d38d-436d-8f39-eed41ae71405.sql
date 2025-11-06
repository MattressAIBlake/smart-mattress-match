-- Drop and recreate viral_metrics view without SECURITY DEFINER
DROP VIEW IF EXISTS public.viral_metrics;

CREATE VIEW public.viral_metrics AS
SELECT 
  COUNT(DISTINCT sp.id) AS total_profiles_created,
  COUNT(DISTINCT CASE WHEN sp.share_count > 0 THEN sp.id END) AS profiles_shared,
  COALESCE(SUM(sp.share_count), 0) AS total_shares,
  COUNT(DISTINCT up.id) FILTER (WHERE up.total_referrals > 0) AS total_referrers,
  COUNT(DISTINCT rt.id) FILTER (WHERE rt.status = 'completed') AS total_referrals_completed,
  COALESCE(AVG(up.total_referrals) FILTER (WHERE up.total_referrals > 0), 0) AS avg_referrals_per_user
FROM public.sleep_profiles sp
CROSS JOIN public.user_profiles up
CROSS JOIN public.referral_transactions rt;
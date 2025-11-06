-- Recreate viral_metrics view with SECURITY INVOKER explicitly
DROP VIEW IF EXISTS public.viral_metrics;

CREATE VIEW public.viral_metrics 
WITH (security_invoker = true) AS
SELECT 
  ( SELECT count(*) FROM public.sleep_profiles) AS total_profiles_created,
  ( SELECT count(*) FROM public.sleep_profiles WHERE share_count > 0) AS profiles_shared,
  ( SELECT COALESCE(sum(share_count), 0) FROM public.sleep_profiles) AS total_shares,
  ( SELECT count(DISTINCT referral_code) FROM public.user_profiles WHERE total_referrals > 0) AS total_referrers,
  ( SELECT COALESCE(sum(total_referrals), 0) FROM public.user_profiles) AS total_referrals_completed,
  ( SELECT COALESCE(avg(total_referrals), 0) FROM public.user_profiles WHERE total_referrals > 0) AS avg_referrals_per_user;
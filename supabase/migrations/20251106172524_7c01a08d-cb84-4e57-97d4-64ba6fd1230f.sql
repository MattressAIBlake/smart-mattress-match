-- Fix RLS policies to avoid querying auth.users table directly

-- Drop existing policies that query auth.users
DROP POLICY IF EXISTS "Users view own referral transactions" ON public.referral_transactions;
DROP POLICY IF EXISTS "Users view own redemptions" ON public.reward_redemptions;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Recreate user_profiles policies with proper auth.uid() check
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (
  (auth.uid())::text = (id)::text
);

CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (
  (auth.uid())::text = (id)::text
);

-- Recreate referral_transactions policy
CREATE POLICY "Users view own referral transactions"
ON public.referral_transactions
FOR SELECT
USING (
  referrer_code IN (
    SELECT referral_code 
    FROM user_profiles 
    WHERE (id)::text = (auth.uid())::text
  )
  OR
  referee_email IN (
    SELECT email 
    FROM user_profiles 
    WHERE (id)::text = (auth.uid())::text
  )
);

-- Recreate reward_redemptions policy
CREATE POLICY "Users view own redemptions"
ON public.reward_redemptions
FOR SELECT
USING (
  user_email IN (
    SELECT email 
    FROM user_profiles 
    WHERE (id)::text = (auth.uid())::text
  )
);
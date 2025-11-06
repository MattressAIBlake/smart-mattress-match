-- Fix RLS policies for user_profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can create profile" ON public.user_profiles;

-- User profiles should only be viewable and updatable by the owner
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid()::text = id::text OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid()::text = id::text OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Authenticated users can create profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix RLS policies for referral_transactions
DROP POLICY IF EXISTS "Anyone can view transactions" ON public.referral_transactions;

CREATE POLICY "Users view own referral transactions" 
ON public.referral_transactions 
FOR SELECT 
USING (
  referrer_code IN (
    SELECT referral_code FROM public.user_profiles 
    WHERE id::text = auth.uid()::text OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  ) OR
  referee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Fix RLS policies for reward_redemptions
DROP POLICY IF EXISTS "Anyone can view redemptions" ON public.reward_redemptions;

CREATE POLICY "Users view own redemptions" 
ON public.reward_redemptions 
FOR SELECT 
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Ensure sleep_profiles has proper policies
DROP POLICY IF EXISTS "Anyone can create sleep profile" ON public.sleep_profiles;
CREATE POLICY "Anyone can create sleep profile" 
ON public.sleep_profiles 
FOR INSERT 
WITH CHECK (true);
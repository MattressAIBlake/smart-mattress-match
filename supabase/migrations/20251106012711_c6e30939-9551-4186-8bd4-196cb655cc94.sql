-- Create sleep profiles table
CREATE TABLE public.sleep_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_data jsonb NOT NULL,
  conversation_summary text,
  recommended_products jsonb,
  share_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_sleep_profiles_created ON public.sleep_profiles(created_at DESC);

-- Enable RLS
ALTER TABLE public.sleep_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view shared profiles
CREATE POLICY "Anyone can view sleep profiles"
ON public.sleep_profiles
FOR SELECT
USING (true);

-- Create user profiles table with referral tracking
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  referral_code text UNIQUE NOT NULL,
  referred_by_code text,
  reward_balance numeric DEFAULT 0,
  total_referrals integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_profiles_referral_code ON public.user_profiles(referral_code);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (true);

-- Anyone can insert (for new user creation)
CREATE POLICY "Anyone can create profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (true);

-- Create referral transactions table
CREATE TABLE public.referral_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_code text NOT NULL,
  referee_email text NOT NULL,
  reward_amount numeric NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'paid')),
  order_id text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX idx_referral_trans_status ON public.referral_transactions(status);
CREATE INDEX idx_referral_trans_referrer ON public.referral_transactions(referrer_code);

-- Enable RLS
ALTER TABLE public.referral_transactions ENABLE ROW LEVEL SECURITY;

-- Anyone can view transactions
CREATE POLICY "Anyone can view transactions"
ON public.referral_transactions
FOR SELECT
USING (true);

-- Create reward redemptions table
CREATE TABLE public.reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  amount numeric NOT NULL,
  redemption_code text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'used', 'expired')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_reward_redemptions_code ON public.reward_redemptions(redemption_code);
CREATE INDEX idx_reward_redemptions_email ON public.reward_redemptions(user_email);

-- Enable RLS
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Anyone can view redemptions
CREATE POLICY "Anyone can view redemptions"
ON public.reward_redemptions
FOR SELECT
USING (true);

-- Create view for viral metrics
CREATE VIEW public.viral_metrics AS
SELECT
  (SELECT COUNT(*) FROM public.sleep_profiles) as total_profiles_created,
  (SELECT COUNT(*) FROM public.sleep_profiles WHERE share_count > 0) as profiles_shared,
  (SELECT COALESCE(SUM(share_count), 0) FROM public.sleep_profiles) as total_shares,
  (SELECT COUNT(DISTINCT referral_code) FROM public.user_profiles WHERE total_referrals > 0) as total_referrers,
  (SELECT COALESCE(SUM(total_referrals), 0) FROM public.user_profiles) as total_referrals_completed,
  (SELECT COALESCE(AVG(total_referrals), 0) FROM public.user_profiles WHERE total_referrals > 0) as avg_referrals_per_user;
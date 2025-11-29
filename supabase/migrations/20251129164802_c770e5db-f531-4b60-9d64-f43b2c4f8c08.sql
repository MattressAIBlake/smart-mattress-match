-- Create sleep style profiles table for shareable dating quiz results
CREATE TABLE public.sleep_style_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  personality_type TEXT NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  share_count INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.sleep_style_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profiles (public sharing)
CREATE POLICY "Profiles are publicly viewable" 
ON public.sleep_style_profiles 
FOR SELECT 
USING (true);

-- Allow anyone to create their own profile (no auth required for viral sharing)
CREATE POLICY "Anyone can create a profile" 
ON public.sleep_style_profiles 
FOR INSERT 
WITH CHECK (true);

-- Create function to increment share count
CREATE OR REPLACE FUNCTION public.increment_sleep_style_share_count(profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.sleep_style_profiles
  SET share_count = share_count + 1
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
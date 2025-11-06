-- Fix search_path for increment_share_count function
CREATE OR REPLACE FUNCTION public.increment_share_count(profile_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.sleep_profiles
  SET share_count = share_count + 1
  WHERE id = profile_id;
END;
$$;
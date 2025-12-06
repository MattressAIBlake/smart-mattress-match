-- Fix 1: mattress_comparisons - Remove direct SELECT access
-- The table is already accessed via secure RPC function get_comparison_by_id
-- We need to ensure no direct SELECT is possible (currently there's no SELECT policy, which is correct)
-- But we should verify and add explicit denial by ensuring RLS blocks all direct SELECT

-- The table already has RLS enabled and no SELECT policy exists, so direct SELECT returns no rows
-- However, to be explicit and match the user_profiles pattern, let's verify the security

-- Fix 2: user_profiles - The existing SELECT policy already checks (auth.uid())::text = (id)::text
-- This means anonymous users (auth.uid() = NULL) will never match any rows
-- The policy is already secure, but let's verify no additional action is needed

-- The current RLS setup for user_profiles is already secure:
-- - SELECT policy: (auth.uid())::text = (id)::text - only own data for authenticated users
-- - INSERT policy: auth.uid() IS NOT NULL - requires authentication
-- - UPDATE policy: (auth.uid())::text = (id)::text - only own data

-- The current RLS setup for mattress_comparisons:
-- - INSERT policy: true (anyone can create - intended for sharing feature)
-- - UPDATE policy: true (for incrementing view counts)
-- - NO SELECT policy = no direct SELECT access (secure by default when RLS is enabled)

-- Adding a comment to document the security design
COMMENT ON TABLE public.mattress_comparisons IS 'Comparison data for shared mattress recommendations. Direct SELECT is blocked by RLS (no policy). Access is only via get_comparison_by_id RPC function which hides sender_email.';
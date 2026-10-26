CREATE TABLE public.trip_check_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  trip_details text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.trip_check_requests TO anon;
GRANT ALL ON public.trip_check_requests TO service_role;

ALTER TABLE public.trip_check_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY trip_check_anon_insert ON public.trip_check_requests
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.trip_check_recent_count(p_email text)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)
  FROM public.trip_check_requests
  WHERE lower(email) = lower(p_email)
    AND created_at > now() - interval '15 minutes';
$$;

REVOKE ALL ON FUNCTION public.trip_check_recent_count(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.trip_check_recent_count(text) TO anon;
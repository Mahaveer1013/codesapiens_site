-- =========================
-- 9) Feedback Table
-- =========================
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES public.users(uid),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE IF EXISTS public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own feedback
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'feedback' AND policyname = 'feedback_insert_own') THEN
    CREATE POLICY feedback_insert_own ON public.feedback FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);
  END IF;
END$$;

-- Allow admins to view all feedback
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'feedback' AND policyname = 'feedback_select_admin') THEN
    CREATE POLICY feedback_select_admin ON public.feedback FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
END$$;

-- Allow users to view their own feedback (optional, but good for verification)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'feedback' AND policyname = 'feedback_select_own') THEN
    CREATE POLICY feedback_select_own ON public.feedback FOR SELECT TO authenticated USING (user_id = auth.uid()::text);
  END IF;
END$$;

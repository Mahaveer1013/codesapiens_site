-- Create a table to track solved problems
CREATE TABLE public.user_solved_problems (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  question_id integer NOT NULL,
  solved_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_solved_problems_pkey PRIMARY KEY (id),
  CONSTRAINT user_solved_problems_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(uid),
  -- Ensure a user can only solve a question once essentially (for tracking purposes)
  CONSTRAINT unique_user_question UNIQUE (user_id, question_id)
);

-- Enable RLS
ALTER TABLE public.user_solved_problems ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own solved problems"
ON public.user_solved_problems
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own solved problems"
ON public.user_solved_problems
FOR SELECT
USING (auth.uid()::text = user_id);

-- Add last_feedback_at column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_feedback_at timestamptz;

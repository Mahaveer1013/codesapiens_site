-- ================================================================
-- 1. Helper Function: Get User by Username (RPC)
-- ================================================================
CREATE OR REPLACE FUNCTION public.get_user_by_username(lookup_username text)
RETURNS TABLE (uid text, username text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT u.uid, u.username
    FROM public.users u
    WHERE u.username = lookup_username;
END;
$$;

-- ================================================================
-- 2. Trigger Function: Handle New User Signup
--    (Copies auth.users data to public.users)
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (
    uid, email, display_name, role, email_verified,
    phone_verified, badges_earned, points, sessions_attended,
    volunteering_hours, admin_approved, skills, bio, college,
    github_url, linkedin_url, portfolio_url, avatar, phone_number,
    department, major, year
  )
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'displayName', ''),
    'student',
    FALSE,
    FALSE,
    0,
    0,
    0,
    0,
    FALSE,
    ARRAY[]::text[],
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    NULL,
    NULL,
    NULL
  );
  RETURN NEW;
END;
$$;

-- Trigger: Fires when a user is created in Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- 3. Helper Function: Check if Current User is Admin
-- ================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE uid = auth.uid()::text 
    AND role = 'admin'
  );
$$;

-- ================================================================
-- 4. Trigger Function: Prevent Role Changes
-- ================================================================
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If the role is changing, block it
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'You are not allowed to change the role column directly.';
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger: Fires before update on public.users
DROP TRIGGER IF EXISTS check_role_update ON public.users;
CREATE TRIGGER check_role_update
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_change();

-- ================================================================
-- 5. Trigger Function: Auto-update 'updated_at' timestamp
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger: Fires before update on public.users
DROP TRIGGER IF EXISTS set_updated_at ON public.users;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  ---------------------Trigger----------------------------

  -- ==========================================
-- 1. Functions (Must exist for triggers to work)
-- ==========================================

-- Function for the blog trigger
CREATE OR REPLACE FUNCTION public.update_blog_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function for the generic/user trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ==========================================
-- 2. Triggers
-- ==========================================

-- Trigger 1: For the 'blogs' table
DROP TRIGGER IF EXISTS handle_blog_updated_at ON public.blogs;
CREATE TRIGGER handle_blog_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_updated_at();

-- Trigger 2: For the 'users' table (Replicating the second trigger)
DROP TRIGGER IF EXISTS handle_user_updated_at ON public.users;
CREATE TRIGGER handle_user_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

  -----------------DB Schema-------------------------
  -- ================================================================
-- Supabase Application Seed (Fixed Permissions)
-- ================================================================

-- =========================
-- 1) Extensions
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- 2) Helper functions
-- =========================
CREATE OR REPLACE FUNCTION public.random_token(prefix text)
RETURNS text LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN prefix || '_' || substr(md5(gen_random_uuid()::text || clock_timestamp()::text),1,16);
END;
$$;

-- =========================
-- 3) Public Tables (Application Data)
-- =========================

CREATE TABLE IF NOT EXISTS public.users (
  uid text PRIMARY KEY, -- References auth.users(id)
  display_name text,
  email text UNIQUE,
  phone_number text,
  avatar text,
  bio text,
  college text,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  skills text[],
  role text DEFAULT 'student' CHECK (role = ANY (ARRAY['student','admin','mentor'])),
  badges_earned integer DEFAULT 0,
  points integer DEFAULT 0,
  sessions_attended integer DEFAULT 0,
  volunteering_hours integer DEFAULT 0,
  admin_approved boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  department text,
  major text,
  year integer,
  resume_url text,
  mentorship_request jsonb DEFAULT '[]'::jsonb,
  username text UNIQUE,
  is_public boolean DEFAULT false,
  attended_meetups jsonb DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.meetup (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (TRIM(BOTH FROM title) <> ''),
  description text,
  start_date_time timestamptz,
  end_date_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid,
  created_by uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
  venue text,
  registration_start_time timestamptz,
  registration_end_time timestamptz,
  registration_open_until_meetup_end boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meetup_id uuid REFERENCES public.meetup(id) ON DELETE CASCADE,
  user_name text,
  user_email text,
  token text UNIQUE DEFAULT public.random_token('tok'),
  is_checked_in boolean DEFAULT false,
  checked_in_at timestamptz,
  created_at timestamptz DEFAULT now(),
  user_id text REFERENCES public.users(uid)
);

CREATE TABLE IF NOT EXISTS public.mentorship_programs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text,
  description text,
  image_url text,
  start_date timestamptz,
  end_date timestamptz,
  registration_open_date timestamptz,
  registration_close_date timestamptz,
  status text DEFAULT 'draft' CHECK (status = ANY (ARRAY['draft','published','archived'])),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mentorship_weeks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id uuid,
  week_number integer,
  title text,
  content jsonb,
  submission_open_date timestamptz,
  submission_close_date timestamptz,
  is_submission_open boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (program_id) REFERENCES public.mentorship_programs(id)
);

CREATE TABLE IF NOT EXISTS public.mentorship_registrations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid,
  program_id uuid,
  status text DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending','approved','rejected','completed'])),
  answers jsonb,
  created_at timestamptz DEFAULT now(),
  team_id uuid,
  role text DEFAULT 'member',
  invitation_status text DEFAULT 'accepted',
  FOREIGN KEY (program_id) REFERENCES public.mentorship_programs(id)
);

CREATE TABLE IF NOT EXISTS public.mentorship_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id uuid,
  week_id uuid,
  user_id uuid,
  content jsonb,
  feedback text,
  score integer,
  status text DEFAULT 'submitted' CHECK (status = ANY (ARRAY['submitted','reviewed'])),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  FOREIGN KEY (registration_id) REFERENCES public.mentorship_registrations(id)
);

CREATE TABLE IF NOT EXISTS public.mentorship_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  leader_id uuid,
  program_id uuid,
  created_at timestamptz DEFAULT timezone('utc', now()),
  FOREIGN KEY (leader_id) REFERENCES auth.users(id),
  FOREIGN KEY (program_id) REFERENCES public.mentorship_programs(id)
);

CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar,
  slug varchar UNIQUE,
  excerpt text,
  content text,
  cover_image text,
  author_id text,
  status varchar DEFAULT 'draft' CHECK (status::text = ANY (ARRAY['draft','published']::text[])),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  FOREIGN KEY (author_id) REFERENCES public.users(uid)
);

-- =========================
-- 4) Indexes
-- =========================
CREATE INDEX IF NOT EXISTS idx_public_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_public_registrations_meetup ON public.registrations(meetup_id);

-- =========================
-- 5) Row-Level Security (RLS)
-- =========================

-- Enable RLS on YOUR public tables only
ALTER TABLE IF EXISTS public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.meetup ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mentorship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mentorship_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mentorship_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mentorship_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mentorship_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blogs ENABLE ROW LEVEL SECURITY;

-- Note: storage.objects RLS is already enabled by Supabase. DO NOT run ALTER TABLE on it.

-- --- Policies for Public Tables ---

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'registrations' AND policyname = 'registrations_insert_own') THEN
    CREATE POLICY registrations_insert_own ON public.registrations FOR INSERT TO authenticated WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()::text));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'registrations' AND policyname = 'registrations_select_owner') THEN
    CREATE POLICY registrations_select_owner ON public.registrations FOR SELECT TO authenticated USING (user_id = auth.uid()::text OR user_email = (auth.jwt() ->> 'email'));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'users_select_own') THEN
    CREATE POLICY users_select_own ON public.users FOR SELECT TO authenticated USING (uid = auth.uid()::text);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'users_update_own') THEN
    CREATE POLICY users_update_own ON public.users FOR UPDATE TO authenticated USING (uid = auth.uid()::text) WITH CHECK (uid = auth.uid()::text);
  END IF;
END$$;

-- --- Policies for System Tables (Storage) ---
-- We can ADD policies to storage.objects, but we cannot ALTER the table itself.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'storage_objects_select') THEN
    CREATE POLICY storage_objects_select ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'user-uploads' AND (string_to_array(name, '/'))[1] = auth.uid()::text);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'storage_objects_insert') THEN
    CREATE POLICY storage_objects_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'user-uploads' AND (string_to_array(name, '/'))[1] = auth.uid()::text);
  END IF;
END$$;

-- =========================
-- 6) Custom Trigger Functions
-- =========================

CREATE OR REPLACE FUNCTION public.room_messages_broadcast_trigger()
RETURNS TRIGGER AS $$
DECLARE
  rec RECORD;
BEGIN
  rec := COALESCE(NEW, OLD);
  
  -- Uses Supabase internal realtime function to broadcast changes
  PERFORM realtime.broadcast_changes(
    'room:' || (rec.id)::text,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
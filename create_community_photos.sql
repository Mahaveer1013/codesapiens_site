-- ================================================================
-- Create Community Photos Table and Policies
-- ================================================================

-- 1. Create Table
CREATE TABLE IF NOT EXISTS public.community_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  date text,
  description text,
  participants integer DEFAULT 0,
  order_number integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE IF EXISTS public.community_photos ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies

-- Allow everyone to view photos
DROP POLICY IF EXISTS "community_photos_select_all" ON public.community_photos;
CREATE POLICY "community_photos_select_all" 
ON public.community_photos FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow admins to insert photos
-- Note: If you want ONLY admins to insert, change 'anon, authenticated' to 'authenticated' and add 'USING (public.is_admin())'
DROP POLICY IF EXISTS "community_photos_insert_admin" ON public.community_photos;
CREATE POLICY "community_photos_insert_admin" 
ON public.community_photos FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin());

-- Allow admins to update photos
DROP POLICY IF EXISTS "community_photos_update_admin" ON public.community_photos;
CREATE POLICY "community_photos_update_admin" 
ON public.community_photos FOR UPDATE 
TO authenticated 
USING (public.is_admin());

-- Allow admins to delete photos
DROP POLICY IF EXISTS "community_photos_delete_admin" ON public.community_photos;
CREATE POLICY "community_photos_delete_admin" 
ON public.community_photos FOR DELETE 
TO authenticated 
USING (public.is_admin());

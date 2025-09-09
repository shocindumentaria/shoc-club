-- Fix critical security vulnerability: Remove public read access to leads table
-- and implement proper authentication-based access control

-- Drop the dangerous public read policy
DROP POLICY IF EXISTS "Enable read access for all users" ON public.leads;

-- Create admin role enum for proper access control
DO $$ BEGIN
    CREATE TYPE public.admin_role AS ENUM ('admin', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create admin users table for dashboard access
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role admin_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
CREATE POLICY "Admin users can view their own record" ON public.admin_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all admin users" ON public.admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid() 
            AND au.role = 'admin'
        )
    );

-- Create secure function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.admin_users 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'viewer')
    );
$$;

-- Create new secure policy for leads table - only authenticated admin users can read
CREATE POLICY "Only authenticated admins can view leads" ON public.leads
    FOR SELECT USING (public.is_admin_user());

-- Keep the insert policy for public lead capture (this is safe)
-- The existing "Enable insert for all users" policy remains as it only allows inserting, not reading

-- Update analytics table policies to be more secure
DROP POLICY IF EXISTS "Enable read access for analytics" ON public.analytics_events;
CREATE POLICY "Only authenticated admins can view analytics" ON public.analytics_events
    FOR SELECT USING (public.is_admin_user());

-- Add trigger for admin_users updated_at
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a default admin user (you'll need to update this with your actual user ID)
-- This is commented out - you'll need to add admin users manually through the Supabase dashboard
-- INSERT INTO public.admin_users (user_id, email, role) 
-- VALUES ('your-user-id-here', 'admin@shoc.com', 'admin');
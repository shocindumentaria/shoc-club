-- Create leads table to store all registrations
CREATE TABLE public.leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    city TEXT,
    province TEXT,
    source TEXT NOT NULL DEFAULT 'landing', -- 'landing', 'whatsapp', etc.
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    consent_email BOOLEAN NOT NULL DEFAULT false,
    consent_whatsapp BOOLEAN NOT NULL DEFAULT false,
    consent_terms BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'converted'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_status ON public.leads(status);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for dashboard)
CREATE POLICY "Enable read access for all users" ON public.leads
    FOR SELECT USING (true);

-- Create policy for public insert access (for lead capture)
CREATE POLICY "Enable insert for all users" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create analytics table for tracking events
CREATE TABLE public.analytics_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'page_view', 'cta_click', 'form_submit', 'email_open', etc.
    event_data JSONB,
    user_id UUID REFERENCES public.leads(id),
    session_id TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for analytics
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);

-- Enable RLS for analytics
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy for analytics
CREATE POLICY "Enable read access for analytics" ON public.analytics_events
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for analytics" ON public.analytics_events
    FOR INSERT WITH CHECK (true);
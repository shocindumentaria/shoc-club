import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  province?: string;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  consent_email: boolean;
  consent_whatsapp: boolean;
  consent_terms: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  province?: string;
  consentEmail: boolean;
  consentWhatsApp: boolean;
  consentTerms: boolean;
}

export const useLeads = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLead = async (formData: LeadFormData) => {
    setIsSubmitting(true);
    
    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      
      // Prepare lead data
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        city: formData.city || null,
        province: formData.province || null,
        source: 'landing',
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        consent_email: formData.consentEmail,
        consent_whatsapp: formData.consentWhatsApp,
        consent_terms: formData.consentTerms,
        status: 'pending'
      };

      // Save to database
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) throw error;

      // Track analytics event
      await supabase
        .from('analytics_events')
        .insert([{
          event_type: 'form_submit',
          event_data: { 
            form_type: 'club_registration',
            source: 'modal',
            consent_email: formData.consentEmail,
            consent_whatsapp: formData.consentWhatsApp
          },
          user_id: data.id,
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign')
        }]);

      // Send welcome email if consent given
      if (formData.consentEmail) {
        try {
          await supabase.functions.invoke('send-welcome-email', {
            body: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              city: formData.city,
              province: formData.province
            }
          });
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Don't fail the lead submission if email fails
        }
      }

      toast({
        title: "¡Registro exitoso!",
        description: `¡Hola ${formData.name}! Tu lugar en el Club SHOC está reservado.${formData.consentEmail ? ' Revisá tu email para más detalles.' : ''}`,
        variant: "default",
      });

      return { success: true, lead: data };

    } catch (error: any) {
      console.error('Error submitting lead:', error);
      
      toast({
        title: "Error al registrar",
        description: "Hubo un problema al procesar tu registro. Por favor, intentá nuevamente.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackAnalytics = async (eventType: string, eventData: any = {}) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      await supabase
        .from('analytics_events')
        .insert([{
          event_type: eventType,
          event_data: eventData,
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign')
        }]);
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  return {
    submitLead,
    trackAnalytics,
    isSubmitting
  };
};
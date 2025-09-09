import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Shield, Crown, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Note: We can't directly query auth.users from the client
      // The user must provide their user ID or we create a simpler approach
      toast({
        title: "Información",
        description: "Para agregar administradores, usa la consola de Supabase o contacta al desarrollador.",
      });

      // Alternative: You could create an edge function to handle this safely
      // Or manually add users via Supabase dashboard SQL editor
      
      setEmail('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Agregar Administrador
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Cómo agregar administradores:</strong><br/>
            1. Ve a la consola de Supabase → SQL Editor<br/>
            2. Ejecuta: <code>INSERT INTO public.admin_users (user_id, email, role) VALUES ('user-uuid', 'email@example.com', 'admin');</code><br/>
            3. Reemplaza 'user-uuid' con el ID real del usuario de auth.users
          </AlertDescription>
        </Alert>

        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Gestión segura de administradores</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Por seguridad, los administradores deben agregarse manualmente a través de la consola de Supabase.
          </p>
          
          <div className="space-y-2 text-sm">
            <p><strong>Paso 1:</strong> El usuario debe registrarse en <code>/auth</code></p>
            <p><strong>Paso 2:</strong> Obtener su user_id desde auth.users en Supabase</p>
            <p><strong>Paso 3:</strong> Insertarlo en admin_users con el rol apropiado</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-3">Instrucciones de seguridad:</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>El usuario debe crear una cuenta primero en <code>/auth</code></li>
            <li>Solo agrega usuarios de confianza con necesidad legítima de acceso</li>
            <li>Revisa periódicamente la lista de administradores</li>
            <li>Usa el rol "viewer" para acceso solo de lectura</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSetup;
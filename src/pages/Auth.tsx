import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user is admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (adminUser) {
          navigate('/dashboard');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });

        if (error) throw error;

        toast({
          title: "Registro exitoso",
          description: "Revisa tu email para confirmar tu cuenta. Luego contacta al administrador para obtener permisos.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check if user is admin after login
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (adminUser) {
            navigate('/dashboard');
          } else {
            await supabase.auth.signOut();
            throw new Error('No tienes permisos para acceder al dashboard. Contacta al administrador.');
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 rounded-2xl bg-shoc-yellow/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-shoc-yellow" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? 'Crear Cuenta Admin' : 'Dashboard SHOC'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isSignUp 
                ? 'Registrate para solicitar acceso al dashboard' 
                : 'Ingresa tus credenciales para acceder'
              }
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shoc.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isSignUp ? 'Registrando...' : 'Iniciando sesión...'}
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    {isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
              >
                {isSignUp 
                  ? '¿Ya tienes cuenta? Iniciar sesión' 
                  : '¿Necesitas una cuenta? Registrarse'
                }
              </Button>
            </div>

            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota:</strong> Solo administradores autorizados pueden acceder al dashboard. 
                Si te registras, contacta al propietario para obtener permisos de administrador.
              </AlertDescription>
            </Alert>

            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                ← Volver al sitio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
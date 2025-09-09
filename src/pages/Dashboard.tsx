import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Users, Mail, Phone, MapPin, Search, Download, LogOut, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AdminSetup from '@/components/AdminSetup';
import type { Lead } from '@/hooks/useLeads';

interface AnalyticsData {
  totalLeads: number;
  leadsToday: number;
  leadsThisWeek: number;
  conversionRate: number;
  topSources: Array<{ source: string; count: number }>;
  topCities: Array<{ city: string; count: number }>;
}

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      // Check if user is admin
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !adminUser) {
        setIsAuthenticated(false);
        await supabase.auth.signOut();
        return;
      }

      setIsAuthenticated(true);
      setUserEmail(adminUser.email);
      fetchData();
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch leads (now secured by RLS)
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) {
        console.error('Error fetching leads:', leadsError);
        toast({
          title: "Error de acceso",
          description: "No tienes permisos para ver los datos. Contacta al administrador.",
          variant: "destructive",
        });
        return;
      }

      setLeads(leadsData || []);

      // Calculate analytics
      if (leadsData) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const totalLeads = leadsData.length;
        const leadsToday = leadsData.filter(lead => new Date(lead.created_at) >= today).length;
        const leadsThisWeek = leadsData.filter(lead => new Date(lead.created_at) >= weekAgo).length;

        // Calculate conversion rate (assuming email consent as conversion)
        const conversions = leadsData.filter(lead => lead.consent_email).length;
        const conversionRate = totalLeads > 0 ? (conversions / totalLeads) * 100 : 0;

        // Top sources
        const sourceCounts = leadsData.reduce((acc, lead) => {
          const source = lead.utm_source || lead.source || 'Direct';
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topSources = Object.entries(sourceCounts)
          .map(([source, count]) => ({ source, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Top cities
        const cityCounts = leadsData.reduce((acc, lead) => {
          if (lead.city) {
            const key = lead.province ? `${lead.city}, ${lead.province}` : lead.city;
            acc[key] = (acc[key] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        const topCities = Object.entries(cityCounts)
          .map(([city, count]) => ({ city, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setAnalytics({
          totalLeads,
          leadsToday,
          leadsThisWeek,
          conversionRate,
          topSources,
          topCities
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.city && lead.city.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Ciudad', 'Provincia', 'Origen', 'Estado', 'Email Consent', 'WhatsApp Consent'];
    const csvData = filteredLeads.map(lead => [
      new Date(lead.created_at).toLocaleDateString('es-AR'),
      lead.name,
      lead.email,
      lead.phone || '',
      lead.city || '',
      lead.province || '',
      lead.utm_source || lead.source,
      lead.status,
      lead.consent_email ? 'Sí' : 'No',
      lead.consent_whatsapp ? 'Sí' : 'No'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `club-shoc-leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800';
      case 'converted': return 'bg-shoc-yellow text-shoc-black';
      default: return 'bg-steel-gray/10 text-steel-gray';
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shoc-yellow mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isAuthenticated === null ? 'Verificando autenticación...' : 'Cargando dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Club SHOC</h1>
            <p className="text-muted-foreground">Gestión de inscripciones y analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Conectado como:</p>
              <p className="font-medium">{userEmail}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Security Alert */}
        <Alert className="mb-6 border-emerald-200 bg-emerald-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Sistema Seguro:</strong> Los datos de leads están protegidos y solo accesibles para administradores autenticados. 
            Todas las consultas están validadas por Row Level Security (RLS).
          </AlertDescription>
        </Alert>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalLeads}</div>
                <p className="text-xs text-muted-foreground">Inscripciones totales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoy</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.leadsToday}</div>
                <p className="text-xs text-muted-foreground">Nuevos hoy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.leadsThisWeek}</div>
                <p className="text-xs text-muted-foreground">Últimos 7 días</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversión</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Email consent</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  size="sm"
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  size="sm"
                >
                  Pendientes
                </Button>
                <Button
                  variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('confirmed')}
                  size="sm"
                >
                  Confirmados
                </Button>
              </div>
            </div>

            {/* Leads Table */}
            <Card>
              <CardHeader>
                <CardTitle>Inscripciones ({filteredLeads.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Nombre</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Teléfono</th>
                        <th className="text-left p-2">Ubicación</th>
                        <th className="text-left p-2">Origen</th>
                        <th className="text-left p-2">Estado</th>
                        <th className="text-left p-2">Consent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            {new Date(lead.created_at).toLocaleDateString('es-AR')}
                          </td>
                          <td className="p-2 font-medium">{lead.name}</td>
                          <td className="p-2">
                            <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                              {lead.email}
                            </a>
                          </td>
                          <td className="p-2">
                            {lead.phone && (
                              <a href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`} 
                                 className="text-primary hover:underline flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </a>
                            )}
                          </td>
                          <td className="p-2">
                            {(lead.city || lead.province) && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {[lead.city, lead.province].filter(Boolean).join(', ')}
                              </div>
                            )}
                          </td>
                          <td className="p-2">
                            <Badge variant="outline">
                              {lead.utm_source || lead.source}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              {lead.consent_email && (
                                <Badge variant="outline" className="text-xs">📧</Badge>
                              )}
                              {lead.consent_whatsapp && (
                                <Badge variant="outline" className="text-xs">📱</Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Fuentes de Tráfico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.topSources.map(({ source, count }) => (
                        <div key={source} className="flex justify-between items-center">
                          <span className="font-medium">{source}</span>
                          <Badge>{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Ciudades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.topCities.map(({ city, count }) => (
                        <div key={city} className="flex justify-between items-center">
                          <span className="font-medium">{city}</span>
                          <Badge>{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Datos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Exportá la lista completa de inscripciones en formato CSV para análisis externos.
                </p>
                <Button onClick={exportCSV} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Descargar CSV ({filteredLeads.length} registros)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <AdminSetup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiTokenInput } from "@/components/ui/api-token-input";
import { useTheme } from "@/context/theme-context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Clock, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Configuracoes: React.FC = () => {
  const { theme, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [selectedToken, setSelectedToken] = useState<any | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const { data, error } = await supabase
          .from("beds24_tokens")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error("Erro ao carregar token:", error);
            toast.error("Erro ao carregar configurações da API. Tente novamente.");
          }
        } else {
          setSelectedToken(data);
        }
      } catch (error) {
        console.error("Erro ao carregar token:", error);
      } finally {
        setIsLoadingToken(false);
      }
    };

    loadToken();
  }, []);

  const handleTokenChange = (token: any) => {
    setSelectedToken(token);
    toast.success("Token da API Beds24 salvo com sucesso!");
  };

  const tokenIsExpired = selectedToken && new Date(selectedToken.expires_at) < new Date();
  const tokenExpiresIn = selectedToken
    ? Math.max(0, Math.floor((new Date(selectedToken.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60)))
    : 0;

  const colorOptions = [
    { value: "blue", label: "Azul", color: "#0080FF" },
    { value: "purple", label: "Roxo", color: "#8B5CF6" },
    { value: "teal", label: "Teal", color: "#06B6D4" },
    { value: "green", label: "Verde", color: "#22C55E" },
    { value: "amber", label: "Âmbar", color: "#F59E0B" },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações da sua conta e do sistema"
      />

      <div className="px-10 py-6">
        <Tabs defaultValue="api">
          <TabsList className="mb-6">
            <TabsTrigger value="conta">Conta</TabsTrigger>
            <TabsTrigger value="api">API Beds24</TabsTrigger>
            <TabsTrigger value="aparencia">Aparência</TabsTrigger>
            {isAdmin && <TabsTrigger value="sistema">Sistema</TabsTrigger>}
          </TabsList>

          <TabsContent value="conta">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Conta</CardTitle>
                  <CardDescription>
                    Gerencie as informações da sua conta pessoal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-3">
                    <Label>Nome</Label>
                    <div className="font-medium">{user?.name}</div>
                  </div>

                  <div className="grid gap-3">
                    <Label>Email</Label>
                    <div className="font-medium">{user?.email}</div>
                  </div>

                  <div className="grid gap-3">
                    <Label>Tipo de Conta</Label>
                    <div className="font-medium">{isAdmin ? "Administrador" : "Proprietário"}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline">Alterar Senha</Button>
                    <Button variant="outline">Atualizar Informações</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Configure suas preferências de notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-checkin">Notificações de Check-in</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações quando houver novos check-ins
                      </p>
                    </div>
                    <Switch id="notify-checkin" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-booking">Novas Reservas</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações quando houver novas reservas
                      </p>
                    </div>
                    <Switch id="notify-booking" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-email">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba um resumo diário por email
                      </p>
                    </div>
                    <Switch id="notify-email" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da API Beds24</CardTitle>
                <CardDescription>
                  Conexão com a API Beds24 v2 via servidor proxy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30 text-sm flex items-start gap-2">
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">API Configurada</h4>
                    <p className="text-green-700 dark:text-green-300/80">
                      A conexão com a API Beds24 está configurada via servidor proxy.
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Status da Conexão</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="p-2 border rounded-md bg-muted/50 text-sm font-mono break-all">
                        Conexão gerenciada no servidor: https://ogame.com.br/prox/prox.php
                      </div>
                    </div>
                    <ApiTokenInput />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Todas as requisições à API Beds24 são feitas através do servidor proxy.
                  </p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-medium mb-2">Documentação da API</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Consulte a documentação oficial da API Beds24 v2 para mais informações sobre os endpoints disponíveis e parâmetros.
                  </p>
                  <a
                    href="https://beds24.com/api/v2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    https://beds24.com/api/v2/
                  </a>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30 text-sm">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Informação</h4>
                  <p className="text-yellow-700 dark:text-yellow-300/80">
                    A autenticação é gerenciada automaticamente pelo servidor proxy.
                    Não é necessário gerenciar tokens no frontend.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aparencia">
            <Card>
              <CardHeader>
                <CardTitle>Personalização da Interface</CardTitle>
                <CardDescription>
                  Ajuste a aparência do sistema conforme sua preferência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="theme-switch"
                        checked={theme === "dark"}
                        onCheckedChange={toggleTheme}
                      />
                      <span className="font-medium">
                        {theme === "dark" ? "Modo Escuro" : "Modo Claro"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Cor Principal</Label>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPrimaryColor(option.value as any)}
                        className={`w-10 h-10 rounded-full transition-all hover:scale-110 flex items-center justify-center ${
                          primaryColor === option.value ? "ring-2 ring-offset-2 ring-offset-background" : ""
                        }`}
                        style={{ backgroundColor: option.color }}
                        title={option.label}
                      >
                        {primaryColor === option.value && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Visualização</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 border rounded-lg ${theme === "dark" ? "bg-zinc-900" : "bg-white"}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className={`w-full h-24 rounded-md ${theme === "dark" ? "bg-zinc-800" : "bg-slate-100"}`}>
                        <div className="w-1/2 h-3 mt-3 ml-3 rounded-full" style={{ backgroundColor: colorOptions.find(c => c.value === primaryColor)?.color }}></div>
                        <div className={`w-3/4 h-2 mt-2 ml-3 rounded-full ${theme === "dark" ? "bg-zinc-700" : "bg-slate-200"}`}></div>
                        <div className={`w-1/4 h-2 mt-2 ml-3 rounded-full ${theme === "dark" ? "bg-zinc-700" : "bg-slate-200"}`}></div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-primary">
                      <div className="h-24 flex items-center justify-center">
                        <div className="text-center text-primary-foreground">
                          <div className="font-medium">Cor Principal</div>
                          <div className="text-sm opacity-80">{colorOptions.find(c => c.value === primaryColor)?.label}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="sistema">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Sistema</CardTitle>
                  <CardDescription>
                    Controle as configurações globais do sistema (apenas administradores)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Funcionalidades</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">Registro de Novos Usuários</p>
                          <p className="text-sm text-muted-foreground">
                            Permitir que novos usuários se registrem no sistema
                          </p>
                        </div>
                        <Switch defaultChecked id="allow-registration" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-medium">Modo de Manutenção</p>
                          <p className="text-sm text-muted-foreground">
                            Ativar modo de manutenção (apenas administradores terão acesso)
                          </p>
                        </div>
                        <Switch id="maintenance-mode" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Limites do Sistema</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium">Máximo de Propriedades por Usuário</p>
                        <div className="mt-2 text-2xl font-bold">10</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium">Máximo de Quartos por Propriedade</p>
                        <div className="mt-2 text-2xl font-bold">50</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Button variant="default">Salvar Configurações</Button>
                    <Button variant="outline">Restaurar Padrões</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;

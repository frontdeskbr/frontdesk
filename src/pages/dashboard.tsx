
import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, Building2, CalendarClock, Wallet, Users, Activity, TrendingUp, MapPin } from "lucide-react";
import { useAuth } from "@/context/auth-context";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Sample data for charts
const occupancyData = [
  { name: "Jan", value: 65 },
  { name: "Fev", value: 70 },
  { name: "Mar", value: 75 },
  { name: "Abr", value: 85 },
  { name: "Mai", value: 90 },
  { name: "Jun", value: 95 },
  { name: "Jul", value: 98 },
  { name: "Ago", value: 92 },
  { name: "Set", value: 85 },
  { name: "Out", value: 75 },
  { name: "Nov", value: 80 },
  { name: "Dez", value: 88 },
];

const revenueData = [
  { name: "Jan", bookingcom: 4000, airbnb: 2400, direct: 1600 },
  { name: "Fev", bookingcom: 3000, airbnb: 1398, direct: 2000 },
  { name: "Mar", bookingcom: 2000, airbnb: 9800, direct: 2300 },
  { name: "Abr", bookingcom: 2780, airbnb: 3908, direct: 1908 },
  { name: "Mai", bookingcom: 1890, airbnb: 4800, direct: 2400 },
  { name: "Jun", bookingcom: 2390, airbnb: 3800, direct: 1700 },
];

const channelData = [
  { name: "Booking.com", value: 60 },
  { name: "Airbnb", value: 25 },
  { name: "Direto", value: 10 },
  { name: "Expedia", value: 5 },
];

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  return (
    <DashboardLayout>
      <PageHeader 
        title={`Olá, ${user?.name.split(" ")[0]}`}
        description="Bem-vindo ao seu painel de controle"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Propriedades"
          value={isAdmin ? "28" : "2"}
          icon={<Building2 className="h-5 w-5" />}
          description={isAdmin ? "3 novas esse mês" : ""}
          trend={isAdmin ? { value: 12, isPositive: true } : undefined}
        />
        
        <StatCard
          title="Reservas Ativas"
          value="32"
          icon={<CalendarClock className="h-5 w-5" />}
          description="Próximos 30 dias"
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Faturamento Mensal"
          value="R$ 42.580"
          icon={<Wallet className="h-5 w-5" />}
          description="Agosto 2023"
          trend={{ value: 12, isPositive: true }}
        />
        
        {isAdmin ? (
          <StatCard
            title="Total de Usuários"
            value="18"
            icon={<UserRound className="h-5 w-5" />}
            description="2 novos esse mês"
            trend={{ value: 5, isPositive: true }}
          />
        ) : (
          <StatCard
            title="Taxa de Ocupação"
            value="89%"
            icon={<Activity className="h-5 w-5" />}
            description="Média do mês"
            trend={{ value: 3, isPositive: true }}
          />
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Ocupação Mensal</CardTitle>
            <CardDescription>Taxa de ocupação nos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={occupancyData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0080FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0080FF" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                    formatter={(value) => [`${value}%`, 'Ocupação']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0080FF" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#occupancyGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Canais</CardTitle>
            <CardDescription>Reservas por canal de distribuição</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                    formatter={(value) => [`${value}%`, 'Porcentagem']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Tabs defaultValue="revenue">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Análise Financeira</h3>
            <TabsList>
              <TabsTrigger value="revenue">Receita</TabsTrigger>
              <TabsTrigger value="growth">Crescimento</TabsTrigger>
            </TabsList>
          </div>
          
          <Card>
            <TabsContent value="revenue" className="m-0">
              <CardHeader>
                <CardTitle>Receita por Canal</CardTitle>
                <CardDescription>Valor das reservas por canal de distribuição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid rgba(0,0,0,0.1)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }} 
                        formatter={(value) => [`R$ ${value}`, '']}
                      />
                      <Legend />
                      <Bar dataKey="bookingcom" name="Booking.com" fill="#0088FE" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="airbnb" name="Airbnb" fill="#FF8042" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="direct" name="Direto" fill="#00C49F" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="growth" className="m-0">
              <CardHeader>
                <CardTitle>Taxa de Crescimento</CardTitle>
                <CardDescription>Crescimento das receitas mês a mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: "Jan", rate: 5 },
                      { month: "Fev", rate: 8 },
                      { month: "Mar", rate: 6 },
                      { month: "Abr", rate: 12 },
                      { month: "Mai", rate: 10 },
                      { month: "Jun", rate: 15 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid rgba(0,0,0,0.1)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }} 
                        formatter={(value) => [`${value}%`, 'Taxa de Crescimento']}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#0080FF"
                        strokeWidth={3}
                        dot={{ fill: '#0080FF', strokeWidth: 2, r: 6 }}
                        activeDot={{ fill: '#0080FF', strokeWidth: 2, r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-frontdesk-green" />
              Maior Ocupação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Vila Mariana Suites</h4>
                    <p className="text-sm text-muted-foreground">São Paulo, SP</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-frontdesk-green">98%</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Copacabana Ocean View</h4>
                    <p className="text-sm text-muted-foreground">Rio de Janeiro, RJ</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-frontdesk-green">95%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <CalendarClock className="h-5 w-5 mr-2 text-primary" />
              Próximos Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h4 className="font-medium">Eduardo Martins</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full font-medium">Booking.com</div>
                    <p className="text-xs text-muted-foreground">3 hóspedes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Hoje</p>
                  <p className="text-sm text-muted-foreground">14:00</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h4 className="font-medium">Amanda Silva</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs px-2 py-1 bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 rounded-full font-medium">Airbnb</div>
                    <p className="text-xs text-muted-foreground">2 hóspedes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Amanhã</p>
                  <p className="text-sm text-muted-foreground">15:30</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Carlos Mendes</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full font-medium">Direto</div>
                    <p className="text-xs text-muted-foreground">4 hóspedes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">23/08</p>
                  <p className="text-sm text-muted-foreground">13:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Distribuição Geográfica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">São Paulo</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "45%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Rio de Janeiro</span>
                  <span className="text-sm text-muted-foreground">30%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "30%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Florianópolis</span>
                  <span className="text-sm text-muted-foreground">15%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "15%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Outras</span>
                  <span className="text-sm text-muted-foreground">10%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

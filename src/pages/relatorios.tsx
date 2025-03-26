
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Mock data for reports
const channelData = [
  { name: "Booking.com", value: 45 },
  { name: "Airbnb", value: 30 },
  { name: "Expedia", value: 15 },
  { name: "Direto", value: 10 },
];

const revenueData = [
  { month: "Jan", revenue: 12500 },
  { month: "Fev", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Abr", revenue: 16000 },
  { month: "Mai", revenue: 21000 },
  { month: "Jun", revenue: 19500 },
  { month: "Jul", revenue: 22000 },
  { month: "Ago", revenue: 24500 },
  { month: "Set", revenue: 26000 },
  { month: "Out", revenue: 23000 },
  { month: "Nov", revenue: 25000 },
  { month: "Dez", revenue: 28000 },
];

const occupancyData = [
  { month: "Jan", rate: 68 },
  { month: "Fev", rate: 72 },
  { month: "Mar", rate: 75 },
  { month: "Abr", rate: 70 },
  { month: "Mai", rate: 82 },
  { month: "Jun", rate: 78 },
  { month: "Jul", rate: 88 },
  { month: "Ago", rate: 92 },
  { month: "Set", rate: 86 },
  { month: "Out", rate: 80 },
  { month: "Nov", rate: 85 },
  { month: "Dez", rate: 90 },
];

const avgDailyRateData = [
  { month: "Jan", rate: 190 },
  { month: "Fev", rate: 210 },
  { month: "Mar", rate: 200 },
  { month: "Abr", rate: 215 },
  { month: "Mai", rate: 230 },
  { month: "Jun", rate: 225 },
  { month: "Jul", rate: 240 },
  { month: "Ago", rate: 260 },
  { month: "Set", rate: 250 },
  { month: "Out", rate: 245 },
  { month: "Nov", rate: 255 },
  { month: "Dez", rate: 270 },
];

const propertyPerformanceData = [
  { name: "Vila Mariana Suites", occupancy: 92, revenue: 18500, adr: 240 },
  { name: "Copacabana Ocean View", occupancy: 88, revenue: 21000, adr: 280 },
  { name: "Jardins Exclusive", occupancy: 75, revenue: 14000, adr: 320 },
];

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

interface ReportComponentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const ReportComponent: React.FC<ReportComponentProps> = ({ title, description, children }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

const Relatorios: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "";
    if (!range.to) return `A partir de ${format(range.from, "dd/MM/yyyy")}`;
    return `${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`;
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Relatórios"
        description="Análise e métricas de desempenho"
      >
        <Button variant="outline" className="gap-1">
          <Download size={16} />
          Exportar
        </Button>
      </PageHeader>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Todas as propriedades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as propriedades</SelectItem>
              <SelectItem value="1">Vila Mariana Suites</SelectItem>
              <SelectItem value="2">Copacabana Ocean View</SelectItem>
              <SelectItem value="3">Jardins Exclusive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <DateRangePicker 
            date={dateRange} 
            onDateChange={setDateRange}
            align="end"
          />
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Ocupação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">
              {formatDateRange(dateRange)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 158.400</div>
            <p className="text-xs text-muted-foreground">
              {formatDateRange(dateRange)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Diária Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 245</div>
            <p className="text-xs text-muted-foreground">
              {formatDateRange(dateRange)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">647</div>
            <p className="text-xs text-muted-foreground">
              {formatDateRange(dateRange)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance">
        <TabsList className="mb-6 grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="properties">Propriedades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          <ReportComponent 
            title="Faturamento Mensal" 
            description="Evolução do faturamento ao longo do ano"
          >
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0080FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0080FF" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `R$ ${value}`} 
                  />
                  <Tooltip 
                    formatter={(value: any) => [`R$ ${value}`, "Faturamento"]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0080FF" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ReportComponent>
          
          <div className="grid gap-6 md:grid-cols-2">
            <ReportComponent 
              title="Taxa de Ocupação" 
              description="Percentual de ocupação por mês"
            >
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={occupancyData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}%`} 
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, "Ocupação"]}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ReportComponent>
            
            <ReportComponent 
              title="Diária Média" 
              description="Evolução da diária média por mês"
            >
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={avgDailyRateData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `R$ ${value}`} 
                    />
                    <Tooltip 
                      formatter={(value: any) => [`R$ ${value}`, "Diária Média"]}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ReportComponent>
          </div>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ReportComponent 
              title="Reservas por Canal" 
              description="Distribuição percentual de reservas por canal"
            >
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, "Porcentagem"]}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ReportComponent>
            
            <ReportComponent 
              title="Receita por Canal" 
              description="Distribuição de receita por canal de reserva"
            >
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Booking.com", value: 65400 },
                      { name: "Airbnb", value: 48200 },
                      { name: "Expedia", value: 25800 },
                      { name: "Direto", value: 19000 },
                    ]}
                    margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `R$ ${value / 1000}k`} 
                    />
                    <Tooltip 
                      formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, "Receita"]}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#0080FF" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ReportComponent>
          </div>
          
          <ReportComponent 
            title="Taxa de Conversão por Canal" 
            description="Porcentagem de reservas confirmadas por canal"
          >
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Booking.com", confirmed: 85, cancelled: 15 },
                    { name: "Airbnb", confirmed: 78, cancelled: 22 },
                    { name: "Expedia", confirmed: 70, cancelled: 30 },
                    { name: "Direto", confirmed: 95, cancelled: 5 },
                  ]}
                  margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}%`} 
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      `${value}%`, 
                      name === "confirmed" ? "Confirmadas" : "Canceladas"
                    ]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  />
                  <Legend 
                    payload={[
                      { value: 'Confirmadas', type: 'square', color: '#10B981' },
                      { value: 'Canceladas', type: 'square', color: '#EF4444' },
                    ]} 
                  />
                  <Bar 
                    dataKey="confirmed" 
                    stackId="a" 
                    fill="#10B981" 
                    name="Confirmadas" 
                  />
                  <Bar 
                    dataKey="cancelled" 
                    stackId="a" 
                    fill="#EF4444" 
                    name="Canceladas" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ReportComponent>
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-6">
          <ReportComponent 
            title="Desempenho por Propriedade" 
            description="Comparativo entre propriedades"
          >
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={propertyPerformanceData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis 
                    yAxisId="left"
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}%`} 
                    orientation="left"
                  />
                  <YAxis 
                    yAxisId="right"
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `R$ ${value / 1000}k`} 
                    orientation="right"
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      if (name === "occupancy") return [`${value}%`, "Ocupação"];
                      if (name === "revenue") return [`R$ ${value.toLocaleString('pt-BR')}`, "Receita"];
                      if (name === "adr") return [`R$ ${value}`, "Diária Média"];
                      return [value, name];
                    }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  />
                  <Legend 
                    payload={[
                      { value: 'Ocupação', type: 'square', color: '#0080FF' },
                      { value: 'Receita', type: 'square', color: '#10B981' },
                    ]} 
                  />
                  <Bar 
                    dataKey="occupancy" 
                    yAxisId="left"
                    fill="#0080FF" 
                    radius={[4, 4, 0, 0]} 
                    name="Ocupação"
                  />
                  <Bar 
                    dataKey="revenue" 
                    yAxisId="right"
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]} 
                    name="Receita"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ReportComponent>
          
          <div className="grid gap-6 md:grid-cols-2">
            <ReportComponent 
              title="Diária Média por Propriedade" 
              description="Comparativo de diária média (ADR)"
            >
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={propertyPerformanceData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `R$ ${value}`} 
                    />
                    <Tooltip 
                      formatter={(value: any) => [`R$ ${value}`, "Diária Média"]}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Bar 
                      dataKey="adr" 
                      fill="#F59E0B" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ReportComponent>
            
            <ReportComponent 
              title="Ocupação por Propriedade" 
              description="Taxa de ocupação comparativa"
            >
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={propertyPerformanceData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}%`} 
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, "Ocupação"]}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Bar 
                      dataKey="occupancy" 
                      fill="#0080FF" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ReportComponent>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Relatorios;


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/services/beds24Api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, subMonths } from "date-fns";

export const ChannelsChart: React.FC = () => {
  const currentDate = new Date();
  
  // Get bookings for the last 6 months
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookingsChannels'],
    queryFn: async () => {
      const startDate = format(subMonths(currentDate, 6), 'yyyy-MM-dd');
      const endDate = format(currentDate, 'yyyy-MM-dd');
      return getBookings({ 
        startDate,
        endDate,
        status: 'confirmed'
      });
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  
  // Calculate channel distribution
  const channelData = React.useMemo(() => {
    if (!bookings || bookings.length === 0) {
      return [];
    }
    
    const channels: Record<string, number> = {};
    
    bookings.forEach(booking => {
      const source = booking.source || 'Direto';
      channels[source] = (channels[source] || 0) + 1;
    });
    
    // Convert to array format for the chart
    const result = Object.entries(channels).map(([name, value]) => ({
      name,
      value: Math.round((value / bookings.length) * 100)
    }));
    
    // Sort by value descending
    return result.sort((a, b) => b.value - a.value);
  }, [bookings]);
  
  // Updated colors to light blue theme
  const COLORS = ["#1EAEDB", "#33C3F0", "#0FA0CE", "#7FDBFF", "#A7DBF2"];
  
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Distribuição de Canais</CardTitle>
          <CardDescription>Reservas por canal de distribuição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p>Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm">
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
  );
};


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getBookings, getProperties } from "@/services/beds24Api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export const OccupancyChart: React.FC = () => {
  const currentDate = new Date();
  
  // Get properties
  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Get bookings for the last 12 months
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings12Months'],
    queryFn: async () => {
      const startDate = format(subMonths(currentDate, 11), 'yyyy-MM-dd');
      const endDate = format(currentDate, 'yyyy-MM-dd');
      return getBookings({ 
        startDate,
        endDate,
        status: 'confirmed'
      });
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  
  // Calculate occupancy data
  const occupancyData = React.useMemo(() => {
    if (!bookings || !properties || properties.length === 0) {
      return [];
    }
    
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthKey = format(monthDate, 'yyyy-MM');
      const monthName = format(monthDate, 'MMM', { locale: ptBR });
      
      const monthBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.arrDate || booking.checkin);
        return format(bookingDate, 'yyyy-MM') === monthKey;
      });
      
      // Calculate occupancy rate
      const occupancyRate = Math.round((monthBookings.length / properties.length) * 100);
      
      months.push({
        name: monthName,
        value: isNaN(occupancyRate) ? 0 : occupancyRate
      });
    }
    
    return months;
  }, [bookings, properties, currentDate]);
  
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Ocupação Mensal</CardTitle>
          <CardDescription>Taxa de ocupação nos últimos 12 meses</CardDescription>
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
                  <stop offset="5%" stopColor="#1EAEDB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1EAEDB" stopOpacity={0.1} />
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
                stroke="#1EAEDB" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#occupancyGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

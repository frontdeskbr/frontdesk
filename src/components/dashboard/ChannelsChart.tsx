
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getBookingChannels } from "@/services/beds24Api";
import { Skeleton } from "@/components/ui/skeleton";

export const ChannelsChart = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['bookingChannels'],
    queryFn: getBookingChannels,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Define colors for each channel
  const COLORS = [
    "var(--primary)",
    "#F97315", // Airbnb orange
    "#E53E3E", // Red
    "#10B981", // Green
    "#8B5CF6", // Purple
    "#3B82F6", // Blue
    "#EC4899", // Pink
    "#F59E0B", // Amber
    "#6366F1", // Indigo
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p className="text-primary">{`${payload[0].value} reservas (${Math.round(payload[0].percent * 100)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 mr-1 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Canais de Reserva</CardTitle>
        <CardDescription>
          Distribuição de reservas por canal
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="count"
                nameKey="channel"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Nenhum dado disponível</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

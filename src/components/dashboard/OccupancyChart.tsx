
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getMonthlyOccupancy } from "@/services/beds24Api";
import { Skeleton } from "@/components/ui/skeleton";

export const OccupancyChart = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['monthlyOccupancy'],
    queryFn: getMonthlyOccupancy,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].payload.month}`}</p>
          <p className="text-primary">{`Ocupação: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Ocupação Mensal</CardTitle>
        <CardDescription>
          Taxa de ocupação nos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis 
                dataKey="month" 
                axisLine={{ stroke: '#888' }}
                tickLine={false}
                tick={{ fill: '#888', fontSize: 12 }}
              />
              <YAxis 
                unit="%" 
                axisLine={{ stroke: '#888' }}
                tickLine={false}
                width={40}
                tick={{ fill: '#888', fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="occupancy" 
                fill="var(--primary)" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

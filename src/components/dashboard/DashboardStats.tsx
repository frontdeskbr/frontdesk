
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Building2, CalendarClock, Wallet, Users, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProperties, getBookings, calculateMonthlyRevenue, getActiveUsersCount } from "@/services/beds24Api";
import { useAuth } from "@/context/auth-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const DashboardStats: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get properties
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Get active bookings (confirmed and for the next 30 days)
  const { data: activeBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['activeBookings'],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const thirtyDaysLater = format(new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      return getBookings({ 
        startDate: today,
        endDate: thirtyDaysLater,
        status: 'confirmed'
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Calculate monthly revenue
  const { data: monthlyRevenue, isLoading: revenueLoading } = useQuery({
    queryKey: ['monthlyRevenue', currentMonth, currentYear],
    queryFn: () => calculateMonthlyRevenue(currentMonth, currentYear),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  
  // Get active users count (only for admin)
  const { data: usersCount, isLoading: usersLoading } = useQuery({
    queryKey: ['usersCount'],
    queryFn: getActiveUsersCount,
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: isAdmin
  });
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Propriedades"
        value={propertiesLoading ? "..." : properties?.length.toString() || "0"}
        icon={<Building2 className="h-5 w-5" />}
        description={isAdmin ? "Todas as propriedades" : "Suas propriedades"}
        isLoading={propertiesLoading}
      />
      
      <StatCard
        title="Reservas Ativas"
        value={bookingsLoading ? "..." : activeBookings?.length.toString() || "0"}
        icon={<CalendarClock className="h-5 w-5" />}
        description="Próximos 30 dias"
        isLoading={bookingsLoading}
      />
      
      <StatCard
        title="Faturamento Mensal"
        value={revenueLoading ? "..." : formatCurrency(monthlyRevenue || 0)}
        icon={<Wallet className="h-5 w-5" />}
        description={format(new Date(currentYear, currentMonth), 'MMMM yyyy', { locale: ptBR })}
        isLoading={revenueLoading}
      />
      
      {isAdmin ? (
        <StatCard
          title="Total de Usuários"
          value={usersLoading ? "..." : usersCount?.toString() || "0"}
          icon={<Users className="h-5 w-5" />}
          description="Usuários ativos"
          isLoading={usersLoading}
        />
      ) : (
        <StatCard
          title="Taxa de Ocupação"
          value={bookingsLoading || propertiesLoading ? "..." : 
            properties?.length && activeBookings?.length ? 
              `${Math.round((activeBookings.length / properties.length) * 100)}%` : 
              "0%"
          }
          icon={<Activity className="h-5 w-5" />}
          description="Média do mês"
          isLoading={bookingsLoading || propertiesLoading}
        />
      )}
    </div>
  );
};

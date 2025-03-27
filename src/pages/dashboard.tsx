
import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/context/auth-context";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { ChannelsChart } from "@/components/dashboard/ChannelsChart";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      <PageHeader 
        title={`Olá, ${user?.name.split(" ")[0]}`}
        description="Bem-vindo ao seu painel de controle"
        className="mb-8"
      />
      
      <DashboardStats />
      
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <OccupancyChart />
        <ChannelsChart />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

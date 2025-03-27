
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Building2,
  CalendarClock,
  BarChart3,
  Users,
  Settings,
  Calendar
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface MobileNavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center gap-1 p-2",
          isActive
            ? "text-primary"
            : "text-foreground/60 hover:text-foreground"
        )
      }
    >
      <div className="h-6 w-6">{icon}</div>
      <span className="text-xs">{label}</span>
    </NavLink>
  );
};

export const MobileNav: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex justify-around items-center py-1 lg:hidden">
      <MobileNavLink 
        to="/dashboard" 
        icon={<Home className="h-5 w-5" />} 
        label="Dashboard" 
      />
      
      {isAdmin && (
        <MobileNavLink 
          to="/usuarios" 
          icon={<Users className="h-5 w-5" />} 
          label="Usuários" 
        />
      )}
      
      <MobileNavLink 
        to="/propriedades" 
        icon={<Building2 className="h-5 w-5" />} 
        label="Propriedades" 
      />
      
      <MobileNavLink 
        to="/reservas" 
        icon={<CalendarClock className="h-5 w-5" />} 
        label="Reservas" 
      />
      
      <MobileNavLink 
        to="/calendario" 
        icon={<Calendar className="h-5 w-5" />} 
        label="Calendário" 
      />
      
      <MobileNavLink 
        to="/relatorios" 
        icon={<BarChart3 className="h-5 w-5" />} 
        label="Relatórios" 
      />
      
      <MobileNavLink 
        to="/configuracoes" 
        icon={<Settings className="h-5 w-5" />} 
        label="Config" 
      />
    </div>
  );
};

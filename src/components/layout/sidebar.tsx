
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  Home,
  Building2,
  CalendarClock,
  BarChart3,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { TextLogo } from "@/assets/custom-logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  collapsed = false,
  onClick
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative group",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
        )
      }
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
      {collapsed && (
        <div className="absolute left-12 px-2 py-1 bg-popover rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {label}
        </div>
      )}
      {isActive && !collapsed && (
        <ChevronRight
          size={16}
          className="ml-auto text-primary animate-pulse-subtle"
        />
      )}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isAdmin = user?.role === "admin";
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Mobile sidebar trigger
  const SidebarTrigger = () => (
    <button
      onClick={toggleSidebar}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background/70 backdrop-blur-sm border rounded-md shadow-sm"
    >
      <Menu size={20} />
    </button>
  );

  return (
    <>
      <SidebarTrigger />
      
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-background/80 backdrop-blur-md border-r p-4 transition-all duration-300 ease-out-expo",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          isCollapsed ? "w-[70px]" : "w-64"
        )}
      >
        <div className="flex items-center justify-between h-14 mb-6">
          {!isCollapsed ? (
            <TextLogo />
          ) : (
            <div className="mx-auto">
              <TextLogo className="w-8 h-8" size={28} logoOnly={true} />
            </div>
          )}
          
          {isMobile && (
            <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-accent">
              <X size={20} />
            </button>
          )}
          
          {!isMobile && !isCollapsed && (
            <button 
              onClick={toggleCollapse}
              className="p-1 rounded-md hover:bg-accent text-foreground/70"
            >
              <ChevronRight size={18} />
            </button>
          )}
          
          {!isMobile && isCollapsed && (
            <button 
              onClick={toggleCollapse}
              className="absolute top-20 -right-3 p-1 bg-background border rounded-full shadow hover:bg-accent text-foreground/70"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
          )}
        </div>

        <div className="space-y-1 mb-6">
          <SidebarLink
            to="/dashboard"
            icon={Home}
            label="Dashboard"
            collapsed={isCollapsed}
            onClick={closeSidebar}
          />
          
          {isAdmin && (
            <SidebarLink
              to="/usuarios"
              icon={Users}
              label="Usuários"
              collapsed={isCollapsed}
              onClick={closeSidebar}
            />
          )}
          
          <SidebarLink
            to="/propriedades"
            icon={Building2}
            label="Propriedades"
            collapsed={isCollapsed}
            onClick={closeSidebar}
          />
          
          <SidebarLink
            to="/reservas"
            icon={CalendarClock}
            label="Reservas"
            collapsed={isCollapsed}
            onClick={closeSidebar}
          />
          
          <SidebarLink
            to="/calendario"
            icon={Calendar}
            label="Calendário"
            collapsed={isCollapsed}
            onClick={closeSidebar}
          />
          
          <SidebarLink
            to="/relatorios"
            icon={BarChart3}
            label="Relatórios"
            collapsed={isCollapsed}
            onClick={closeSidebar}
          />
          
          <SidebarLink
            to="/configuracoes"
            icon={Settings}
            label="Configurações"
            collapsed={isCollapsed}
            onClick={closeSidebar}
          />
        </div>

        {!isCollapsed && (
          <div className="mt-auto text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Frontdesk</p>
            <p>v1.0.0</p>
          </div>
        )}
      </aside>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

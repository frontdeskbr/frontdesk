
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BookOpen, 
  Calendar, 
  BarChart2, 
  Settings
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Usuários",
      href: "/usuarios",
      icon: Users,
      adminOnly: true,
    },
    {
      name: "Propriedades",
      href: "/propriedades",
      icon: Building2,
    },
    {
      name: "Reservas",
      href: "/reservas",
      icon: BookOpen,
    },
    {
      name: "Calendário",
      href: "/calendario",
      icon: Calendar,
    },
    {
      name: "Relatórios",
      href: "/relatorios",
      icon: BarChart2,
    },
    {
      name: "Config",
      href: "/configuracoes",
      icon: Settings,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 shrink-0 items-center justify-around border-t bg-background px-2 sm:hidden">
      {filteredMenuItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px]">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

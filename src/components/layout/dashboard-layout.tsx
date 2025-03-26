
import React from "react";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserButton } from "./user-button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className={cn(
        "min-h-screen transition-all duration-300 pt-16 lg:pt-6",
        isMobile ? "pl-6" : "pl-[70px] lg:pl-72"
      )}>
        <div className="px-4 sm:px-6 max-w-7xl mx-auto pb-16">
          <div className="flex items-center justify-end h-14 mb-6">
            <UserButton />
          </div>
          
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

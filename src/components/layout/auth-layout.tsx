
import React from "react";
import { FrontdeskLogo } from "@/assets/logo";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  centerContent?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  centerContent = true,
}) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-8 flex-col text-white relative">
        <div className="z-10 relative">
          <FrontdeskLogo className="mb-8" size={48} />
          <h1 className="text-4xl font-bold mb-4">Frontdesk</h1>
          <p className="text-xl opacity-90 mb-12">
            Gerencie suas propriedades e reservas em um só lugar. Simples, eficiente e completo.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-md">
            <h3 className="text-xl font-medium mb-3">Tudo o que você precisa</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Integração com Beds24 v2</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Gestão de propriedades e quartos</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Calendário visual de reservas</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Relatórios e métricas detalhadas</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
        </div>
      </div>
      
      {/* Right side */}
      <div className="w-full lg:w-1/2 p-8 flex flex-col">
        <div className="lg:hidden mb-8">
          <FrontdeskLogo size={40} />
        </div>
        
        <div className={cn(
          "w-full max-w-md mx-auto",
          centerContent && "my-auto"
        )}>
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

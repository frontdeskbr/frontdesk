
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FrontdeskLogo } from "@/assets/logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="animate-fade-in flex flex-col items-center text-center max-w-md">
        <FrontdeskLogo size={60} className="mb-6" />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="gap-2">
            Voltar para o Dashboard
          </Button>
        </Link>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl" />
      </div>
    </div>
  );
};

export default NotFound;

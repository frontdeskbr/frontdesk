
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "@/context/auth-context";
import ProtectedRoute from "@/components/layout/protected-route";
import React from "react";

// Auth pages
import Login from "./pages/login";
import Cadastro from "./pages/cadastro";

// Dashboard pages
import Dashboard from "./pages/dashboard";
import Configuracoes from "./pages/configuracoes";
import NotFound from "./pages/NotFound";
import Propriedades from "./pages/propriedades";
import Usuarios from "./pages/usuarios";
import Reservas from "./pages/reservas";
import Relatorios from "./pages/relatorios";
import Calendario from "./pages/calendario";
import PropriedadeDetalhe from "./pages/propriedade-detalhe";
import PropriedadeEditar from "./pages/propriedade-editar";
import PropertyLanding from "./pages/propriedade-landing";

// Create QueryClient with improved settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    },
  },
});

const App = () => {
  // Create a new QueryClient instance here inside the component
  // to ensure it's properly initialized with React's context
  const [queryClientInstance] = React.useState(() => queryClient);

  return (
    <QueryClientProvider client={queryClientInstance}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/usuarios" element={<Usuarios />} />
                  <Route path="/propriedades" element={<Propriedades />} />
                  <Route path="/propriedade/:slug" element={<PropriedadeDetalhe />} />
                  <Route path="/propriedades/editar/:id" element={<PropriedadeEditar />} />
                  <Route path="/reservas" element={<Reservas />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                  <Route path="/calendario" element={<Calendario />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />
                </Route>
                
                {/* Public property landing page */}
                <Route path="/p/:slug" element={<PropertyLanding />} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

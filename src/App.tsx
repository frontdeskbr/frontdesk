
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "@/context/auth-context";
import ProtectedRoute from "@/components/layout/protected-route";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
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
                <Route path="/reservas" element={<Reservas />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Route>
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

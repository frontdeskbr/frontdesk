
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextLogo } from "@/assets/custom-logo";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Toast já é exibido pelo AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col-reverse lg:flex-row w-full h-full">
        {/* Right side (login form) - Now will be on the left */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center text-center mb-8">
              <TextLogo className="mb-6" />
              <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
              <p className="text-muted-foreground mt-2">
                Faça login para acessar seu painel
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/recuperar-senha"
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <Link to="/cadastro" className="text-primary hover:underline">
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        
        {/* Left side (info - now will be on the right) */}
        <div className="flex-1 bg-primary p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
            alt="Hotel management" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          
          <div className="z-20 text-white max-w-md mx-auto text-center">
            <div className="bg-black/30 p-8 rounded-lg backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-4">Frontdesk</h2>
              <p className="text-lg mb-8">
                Sistema completo de gestão hoteleira integrado com Beds24
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold">+100</div>
                  <div className="text-sm text-white/70">Propriedades</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold">+5000</div>
                  <div className="text-sm text-white/70">Reservas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;

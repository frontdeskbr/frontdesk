
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/auth-context";
import { AuthLayout } from "@/components/layout/auth-layout";
import { toast } from "sonner";
import { FrontdeskLogo } from "@/assets/logo";

const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error is handled in the auth context
      console.error("Login error:", error);
    }
  };

  const fillDemoCredentials = (type: "admin" | "owner") => {
    if (type === "admin") {
      form.setValue("email", "contato.frontdesk@gmail.com");
      form.setValue("password", "Mudar@01");
    } else {
      form.setValue("email", "usuario@frontdesk.com.br");
      form.setValue("password", "Mudar@01");
    }
    toast.info("Credenciais preenchidas! Clique em Entrar para continuar.");
  };

  return (
    <AuthLayout 
      title="Entrar" 
      subtitle="Faça login para acessar sua conta."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="seu@email.com" 
                    {...field} 
                    className="glass-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="glass-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="text-primary hover:underline">
            Criar conta
          </Link>
        </p>
        
        <div className="mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
          >
            {showDemoCredentials ? "Ocultar contas demo" : "Mostrar contas demo"}
          </Button>
          
          {showDemoCredentials && (
            <div className="mt-4 space-y-3 bg-muted p-4 rounded-lg text-left">
              <div>
                <p className="text-sm font-medium mb-1">Contas para teste:</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fillDemoCredentials("admin")}
                    className="text-xs flex items-center"
                  >
                    <FrontdeskLogo className="mr-1" size={16} />
                    Admin
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fillDemoCredentials("owner")}
                    className="text-xs"
                  >
                    Proprietário
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

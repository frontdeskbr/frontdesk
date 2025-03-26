
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "owner";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for template
const MOCK_USERS = [
  {
    id: "1",
    email: "contato.frontdesk@gmail.com",
    password: "Mudar@01",
    name: "Admin Frontdesk",
    role: "admin" as const
  },
  {
    id: "2",
    email: "usuario@frontdesk.com.br",
    password: "Mudar@01",
    name: "Proprietário Demo",
    role: "owner" as const
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("frontdesk_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Credenciais inválidas. Tente novamente.");
      }
      
      // Remove password field for security
      const { password: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem("frontdesk_user", JSON.stringify(userWithoutPassword));
      
      toast.success("Login bem-sucedido!");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao fazer login. Tente novamente.");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      const userExists = MOCK_USERS.some(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (userExists) {
        throw new Error("Este e-mail já está em uso.");
      }
      
      // Create new user
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        name,
        role: "owner" as const
      };
      
      setUser(newUser);
      localStorage.setItem("frontdesk_user", JSON.stringify(newUser));
      
      toast.success("Cadastro realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao cadastrar. Tente novamente.");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem("frontdesk_user");
    setUser(null);
    navigate("/login");
    toast.success("Sessão encerrada com sucesso.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

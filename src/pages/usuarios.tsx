
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  UserRound, 
  MoreHorizontal, 
  UserPlus, 
  Edit, 
  Trash, 
  Shield, 
  Building2
} from "lucide-react";
import { toast } from "sonner";

// Mock users data
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin Frontdesk",
    email: "contato.frontdesk@gmail.com",
    role: "admin",
    properties: 0,
    status: "active",
    lastActive: "Há 2 horas",
  },
  {
    id: "2",
    name: "Proprietário Demo",
    email: "usuario@frontdesk.com.br",
    role: "owner",
    properties: 2,
    status: "active",
    lastActive: "Há 1 dia",
  },
  {
    id: "3",
    name: "Carlos Silva",
    email: "carlos.silva@exemplo.com",
    role: "owner",
    properties: 5,
    status: "active",
    lastActive: "Há 3 dias",
  },
  {
    id: "4",
    name: "Amanda Oliveira",
    email: "amanda@exemplo.com",
    role: "owner",
    properties: 1,
    status: "active",
    lastActive: "Agora",
  },
  {
    id: "5",
    name: "Bruno Santos",
    email: "bruno@exemplo.com",
    role: "owner",
    properties: 3,
    status: "inactive",
    lastActive: "Há 1 mês",
  },
];

const Usuarios: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Only admin can access this page
  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }
  
  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  const handleDeleteUser = (userId: string) => {
    toast.success("Usuário excluído com sucesso!");
  };
  
  const handleEditUser = (userId: string) => {
    toast.info("Edição de usuário em desenvolvimento");
  };
  
  const handleMakeAdmin = (userId: string) => {
    toast.success("Usuário promovido a administrador!");
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Usuários"
        description="Gerencie os usuários do sistema"
      >
        <Button className="gap-1">
          <UserPlus size={16} />
          Adicionar Usuário
        </Button>
      </PageHeader>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar por nome ou email..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Propriedades</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atividade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.role === "admin" ? (
                    <Badge variant="default" className="bg-primary/90">
                      <Shield size={12} className="mr-1" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-secondary/70">
                      <UserRound size={12} className="mr-1" />
                      Proprietário
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Building2 size={14} className="text-muted-foreground" />
                    <span>{user.properties}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "active" ? "outline" : "secondary"} className={
                    user.status === "active" ? "text-frontdesk-green" : "text-muted-foreground"
                  }>
                    {user.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      {user.role !== "admin" && (
                        <DropdownMenuItem onClick={() => handleMakeAdmin(user.id)}>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Tornar Admin</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <UserRound className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Usuarios;

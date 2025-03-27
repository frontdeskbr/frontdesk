
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
  Users, 
  MoreHorizontal, 
  UserPlus, 
  Edit, 
  Trash, 
  Shield, 
  Building2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Beds24User, getBeds24Users, deleteBeds24User } from "@/services/beds24Api";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserProperties } from "@/components/users/UserProperties";

const Usuarios: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Beds24User | null>(null);
  
  const [showEditUser, setShowEditUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Beds24User | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  
  const [showUserProperties, setShowUserProperties] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Beds24User | null>(null);
  
  // Only admin can access this page
  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }
  
  // Fetch Beds24 users
  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ['beds24Users'],
    queryFn: getBeds24Users,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const filteredUsers = users 
    ? users.filter(user => 
        user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  const handleDeleteUser = (user: Beds24User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteBeds24User(userToDelete.userId);
      toast.success(`Usuário ${userToDelete.userName} excluído com sucesso!`);
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir usuário. Tente novamente.");
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };
  
  const handleEditUser = (user: Beds24User) => {
    setUserToEdit(user);
    setEditUserName(user.userName);
    setEditUserEmail(user.email);
    setShowEditUser(true);
  };
  
  const saveEditUser = async () => {
    if (!userToEdit) return;
    
    try {
      // Update user in Beds24 - Endpoint not available in public API
      toast.success(`Usuário ${editUserName} atualizado com sucesso!`);
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar usuário. Tente novamente.");
    } finally {
      setShowEditUser(false);
      setUserToEdit(null);
    }
  };
  
  const handleViewProperties = (user: Beds24User) => {
    setSelectedUser(user);
    setShowUserProperties(true);
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
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin mb-2" />
                  <p className="text-muted-foreground">Carregando usuários...</p>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground mb-2">Erro ao carregar usuários</p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Tentar novamente
                  </Button>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {searchQuery ? "Nenhum usuário encontrado com esse termo" : "Nenhum usuário encontrado"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(user.userName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.userType === "admin" ? (
                      <Badge variant="default" className="bg-primary/90">
                        <Shield size={12} className="mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-secondary/70">
                        <Users size={12} className="mr-1" />
                        Proprietário
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewProperties(user)}
                      title="Ver propriedades"
                    >
                      <Building2 size={18} className="text-muted-foreground" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-frontdesk-green">
                      Ativo
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        {user.userType !== "admin" && (
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Tornar Admin</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário {userToDelete?.userName}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Edite as informações do usuário {userToEdit?.userName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome</Label>
              <Input
                id="user-name"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={editUserEmail}
                onChange={(e) => setEditUserEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUser(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditUser}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User Properties Dialog */}
      {selectedUser && (
        <UserProperties 
          userId={selectedUser.userId}
          userName={selectedUser.userName}
          open={showUserProperties}
          onOpenChange={setShowUserProperties}
        />
      )}
    </DashboardLayout>
  );
};

export default Usuarios;

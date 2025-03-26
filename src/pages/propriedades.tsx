
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Plus, Search, Building2, Edit, Trash, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

// Mock properties data
const MOCK_PROPERTIES = [
  {
    id: "1",
    slug: "vila-mariana-suites",
    name: "Vila Mariana Suites",
    propId: "P12345",
    address: "Vila Mariana, São Paulo, SP",
    description: "Apartamentos modernos próximos ao metrô Vila Mariana",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
    rooms: 5,
    status: "active",
    checkIn: "14:00",
    checkOut: "12:00",
  },
  {
    id: "2",
    slug: "copacabana-ocean-view",
    name: "Copacabana Ocean View",
    propId: "P12346",
    address: "Copacabana, Rio de Janeiro, RJ",
    description: "Apartamentos com vista para o mar em Copacabana",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
    rooms: 3,
    status: "active",
    checkIn: "15:00",
    checkOut: "11:00",
  },
  {
    id: "3",
    slug: "jardins-exclusive",
    name: "Jardins Exclusive",
    propId: "P12347",
    address: "Jardins, São Paulo, SP",
    description: "Apartamentos de luxo na região dos Jardins",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
    rooms: 2,
    status: "inactive",
    checkIn: "14:00",
    checkOut: "12:00",
  }
];

const Propriedades: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.propId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProperty = (id: string) => {
    setPropertyToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!propertyToDelete) return;
    
    setProperties(properties.filter(p => p.id !== propertyToDelete));
    setShowDeleteConfirm(false);
    setPropertyToDelete(null);
    toast.success("Propriedade excluída com sucesso!");
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Propriedades" 
        description="Gerencie suas propriedades e apartamentos"
      >
        <Link to="/propriedades/nova">
          <Button className="gap-1">
            <Plus size={16} />
            Nova Propriedade
          </Button>
        </Link>
      </PageHeader>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar por nome, endereço ou ID..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Nenhuma propriedade encontrada</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Tente alterar os termos da busca" : "Comece adicionando sua primeira propriedade"}
          </p>
          <Link to="/propriedades/nova">
            <Button>
              <Plus size={16} className="mr-2" />
              Adicionar Propriedade
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover-card">
              <AspectRatio ratio={16 / 9}>
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{property.name}</CardTitle>
                    <CardDescription className="mt-1">{property.address}</CardDescription>
                  </div>
                  <Badge variant={property.status === "active" ? "default" : "secondary"}>
                    {property.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID da Propriedade:</span>
                    <span className="font-medium">{property.propId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quartos:</span>
                    <span className="font-medium">{property.rooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in / Check-out:</span>
                    <span className="font-medium">{property.checkIn} - {property.checkOut}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Link to={`/propriedade/${property.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink size={14} />
                    Ver
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Link to={`/propriedades/editar/${property.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit size={14} />
                      Editar
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 text-red-500 hover:text-red-500"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    <Trash size={14} />
                    Excluir
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta propriedade? Esta ação não pode ser desfeita.
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
    </DashboardLayout>
  );
};

export default Propriedades;

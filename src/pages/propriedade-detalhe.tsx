
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, Link } from "react-router-dom";
import { Edit, ArrowLeft, MapPin, Clock, Bed, Phone, Building2, Home, Image, Calendar, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Mock property data (would typically come from an API)
const mockProperty = {
  id: "1",
  slug: "vila-mariana-suites",
  name: "Vila Mariana Suites",
  propId: "P12345",
  address: "Rua Domingos de Morais, 2187 - Vila Mariana, São Paulo, SP",
  description: "Apartamentos modernos próximos ao metrô Vila Mariana com fácil acesso às principais regiões de São Paulo. Unidades totalmente equipadas com cozinha completa, ar-condicionado e Wi-Fi de alta velocidade.",
  whatsapp: "+5511987654321",
  images: [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
  ],
  rooms: [
    {
      id: "r1",
      title: "Apartamento Superior",
      description: "Amplo apartamento com 1 quarto, cozinha americana e varanda",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
      price: 289,
      number: "101",
      bedType: "Cama de casal",
      bedCount: 1,
    },
    {
      id: "r2",
      title: "Studio Deluxe",
      description: "Studio moderno com cozinha compacta e área de trabalho",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
      price: 219,
      number: "102",
      bedType: "Cama de casal",
      bedCount: 1,
    },
    {
      id: "r3",
      title: "Apartamento Premium",
      description: "Apartamento de 2 quartos com sala espaçosa e cozinha completa",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
      price: 359,
      number: "201",
      bedType: "Cama queen",
      bedCount: 2,
    },
  ],
  status: "active",
  checkIn: "14:00",
  checkOut: "12:00",
};

// Mock pricing rules data
const pricingRules = [
  { id: "1", type: "seasonal", name: "Alta Temporada - Verão", dates: "15/12/2023 - 15/02/2024", adjustment: "+30%" },
  { id: "2", type: "dynamic", name: "Final de Semana", days: "Sexta, Sábado", adjustment: "+20%" },
  { id: "3", type: "event", name: "Fórmula 1", dates: "01/11/2023 - 06/11/2023", adjustment: "+50%" },
];

const PropriedadeDetalhe: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // In a real app, fetch the property data based on the slug
  const property = mockProperty;
  
  if (!property) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Propriedade não encontrada</h3>
          <p className="text-muted-foreground mb-6">
            A propriedade que você está procurando não foi encontrada
          </p>
          <Link to="/propriedades">
            <Button>Voltar para Propriedades</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  const handleOpenWhatsApp = () => {
    window.open(`https://wa.me/${property.whatsapp.replace(/\D/g, '')}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to="/propriedades" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Voltar para propriedades
        </Link>
      </div>
      
      <PageHeader 
        title={property.name}
        description={property.address}
      >
        <div className="flex gap-3">
          <Button onClick={handleOpenWhatsApp} variant="outline" className="gap-1">
            <Phone size={16} />
            WhatsApp
          </Button>
          <Link to={`/propriedades/editar/${property.id}`}>
            <Button className="gap-1">
              <Edit size={16} />
              Editar
            </Button>
          </Link>
        </div>
      </PageHeader>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Informações Gerais</CardTitle>
                <Badge variant={property.status === "active" ? "default" : "secondary"}>
                  {property.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Detalhes da Propriedade</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Building2 size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <span className="block text-sm font-medium">ID da Propriedade</span>
                        <span className="block text-sm text-muted-foreground">{property.propId}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <MapPin size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <span className="block text-sm font-medium">Endereço</span>
                        <span className="block text-sm text-muted-foreground">{property.address}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Clock size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <span className="block text-sm font-medium">Check-in / Check-out</span>
                        <span className="block text-sm text-muted-foreground">{property.checkIn} - {property.checkOut}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Bed size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <span className="block text-sm font-medium">Quartos</span>
                        <span className="block text-sm text-muted-foreground">{property.rooms.length} unidades</span>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Descrição</h3>
                  <p className="text-sm">{property.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="quartos">
            <TabsList className="mb-6 grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="quartos">Quartos</TabsTrigger>
              <TabsTrigger value="precos">Preços</TabsTrigger>
              <TabsTrigger value="calendario">Calendário</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quartos" className="m-0">
              <div className="grid gap-6 md:grid-cols-2">
                {property.rooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden hover-card">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={room.image} 
                        alt={room.title}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {room.title}
                        {room.number && (
                          <Badge variant="outline">Nº {room.number}</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{room.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Preço padrão</h4>
                          <p className="text-xl font-bold">R$ {room.price}</p>
                          <p className="text-xs text-muted-foreground">por noite</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Camas</h4>
                          <p>{room.bedCount}x {room.bedType}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="border-dashed flex flex-col items-center justify-center p-6 hover-card">
                  <Home size={32} className="text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">Adicionar Quarto</h3>
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    Adicione um novo quarto ou unidade a esta propriedade
                  </p>
                  <Button variant="outline">Adicionar Quarto</Button>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="precos" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Regras de Preços</CardTitle>
                  <CardDescription>
                    Configure as regras de preços para temporadas, eventos e dias específicos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-3">
                      {pricingRules.map((rule) => (
                        <Card key={rule.id} className="p-4 hover-card">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{rule.name}</h4>
                            <Badge>{rule.adjustment}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {rule.type === "seasonal" || rule.type === "event" ? 
                              `Período: ${rule.dates}` : 
                              `Dias: ${rule.days}`
                            }
                          </p>
                          <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm">Editar</Button>
                          </div>
                        </Card>
                      ))}
                      
                      <Card className="border-dashed flex flex-col items-center justify-center p-6 hover-card">
                        <h3 className="text-lg font-medium mb-1">Nova Regra</h3>
                        <p className="text-sm text-muted-foreground text-center mb-3">
                          Adicione uma nova regra de preço
                        </p>
                        <Button variant="outline">Adicionar</Button>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendario" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Calendário de Reservas</CardTitle>
                  <CardDescription>
                    Visualize as reservas para esta propriedade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">Visualizar Calendário</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Acesse o calendário completo para visualizar reservas
                      </p>
                      <Link to="/calendario">
                        <Button>Ver Calendário</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image size={18} className="mr-2" />
                Galeria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-md border">
                  <img 
                    src={property.images[activeImageIndex]} 
                    alt={`${property.name} - Imagem ${activeImageIndex + 1}`}
                    className="object-cover w-full h-full transition-all"
                  />
                </AspectRatio>
                
                <div className="grid grid-cols-3 gap-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      className={`overflow-hidden rounded-md border transition-all ${
                        index === activeImageIndex ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <AspectRatio ratio={4 / 3}>
                        <img 
                          src={image} 
                          alt={`Thumbnail ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info size={18} className="mr-2" />
                Status API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Conexão API Beds24</h3>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-frontdesk-green mr-2"></div>
                    <span className="font-medium">Conectado</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Última sincronização</h3>
                  <p>Hoje às 15:42</p>
                </div>
                
                <Button variant="outline" className="w-full">
                  Sincronizar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropriedadeDetalhe;

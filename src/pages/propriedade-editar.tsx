import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyICal } from "@/components/property/property-ical";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Save, Upload, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Form schema
const propertyFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome da propriedade deve ter pelo menos 3 caracteres.",
  }),
  address: z.string().min(5, {
    message: "Endereço é obrigatório.",
  }),
  city: z.string().min(2, {
    message: "Cidade é obrigatória.",
  }),
  state: z.string().min(2, {
    message: "Estado é obrigatório.",
  }),
  zipCode: z.string().min(5, {
    message: "CEP é obrigatório.",
  }),
  propertyType: z.string({
    required_error: "Selecione um tipo de propriedade.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  template: z.string().optional(),
});

// Types based on the schema
type PropertyFormValues = z.infer<typeof propertyFormSchema>;

// Sample data for the property being edited
const mockProperty = {
  id: "property-1",
  name: "Vila Mariana Suites",
  address: "Rua Domingos de Morais, 2187",
  city: "São Paulo",
  state: "SP",
  zipCode: "04035-000",
  propertyType: "hotel",
  description: "Localizado no coração de Vila Mariana, um dos bairros mais charmosos de São Paulo, o Vila Mariana Suites oferece acomodações modernas e confortáveis para suas estadias na cidade.",
  template: "light",
  photos: [
    { id: "1", url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop" },
    { id: "2", url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1957&auto=format&fit=crop" },
    { id: "3", url: "https://images.unsplash.com/photo-1537726235470-8504e3beef77?q=80&w=2070&auto=format&fit=crop" },
    { id: "4", url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop" },
    { id: "5", url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop" },
    { id: "6", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop" },
  ],
  rooms: [
    { id: "room-1", name: "Studio Deluxe", number: "101", capacity: 2 },
    { id: "room-2", name: "Apartamento Premium", number: "102", capacity: 3 },
    { id: "room-3", name: "Suíte Master", number: "201", capacity: 2 },
  ],
  apiKeys: {
    booking: "bk_api_12345",
    airbnb: "ab_api_12345",
  }
};

const PropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState(mockProperty.photos);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  
  // Form
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: mockProperty.name,
      address: mockProperty.address,
      city: mockProperty.city,
      state: mockProperty.state,
      zipCode: mockProperty.zipCode,
      propertyType: mockProperty.propertyType,
      description: mockProperty.description,
      template: mockProperty.template,
    },
  });

  const onSubmit = (data: PropertyFormValues) => {
    toast.success("Propriedade atualizada com sucesso!");
    console.log(data);
  };

  // Drag and drop functionality for photos
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    if (draggingIndex === null || draggingIndex === index) return;
    
    // Reorder the photos array
    const newPhotos = [...photos];
    const draggedItem = newPhotos[draggingIndex];
    newPhotos.splice(draggingIndex, 1);
    newPhotos.splice(index, 0, draggedItem);
    
    setPhotos(newPhotos);
    setDraggingIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggingIndex(null);
  };

  const handleDeletePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    toast.success("Foto removida com sucesso!");
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Editar Propriedade" 
        description={`Editando: ${mockProperty.name}`}
      >
        <Button onClick={form.handleSubmit(onSubmit)}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </PageHeader>

      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="rooms">Quartos</TabsTrigger>
          <TabsTrigger value="photos">Fotos</TabsTrigger>
          <TabsTrigger value="api">API e Integrações</TabsTrigger>
          <TabsTrigger value="ical">iCal</TabsTrigger>
        </TabsList>
        
        {/* General Information */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Informações básicas sobre sua propriedade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da propriedade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Propriedade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de propriedade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hotel">Hotel</SelectItem>
                              <SelectItem value="pousada">Pousada</SelectItem>
                              <SelectItem value="hostel">Hostel</SelectItem>
                              <SelectItem value="apartamento">Apartamento</SelectItem>
                              <SelectItem value="casa">Casa</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Endereço completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="Estado" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="CEP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descrição da propriedade" 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Descreva sua propriedade com detalhes para os hóspedes.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template do Site</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Este template será usado na página pública da sua propriedade.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={form.handleSubmit(onSubmit)}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Rooms */}
        <TabsContent value="rooms">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Quartos</CardTitle>
                <CardDescription>
                  Gerenciar os quartos da sua propriedade.
                </CardDescription>
              </div>
              <Button>Adicionar Quarto</Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Número</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Capacidade</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {mockProperty.rooms.map((room) => (
                        <tr key={room.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">{room.name}</td>
                          <td className="p-4 align-middle">{room.number}</td>
                          <td className="p-4 align-middle">{room.capacity} pessoas</td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Editar</Button>
                              <Button variant="destructive" size="sm">Remover</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Photos */}
        <TabsContent value="photos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fotos</CardTitle>
                <CardDescription>
                  Gerenciar as fotos da sua propriedade. Arraste para reordenar.
                </CardDescription>
              </div>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Adicionar Fotos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative border rounded-md overflow-hidden cursor-move transition-all"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                        Principal
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDeletePhoto(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <img 
                      src={photo.url} 
                      alt={`Foto ${index + 1}`} 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* API and Integrations */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API e Integrações</CardTitle>
              <CardDescription>
                Gerenciar integrações com outros serviços.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">APIs de Canais</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="booking-api">Booking.com API Key</Label>
                      <Input 
                        id="booking-api" 
                        value={mockProperty.apiKeys.booking} 
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="airbnb-api">Airbnb API Key</Label>
                      <Input 
                        id="airbnb-api" 
                        value={mockProperty.apiKeys.airbnb} 
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Integrações</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Integração com Google</CardTitle>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button>Conectar</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-muted/30">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Stripe (Pagamentos)</CardTitle>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button>Conectar</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* iCal */}
        <TabsContent value="ical">
          <PropertyICal propertyId={mockProperty.id} propertyName={mockProperty.name} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PropertyEdit;

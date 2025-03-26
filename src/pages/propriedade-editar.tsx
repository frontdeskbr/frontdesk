
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiTokenInput } from "@/components/ui/api-token-input";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Building2, Clock, Image, MapPin, Trash2, Upload, Plus } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Mock property data (would typically come from an API)
const mockProperty = {
  id: "1",
  slug: "vila-mariana-suites",
  name: "Vila Mariana Suites",
  propId: "P12345",
  address: "Rua Domingos de Morais, 2187 - Vila Mariana, São Paulo, SP",
  description: "Apartamentos modernos próximos ao metrô Vila Mariana com fácil acesso às principais regiões de São Paulo. Unidades totalmente equipadas com cozinha completa, ar-condicionado e Wi-Fi de alta velocidade.",
  whatsapp: "+5511987654321",
  apiToken: "abcdef123456",
  images: [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80",
  ],
  checkIn: "14:00",
  checkOut: "12:00",
  status: "active",
  template: "light",
};

const propertyFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  propId: z.string().min(1, "ID da propriedade é obrigatório"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  description: z.string().optional(),
  whatsapp: z.string().min(10, "WhatsApp deve ter pelo menos 10 dígitos"),
  checkIn: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido (HH:MM)"),
  checkOut: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido (HH:MM)"),
  template: z.enum(["light", "dark"]),
  status: z.enum(["active", "inactive"]),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const PropriedadeEditar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>(mockProperty.images);
  const [apiToken, setApiToken] = useState<string>(mockProperty.apiToken || "");
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: mockProperty.name,
      propId: mockProperty.propId,
      address: mockProperty.address,
      description: mockProperty.description,
      whatsapp: mockProperty.whatsapp,
      checkIn: mockProperty.checkIn,
      checkOut: mockProperty.checkOut,
      template: mockProperty.template as "light" | "dark",
      status: mockProperty.status as "active" | "inactive",
    },
  });
  
  const onSubmit = (data: PropertyFormValues) => {
    // In a real app, you would save the data to your backend
    console.log({ ...data, images, apiToken });
    toast.success("Propriedade atualizada com sucesso!");
    navigate(`/propriedade/${mockProperty.slug}`);
  };
  
  const handleApiTokenSave = (token: string) => {
    setApiToken(token);
    toast.success("Token API salvo com sucesso!");
  };
  
  const handleImageUpload = () => {
    // Mock image upload
    const newImage = "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80";
    setImages([...images, newImage]);
    toast.success("Imagem adicionada com sucesso!");
  };
  
  const handleImageDelete = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    toast.success("Imagem removida com sucesso!");
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to={`/propriedade/${mockProperty.slug}`} className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Voltar para detalhes da propriedade
        </Link>
      </div>
      
      <PageHeader 
        title="Editar Propriedade"
        description={mockProperty.name}
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
              <TabsTrigger value="api">API e Integrações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 size={18} />
                      Informações Básicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Propriedade</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID da Propriedade</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            ID único para identificação no sistema Beds24
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="active">Ativo</option>
                              <option value="inactive">Inativo</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4} 
                              placeholder="Descreva sua propriedade..." 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin size={18} />
                        Localização e Contato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço Completo</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={3} 
                                placeholder="Rua, número, bairro, cidade, estado, CEP..." 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="+5500000000000" 
                              />
                            </FormControl>
                            <FormDescription>
                              Número com código do país (ex: +55 para Brasil)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock size={18} />
                        Horários
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="checkIn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Check-in</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="14:00" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="checkOut"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Check-out</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="12:00" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Aparência do Site</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div
                            className={`border-2 rounded-md overflow-hidden cursor-pointer transition-all ${
                              field.value === "light" ? "border-primary ring-2 ring-primary ring-opacity-50" : "border-border hover:border-muted-foreground"
                            }`}
                            onClick={() => form.setValue("template", "light")}
                          >
                            <div className="bg-white p-4">
                              <h3 className="font-semibold text-black mb-1">Template Claro</h3>
                              <p className="text-gray-600 text-sm">Design limpo com tema claro</p>
                            </div>
                            <div className="h-40 bg-gray-100 flex items-center justify-center border-t">
                              <div className="text-center">
                                <Image className="h-10 w-10 mb-2 text-gray-400 mx-auto" />
                                <p className="text-sm text-gray-500">Prévia do tema claro</p>
                              </div>
                            </div>
                          </div>
                          
                          <div
                            className={`border-2 rounded-md overflow-hidden cursor-pointer transition-all ${
                              field.value === "dark" ? "border-primary ring-2 ring-primary ring-opacity-50" : "border-border hover:border-muted-foreground"
                            }`}
                            onClick={() => form.setValue("template", "dark")}
                          >
                            <div className="bg-slate-900 p-4">
                              <h3 className="font-semibold text-white mb-1">Template Escuro</h3>
                              <p className="text-slate-400 text-sm">Design premium com tema escuro</p>
                            </div>
                            <div className="h-40 bg-slate-800 flex items-center justify-center border-t border-slate-700">
                              <div className="text-center">
                                <Image className="h-10 w-10 mb-2 text-slate-400 mx-auto" />
                                <p className="text-sm text-slate-400">Prévia do tema escuro</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Label>Prévia</Label>
                    <div className="border rounded-md mt-2 overflow-hidden">
                      <div className={`p-4 ${form.watch("template") === "dark" ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
                        <h3 className="text-xl font-semibold">{form.watch("name")}</h3>
                        <p className={`${form.watch("template") === "dark" ? "text-slate-400" : "text-gray-500"}`}>{form.watch("address")}</p>
                      </div>
                      {images.length > 0 && (
                        <div className={`${form.watch("template") === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
                          <AspectRatio ratio={16 / 9}>
                            <img 
                              src={images[0]} 
                              alt="Preview" 
                              className="object-cover w-full h-full"
                            />
                          </AspectRatio>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image size={18} />
                    Galeria de Imagens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Imagens da Propriedade</h3>
                        <p className="text-sm text-muted-foreground">
                          A primeira imagem será usada como capa
                        </p>
                      </div>
                      <Button onClick={handleImageUpload} className="gap-1">
                        <Upload size={16} />
                        Adicionar Imagem
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group rounded-md overflow-hidden border">
                          <AspectRatio ratio={4 / 3}>
                            <img
                              src={image}
                              alt={`Imagem ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </AspectRatio>
                          
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                              Imagem de Capa
                            </div>
                          )}
                          
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleImageDelete(index)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        className="h-full min-h-[200px] border-dashed flex flex-col items-center justify-center"
                        onClick={handleImageUpload}
                      >
                        <Plus size={24} className="mb-2" />
                        <span>Adicionar imagem</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>Integrações API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Token API Beds24</Label>
                    <div className="mt-2">
                      <ApiTokenInput
                        onSave={handleApiTokenSave}
                        savedToken={apiToken}
                      />
                    </div>
                    {apiToken && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Token conectado! Sua propriedade está sincronizada com Beds24.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Status de Sincronização</Label>
                    <div className="mt-2 p-4 bg-primary/5 rounded-md">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-frontdesk-green mr-2"></div>
                        <span className="font-medium">Conectado</span>
                        {apiToken && (
                          <span className="ml-auto text-sm text-muted-foreground">
                            Última sincronização: Hoje às 15:42
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/propriedade/${mockProperty.slug}`)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </DashboardLayout>
  );
};

export default PropriedadeEditar;

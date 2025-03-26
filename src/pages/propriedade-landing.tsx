
import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight, MapPin, Phone, Star, Menu, X, Check, Plus, ArrowRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/context/theme-context";

// Mock data for the property landing page
const mockProperty = {
  id: "1",
  slug: "vila-mariana-suites",
  name: "Vila Mariana Suites",
  logoUrl: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64",
  address: "Rua Domingos de Morais, 2187 - Vila Mariana, São Paulo, SP",
  description: "Apartamentos modernos próximos ao metrô Vila Mariana com fácil acesso às principais regiões de São Paulo. Unidades totalmente equipadas com cozinha completa, ar-condicionado e Wi-Fi de alta velocidade.",
  whatsapp: "+5511987654321",
  checkIn: "14:00",
  checkOut: "12:00",
  rating: 4.8,
  reviewCount: 156,
  mainFeatures: [
    "Wi-Fi Grátis",
    "Ar-condicionado",
    "Cozinha completa",
    "Smart TV",
    "Roupa de cama e toalhas",
    "Cofre digital"
  ],
  location: {
    lat: -23.588,
    lng: -46.634,
    description: "Localizado na Vila Mariana, um dos melhores bairros de São Paulo, a poucos passos da estação de metrô. Região segura, arborizada e repleta de restaurantes, bares, cafés e comércio.",
    nearby: [
      { name: "Metrô Vila Mariana", distance: "300m" },
      { name: "Parque Ibirapuera", distance: "1.2km" },
      { name: "MASP", distance: "3.5km" },
      { name: "Avenida Paulista", distance: "2.8km" }
    ]
  },
  images: [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800&q=80",
  ],
  rooms: [
    {
      id: "r1",
      title: "Apartamento Superior",
      description: "Amplo apartamento com 1 quarto, cozinha americana e varanda",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800&q=80",
      price: 289,
      regularPrice: 340,
      maxGuests: 2,
      bedCount: 1,
      bedType: "Cama de casal queen",
      size: "32m²",
      amenities: ["Varanda", "Cozinha equipada", "Smart TV 50\"", "Ar-condicionado", "Secador de cabelo", "Ferro de passar"]
    },
    {
      id: "r2",
      title: "Studio Deluxe",
      description: "Studio moderno com cozinha compacta e área de trabalho",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800&q=80",
      price: 219,
      regularPrice: 260,
      maxGuests: 2,
      bedCount: 1,
      bedType: "Cama de casal",
      size: "25m²",
      amenities: ["Mesa de trabalho", "Cozinha compacta", "Smart TV 43\"", "Ar-condicionado", "Secador de cabelo"]
    },
    {
      id: "r3",
      title: "Apartamento Premium",
      description: "Apartamento de 2 quartos com sala espaçosa e cozinha completa",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800&q=80",
      price: 359,
      regularPrice: 400,
      maxGuests: 4,
      bedCount: 2,
      bedType: "1 cama queen e 2 camas de solteiro",
      size: "45m²",
      amenities: ["2 quartos", "Sala de estar", "Cozinha completa", "Smart TV 55\"", "Ar-condicionado", "Máquina de lavar"]
    }
  ],
  reviews: [
    { id: "rev1", author: "Ricardo M.", rating: 5, comment: "Excelente localização e apartamento muito confortável. Recomendo!" },
    { id: "rev2", author: "Ana C.", rating: 5, comment: "Tudo perfeito! Limpeza impecável e ótimo atendimento." },
    { id: "rev3", author: "Paulo S.", rating: 4, comment: "Boa relação custo-benefício. Localização muito boa." }
  ],
  faqs: [
    { question: "É necessário pagar antecipadamente?", answer: "Sim, é necessário o pagamento antecipado para confirmar a reserva." },
    { question: "Aceitam animais de estimação?", answer: "Infelizmente não aceitamos animais de estimação." },
    { question: "Oferecem serviço de translado?", answer: "Não oferecemos serviço de translado, mas podemos recomendar serviços confiáveis de táxi ou transfer." }
  ],
  policies: {
    cancellation: "Cancelamento grátis até 7 dias antes do check-in. Após este período, será cobrada uma taxa de 50% do valor total da reserva.",
    rules: "Não é permitido festas ou eventos. Proibido fumar em todo o estabelecimento. Horário de silêncio: das 22h às 8h."
  },
  template: "light" // or "dark"
};

// Form schema for booking
const bookingFormSchema = z.object({
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.number().min(1).max(10),
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido")
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const LightTemplate: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // In a real app, fetch the property data based on the slug
  const property = mockProperty;
  
  // Get one week from today for default checkout date
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      checkIn: today,
      checkOut: nextWeek,
      guests: 2,
      name: "",
      email: "",
      phone: ""
    }
  });
  
  // Calculate total price when selected rooms change
  useEffect(() => {
    let total = 0;
    selectedRooms.forEach(roomId => {
      const room = property.rooms.find(r => r.id === roomId);
      if (room) {
        total += room.price;
      }
    });
    setTotalPrice(total);
  }, [selectedRooms, property.rooms]);

  const handleRoomSelection = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(id => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
      setShowBookingForm(true);
      
      // Scroll to booking section
      setTimeout(() => {
        bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  
  const toggleRoomDetails = (roomId: string) => {
    // In a real app, you would toggle room details visibility
    console.log(`Toggle details for room ${roomId}`);
  };
  
  const onSubmit = (data: BookingFormValues) => {
    // In a real app, you would handle the booking submission here
    console.log("Booking data:", data);
    console.log("Selected rooms:", selectedRooms);
    
    if (bookingStep === 1) {
      setBookingStep(2);
    } else {
      // Submit the booking
      toast.success("Reserva enviada com sucesso! Entraremos em contato para confirmar.");
      setBookingStep(1);
      setSelectedRooms([]);
      setShowBookingForm(false);
      form.reset();
    }
  };
  
  const handleContactWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Estou interessado no ${property.name}. Gostaria de mais informações.`);
    window.open(`https://wa.me/${property.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };
  
  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Propriedade não encontrada</h1>
          <p className="mb-6">A propriedade que você está procurando não foi encontrada.</p>
          <Link to="/">
            <Button>Voltar para a página inicial</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={property.logoUrl} 
              alt={property.name} 
              className="w-8 h-8"
            />
            <span className="font-semibold text-lg">{property.name}</span>
          </Link>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#rooms" className="text-sm font-medium hover:text-primary">Quartos</a>
            <a href="#location" className="text-sm font-medium hover:text-primary">Localização</a>
            <a href="#reviews" className="text-sm font-medium hover:text-primary">Avaliações</a>
            <a href="#policies" className="text-sm font-medium hover:text-primary">Políticas</a>
            <Button onClick={handleContactWhatsApp} className="gap-1">
              <Phone size={16} />
              Contato
            </Button>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isNavOpen && (
          <div className="md:hidden bg-white border-t py-4 px-6 shadow-lg">
            <div className="flex flex-col space-y-4">
              <a 
                href="#rooms" 
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsNavOpen(false)}
              >
                Quartos
              </a>
              <a 
                href="#location" 
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsNavOpen(false)}
              >
                Localização
              </a>
              <a 
                href="#reviews" 
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsNavOpen(false)}
              >
                Avaliações
              </a>
              <a 
                href="#policies" 
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsNavOpen(false)}
              >
                Políticas
              </a>
              <Button onClick={handleContactWhatsApp} className="gap-1 w-full">
                <Phone size={16} />
                Contato via WhatsApp
              </Button>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero section with gallery */}
      <section className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <div className="flex items-center flex-wrap gap-y-2">
            <div className="flex items-center mr-4">
              <MapPin size={16} className="mr-1 text-primary" />
              <span className="text-sm">{property.address}</span>
            </div>
            
            <div className="flex items-center">
              <Star size={16} className="mr-1 text-amber-500" />
              <span className="font-medium mr-1">{property.rating}</span>
              <span className="text-sm text-slate-500">
                ({property.reviewCount} avaliações)
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 rounded-lg overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={property.images[activeImageIndex]} 
                alt={`${property.name} - Imagem principal`}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {property.images.slice(1, 5).map((image, index) => (
              <div key={index} className={`relative rounded-lg overflow-hidden ${index >= 2 ? 'hidden sm:block' : ''}`}>
                <AspectRatio ratio={4 / 3}>
                  <img
                    src={image}
                    alt={`${property.name} - Imagem ${index + 2}`}
                    className="object-cover w-full h-full"
                    onClick={() => setActiveImageIndex(index + 1)}
                  />
                </AspectRatio>
                {index === 3 && property.images.length > 5 && (
                  <div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                    onClick={() => {/* Open full gallery */}}
                  >
                    <span className="text-white font-medium">
                      +{property.images.length - 5} fotos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Image thumbnails for mobile */}
        <div className="flex mt-3 gap-2 overflow-x-auto pb-2 lg:hidden">
          {property.images.map((image, index) => (
            <div 
              key={index}
              className={`flex-none w-20 h-20 rounded overflow-hidden border-2 ${
                index === activeImageIndex ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setActiveImageIndex(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </section>
      
      {/* Property info section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sobre a Propriedade</h2>
              <p className="text-slate-700">{property.description}</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Destaques</h3>
                <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {property.mainFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check size={16} className="mr-2 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Horários</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded">
                    <span className="block text-sm text-slate-500">Check-in</span>
                    <span className="font-medium">{property.checkIn}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded">
                    <span className="block text-sm text-slate-500">Check-out</span>
                    <span className="font-medium">{property.checkOut}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div ref={bookingSectionRef}>
            {showBookingForm ? (
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {bookingStep === 1 ? "Sua Reserva" : "Informações de Contato"}
                  </h3>
                  
                  {bookingStep === 1 && (
                    <div className="space-y-4">
                      <form>
                        <div className="space-y-4 mb-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="checkIn">Check-in</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(form.watch("checkIn"), "PPP", { locale: ptBR })}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={form.watch("checkIn")}
                                    onSelect={(date) => date && form.setValue("checkIn", date)}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="checkOut">Check-out</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(form.watch("checkOut"), "PPP", { locale: ptBR })}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={form.watch("checkOut")}
                                    onSelect={(date) => date && form.setValue("checkOut", date)}
                                    disabled={(date) => date <= form.watch("checkIn")}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="guests">Número de hóspedes</Label>
                            <Input
                              id="guests"
                              type="number"
                              min={1}
                              max={10}
                              {...form.register("guests", { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                        
                        <h4 className="font-medium mb-3">Quartos selecionados</h4>
                        
                        {selectedRooms.length > 0 ? (
                          <div className="space-y-3 mb-6">
                            {selectedRooms.map(roomId => {
                              const room = property.rooms.find(r => r.id === roomId);
                              return room ? (
                                <div key={roomId} className="flex justify-between items-center border-b pb-3">
                                  <div>
                                    <p className="font-medium">{room.title}</p>
                                    <p className="text-sm text-slate-500">{room.maxGuests} hóspedes máx.</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">R$ {room.price}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive h-auto p-0"
                                      onClick={() => handleRoomSelection(roomId)}
                                    >
                                      Remover
                                    </Button>
                                  </div>
                                </div>
                              ) : null;
                            })}
                            
                            <div className="flex justify-between items-center pt-2">
                              <span className="font-medium">Total</span>
                              <span className="font-bold text-xl">R$ {totalPrice}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 mb-4 bg-slate-50 rounded">
                            <p className="text-slate-500">Nenhum quarto selecionado</p>
                            <p className="text-sm">Selecione pelo menos um quarto abaixo</p>
                          </div>
                        )}
                        
                        <Button
                          className="w-full"
                          disabled={selectedRooms.length === 0}
                          onClick={() => setBookingStep(2)}
                        >
                          Continuar
                        </Button>
                      </form>
                    </div>
                  )}
                  
                  {bookingStep === 2 && (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input
                            id="name"
                            {...form.register("name")}
                            placeholder="Seu nome completo"
                          />
                          {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            {...form.register("email")}
                            placeholder="seu.email@exemplo.com"
                          />
                          {form.formState.errors.email && (
                            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            {...form.register("phone")}
                            placeholder="(00) 00000-0000"
                          />
                          {form.formState.errors.phone && (
                            <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded mb-4">
                        <div className="flex justify-between mb-1">
                          <span>Check-in / Check-out</span>
                          <span>
                            {format(form.watch("checkIn"), "dd/MM/yyyy")} - {format(form.watch("checkOut"), "dd/MM/yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Hóspedes</span>
                          <span>{form.watch("guests")}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2 mt-2">
                          <span>Total</span>
                          <span>R$ {totalPrice}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setBookingStep(1)}
                        >
                          Voltar
                        </Button>
                        <Button type="submit" className="flex-1">
                          Finalizar Reserva
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-primary/5 border-0">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Fazer uma Reserva</h3>
                  <p className="mb-6">Selecione um quarto abaixo para iniciar sua reserva</p>
                  
                  <Button
                    className="w-full" 
                    onClick={handleContactWhatsApp}
                  >
                    <Phone size={16} className="mr-2" />
                    Contato via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
      
      {/* Rooms section */}
      <section id="rooms" className="container mx-auto px-4 py-12 border-t">
        <h2 className="text-2xl font-semibold mb-8">Quartos Disponíveis</h2>
        
        <div className="space-y-8">
          {property.rooms.map((room) => (
            <div key={room.id} className="bg-white border rounded-lg overflow-hidden">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <AspectRatio ratio={4 / 3}>
                    <img
                      src={room.image}
                      alt={room.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                
                <div className="p-6 md:p-4 md:col-span-2">
                  <div className="md:flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                      <p className="text-slate-600 mb-3">{room.description}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:text-right">
                      {room.regularPrice > room.price && (
                        <div className="inline-block bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium mb-1">
                          Oferta Especial
                        </div>
                      )}
                      <div className="flex items-baseline md:justify-end">
                        {room.regularPrice > room.price && (
                          <span className="text-slate-400 text-sm line-through mr-2">
                            R$ {room.regularPrice}
                          </span>
                        )}
                        <span className="text-2xl font-bold">R$ {room.price}</span>
                      </div>
                      <p className="text-xs text-slate-500">por noite</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Badge variant="outline">
                      {room.maxGuests} hóspedes
                    </Badge>
                    <Badge variant="outline">
                      {room.bedType}
                    </Badge>
                    <Badge variant="outline">
                      {room.size}
                    </Badge>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="text-sm bg-slate-100 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <button
                          onClick={() => toggleRoomDetails(room.id)}
                          className="text-sm text-primary hover:underline"
                        >
                          +{room.amenities.length - 3} mais
                        </button>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => toggleRoomDetails(room.id)}
                      >
                        Ver Detalhes
                      </Button>
                      
                      <Button
                        onClick={() => handleRoomSelection(room.id)}
                        className={cn({
                          "bg-green-600 hover:bg-green-700": selectedRooms.includes(room.id)
                        })}
                      >
                        {selectedRooms.includes(room.id) ? (
                          <>
                            <Check size={16} className="mr-2" />
                            Selecionado
                          </>
                        ) : (
                          "Selecionar"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Location section */}
      <section id="location" className="container mx-auto px-4 py-12 border-t">
        <h2 className="text-2xl font-semibold mb-6">Localização</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-slate-700 mb-4">{property.location.description}</p>
            
            <h3 className="text-lg font-medium mb-3">Locais Próximos</h3>
            <ul className="space-y-2">
              {property.location.nearby.map((place, index) => (
                <li key={index} className="flex items-center">
                  <MapPin size={16} className="mr-2 text-primary" />
                  <span className="font-medium">{place.name}</span>
                  <span className="ml-2 text-sm text-slate-500">({place.distance})</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-100 rounded-lg h-[300px] flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="mx-auto mb-3 text-primary" />
              <h3 className="font-medium mb-1">Ver no mapa</h3>
              <p className="text-sm text-slate-500 mb-4">Clique para ver a localização exata</p>
              <Button>Abrir Mapa</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Reviews section */}
      <section id="reviews" className="container mx-auto px-4 py-12 border-t">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Avaliações</h2>
          <div className="flex items-center">
            <Star size={20} className="text-amber-500 mr-2" />
            <span className="font-bold text-lg">{property.rating}</span>
            <span className="text-slate-500 ml-1">({property.reviewCount})</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {property.reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between mb-3">
                <h3 className="font-medium">{review.author}</h3>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "text-amber-500" : "text-slate-200"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* FAQs and Policies section */}
      <section id="policies" className="container mx-auto px-4 py-12 border-t">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {property.faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Políticas</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Política de Cancelamento</h3>
              <p className="text-slate-600">{property.policies.cancellation}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Regras da Casa</h3>
              <p className="text-slate-600">{property.policies.rules}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={property.logoUrl} 
                  alt={property.name} 
                  className="w-8 h-8"
                />
                <span className="font-semibold text-lg">{property.name}</span>
              </div>
              <p className="text-slate-300 mb-4">{property.description.slice(0, 120)}...</p>
              <Button
                onClick={handleContactWhatsApp}
                className="gap-1"
              >
                <Phone size={16} />
                Contato via WhatsApp
              </Button>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#rooms" className="text-slate-300 hover:text-white">Quartos</a>
                </li>
                <li>
                  <a href="#location" className="text-slate-300 hover:text-white">Localização</a>
                </li>
                <li>
                  <a href="#reviews" className="text-slate-300 hover:text-white">Avaliações</a>
                </li>
                <li>
                  <a href="#policies" className="text-slate-300 hover:text-white">Políticas</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Informações de Contato</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 text-primary" />
                  <span className="text-slate-300">{property.address}</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-2 text-primary" />
                  <span className="text-slate-300">{property.whatsapp}</span>
                </li>
              </ul>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Horários</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-2 rounded">
                    <span className="block text-xs text-slate-400">Check-in</span>
                    <span>{property.checkIn}</span>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <span className="block text-xs text-slate-400">Check-out</span>
                    <span>{property.checkOut}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} {property.name}. Todos os direitos reservados.</p>
            <p className="mt-1">Desenvolvido por Frontdesk</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const DarkTemplate: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // In a real app, fetch the property data based on the slug
  const property = mockProperty;
  
  // Get one week from today for default checkout date
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      checkIn: today,
      checkOut: nextWeek,
      guests: 2,
      name: "",
      email: "",
      phone: ""
    }
  });
  
  // Calculate total price when selected rooms change
  useEffect(() => {
    let total = 0;
    selectedRooms.forEach(roomId => {
      const room = property.rooms.find(r => r.id === roomId);
      if (room) {
        total += room.price;
      }
    });
    setTotalPrice(total);
  }, [selectedRooms, property.rooms]);

  const handleRoomSelection = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(id => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
      setShowBookingForm(true);
      
      // Scroll to booking section
      setTimeout(() => {
        bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  
  const toggleRoomDetails = (roomId: string) => {
    // In a real app, you would toggle room details visibility
    console.log(`Toggle details for room ${roomId}`);
  };
  
  const onSubmit = (data: BookingFormValues) => {
    // In a real app, you would handle the booking submission here
    console.log("Booking data:", data);
    console.log("Selected rooms:", selectedRooms);
    
    if (bookingStep === 1) {
      setBookingStep(2);
    } else {
      // Submit the booking
      toast.success("Reserva enviada com sucesso! Entraremos em contato para confirmar.");
      setBookingStep(1);
      setSelectedRooms([]);
      setShowBookingForm(false);
      form.reset();
    }
  };
  
  const handleContactWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Estou interessado no ${property.name}. Gostaria de mais informações.`);
    window.open(`https://wa.me/${property.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };
  
  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Propriedade não encontrada</h1>
          <p className="mb-6">A propriedade que você está procurando não foi encontrada.</p>
          <Link to="/">
            <Button>Voltar para a página inicial</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={property.logoUrl} 
              alt={property.name} 
              className="w-8 h-8"
            />
            <span className="font-semibold text-lg">{property.name}</span>
          </Link>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#rooms" className="text-sm font-medium text-slate-300 hover:text-white">Quartos</a>
            <a href="#location" className="text-sm font-medium text-slate-300 hover:text-white">Localização</a>
            <a href="#reviews" className="text-sm font-medium text-slate-300 hover:text-white">Avaliações</a>
            <a href="#policies" className="text-sm font-medium text-slate-300 hover:text-white">Políticas</a>
            <Button onClick={handleContactWhatsApp} className="gap-1">
              <Phone size={16} />
              Contato
            </Button>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isNavOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 py-4 px-6">
            <div className="flex flex-col space-y-4">
              <a 
                href="#rooms" 
                className="text-sm font-medium text-slate-300 hover:text-white"
                onClick={() => setIsNavOpen(false)}
              >
                Quartos
              </a>
              <a 
                href="#location" 
                className="text-sm font-medium text-slate-300 hover:text-white"
                onClick={() => setIsNavOpen(false)}
              >
                Localização
              </a>
              <a 
                href="#reviews" 
                className="text-sm font-medium text-slate-300 hover:text-white"
                onClick={() => setIsNavOpen(false)}
              >
                Avaliações
              </a>
              <a 
                href="#policies" 
                className="text-sm font-medium text-slate-300 hover:text-white"
                onClick={() => setIsNavOpen(false)}
              >
                Políticas
              </a>
              <Button onClick={handleContactWhatsApp} className="gap-1 w-full">
                <Phone size={16} />
                Contato via WhatsApp
              </Button>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero section with gallery */}
      <section className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <div className="flex items-center flex-wrap gap-y-2">
            <div className="flex items-center mr-4">
              <MapPin size={16} className="mr-1 text-primary" />
              <span className="text-sm text-slate-400">{property.address}</span>
            </div>
            
            <div className="flex items-center">
              <Star size={16} className="mr-1 text-amber-500" />
              <span className="font-medium mr-1">{property.rating}</span>
              <span className="text-sm text-slate-400">
                ({property.reviewCount} avaliações)
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 rounded-lg overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={property.images[activeImageIndex]} 
                alt={`${property.name} - Imagem principal`}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {property.images.slice(1, 5).map((image, index) => (
              <div key={index} className={`relative rounded-lg overflow-hidden ${index >= 2 ? 'hidden sm:block' : ''}`}>
                <AspectRatio ratio={4 / 3}>
                  <img
                    src={image}
                    alt={`${property.name} - Imagem ${index + 2}`}
                    className="object-cover w-full h-full"
                    onClick={() => setActiveImageIndex(index + 1)}
                  />
                </AspectRatio>
                {index === 3 && property.images.length > 5 && (
                  <div 
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                    onClick={() => {/* Open full gallery */}}
                  >
                    <span className="text-white font-medium">
                      +{property.images.length - 5} fotos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Image thumbnails for mobile */}
        <div className="flex mt-3 gap-2 overflow-x-auto pb-2 lg:hidden">
          {property.images.map((image, index) => (
            <div 
              key={index}
              className={`flex-none w-20 h-20 rounded overflow-hidden border-2 ${
                index === activeImageIndex ? 'border-primary' : 'border-slate-800'
              }`}
              onClick={() => setActiveImageIndex(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </section>
      
      {/* Property info section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose prose-invert max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sobre a Propriedade</h2>
              <p className="text-slate-300">{property.description}</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Destaques</h3>
                <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {property.mainFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check size={16} className="mr-2 text-primary" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Horários</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-3 rounded">
                    <span className="block text-sm text-slate-400">Check-in</span>
                    <span className="font-medium">{property.checkIn}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded">
                    <span className="block text-sm text-slate-400">Check-out</span>
                    <span className="font-medium">{property.checkOut}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div ref={bookingSectionRef}>
            {showBookingForm ? (
              <Card className="bg-slate-900 border-slate-800 sticky top-24">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {bookingStep === 1 ? "Sua Reserva" : "Informações de Contato"}
                  </h3>
                  
                  {bookingStep === 1 && (
                    <div className="space-y-4">
                      <form>
                        <div className="space-y-4 mb-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="checkIn">Check-in</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal bg-slate-800 border-slate-700"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(form.watch("checkIn"), "PPP", { locale: ptBR })}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={form.watch("checkIn")}
                                    onSelect={(date) => date && form.setValue("checkIn", date)}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                    className="bg-slate-950 text-white"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="checkOut">Check-out</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal bg-slate-800 border-slate-700"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(form.watch("checkOut"), "PPP", { locale: ptBR })}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={form.watch("checkOut")}
                                    onSelect={(date) => date && form.setValue("checkOut", date)}
                                    disabled={(date) => date <= form.watch("checkIn")}
                                    initialFocus
                                    className="bg-slate-950 text-white"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="guests">Número de hóspedes</Label>
                            <Input
                              id="guests"
                              type="number"
                              min={1}
                              max={10}
                              className="bg-slate-800 border-slate-700"
                              {...form.register("guests", { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                        
                        <h4 className="font-medium mb-3">Quartos selecionados</h4>
                        
                        {selectedRooms.length > 0 ? (
                          <div className="space-y-3 mb-6">
                            {selectedRooms.map(roomId => {
                              const room = property.rooms.find(r => r.id === roomId);
                              return room ? (
                                <div key={roomId} className="flex justify-between items-center border-b border-slate-800 pb-3">
                                  <div>
                                    <p className="font-medium">{room.title}</p>
                                    <p className="text-sm text-slate-400">{room.maxGuests} hóspedes máx.</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">R$ {room.price}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-400 h-auto p-0"
                                      onClick={() => handleRoomSelection(roomId)}
                                    >
                                      Remover
                                    </Button>
                                  </div>
                                </div>
                              ) : null;
                            })}
                            
                            <div className="flex justify-between items-center pt-2">
                              <span className="font-medium">Total</span>
                              <span className="font-bold text-xl">R$ {totalPrice}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 mb-4 bg-slate-800 rounded">
                            <p className="text-slate-400">Nenhum quarto selecionado</p>
                            <p className="text-sm">Selecione pelo menos um quarto abaixo</p>
                          </div>
                        )}
                        
                        <Button
                          className="w-full"
                          disabled={selectedRooms.length === 0}
                          onClick={() => setBookingStep(2)}
                        >
                          Continuar
                        </Button>
                      </form>
                    </div>
                  )}
                  
                  {bookingStep === 2 && (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input
                            id="name"
                            className="bg-slate-800 border-slate-700"
                            {...form.register("name")}
                            placeholder="Seu nome completo"
                          />
                          {form.formState.errors.name && (
                            <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            className="bg-slate-800 border-slate-700"
                            {...form.register("email")}
                            placeholder="seu.email@exemplo.com"
                          />
                          {form.formState.errors.email && (
                            <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            className="bg-slate-800 border-slate-700"
                            {...form.register("phone")}
                            placeholder="(00) 00000-0000"
                          />
                          {form.formState.errors.phone && (
                            <p className="text-sm text-red-400">{form.formState.errors.phone.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-slate-800 p-3 rounded mb-4">
                        <div className="flex justify-between mb-1">
                          <span>Check-in / Check-out</span>
                          <span>
                            {format(form.watch("checkIn"), "dd/MM/yyyy")} - {format(form.watch("checkOut"), "dd/MM/yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Hóspedes</span>
                          <span>{form.watch("guests")}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-slate-700 pt-2 mt-2">
                          <span>Total</span>
                          <span>R$ {totalPrice}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setBookingStep(1)}
                        >
                          Voltar
                        </Button>
                        <Button type="submit" className="flex-1">
                          Finalizar Reserva
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Fazer uma Reserva</h3>
                  <p className="mb-6 text-slate-300">Selecione um quarto abaixo para iniciar sua reserva</p>
                  
                  <Button
                    className="w-full" 
                    onClick={handleContactWhatsApp}
                  >
                    <Phone size={16} className="mr-2" />
                    Contato via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
      
      {/* Rooms section */}
      <section id="rooms" className="container mx-auto px-4 py-12 border-t border-slate-800">
        <h2 className="text-2xl font-semibold mb-8">Quartos Disponíveis</h2>
        
        <div className="space-y-8">
          {property.rooms.map((room) => (
            <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <AspectRatio ratio={4 / 3}>
                    <img
                      src={room.image}
                      alt={room.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                
                <div className="p-6 md:p-4 md:col-span-2">
                  <div className="md:flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                      <p className="text-slate-400 mb-3">{room.description}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:text-right">
                      {room.regularPrice > room.price && (
                        <div className="inline-block bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs font-medium mb-1">
                          Oferta Especial
                        </div>
                      )}
                      <div className="flex items-baseline md:justify-end">
                        {room.regularPrice > room.price && (
                          <span className="text-slate-500 text-sm line-through mr-2">
                            R$ {room.regularPrice}
                          </span>
                        )}
                        <span className="text-2xl font-bold">R$ {room.price}</span>
                      </div>
                      <p className="text-xs text-slate-500">por noite</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {room.maxGuests} hóspedes
                    </Badge>
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {room.bedType}
                    </Badge>
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {room.size}
                    </Badge>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="text-sm bg-slate-800 px-2 py-1 rounded text-slate-300">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <button
                          onClick={() => toggleRoomDetails(room.id)}
                          className="text-sm text-primary hover:underline"
                        >
                          +{room.amenities.length - 3} mais
                        </button>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6">
                      <Button
                        variant="outline"
                        className="bg-transparent border-slate-700"
                        onClick={() => toggleRoomDetails(room.id)}
                      >
                        Ver Detalhes
                      </Button>
                      
                      <Button
                        onClick={() => handleRoomSelection(room.id)}
                        className={cn({
                          "bg-green-800 hover:bg-green-700": selectedRooms.includes(room.id)
                        })}
                      >
                        {selectedRooms.includes(room.id) ? (
                          <>
                            <Check size={16} className="mr-2" />
                            Selecionado
                          </>
                        ) : (
                          "Selecionar"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Location section */}
      <section id="location" className="container mx-auto px-4 py-12 border-t border-slate-800">
        <h2 className="text-2xl font-semibold mb-6">Localização</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-slate-400 mb-4">{property.location.description}</p>
            
            <h3 className="text-lg font-medium mb-3">Locais Próximos</h3>
            <ul className="space-y-2">
              {property.location.nearby.map((place, index) => (
                <li key={index} className="flex items-center">
                  <MapPin size={16} className="mr-2 text-primary" />
                  <span className="font-medium">{place.name}</span>
                  <span className="ml-2 text-sm text-slate-500">({place.distance})</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-lg h-[300px] flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="mx-auto mb-3 text-primary" />
              <h3 className="font-medium mb-1">Ver no mapa</h3>
              <p className="text-sm text-slate-400 mb-4">Clique para ver a localização exata</p>
              <Button>Abrir Mapa</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Reviews section */}
      <section id="reviews" className="container mx-auto px-4 py-12 border-t border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Avaliações</h2>
          <div className="flex items-center">
            <Star size={20} className="text-amber-500 mr-2" />
            <span className="font-bold text-lg">{property.rating}</span>
            <span className="text-slate-500 ml-1">({property.reviewCount})</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {property.reviews.map((review) => (
            <div key={review.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex justify-between mb-3">
                <h3 className="font-medium">{review.author}</h3>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "text-amber-500" : "text-slate-700"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-400">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* FAQs and Policies section */}
      <section id="policies" className="container mx-auto px-4 py-12 border-t border-slate-800">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {property.faqs.map((faq, index) => (
                <div key={index} className="border-b border-slate-800 pb-4">
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-slate-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Políticas</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Política de Cancelamento</h3>
              <p className="text-slate-400">{property.policies.cancellation}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Regras da Casa</h3>
              <p className="text-slate-400">{property.policies.rules}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={property.logoUrl} 
                  alt={property.name} 
                  className="w-8 h-8"
                />
                <span className="font-semibold text-lg">{property.name}</span>
              </div>
              <p className="text-slate-400 mb-4">{property.description.slice(0, 120)}...</p>
              <Button
                onClick={handleContactWhatsApp}
                className="gap-1"
              >
                <Phone size={16} />
                Contato via WhatsApp
              </Button>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#rooms" className="text-slate-400 hover:text-white">Quartos</a>
                </li>
                <li>
                  <a href="#location" className="text-slate-400 hover:text-white">Localização</a>
                </li>
                <li>
                  <a href="#reviews" className="text-slate-400 hover:text-white">Avaliações</a>
                </li>
                <li>
                  <a href="#policies" className="text-slate-400 hover:text-white">Políticas</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Informações de Contato</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 text-primary" />
                  <span className="text-slate-400">{property.address}</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-2 text-primary" />
                  <span className="text-slate-400">{property.whatsapp}</span>
                </li>
              </ul>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Horários</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-2 rounded">
                    <span className="block text-xs text-slate-500">Check-in</span>
                    <span>{property.checkIn}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded">
                    <span className="block text-xs text-slate-500">Check-out</span>
                    <span>{property.checkOut}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} {property.name}. Todos os direitos reservados.</p>
            <p className="mt-1">Desenvolvido por Frontdesk</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PropertyLanding: React.FC = () => {
  const { theme } = useTheme();
  const { slug } = useParams<{ slug: string }>();
  
  // In a real app, fetch the property data based on the slug
  const property = mockProperty;
  
  // Get template preference from property data
  const templatePreference = property?.template || "light";
  const isDark = templatePreference === "dark" || (templatePreference === "system" && theme === "dark");
  
  return isDark ? <DarkTemplate /> : <LightTemplate />;
};

export default PropertyLanding;

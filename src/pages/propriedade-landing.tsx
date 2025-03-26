import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { MapPin, Star, Users, Wifi, Coffee, DoorOpen, Calendar, Utensils, AlarmClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyGallery } from '@/components/property/property-gallery';
import { PropertySuites, Suite } from '@/components/property/property-suites';
import { PropertyBookingForm } from '@/components/property/property-booking-form';
import { useTheme } from '@/context/theme-context';

// Sample data
const MOCK_PROPERTIES = {
  'vila-mariana-suites': {
    id: '1',
    name: 'Vila Mariana Suites',
    description: 'Localizado no coração de Vila Mariana, um dos bairros mais charmosos de São Paulo, o Vila Mariana Suites oferece acomodações modernas e confortáveis para suas estadias na cidade. A apenas 10 minutos de caminhada do metrô, com fácil acesso aos principais pontos turísticos e negócios da cidade.',
    rating: 4.8,
    reviews: 124,
    location: 'Vila Mariana, São Paulo',
    address: 'Rua Domingos de Morais, 2187 - Vila Mariana, São Paulo - SP',
    coordinates: { lat: -23.5869, lng: -46.6388 },
    mainImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1957&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537726235470-8504e3beef77?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop',
    ],
    amenities: [
      'Wi-Fi gratuito',
      'Ar-condicionado',
      'Café da manhã',
      'Estacionamento',
      'Recepção 24h',
      'Restaurante',
      'Bar',
      'Academia',
      'Lavanderia'
    ],
    checkIn: '14:00',
    checkOut: '12:00',
    houseRules: [
      'Não é permitido fumar',
      'Não são permitidos animais de estimação',
      'Não são permitidas festas ou eventos',
      'O horário de silêncio é das 22:00 às 08:00'
    ],
    theme: 'light', // Adding theme property here
    suites: [
      {
        id: 's1',
        name: 'Studio Deluxe',
        description: 'Confortável studio com cama queen size, cozinha compacta totalmente equipada, área de trabalho e banheiro privativo. Perfeito para viajantes individuais ou casais.',
        price: 280,
        capacity: 2,
        size: 25,
        beds: '1 cama queen size',
        images: [
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1957&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=2070&auto=format&fit=crop'
        ],
        amenities: [
          'Wi-Fi',
          'Ar-condicionado',
          'TV',
          'Cozinha compacta',
          'Frigobar',
          'Secador de cabelo'
        ]
      },
      {
        id: 's2',
        name: 'Apartamento Premium',
        description: 'Espaçoso apartamento com quarto separado e sala de estar. Cozinha completa, banheiro com banheira e área de trabalho. Ideal para estadias mais longas ou famílias pequenas.',
        price: 450,
        capacity: 3,
        size: 45,
        beds: '1 cama queen size e 1 sofá-cama',
        images: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop'
        ],
        amenities: [
          'Wi-Fi',
          'Ar-condicionado',
          'TV',
          'Cozinha completa',
          'Máquina de lavar',
          'Banheira',
          'Secador de cabelo',
          'Ferro de passar'
        ]
      },
      {
        id: 's3',
        name: 'Suíte Master',
        description: 'Nossa melhor acomodação, com amplo quarto, sala de estar, banheiro luxuoso com banheira de hidromassagem e vista para a cidade. Inclui café da manhã premium.',
        price: 650,
        capacity: 2,
        size: 55,
        beds: '1 cama king size',
        images: [
          'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop'
        ],
        amenities: [
          'Wi-Fi',
          'Ar-condicionado',
          'TV',
          'Cozinha completa',
          'Café da manhã',
          'Banheira de hidromassagem',
          'Roupão de banho',
          'Vista para a cidade',
          'Minibar premium'
        ]
      }
    ]
  },
  'copacabana-ocean-view': {
    id: '2',
    name: 'Copacabana Ocean View',
    description: 'Com vista deslumbrante para o oceano, o Copacabana Ocean View oferece acomodações de luxo a poucos passos da mundialmente famosa praia de Copacabana. Desfrute de estadias inesquecíveis no Rio de Janeiro com o máximo de conforto e sofisticação.',
    rating: 4.9,
    reviews: 256,
    location: 'Copacabana, Rio de Janeiro',
    address: 'Avenida Atlântica, 1702 - Copacabana, Rio de Janeiro - RJ',
    coordinates: { lat: -22.9671, lng: -43.1782 },
    mainImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=2835&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558976825-6b1b03a03719?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
    ],
    amenities: [
      'Wi-Fi gratuito',
      'Ar-condicionado',
      'Café da manhã',
      'Piscina',
      'Estacionamento',
      'Recepção 24h',
      'Restaurante',
      'Bar',
      'Spa',
      'Academia',
      'Serviço de praia'
    ],
    checkIn: '15:00',
    checkOut: '11:00',
    houseRules: [
      'Não é permitido fumar',
      'Não são permitidos animais de estimação',
      'Não são permitidas festas ou eventos',
      'O horário de silêncio é das 22:00 às 08:00'
    ],
    theme: 'dark', // Theme property already exists here
    suites: [
      {
        id: 's1',
        name: 'Suíte Vista Mar',
        description: 'Suíte com vista deslumbrante para o Oceano Atlântico e a praia de Copacabana. Equipada com cama king size, banheiro privativo e varanda.',
        price: 580,
        capacity: 2,
        size: 30,
        beds: '1 cama king size',
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
        ],
        amenities: [
          'Wi-Fi',
          'Ar-condicionado',
          'TV',
          'Vista para o mar',
          'Varanda',
          'Frigobar',
          'Secador de cabelo'
        ]
      },
      {
        id: 's2',
        name: 'Suíte Deluxe',
        description: 'Ampla suíte com sala de estar separada, decoração sofisticada, cama king size e vista parcial para o mar. Inclui café da manhã e acesso ao spa.',
        price: 750,
        capacity: 2,
        size: 40,
        beds: '1 cama king size',
        images: [
          'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=2835&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1558976825-6b1b03a03719?q=80&w=2070&auto=format&fit=crop'
        ],
        amenities: [
          'Wi-Fi',
          'Ar-condicionado',
          'TV',
          'Vista parcial para o mar',
          'Café da manhã',
          'Acesso ao spa',
          'Roupão de banho',
          'Secador de cabelo'
        ]
      },
      {
        id: 's3',
        name: 'Suíte Presidencial',
        description: 'A mais luxuosa acomodação do hotel, com ampla sala de estar, quarto elegante, banheiro com banheira de hidromassagem e varanda privativa com vista panorâmica para a praia de Copacabana.',
        price: 1200,
        capacity: 4,
        size: 70,
        beds: '1 cama king size e 1 sofá-cama queen',
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop'
        ],
        amenities: [
          'Wi-Fi',
          'Ar-condicionado',
          'TV',
          'Vista panorâmica para o mar',
          'Varanda privativa',
          'Cozinha',
          'Banheira de hidromassagem',
          'Café da manhã privativo',
          'Serviço de mordomo',
          'Minibar premium'
        ]
      }
    ]
  }
};

const PropertyLanding: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const property = MOCK_PROPERTIES[slug as keyof typeof MOCK_PROPERTIES];
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedSuite, setSelectedSuite] = useState<Suite | undefined>();
  const { theme, toggleTheme } = useTheme();
  
  // Set theme based on property preference
  React.useEffect(() => {
    if (property?.theme && theme !== property.theme) {
      toggleTheme();
    }
  }, [property, theme, toggleTheme]);

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Propriedade não encontrada</h1>
          <p className="text-muted-foreground mb-6">A propriedade que você está procurando não existe.</p>
          <a href="/" className="text-primary hover:underline">
            Voltar para a página inicial
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Property header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-medium">{property.rating}</span>
              <span className="text-muted-foreground ml-1">
                ({property.reviews} avaliações)
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
              <span>{property.location}</span>
            </div>
            <Badge variant="secondary" className="font-normal">
              <Users className="h-3 w-3 mr-1" />
              Superhost
            </Badge>
          </div>
        </div>

        {/* Property gallery */}
        <PropertyGallery images={property.images} title={property.name} />

        {/* Main content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left column - property details */}
          <div className="lg:col-span-2">
            <div className="prose max-w-none mb-8">
              <p>{property.description}</p>
            </div>

            <Tabs defaultValue="suites" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="suites">Suítes</TabsTrigger>
                <TabsTrigger value="amenities">Comodidades</TabsTrigger>
                <TabsTrigger value="location">Localização</TabsTrigger>
                <TabsTrigger value="rules">Regras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="suites">
                <PropertySuites 
                  suites={property.suites} 
                  onSelect={setSelectedSuite}
                  selectedSuiteId={selectedSuite?.id}
                />
              </TabsContent>
              
              <TabsContent value="amenities">
                <h2 className="text-2xl font-semibold mb-6">Comodidades</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {amenity.includes('Wi-Fi') ? <Wifi className="h-5 w-5" /> :
                       amenity.includes('Café') ? <Coffee className="h-5 w-5" /> :
                       amenity.includes('Recepção') ? <AlarmClock className="h-5 w-5" /> :
                       amenity.includes('Restaurante') ? <Utensils className="h-5 w-5" /> :
                       <DoorOpen className="h-5 w-5" />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="location">
                <h2 className="text-2xl font-semibold mb-6">Localização</h2>
                <p className="text-lg mb-4">{property.address}</p>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <iframe 
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(property.address)}`}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="rules">
                <h2 className="text-2xl font-semibold mb-6">Regras da casa</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Horários
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pl-7">
                      <div>
                        <p className="text-sm text-muted-foreground">Check-in</p>
                        <p className="font-medium">{property.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check-out</p>
                        <p className="font-medium">{property.checkOut}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Regras</h3>
                    <ul className="space-y-2">
                      {property.houseRules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1">•</div>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - booking form */}
          <div>
            <PropertyBookingForm 
              propertyName={property.name}
              selectedSuite={selectedSuite}
              onSelectDates={setDateRange}
            />
          </div>
        </div>
      </div>
      
      <footer className="mt-12 py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {property.name}. Todos os direitos reservados.</p>
            <p className="mt-2">Powered by Frontdesk</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyLanding;

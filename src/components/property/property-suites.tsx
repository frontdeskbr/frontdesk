
import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Users, Wifi, Snowflake, Coffee, Car, Waves, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

export interface Suite {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  images: string[];
  size: number;
  beds: string;
  amenities: string[];
}

interface PropertySuitesProps {
  suites: Suite[];
  onSelect: (suite: Suite) => void;
  selectedSuiteId?: string;
}

export const PropertySuites: React.FC<PropertySuitesProps> = ({ 
  suites, 
  onSelect,
  selectedSuiteId
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { primaryColor } = useTheme();

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const renderAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} />;
      case 'ar-condicionado':
        return <Snowflake size={16} />;
      case 'café da manhã':
        return <Coffee size={16} />;
      case 'estacionamento':
        return <Car size={16} />;
      case 'tv':
        return <Tv size={16} />;
      case 'vista para o mar':
        return <Waves size={16} />;
      default:
        return <Check size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Acomodações disponíveis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {suites.map((suite) => (
          <Card 
            key={suite.id} 
            className={cn(
              "overflow-hidden transition-all",
              selectedSuiteId === suite.id ? "ring-2 ring-primary" : "",
              expandedId === suite.id ? "shadow-lg" : ""
            )}
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={suite.images[0]} 
                alt={suite.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                <CardTitle className="text-white">{suite.name}</CardTitle>
                <CardDescription className="text-white/90">
                  {suite.size}m² · {suite.beds}
                </CardDescription>
              </div>
            </div>
            
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Até {suite.capacity} pessoas</span>
                </div>
                <div>
                  <span className="text-lg font-semibold text-primary">
                    R$ {suite.price.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-sm text-muted-foreground">/noite</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2">
              <div className={cn(
                "text-sm text-muted-foreground transition-all",
                expandedId === suite.id ? "" : "line-clamp-2"
              )}>
                {suite.description}
              </div>
              
              {expandedId === suite.id && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Comodidades</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {suite.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {renderAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="p-4 flex flex-col sm:flex-row gap-3 justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toggleExpand(suite.id)}
                className="w-full sm:w-auto"
              >
                {expandedId === suite.id ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    Mostrar mais
                  </>
                )}
              </Button>
              
              <Button 
                onClick={() => onSelect(suite)}
                className="w-full sm:w-auto"
                variant={selectedSuiteId === suite.id ? "secondary" : "default"}
              >
                {selectedSuiteId === suite.id ? 'Selecionado' : 'Selecionar'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

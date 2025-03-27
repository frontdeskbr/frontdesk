
import React, { useState, useEffect } from "react";
import { getUserProperties } from "@/services/beds24Api";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Home, Building2, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

interface UserPropertiesProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProperties: React.FC<UserPropertiesProps> = ({
  userId,
  userName,
  open,
  onOpenChange
}) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (open && userId) {
      loadProperties();
    }
  }, [open, userId]);
  
  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getUserProperties(userId);
      setProperties(data || []);
    } catch (err) {
      console.error("Error loading properties:", err);
      setError("Não foi possível carregar as propriedades deste usuário.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewProperty = (propertyId: string, slug: string) => {
    onOpenChange(false);
    navigate(`/propriedade/${slug}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Propriedades de {userName}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{error}</p>
            <Button 
              variant="outline" 
              onClick={loadProperties} 
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>Este usuário não possui propriedades.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto p-1">
            {properties.map((property) => (
              <Card key={property.propId} className="overflow-hidden hover:shadow-md transition-shadow">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={property.pictures?.[0]?.url || "https://placehold.co/600x400?text=Sem+Imagem"} 
                    alt={property.propName}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{property.propName}</h3>
                  
                  {property.address && (
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{property.address}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center text-sm">
                      <Home className="h-4 w-4 mr-1 text-primary" />
                      <span>ID: {property.propId}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Bed className="h-4 w-4 mr-1 text-primary" />
                      <span>{property.rooms?.length || 0} Quartos</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProperty(property.propId, property.propId)}
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

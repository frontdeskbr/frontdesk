
import React, { useState } from 'react';
import { Calendar, ExternalLink, Copy, Download, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface PropertyICalProps {
  propertyId: string;
  propertyName: string;
}

export const PropertyICal: React.FC<PropertyICalProps> = ({ propertyId, propertyName }) => {
  const [icalImportUrl, setIcalImportUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Generate a unique iCal feed URL for this property
  const icalFeedUrl = `https://frontdesk.com.br/api/ical/${propertyId}/export.ics`;
  
  const handleAddIcalImport = () => {
    if (!icalImportUrl) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }
    
    // This would normally send the URL to the backend
    toast.success('URL do iCal adicionada com sucesso');
    setIcalImportUrl('');
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(icalFeedUrl);
    setCopied(true);
    toast.success('URL do iCal copiada para a área de transferência');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleDownloadIcal = () => {
    // This would normally trigger a download of the iCal file
    window.open(icalFeedUrl, '_blank');
    toast.success('Arquivo iCal baixado');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Exportar calendário iCal
          </CardTitle>
          <CardDescription>
            Sincronize suas reservas com outros calendários como Google Calendar, 
            Apple Calendar ou qualquer outro serviço que suporte iCal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="ical-export">URL do feed iCal para {propertyName}</Label>
            <div className="flex gap-2">
              <Input 
                id="ical-export" 
                value={icalFeedUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopyToClipboard}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleDownloadIcal}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar arquivo iCal
            </Button>
            <Button
              className="flex-1"
              onClick={() => window.open('https://calendar.google.com/calendar/r/settings/addbyurl', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Adicionar ao Google Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Importar calendários iCal
          </CardTitle>
          <CardDescription>
            Importe calendários de outras plataformas (Airbnb, Booking.com, etc.) para 
            manter suas reservas sincronizadas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="ical-import">URL do feed iCal para importar</Label>
            <div className="flex gap-2">
              <Input 
                id="ical-import" 
                placeholder="https://www.airbnb.com/calendar/ical/12345.ics"
                value={icalImportUrl}
                onChange={(e) => setIcalImportUrl(e.target.value)}
                className="font-mono text-sm"
              />
              <Button 
                onClick={handleAddIcalImport}
                className="shrink-0"
              >
                Adicionar
              </Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-sm font-medium mb-3">Calendários importados</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Airbnb</span>
                </div>
                <Button variant="ghost" size="sm">Remover</Button>
              </div>
              
              <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Booking.com</span>
                </div>
                <Button variant="ghost" size="sm">Remover</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

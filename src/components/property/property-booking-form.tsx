
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Users, Calendar, CreditCard, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Suite } from './property-suites';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/context/theme-context';

interface PropertyBookingFormProps {
  propertyName: string;
  selectedSuite?: Suite;
  onSelectDates: (range: DateRange) => void;
}

export const PropertyBookingForm: React.FC<PropertyBookingFormProps> = ({
  propertyName,
  selectedSuite,
  onSelectDates
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3)
  });
  const [guests, setGuests] = useState("2");
  const [showPayment, setShowPayment] = useState(false);
  const { theme } = useTheme();

  const nights = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0;
  
  const subtotal = selectedSuite ? nights * selectedSuite.price : 0;
  const cleaningFee = selectedSuite ? 150 : 0;
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + cleaningFee + serviceFee;

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onSelectDates(range || { from: undefined, to: undefined });
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  return (
    <Card className={`sticky top-4 ${!selectedSuite ? 'border-dashed' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">
          {selectedSuite ? `Reserve: ${selectedSuite.name}` : 'Faça sua reserva'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!selectedSuite ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Selecione uma suíte para continuar</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div>
                <Label htmlFor="check-in-out">Período da estadia</Label>
                <div className="mt-1">
                  <DateRangePicker 
                    date={dateRange}
                    onDateChange={handleDateChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="guests">Número de hóspedes</Label>
                <Select 
                  value={guests} 
                  onValueChange={setGuests}
                >
                  <SelectTrigger id="guests" className="mt-1">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: selectedSuite.capacity }, (_, i) => i + 1).map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'hóspede' : 'hóspedes'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {!showPayment && dateRange?.from && dateRange?.to && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>
                      R$ {selectedSuite.price} x {nights} {nights === 1 ? 'noite' : 'noites'}
                    </span>
                    <span>R$ {subtotal.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de limpeza</span>
                    <span>R$ {cleaningFee.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de serviço</span>
                    <span>R$ {serviceFee.toLocaleString('pt-BR')}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>R$ {total.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              )}
              
              {showPayment && (
                <div className="space-y-4 mt-4">
                  <Separator />
                  <h3 className="font-medium flex items-center gap-2">
                    <CreditCard size={18} />
                    Dados de pagamento
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="card-name">Nome no cartão</Label>
                      <Input id="card-name" className="mt-1" />
                    </div>
                    
                    <div>
                      <Label htmlFor="card-number">Número do cartão</Label>
                      <Input id="card-number" className="mt-1" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="card-expiry">Validade</Label>
                        <Input id="card-expiry" placeholder="MM/AA" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="card-cvc">CVC</Label>
                        <Input id="card-cvc" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        {selectedSuite && (
          <Button 
            className="w-full" 
            size="lg"
            disabled={!dateRange?.from || !dateRange?.to || guests === "0"}
            onClick={handleProceedToPayment}
          >
            {showPayment ? (
              <>
                <Check className="mr-2" size={18} />
                Concluir reserva
              </>
            ) : (
              <>
                <Calendar className="mr-2" size={18} />
                Reservar agora
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

// Mock bookings data
const MOCK_BOOKINGS = [
  {
    id: "b1",
    propertyId: "1",
    roomId: "r1",
    guestName: "Eduardo Martins",
    checkIn: "2023-11-20",
    checkOut: "2023-11-23",
    status: "confirmed", // confirmed, pending, cancelled
    channel: "booking.com",
    whatsapp: "+5511987654321",
  },
  {
    id: "b2",
    propertyId: "1",
    roomId: "r2",
    guestName: "Amanda Silva",
    checkIn: "2023-11-22",
    checkOut: "2023-11-25",
    status: "confirmed",
    channel: "airbnb",
    whatsapp: "+5511976543210",
  },
  {
    id: "b3",
    propertyId: "2",
    roomId: "r1",
    guestName: "Roberto Almeida",
    checkIn: "2023-11-15",
    checkOut: "2023-11-21",
    status: "pending",
    channel: "expedia",
    whatsapp: "+5511965432109",
  },
  {
    id: "b4",
    propertyId: "1",
    roomId: "r3",
    guestName: "Carolina Mendes",
    checkIn: "2023-11-25",
    checkOut: "2023-11-28",
    status: "cancelled",
    channel: "direct",
    whatsapp: "+5511954321098",
  },
];

// Mock properties data
const MOCK_PROPERTIES = [
  { id: "1", name: "Vila Mariana Suites" },
  { id: "2", name: "Copacabana Ocean View" },
];

// Mock rooms data grouped by property
const MOCK_ROOMS = {
  "1": [
    { id: "r1", name: "Apartamento Superior", number: "101" },
    { id: "r2", name: "Studio Deluxe", number: "102" },
    { id: "r3", name: "Apartamento Premium", number: "201" },
  ],
  "2": [
    { id: "r1", name: "Suite Master", number: "301" },
    { id: "r2", name: "Suite Ocean", number: "302" },
  ],
};

const Calendario: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { primaryColor } = useTheme();
  
  // Generate calendar dates
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate the day of week for the month start (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  
  // Add days before month start to complete the week
  const daysBeforeMonth = [];
  for (let i = startDayOfWeek; i > 0; i--) {
    daysBeforeMonth.push(addDays(monthStart, -i));
  }
  
  // Calculate the day of week for the month end
  const endDayOfWeek = monthEnd.getDay();
  
  // Add days after month end to complete the week
  const daysAfterMonth = [];
  for (let i = 1; i < (7 - endDayOfWeek); i++) {
    daysAfterMonth.push(addDays(monthEnd, i));
  }
  
  // All displayed days
  const allDays = [...daysBeforeMonth, ...daysInMonth, ...daysAfterMonth];
  
  // Create weeks structure
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }
  
  // Filter bookings based on selected property
  const filteredBookings = MOCK_BOOKINGS.filter(booking => 
    selectedProperty === "all" || booking.propertyId === selectedProperty
  );
  
  // Group rooms by property for display
  const getFilteredRooms = () => {
    if (selectedProperty === "all") {
      // If all properties selected, get all rooms from all properties
      return Object.values(MOCK_ROOMS).flat();
    }
    return MOCK_ROOMS[selectedProperty as keyof typeof MOCK_ROOMS] || [];
  };
  
  const rooms = getFilteredRooms();
  
  const previousMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, -1));
  };
  
  const nextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Check if a room has a booking on a specific date
  const getBookingForRoomDate = (roomId: string, date: Date) => {
    return filteredBookings.find(booking => {
      const checkIn = parseISO(booking.checkIn);
      const checkOut = parseISO(booking.checkOut);
      
      return (
        booking.roomId === roomId &&
        (isSameDay(date, checkIn) || isSameDay(date, checkOut) || 
         (date > checkIn && date < checkOut))
      );
    });
  };
  
  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };
  
  const getChannelBadge = (channel: string) => {
    const badgeClassName = `bg-${primaryColor === 'purple' ? 'purple' : primaryColor}-500`;
    
    switch (channel) {
      case "booking.com":
        return <Badge className="bg-blue-500">Booking.com</Badge>;
      case "airbnb":
        return <Badge className="bg-rose-500">Airbnb</Badge>;
      case "expedia":
        return <Badge className="bg-yellow-500">Expedia</Badge>;
      case "direct":
        return <Badge className={badgeClassName}>Direto</Badge>;
      default:
        return <Badge>{channel}</Badge>;
    }
  };
  
  const handleOpenWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank');
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "reservation-confirmed";
      case "pending":
        return "reservation-pending";
      case "cancelled":
        return "reservation-cancelled";
      default:
        return "";
    }
  };
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <PageHeader 
            title="Calendário de Reservas"
            description="Visualize e gerencie reservas por quartos e datas"
          />
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-lg font-medium min-w-[150px] text-center">
                  {format(currentDate, "MMMM yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
                </div>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hoje
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Propriedade:</span>
                  <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Todas as propriedades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as propriedades</SelectItem>
                      {MOCK_PROPERTIES.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 items-center text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Confirmada</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Pendente</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Cancelada</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="border rounded-lg overflow-auto flex-1">
          <div className="min-w-[800px] h-full">
            {/* Calendar header with days */}
            <div className="grid grid-cols-[150px_repeat(7,1fr)] border-b">
              <div className="p-3 border-r bg-muted/30">
                <span className="font-medium">Quarto</span>
              </div>
              {weekDays.map((day, index) => (
                <div key={index} className="p-3 text-center font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar body */}
            {rooms.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum quarto encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Selecione outra propriedade ou adicione quartos a esta propriedade
                </p>
              </div>
            ) : (
              <>
                {weeks.map((week, weekIndex) => (
                  <React.Fragment key={`week-${weekIndex}`}>
                    {/* Dates row */}
                    <div className="grid grid-cols-[150px_repeat(7,1fr)] border-b">
                      <div className="p-2 border-r bg-muted/30"></div>
                      {week.map((date, dateIndex) => (
                        <div
                          key={`date-${dateIndex}`}
                          className={cn(
                            "p-2 text-center text-sm",
                            !isSameMonth(date, currentDate) && "text-muted-foreground"
                          )}
                        >
                          {format(date, "d")}
                        </div>
                      ))}
                    </div>
                    
                    {/* Rooms with bookings */}
                    {rooms.map((room) => (
                      <div key={`room-${room.id}-week-${weekIndex}`} className="grid grid-cols-[150px_repeat(7,1fr)] border-b last:border-b-0">
                        {weekIndex === 0 && (
                          <div className="p-3 border-r flex flex-col justify-center row-span-1">
                            <div className="font-medium">{room.name}</div>
                            <div className="text-xs text-muted-foreground">Nº {room.number}</div>
                          </div>
                        )}
                        {weekIndex > 0 && (
                          <div className="p-3 border-r flex flex-col justify-center row-span-1 invisible"></div>
                        )}
                        
                        {week.map((date, dayIndex) => {
                          const booking = getBookingForRoomDate(room.id, date);
                          
                          return (
                            <div key={`day-${dayIndex}`} className="relative min-h-[70px] border-r last:border-r-0">
                              {booking && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() => handleBookingClick(booking)}
                                        className={cn(
                                          "absolute top-1/2 left-0 transform -translate-y-1/2 w-full px-1 py-2 mx-auto border text-xs",
                                          getStatusClass(booking.status)
                                        )}
                                      >
                                        {booking.guestName}
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-xs">
                                        <p className="font-bold">{booking.guestName}</p>
                                        <p>Check-in: {format(parseISO(booking.checkIn), "dd/MM/yyyy")}</p>
                                        <p>Check-out: {format(parseISO(booking.checkOut), "dd/MM/yyyy")}</p>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Booking details dialog */}
      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
            <DialogDescription>
              Informações completas sobre a reserva
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {selectedBooking.guestName.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedBooking.guestName}</div>
                  <div className="mt-1">{getChannelBadge(selectedBooking.channel)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Check-in</label>
                  <div className="font-medium">{format(parseISO(selectedBooking.checkIn), "dd/MM/yyyy")}</div>
                  <div className="text-sm">14:00</div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Check-out</label>
                  <div className="font-medium">{format(parseISO(selectedBooking.checkOut), "dd/MM/yyyy")}</div>
                  <div className="text-sm">12:00</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Status</label>
                <Badge className={cn(
                  selectedBooking.status === "confirmed" ? "bg-green-500" :
                  selectedBooking.status === "pending" ? "bg-yellow-500" :
                  "bg-red-500"
                )}>
                  {selectedBooking.status === "confirmed" ? "Confirmada" :
                   selectedBooking.status === "pending" ? "Pendente" : "Cancelada"}
                </Badge>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Propriedade / Quarto</label>
                <div className="font-medium">
                  {MOCK_PROPERTIES.find(p => p.id === selectedBooking.propertyId)?.name} / 
                  {' '}
                  {rooms.find(r => r.id === selectedBooking.roomId)?.name} 
                  ({rooms.find(r => r.id === selectedBooking.roomId)?.number})
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenWhatsApp(selectedBooking.whatsapp)}
                >
                  WhatsApp
                </Button>
                <Button>Ver Detalhes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Calendario;


import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addMonths, differenceInDays, addWeeks, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Share } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    price: 780,
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
    price: 950,
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
    price: 1200,
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
    price: 850,
  },
  {
    id: "b5",
    propertyId: "1",
    roomId: "r1",
    guestName: "Ricardo Torres",
    checkIn: "2023-11-24",
    checkOut: "2023-11-26",
    status: "confirmed",
    channel: "booking.com",
    whatsapp: "+5511932165478",
    price: 680,
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

type ViewMode = "week" | "month";

const Calendario: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const { primaryColor } = useTheme();
  
  useEffect(() => {
    // Set the page title in the header
    document.title = "Calendário - Frontdesk";
  }, []);
  
  // Calculate calendar days based on viewMode
  const calculateCalendarDays = () => {
    if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 = Sunday
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      // Complete first week
      const startDayOfWeek = monthStart.getDay();
      const daysBeforeMonth = [];
      for (let i = startDayOfWeek; i > 0; i--) {
        daysBeforeMonth.push(addDays(monthStart, -i));
      }
      
      // Complete last week
      const endDayOfWeek = monthEnd.getDay();
      const daysAfterMonth = [];
      for (let i = 1; i < (7 - endDayOfWeek); i++) {
        daysAfterMonth.push(addDays(monthEnd, i));
      }
      
      return [...daysBeforeMonth, ...eachDayOfInterval({ start: monthStart, end: monthEnd }), ...daysAfterMonth];
    }
  };
  
  const allDays = calculateCalendarDays();
  
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
  
  const previousPeriod = () => {
    if (viewMode === "week") {
      setCurrentDate(prevDate => addDays(prevDate, -7));
    } else {
      setCurrentDate(prevDate => addMonths(prevDate, -1));
    }
  };
  
  const nextPeriod = () => {
    if (viewMode === "week") {
      setCurrentDate(prevDate => addDays(prevDate, 7));
    } else {
      setCurrentDate(prevDate => addMonths(prevDate, 1));
    }
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
    switch (channel) {
      case "booking.com":
        return <Badge className="bg-blue-500/80">Booking.com</Badge>;
      case "airbnb":
        return <Badge className="bg-rose-500/80">Airbnb</Badge>;
      case "expedia":
        return <Badge className="bg-yellow-500/80">Expedia</Badge>;
      case "direct":
        return <Badge className={`bg-${primaryColor}-500/80`}>Direto</Badge>;
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
        return "reservation-confirmed bg-green-100 border-green-400 dark:bg-green-950/40 dark:border-green-700";
      case "pending":
        return "reservation-pending bg-yellow-100 border-yellow-400 dark:bg-yellow-950/40 dark:border-yellow-700";
      case "cancelled":
        return "reservation-cancelled bg-red-100 border-red-400 dark:bg-red-950/40 dark:border-red-700";
      default:
        return "";
    }
  };
  
  const getPeriodLabel = () => {
    if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(start, "dd")} - ${format(end, "dd")} de ${format(end, "MMMM yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}`;
    } else {
      return format(currentDate, "MMMM yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase());
    }
  };
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  // Function to calculate position and width of booking bar
  const calculateBookingPosition = (booking: any, date: Date) => {
    const checkIn = parseISO(booking.checkIn);
    const checkOut = parseISO(booking.checkOut);
    
    // Check if this is the check-in day
    const isCheckInDay = isSameDay(date, checkIn);
    // Check if this is the check-out day
    const isCheckOutDay = isSameDay(date, checkOut);
    
    let styles = {};
    
    if (isCheckInDay && isCheckOutDay) {
      // For same-day bookings
      styles = {
        left: '20%',
        width: '60%',
        borderRadius: '20px'
      };
    } else if (isCheckInDay) {
      // Start in the middle of the cell
      styles = {
        left: '50%',
        width: '50%',
        borderTopLeftRadius: '20px',
        borderBottomLeftRadius: '20px',
        borderRight: 'none'
      };
    } else if (isCheckOutDay) {
      // End in the middle of the cell
      styles = {
        left: '0',
        width: '50%',
        borderTopRightRadius: '20px',
        borderBottomRightRadius: '20px',
        borderLeft: 'none'
      };
    } else {
      // Full cell width
      styles = {
        left: '0',
        width: '100%',
        borderRadius: '0',
        borderLeft: 'none',
        borderRight: 'none'
      };
    }
    
    return styles;
  };
  
  const handleShareCalendar = () => {
    // Implement share functionality
    toast.success("Link do calendário copiado para a área de transferência!");
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <PageHeader 
            title="Calendário de Reservas"
            description="Visualize e gerencie reservas por quartos e datas"
          />
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShareCalendar}>
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={previousPeriod}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-lg font-medium min-w-[180px] text-center">
                  {getPeriodLabel()}
                </div>
                <Button variant="outline" size="icon" onClick={nextPeriod}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hoje
                </Button>
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    variant={viewMode === "week" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setViewMode("week")}
                  >
                    Semana
                  </Button>
                  <Button 
                    variant={viewMode === "month" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setViewMode("month")}
                  >
                    Mês
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                            !isSameMonth(date, currentDate) && "text-muted-foreground",
                            isSameDay(date, new Date()) && "bg-primary/5 font-medium"
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
                                          "absolute top-1/2 transform -translate-y-1/2 border text-sm",
                                          getStatusClass(booking.status)
                                        )}
                                        style={calculateBookingPosition(booking, date)}
                                      >
                                        <div className="flex items-center gap-1 px-2 py-1 truncate">
                                          {getChannelBadge(booking.channel)}
                                          <span className="truncate font-medium">{booking.guestName}</span>
                                          <span className="text-xs ml-auto">R${booking.price}</span>
                                        </div>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-xs">
                                        <p className="font-bold">{booking.guestName}</p>
                                        <p>Check-in: {format(parseISO(booking.checkIn), "dd/MM/yyyy")}</p>
                                        <p>Check-out: {format(parseISO(booking.checkOut), "dd/MM/yyyy")}</p>
                                        <p>Valor: R$ {booking.price}</p>
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
                <label className="text-sm text-muted-foreground block mb-1">Valor</label>
                <div className="font-medium">R$ {selectedBooking.price}</div>
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

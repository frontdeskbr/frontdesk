
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Building2, 
  Calendar, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Search,
  Eye,
  BarChart4,
  CalendarIcon,
  ArrowDownUp,
  MessagesSquare
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Mock bookings data
const MOCK_BOOKINGS = [
  {
    id: "b1",
    propertyName: "Vila Mariana Suites",
    propertyId: "1",
    roomName: "Apartamento Superior",
    roomId: "r1",
    guestName: "Eduardo Martins",
    checkIn: "2023-08-20",
    checkOut: "2023-08-23",
    status: "confirmed", // confirmed, pending, cancelled
    channel: "booking.com",
    totalValue: 867,
    whatsapp: "+5511987654321",
  },
  {
    id: "b2",
    propertyName: "Vila Mariana Suites",
    propertyId: "1",
    roomName: "Studio Deluxe",
    roomId: "r2",
    guestName: "Amanda Silva",
    checkIn: "2023-08-22",
    checkOut: "2023-08-25",
    status: "confirmed",
    channel: "airbnb",
    totalValue: 657,
    whatsapp: "+5511976543210",
  },
  {
    id: "b3",
    propertyName: "Copacabana Ocean View",
    propertyId: "2",
    roomName: "Suite Master",
    roomId: "r1",
    guestName: "Roberto Almeida",
    checkIn: "2023-08-15",
    checkOut: "2023-08-21",
    status: "pending",
    channel: "expedia",
    totalValue: 1430,
    whatsapp: "+5511965432109",
  },
  {
    id: "b4",
    propertyName: "Vila Mariana Suites",
    propertyId: "1",
    roomName: "Apartamento Premium",
    roomId: "r3",
    guestName: "Carolina Mendes",
    checkIn: "2023-08-25",
    checkOut: "2023-08-28",
    status: "cancelled",
    channel: "direct",
    totalValue: 1077,
    whatsapp: "+5511954321098",
  },
  {
    id: "b5",
    propertyName: "Copacabana Ocean View",
    propertyId: "2",
    roomName: "Suite Ocean",
    roomId: "r2",
    guestName: "Marcos Oliveira",
    checkIn: "2023-09-05",
    checkOut: "2023-09-09",
    status: "confirmed",
    channel: "booking.com",
    totalValue: 1280,
    whatsapp: "+5511943210987",
  },
];

// Mock properties data
const MOCK_PROPERTIES = [
  { id: "1", name: "Vila Mariana Suites" },
  { id: "2", name: "Copacabana Ocean View" },
];

const Reservas: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  
  const filteredBookings = MOCK_BOOKINGS.filter(booking => {
    const matchesSearch = 
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesProperty = propertyFilter === "all" || booking.propertyId === propertyFilter;
    
    return matchesSearch && matchesStatus && matchesProperty;
  });
  
  // Stats calculations
  const confirmedBookings = MOCK_BOOKINGS.filter(b => b.status === "confirmed").length;
  const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === "pending").length;
  const cancelledBookings = MOCK_BOOKINGS.filter(b => b.status === "cancelled").length;
  const totalRevenue = MOCK_BOOKINGS
    .filter(b => b.status === "confirmed")
    .reduce((sum, booking) => sum + booking.totalValue, 0);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-frontdesk-green">Confirmada</Badge>;
      case "pending":
        return <Badge className="bg-frontdesk-yellow text-black">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-frontdesk-red">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "booking.com":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800">Booking.com</Badge>;
      case "airbnb":
        return <Badge variant="outline" className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800">Airbnb</Badge>;
      case "expedia":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">Expedia</Badge>;
      case "direct":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">Direto</Badge>;
      default:
        return <Badge variant="outline">{channel}</Badge>;
    }
  };
  
  const handleOpenWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank');
  };
  
  const handleViewBooking = (id: string) => {
    toast.info(`Visualizando reserva ${id}`);
  };
  
  const handleChangeStatus = (id: string, status: string) => {
    toast.success(`Status alterado para ${status === "confirmed" ? "Confirmada" : status === "pending" ? "Pendente" : "Cancelada"}`);
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Reservas"
        description="Gerencie todas as reservas do sistema"
      />
      
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_BOOKINGS.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-frontdesk-green">{confirmedBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-frontdesk-yellow">{pendingBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faturamento Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar por hóspede, propriedade ou quarto..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <span className="text-sm mr-1">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-muted-foreground" />
              <span className="text-sm mr-1">Propriedade:</span>
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
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
          </div>
        </CardContent>
      </Card>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Hóspede</TableHead>
              <TableHead>Propriedade / Quarto</TableHead>
              <TableHead className="w-[120px]">Check-in</TableHead>
              <TableHead className="w-[120px]">Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-32">
                  <div className="flex flex-col items-center justify-center">
                    <Calendar className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-muted-foreground">Nenhuma reserva encontrada</p>
                    <Button variant="outline" size="sm">
                      Limpar Filtros
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium truncate" title={booking.guestName}>
                      {booking.guestName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.propertyName}</span>
                      <span className="text-sm text-muted-foreground">{booking.roomName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(parseISO(booking.checkIn), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(booking.checkOut), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell>
                    {getChannelBadge(booking.channel)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">
                      R$ {booking.totalValue.toLocaleString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewBooking(booking.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenWhatsApp(booking.whatsapp)}>
                            <Phone className="mr-2 h-4 w-4" />
                            WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Ver no Calendário
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart4 className="mr-2 h-4 w-4" />
                            Relatório
                          </DropdownMenuItem>
                          
                          <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => handleChangeStatus(booking.id, "confirmed")}
                            disabled={booking.status === "confirmed"}
                          >
                            <div className="mr-2 h-3 w-3 rounded-full bg-frontdesk-green" />
                            Confirmada
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleChangeStatus(booking.id, "pending")}
                            disabled={booking.status === "pending"}
                          >
                            <div className="mr-2 h-3 w-3 rounded-full bg-frontdesk-yellow" />
                            Pendente
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleChangeStatus(booking.id, "cancelled")}
                            disabled={booking.status === "cancelled"}
                            className="text-frontdesk-red focus:text-frontdesk-red"
                          >
                            <div className="mr-2 h-3 w-3 rounded-full bg-frontdesk-red" />
                            Cancelada
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredBookings.length} de {MOCK_BOOKINGS.length} reservas
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Próxima
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reservas;

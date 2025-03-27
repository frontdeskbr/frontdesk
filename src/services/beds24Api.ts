import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Beds24Token {
  token: string;
  expires_at: string;
  id?: string;
  user_id?: string;
  created_at?: string;
}

export interface Beds24Property {
  propId: string;
  propName: string;
  address?: string;
  city?: string;
  country?: string;
  pictures?: Array<{ url: string; title?: string }>;
  texts?: {
    property?: {
      description?: string;
    }
  };
  rooms?: Array<{
    roomId: string;
    roomName: string;
    defaultPrice?: number;
    maxGuests?: number;
    description?: string;
  }>;
}

export interface Beds24Booking {
  bookId: string;
  propId: string;
  roomId: string;
  firstName: string;
  lastName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalCost?: number;
  channel?: string;
  created?: string;
  modified?: string;
  adults?: number;
  children?: number;
  notes?: string;
  roomName?: string;
  propName?: string;
}

export interface Beds24User {
  userId: string;
  userName: string;
  email: string;
  userType: string;
  properties?: string[];
}

// Cache mechanism to avoid requesting the token too often
let tokenCache: Beds24Token | null = null;
let tokenCacheExpiry: Date | null = null;

/**
 * Gets a valid Beds24 API token
 */
export const getBeds24Token = async (): Promise<string> => {
  try {
    // Return cached token if it's still valid (with 5 min buffer)
    if (tokenCache && tokenCacheExpiry && tokenCacheExpiry > new Date(Date.now() + 5 * 60 * 1000)) {
      return tokenCache.token;
    }

    // Get token from database
    const { data: tokenData, error } = await supabase
      .from("beds24_tokens")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error("Token não encontrado. Por favor, configure na página de Configurações.");
    }

    if (!tokenData) {
      throw new Error("Token não encontrado. Por favor, configure na página de Configurações.");
    }

    const token = tokenData as Beds24Token;
    const expiresAt = new Date(token.expires_at);

    // Check if token is expired
    if (expiresAt < new Date()) {
      // Token expired, should refresh
      // Since this would require refresh_token, we'll just notify the user for now
      toast.error("O token da API Beds24 expirou. Por favor, atualize nas Configurações.");
      throw new Error("Token expirado");
    }

    // Cache the token
    tokenCache = token;
    tokenCacheExpiry = expiresAt;
    
    return token.token;
  } catch (error) {
    console.error("Erro ao obter token Beds24:", error);
    throw error;
  }
};

/**
 * Saves or updates a Beds24 token in the database
 */
export const saveBeds24Token = async (tokenData: Partial<Beds24Token>): Promise<Beds24Token> => {
  try {
    // Clear cache
    tokenCache = null;
    tokenCacheExpiry = null;

    // Get user ID from auth context
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");
    
    // Check if token already exists for this user
    const { data: existingToken } = await supabase
      .from("beds24_tokens")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    let result;
    
    if (existingToken) {
      // Update existing token
      const { data, error } = await supabase
        .from("beds24_tokens")
        .update({
          token: tokenData.token,
          expires_at: tokenData.expires_at,
        })
        .eq("id", existingToken.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new token
      const { data, error } = await supabase
        .from("beds24_tokens")
        .insert({
          token: tokenData.token,
          expires_at: tokenData.expires_at,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }
    
    toast.success("Token Beds24 salvo com sucesso!");
    return result as Beds24Token;
  } catch (error) {
    console.error("Erro ao salvar token Beds24:", error);
    toast.error("Erro ao salvar token. Tente novamente.");
    throw error;
  }
};

/**
 * Makes an authenticated request to the Beds24 API
 */
export const beds24Request = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: object
): Promise<T> => {
  try {
    const token = await getBeds24Token();
    
    // Make direct API call to Beds24
    const response = await fetch(`https://api.beds24.com/v2/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Check if token is expired based on the error
      if (response.status === 401 || errorData?.message?.includes?.("token")) {
        toast.error("Token da API expirado ou inválido. Atualize nas Configurações.");
        throw new Error("Token inválido ou expirado");
      }
      
      throw new Error(`Erro na API Beds24: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Erro na requisição Beds24:", error);
    throw error;
  }
};

/**
 * Gets all properties from Beds24
 */
export const getProperties = async (): Promise<Beds24Property[]> => {
  try {
    return beds24Request<Beds24Property[]>("/properties?includePictures=true&includeTexts=property&includeAllRooms=true");
  } catch (error) {
    console.error("Erro ao buscar propriedades:", error);
    toast.error("Erro ao carregar propriedades. Verifique sua conexão com a API Beds24.");
    throw error;
  }
};

/**
 * Gets bookings from Beds24
 */
export const getBookings = async (params: { 
  propertyId?: string; 
  startDate?: string; 
  endDate?: string; 
  status?: string;
} = {}): Promise<Beds24Booking[]> => {
  try {
    let queryParams = new URLSearchParams();
    
    if (params.propertyId) queryParams.append("propId", params.propertyId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.status) queryParams.append("status", params.status);
    
    const endpoint = `/bookings?${queryParams.toString()}`;
    return beds24Request<Beds24Booking[]>(endpoint);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    toast.error("Erro ao carregar reservas. Verifique sua conexão com a API Beds24.");
    throw error;
  }
};

/**
 * Gets availability data from Beds24
 */
export const getAvailability = async (params: {
  propertyId?: string;
  roomId?: string;
  startDate?: string; 
  endDate?: string;
} = {}): Promise<any[]> => {
  try {
    let queryParams = new URLSearchParams();
    
    if (params.propertyId) queryParams.append("propId", params.propertyId);
    if (params.roomId) queryParams.append("roomId", params.roomId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    
    const endpoint = `/availabilities?${queryParams.toString()}`;
    return beds24Request<any[]>(endpoint);
  } catch (error) {
    console.error("Erro ao buscar disponibilidade:", error);
    toast.error("Erro ao carregar disponibilidade. Verifique sua conexão com a API Beds24.");
    throw error;
  }
};

/**
 * Calculate total monthly revenue from bookings
 */
export const calculateMonthlyRevenue = async (month: number, year: number): Promise<number> => {
  try {
    // Get first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Get bookings for the month
    const bookings = await getBookings({
      startDate: formatDate(firstDay),
      endDate: formatDate(lastDay),
      status: 'confirmed'
    });
    
    // Calculate total revenue
    let totalRevenue = 0;
    
    for (const booking of bookings) {
      if (booking.totalCost) {
        totalRevenue += parseFloat(booking.totalCost.toString());
      }
    }
    
    return totalRevenue;
  } catch (error) {
    console.error("Erro ao calcular receita mensal:", error);
    throw error;
  }
};

/**
 * Gets active users count from Supabase
 */
export const getActiveUsersCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("beds24_tokens")
      .select("*", { count: "exact", head: true });
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error("Erro ao buscar contagem de usuários:", error);
    throw error;
  }
};

/**
 * Gets Beds24 users
 */
export const getBeds24Users = async (): Promise<Beds24User[]> => {
  try {
    return beds24Request<Beds24User[]>("/users");
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    toast.error("Erro ao carregar usuários. Verifique sua conexão com a API Beds24.");
    throw error;
  }
};

/**
 * Update a Beds24 user
 */
export const updateBeds24User = async (userId: string, userData: Partial<Beds24User>): Promise<any> => {
  try {
    return beds24Request<any>(`/users/${userId}`, "PUT", userData);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    toast.error("Erro ao atualizar usuário. Verifique sua conexão com a API Beds24.");
    throw error;
  }
};

/**
 * Delete a Beds24 user
 */
export const deleteBeds24User = async (userId: string): Promise<any> => {
  try {
    return beds24Request<any>(`/users/${userId}`, "DELETE");
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    toast.error("Erro ao excluir usuário. Verifique sua conexão com a API Beds24.");
    throw error;
  }
};

/**
 * Get properties for a specific user
 */
export const getUserProperties = async (userId: string): Promise<Beds24Property[]> => {
  try {
    return beds24Request<Beds24Property[]>(`/properties?userId=${userId}`);
  } catch (error) {
    console.error("Erro ao buscar propriedades do usuário:", error);
    toast.error("Erro ao carregar propriedades do usuário. Verifique sua conexão com a API Beds24.");
    throw error;
  }
};

/**
 * Get bookings for a specific property
 */
export const getPropertyBookings = async (propId: string): Promise<Beds24Booking[]> => {
  try {
    return beds24Request<Beds24Booking[]>(`/bookings?propId=${propId}`);
  } catch (error) {
    console.error("Erro ao buscar reservas da propriedade:", error);
    toast.error("Erro ao carregar reservas da propriedade. Verifique sua conexão com a API Beds24.");
    throw error;
  }
};

/**
 * Get booking details by ID
 */
export const getBookingDetails = async (bookId: string): Promise<Beds24Booking> => {
  try {
    const bookings = await beds24Request<Beds24Booking[]>(`/bookings?bookId=${bookId}`);
    if (!bookings || bookings.length === 0) {
      throw new Error("Reserva não encontrada");
    }
    return bookings[0];
  } catch (error) {
    console.error("Erro ao buscar detalhes da reserva:", error);
    toast.error("Erro ao carregar detalhes da reserva. Verifique sua conexão com a API Beds24.");
    throw error;
  }
};

/**
 * Get all channels from bookings
 */
export const getBookingChannels = async (): Promise<{ channel: string; count: number }[]> => {
  try {
    // Get all bookings for the last 90 days
    const today = new Date();
    const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const bookings = await getBookings({
      startDate: ninetyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
    
    // Count bookings by channel
    const channelCounts: Record<string, number> = {};
    
    for (const booking of bookings) {
      const channel = booking.channel || 'Direto';
      channelCounts[channel] = (channelCounts[channel] || 0) + 1;
    }
    
    // Convert to array of objects
    return Object.entries(channelCounts).map(([channel, count]) => ({
      channel,
      count
    }));
  } catch (error) {
    console.error("Erro ao buscar canais de reserva:", error);
    throw error;
  }
};

/**
 * Get monthly occupancy data
 */
export const getMonthlyOccupancy = async (): Promise<{ month: string; occupancy: number }[]> => {
  try {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    
    const properties = await getProperties();
    if (!properties || properties.length === 0) {
      return [];
    }
    
    const result: { month: string; occupancy: number }[] = [];
    
    // Calculate occupancy for each month
    for (let i = 0; i < 6; i++) {
      const month = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
      const monthName = format(month, 'MMM', { locale: ptBR });
      
      // Get bookings for this month
      const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
      const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const bookings = await getBookings({
        startDate: firstDay.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0],
        status: 'confirmed'
      });
      
      // Calculate days booked per property
      const totalPossibleDays = properties.length * lastDay.getDate();
      let totalBookedDays = 0;
      
      for (const booking of bookings) {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        
        // Adjust dates to be within the month
        const effectiveCheckIn = checkIn < firstDay ? firstDay : checkIn;
        const effectiveCheckOut = checkOut > lastDay ? lastDay : checkOut;
        
        // Calculate days
        const days = Math.max(0, (effectiveCheckOut.getTime() - effectiveCheckIn.getTime()) / (24 * 60 * 60 * 1000));
        totalBookedDays += days;
      }
      
      const occupancy = totalPossibleDays > 0 ? (totalBookedDays / totalPossibleDays) * 100 : 0;
      
      result.push({
        month: monthName,
        occupancy: Math.round(occupancy)
      });
    }
    
    return result;
  } catch (error) {
    console.error("Erro ao calcular ocupação mensal:", error);
    throw error;
  }
};

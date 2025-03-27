export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      beds24_tokens: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          token: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          token?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          token?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          beds24_booking_id: string | null
          check_in: string
          check_out: string
          created_at: string | null
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          guests_count: number
          id: string
          property_id: string
          room_id: string
          source: string
          status: string
          total_price: number
          updated_at: string | null
        }
        Insert: {
          beds24_booking_id?: string | null
          check_in: string
          check_out: string
          created_at?: string | null
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          guests_count?: number
          id?: string
          property_id: string
          room_id: string
          source?: string
          status?: string
          total_price: number
          updated_at?: string | null
        }
        Update: {
          beds24_booking_id?: string | null
          check_in?: string
          check_out?: string
          created_at?: string | null
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          guests_count?: number
          id?: string
          property_id?: string
          room_id?: string
          source?: string
          status?: string
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          beds24_account_id: string | null
          beds24_association: string | null
          beds24_username: string | null
          created_at: string | null
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          beds24_account_id?: string | null
          beds24_association?: string | null
          beds24_username?: string | null
          created_at?: string | null
          id: string
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          beds24_account_id?: string | null
          beds24_association?: string | null
          beds24_username?: string | null
          created_at?: string | null
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          beds24_property_id: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          name: string
          owner_id: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          beds24_property_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          beds24_property_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          base_price: number
          beds24_room_id: string | null
          created_at: string | null
          description: string | null
          id: string
          max_guests: number
          name: string
          property_id: string
          updated_at: string | null
        }
        Insert: {
          base_price?: number
          beds24_room_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_guests?: number
          name: string
          property_id: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          beds24_room_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_guests?: number
          name?: string
          property_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

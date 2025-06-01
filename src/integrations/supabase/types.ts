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
      maintenance_items: {
        Row: {
          cost_estimate: number | null
          created_at: string
          description: string
          id: string
          interval_type: string
          interval_value: number
          is_active: boolean | null
          item_type: string
          last_service_date: string | null
          last_service_mileage: number | null
          next_due_date: string | null
          next_due_mileage: number | null
          notes: string | null
          priority: string | null
          updated_at: string
          vehicle_id: string
          vendor_id: string | null
        }
        Insert: {
          cost_estimate?: number | null
          created_at?: string
          description: string
          id?: string
          interval_type: string
          interval_value: number
          is_active?: boolean | null
          item_type: string
          last_service_date?: string | null
          last_service_mileage?: number | null
          next_due_date?: string | null
          next_due_mileage?: number | null
          notes?: string | null
          priority?: string | null
          updated_at?: string
          vehicle_id: string
          vendor_id?: string | null
        }
        Update: {
          cost_estimate?: number | null
          created_at?: string
          description?: string
          id?: string
          interval_type?: string
          interval_value?: number
          is_active?: boolean | null
          item_type?: string
          last_service_date?: string | null
          last_service_mileage?: number | null
          next_due_date?: string | null
          next_due_mileage?: number | null
          notes?: string | null
          priority?: string | null
          updated_at?: string
          vehicle_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_notifications: {
        Row: {
          created_at: string
          due_date: string | null
          id: string
          is_read: boolean | null
          maintenance_item_id: string | null
          message: string
          notification_type: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          id?: string
          is_read?: boolean | null
          maintenance_item_id?: string | null
          message: string
          notification_type: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          id?: string
          is_read?: boolean | null
          maintenance_item_id?: string | null
          message?: string
          notification_type?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_notifications_maintenance_item_id_fkey"
            columns: ["maintenance_item_id"]
            isOneToOne: false
            referencedRelation: "maintenance_items"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_documents: {
        Row: {
          document_name: string
          document_number: string | null
          document_type: string
          document_url: string
          expiry_date: string | null
          id: string
          issued_date: string | null
          issuing_authority: string | null
          notes: string | null
          uploaded_at: string
          uploaded_by: string | null
          vehicle_id: string
        }
        Insert: {
          document_name: string
          document_number?: string | null
          document_type: string
          document_url: string
          expiry_date?: string | null
          id?: string
          issued_date?: string | null
          issuing_authority?: string | null
          notes?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          vehicle_id: string
        }
        Update: {
          document_name?: string
          document_number?: string | null
          document_type?: string
          document_url?: string
          expiry_date?: string | null
          id?: string
          issued_date?: string | null
          issuing_authority?: string | null
          notes?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          vehicle_id?: string
        }
        Relationships: []
      }
      vehicle_photos: {
        Row: {
          description: string | null
          id: string
          photo_type: string | null
          photo_url: string
          uploaded_at: string
          uploaded_by: string | null
          vehicle_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          photo_type?: string | null
          photo_url: string
          uploaded_at?: string
          uploaded_by?: string | null
          vehicle_id: string
        }
        Update: {
          description?: string | null
          id?: string
          photo_type?: string | null
          photo_url?: string
          uploaded_at?: string
          uploaded_by?: string | null
          vehicle_id?: string
        }
        Relationships: []
      }
      vendor_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          notes: string | null
          phone: string | null
          title: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          title?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          title?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_contacts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: Json | null
          company_name: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          status: string | null
          tax_id: string | null
          updated_at: string
          vendor_number: string
          website: string | null
        }
        Insert: {
          address?: Json | null
          company_name: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string
          vendor_number: string
          website?: string | null
        }
        Update: {
          address?: Json | null
          company_name?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          updated_at?: string
          vendor_number?: string
          website?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          id: string;
          name: string;
          type: 'truck' | 'van' | 'trailer' | 'equipment';
          status: 'active' | 'inactive' | 'maintenance' | 'out-of-service';
          location: { lat: number; lng: number; address: string; lastUpdate: string };
          driver?: string;
          fuelLevel: number;
          mileage: number;
          maintenanceScore: number;
          route?: string;
          speed: number;
          engineHours: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'truck' | 'van' | 'trailer' | 'equipment';
          status: 'active' | 'inactive' | 'maintenance' | 'out-of-service';
          location: { lat: number; lng: number; address: string; lastUpdate: string };
          driver?: string;
          fuelLevel: number;
          mileage: number;
          maintenanceScore: number;
          route?: string;
          speed: number;
          engineHours: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'truck' | 'van' | 'trailer' | 'equipment';
          status?: 'active' | 'inactive' | 'maintenance' | 'out-of-service';
          location?: { lat: number; lng: number; address: string; lastUpdate: string };
          driver?: string;
          fuelLevel?: number;
          mileage?: number;
          maintenanceScore?: number;
          route?: string;
          speed?: number;
          engineHours?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      },
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_maintenance_due: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_vendor_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          birthCenterId: string;
          created_at: string;
          id: number;
          patientId: string;
          scheduledAt: string;
          serviceId: number;
          status: Database["public"]["Enums"]["status_enum"];
          updated_at: string | null;
        };
        Insert: {
          birthCenterId: string;
          created_at?: string;
          id?: number;
          patientId: string;
          scheduledAt: string;
          serviceId: number;
          status: Database["public"]["Enums"]["status_enum"];
          updated_at?: string | null;
        };
        Update: {
          birthCenterId?: string;
          created_at?: string;
          id?: number;
          patientId?: string;
          scheduledAt?: string;
          serviceId?: number;
          status?: Database["public"]["Enums"]["status_enum"];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_birthCenterId_fkey";
            columns: ["birthCenterId"];
            isOneToOne: false;
            referencedRelation: "birth_centers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_patientId_fkey";
            columns: ["patientId"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_serviceId_fkey";
            columns: ["serviceId"];
            isOneToOne: false;
            referencedRelation: "birth_center_services";
            referencedColumns: ["id"];
          }
        ];
      };
      birth_center_services: {
        Row: {
          birthCenterId: string | null;
          created_at: string;
          duration: unknown | null;
          id: number;
          price: number | null;
          serviceDescription: string | null;
          serviceName: string | null;
          status: Database["public"]["Enums"]["service_status"] | null;
          updated_at: string | null;
        };
        Insert: {
          birthCenterId?: string | null;
          created_at?: string;
          duration?: unknown | null;
          id?: number;
          price?: number | null;
          serviceDescription?: string | null;
          serviceName?: string | null;
          status?: Database["public"]["Enums"]["service_status"] | null;
          updated_at?: string | null;
        };
        Update: {
          birthCenterId?: string | null;
          created_at?: string;
          duration?: unknown | null;
          id?: number;
          price?: number | null;
          serviceDescription?: string | null;
          serviceName?: string | null;
          status?: Database["public"]["Enums"]["service_status"] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "birth_center_services_birthCenterId_fkey";
            columns: ["birthCenterId"];
            isOneToOne: false;
            referencedRelation: "birth_centers";
            referencedColumns: ["id"];
          }
        ];
      };
      birth_centers: {
        Row: {
          address: string | null;
          centerName: string | null;
          created_at: string;
          environment: string | null;
          id: string;
          latitude: number | null;
          logoUrl: string | null;
          longitude: number | null;
          phoneNumber: string | null;
          websiteUrl: string | null;
        };
        Insert: {
          address?: string | null;
          centerName?: string | null;
          created_at?: string;
          environment?: string | null;
          id?: string;
          latitude?: number | null;
          logoUrl?: string | null;
          longitude?: number | null;
          phoneNumber?: string | null;
          websiteUrl?: string | null;
        };
        Update: {
          address?: string | null;
          centerName?: string | null;
          created_at?: string;
          environment?: string | null;
          id?: string;
          latitude?: number | null;
          logoUrl?: string | null;
          longitude?: number | null;
          phoneNumber?: string | null;
          websiteUrl?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "birth_centers_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "user_roles";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          created_at: string;
          id: string;
          sent_by: string | null;
          text: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          sent_by?: string | null;
          text: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          sent_by?: string | null;
          text?: string;
        };
        Relationships: [];
      };
      patients: {
        Row: {
          address: string | null;
          age: number | null;
          birthDate: string | null;
          created_at: string;
          fullName: string | null;
          gender: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          phoneNumber: string | null;
        };
        Insert: {
          address?: string | null;
          age?: number | null;
          birthDate?: string | null;
          created_at?: string;
          fullName?: string | null;
          gender?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          phoneNumber?: string | null;
        };
        Update: {
          address?: string | null;
          age?: number | null;
          birthDate?: string | null;
          created_at?: string;
          fullName?: string | null;
          gender?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          phoneNumber?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "patients_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "user_roles";
            referencedColumns: ["id"];
          }
        ];
      };
      subscribed_patients: {
        Row: {
          birthCenterId: string;
          created_at: string;
          id: number;
          patientId: string;
          status: Database["public"]["Enums"]["subscription_status"] | null;
          subscribedOn: string | null;
          subscriptionExpiry: string | null;
        };
        Insert: {
          birthCenterId: string;
          created_at?: string;
          id?: number;
          patientId: string;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          subscribedOn?: string | null;
          subscriptionExpiry?: string | null;
        };
        Update: {
          birthCenterId?: string;
          created_at?: string;
          id?: number;
          patientId?: string;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          subscribedOn?: string | null;
          subscriptionExpiry?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscribed_patients_birthCenterId_fkey";
            columns: ["birthCenterId"];
            isOneToOne: false;
            referencedRelation: "birth_centers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscribed_patients_patientId_fkey";
            columns: ["patientId"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          }
        ];
      };
      user_roles: {
        Row: {
          created_at: string | null;
          id: string;
          role: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          role: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      service_status: "inactive" | "active";
      status_enum: "scheduled" | "completed";
      subscription_status: "inactive" | "active";
      user_role: "patient" | "birth_center";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

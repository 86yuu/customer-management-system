
import { Database as SupabaseDatabase } from "@/integrations/supabase/types";

// Extend the Supabase database types with our custom tables
export interface ExtendedDatabase extends SupabaseDatabase {
  public: SupabaseDatabase['public'] & {
    Tables: SupabaseDatabase['public']['Tables'] & {
      admins: {
        Row: {
          user_id: string;
          name: string | null;
        };
        Insert: {
          user_id: string;
          name?: string | null;
        };
        Update: {
          user_id?: string;
          name?: string | null;
        };
        Relationships: never[];
      };
      user_customer_map: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_id: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_id?: string;
        };
        Relationships: never[];
      };
    };
  };
}


import { User, Session } from "@supabase/supabase-js";

// Define user roles
export type UserRole = "admin" | "customer" | "user";

// Define the types for our auth context
export type AuthContextType = {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  checkUserRole: () => Promise<UserRole | null>;
};

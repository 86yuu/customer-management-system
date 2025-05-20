
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { UserRole } from "@/types/auth";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Function to check user role
  const checkUserRole = async (user?: User | null): Promise<UserRole | null> => {
    try {
      if (!user) return null;

      // First check if user is an admin
      const { data: adminData, error: adminError } = await extendedSupabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminData) {
        setUserRole('admin');
        return 'admin';
      }

      // Then check if user is a customer
      const { data: customerData, error: customerError } = await extendedSupabase
        .from("user_customer_map")
        .select("customer_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (customerData) {
        setUserRole('customer');
        return 'customer';
      }

      // Default role
      setUserRole('user');
      return 'user';
    } catch (error) {
      console.error("Error checking user role:", error);
      return null;
    }
  };

  return {
    userRole,
    setUserRole,
    checkUserRole
  };
};


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { extendedSupabase } from "@/integrations/supabase/extended-client";
import { User } from "@supabase/supabase-js";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuthSession } from "@/hooks/useAuthSession";
import { UserRole } from "@/types/auth";
import { getNextCustomerId } from "@/services/customerService";

export const useAuthProvider = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, setLoading } = useAuthSession();
  const { userRole, checkUserRole } = useUserRole();

  // Setup auth state listener
  useEffect(() => {
    // If user exists, check their role
    if (user && !userRole) {
      // Use setTimeout to prevent potential auth deadlocks
      setTimeout(async () => {
        const role = await checkUserRole(user);
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/dashboard');
        } else if (role === 'customer') {
          navigate('/customer-profile');
        } else {
          navigate('/dashboard');
        }
      }, 0);
    }
  }, [user, userRole, navigate, checkUserRole]);

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole = 'user') => {
    setLoading(true);
    
    try {
      // If the user will be a customer, generate a customer number first
      let custno = "";
      if (role === 'customer') {
        custno = await getNextCustomerId();
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            custno, // Store the customer number in user metadata
          },
        },
      });
      
      if (error) throw error;
      
      // If role is specified and user is created, add to appropriate role table
      if (data.user) {
        if (role === 'admin') {
          // Insert into admins table
          const { error: adminError } = await extendedSupabase
            .from("admins")
            .insert({
              user_id: data.user.id,
              name
            });
          if (adminError) throw adminError;
        } else if (role === 'customer') {
          // Create customer record in customer table
          const { error: custError } = await supabase
            .from('customer')
            .insert({
              custno: custno,
              custname: name,
              address: '',
              payterm: 'COD'
            });
          if (custError) throw custError;

          // Link user to customer record
          const { error: mapError } = await extendedSupabase
            .from("user_customer_map")
            .insert({
              user_id: data.user.id,
              customer_id: custno
            });
          if (mapError) throw mapError;
        }
      }
      
      toast({
        title: "Account created",
        description: "Check your email for the confirmation link.",
      });

      // Call checkUserRole to set the role state
      if (data.user) {
        setTimeout(async () => {
          await checkUserRole(data.user);
        }, 0);
      }
      
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check user role and navigate accordingly
      setTimeout(async () => {
        const role = await checkUserRole(data.user);
        
        toast({
          title: "Login successful",
          description: `Welcome back!`,
        });
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/dashboard');
        } else if (role === 'customer') {
          navigate('/customer-profile');
        } else {
          navigate('/dashboard');
        }
      }, 0);
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });

      // Navigate to login page after logout
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    userRole,
    loading,
    login,
    signup,
    logout,
    checkUserRole: () => checkUserRole(user)
  };
};

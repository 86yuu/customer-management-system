
import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CustomerTopBar from "./CustomerTopBar";

const CustomerLayout = () => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated or not a customer
  useEffect(() => {
    if (!loading && (!user || userRole !== 'customer')) {
      navigate("/login");
    }
  }, [user, loading, userRole, navigate]);

  // If loading, show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user or not a customer, redirect to login
  if (!user || userRole !== 'customer') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <CustomerTopBar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
      <footer className="border-t px-6 py-3 text-center text-sm text-muted-foreground">
        <p>© 2025 CRM System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerLayout;

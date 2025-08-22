"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuthStore, UserRole } from "@/lib/store";

interface AuthContextType {
  user: {
    email: string;
    role: UserRole;
    name?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
  } | null;
  login: (email: string, password: string, userType: "administrator" | "merchant" | "partner-bank" | "submerchant") => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, login, logout, isLoading, error, initializeAuth } = useAuthStore();
  
  // Initialize authentication state on app startup
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
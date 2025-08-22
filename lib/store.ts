"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "./api/services/auth.service";
import { UserRole as ApiUserRole, User as ApiUser } from "./api/types";

export type UserRole = "administrator" | "merchant" | "partner-bank" | "submerchant" | null;

interface User {
  email: string;
  role: UserRole;
  name?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  showLogoutModal: boolean;
  login: (email: string, password: string, userType: "administrator" | "merchant" | "partner-bank" | "submerchant") => Promise<boolean>;
  logout: () => void;
  setShowLogoutModal: (show: boolean) => void;
  clearError: () => void;
  requestPasswordReset: (email: string, userType: "administrator" | "merchant" | "partner-bank" | "submerchant") => Promise<void>;
  initializeAuth: () => User | null;
}

// Helper function to map API user role to local user role
const mapApiUserRole = (apiRole: ApiUserRole): UserRole => {
  switch (apiRole) {
    case ApiUserRole.ADMINISTRATOR:
      return "administrator";
    case ApiUserRole.MERCHANT:
      return "merchant";
    case ApiUserRole.PARTNER_BANK:
      return "partner-bank";
    case ApiUserRole.SUB_MERCHANT:
      return "submerchant";
    default:
      return null;
  }
};

// Helper function to convert API user to local user format
const convertApiUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    role: mapApiUserRole(apiUser.role),
    name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
  };
};



export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      showLogoutModal: false,
      
      // Initialize auth state from stored tokens
      initializeAuth: () => {
        if (authService.isAuthenticated()) {
          try {
            // Get stored user data from localStorage
            const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null;
            if (storedUserStr) {
              const storedUser = JSON.parse(storedUserStr);
              const user = convertApiUser(storedUser);
              set({ user });
              return user;
            }
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
          }
        }
        return null;
      },
      
      login: async (email, password, userType) => {
        set({ isLoading: true, error: null });
        
        try {
          let response;
          
          // Use partner bank login for partner-bank users
          if (userType === "partner-bank") {
            // Extract partner bank slug from email or use a default
            // This might need to be adjusted based on your partner bank setup
            const partnerSlug = email.split("@")[1]?.split(".")[0] || "default";
            response = await authService.partnerBankLogin(partnerSlug, { email, password, userType });
          } else {
            response = await authService.login({ email, password, userType });
          }
          
          // Store user data in localStorage for persistence
          if (response.user) {
            const user = convertApiUser(response.user);
            if (typeof window !== 'undefined') {
              localStorage.setItem('user_data', JSON.stringify(response.user));
            }
            set({ user, isLoading: false });
            return true;
          } else {
            set({ 
              error: "Login failed - invalid credentials", 
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An unknown error occurred", 
            isLoading: false 
          });
          return false;
        }
      },
      
      logout: () => {
        set({ showLogoutModal: true });
      },
      
      setShowLogoutModal: (show: boolean) => {
        if (!show) {
          // Actually logout when modal is closed
          const userRole = get().user?.role;
          
          // Clear auth service tokens
          authService.logout();
          // Clear user data from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user_data');
          }
          set({ user: null, showLogoutModal: false });
          
          // Redirect to the appropriate login page based on the user's role
          if (userRole === "administrator") {
            window.location.href = "/login/admin";
          } else if (userRole === "partner-bank") {
            window.location.href = "/login/partner-bank";
          } else if (userRole === "submerchant") {
            window.location.href = "/login/submerchant";
          } else {
            window.location.href = "/login/merchant";
          }
        } else {
          set({ showLogoutModal: show });
        }
      },
      
      clearError: () => set({ error: null }),
      
      requestPasswordReset: async (email) => {
        set({ isLoading: true, error: null });
        
        try {
          await authService.initiatePasswordReset({ email });
          set({ isLoading: false });
          // Success - password reset email sent
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to process reset request",
            isLoading: false
          });
        }
      }
    }),
    {
      name: "blupay-auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
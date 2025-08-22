"use client";

import { LogIn, LogOut, Clock } from "lucide-react";
import { toast } from "sonner";

interface User {
  name?: string;
  email: string;
}

interface SuccessToastOptions {
  type: "login" | "logout";
  userType: "administrator" | "merchant" | "partner-bank" | "submerchant";
  user?: User;
  duration?: number;
}

export const showSuccessToast = ({ 
  type, 
  userType, 
  user, 
  duration = 4000
}: SuccessToastOptions) => {
  const timestamp = new Date().toLocaleTimeString();
  const sessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const getUserTypeLabel = () => {
    switch (userType) {
      case "administrator": return "Admin";
      case "merchant": return "Merchant";
      case "partner-bank": return "Partner Bank";
      case "submerchant": return "SubMerchant";
      default: return "User";
    }
  };

  const getGradientColors = () => {
    switch (userType) {
      case "administrator": return {
        bg: "bg-purple-100 dark:bg-purple-900",
        text: "text-purple-600 dark:text-purple-300",
        accent: "text-purple-500 dark:text-purple-400"
      };
      case "merchant": return {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-600 dark:text-blue-300",
        accent: "text-blue-500 dark:text-blue-400"
      };
      case "partner-bank": return {
        bg: "bg-emerald-100 dark:bg-emerald-900",
        text: "text-emerald-600 dark:text-emerald-300",
        accent: "text-emerald-500 dark:text-emerald-400"
      };
      case "submerchant": return {
        bg: "bg-orange-100 dark:bg-orange-900",
        text: "text-orange-600 dark:text-orange-300",
        accent: "text-orange-500 dark:text-orange-400"
      };
      default: return {
        bg: "bg-gray-100 dark:bg-gray-900",
        text: "text-gray-600 dark:text-gray-300",
        accent: "text-gray-500 dark:text-gray-400"
      };
    }
  };

  const getTitle = () => {
    if (type === "login") {
      return `Welcome to ${getUserTypeLabel()} Portal!`;
    }
    return "Logged Out Successfully";
  };

  const getDescription = () => {
    if (type === "login") {
      return `Hello ${user?.name || user?.email?.split('@')[0] || 'User'}! You're now logged in.`;
    }
    return "You have been securely logged out of your account.";
  };

  const getIcon = () => {
    if (type === "login") {
      return LogIn;
    }
    return LogOut;
  };

  const colors = getGradientColors();
  const Icon = getIcon();

  toast.custom((t) => (
    <div className="animate-slide-in-from-top-full w-[95%] max-w-md mx-auto bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col sm:flex-row ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10">
      <div className="flex-1 w-full p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className={`h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center`}>
              <Icon className={`h-6 w-6 ${colors.text}`} />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getTitle()}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {getDescription()}
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="mr-1 h-3 w-3" />
              {timestamp}
              {type === "login" && (
                <>
                  {" • "}
                  Session: {sessionId}
                </>
              )}
            </div>
            {type === "login" && (
              <div className="mt-2 text-xs text-gray-400">
                Redirecting to dashboard...
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-800 flex">
        <button
          onClick={() => toast.dismiss(t)}
          className={`w-full border border-transparent rounded-b-lg sm:rounded-b-none sm:rounded-r-lg p-4 flex items-center justify-center text-sm font-medium ${colors.accent} hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-current`}
        >
          Dismiss
        </button>
      </div>
    </div>
  ), {
    id: `${type}-success-${userType}`,
    duration: type === "login" ? 3000 : duration,
    position: "top-center"
  });

  return new Promise(resolve => setTimeout(resolve, 300));
};

export const showLoginSuccess = (userType: SuccessToastOptions['userType'], user?: User) => {
  return showSuccessToast({
    type: "login",
    userType,
    user
  });
};

export const showLogoutSuccess = (userType: SuccessToastOptions['userType']) => {
  return showSuccessToast({
    type: "logout",
    userType,
    duration: 4000
  });
};
"use client";

import { ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  name?: string;
  email: string;
}

export const showAdminLoginToast = (user: AdminUser) => {
  const loginTime = new Date().toLocaleTimeString();
  const sessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  toast.custom((t) => (
    <div className="animate-slide-in-from-top-full w-[95%] max-w-md mx-auto bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col sm:flex-row ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10">
      <div className="flex-1 w-full p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Admin Login Successful
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Welcome back, {user.name || "Admin"}!
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="mr-1 h-3 w-3" />
              {loginTime} • Session: {sessionId}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-800 flex">
        <button
          onClick={() => toast.dismiss(t)}
          className="w-full border border-transparent rounded-b-lg sm:rounded-b-none sm:rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Dismiss
        </button>
      </div>
    </div>
  ), {
    id: "admin-login-success",
    duration: 6000,
    position: "top-center"
  });
  
  // Return a promise that resolves after allowing time for the toast to be seen
  return new Promise(resolve => setTimeout(resolve, 300));
}; 
"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IconHome, 
  IconTransfer,
  IconCreditCard, 
  IconUser,
  IconWallet,
  IconDevices,
  IconLogout,
  IconMenu2,
  IconX
} from "@tabler/icons-react";
import { showLogoutSuccess } from "@/components/success-toast";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function SidebarItem({ href, icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted"
        }`}
      >
        <div className="w-5 h-5">{icon}</div>
        <span className="text-sm sm:text-base">{label}</span>
      </div>
    </Link>
  );
}

export default function SubmerchantDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = async () => {
    // Show logout success toast
    await showLogoutSuccess("submerchant");
    
    // Clear user data and redirect
    setTimeout(() => {
      window.location.href = "/login/submerchant";
    }, 500);
  };
  
  const sidebarItems = [
    {
      href: "/submerchant/dashboard",
      icon: <IconHome className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/submerchant/dashboard/transactions",
      icon: <IconTransfer className="w-5 h-5" />,
      label: "Transactions",
    },
    {
      href: "/submerchant/dashboard/payments",
      icon: <IconCreditCard className="w-5 h-5" />,
      label: "Payments",
    },
    {
      href: "/submerchant/dashboard/wallet",
      icon: <IconWallet className="w-5 h-5" />,
      label: "Wallet",
    },
    {
      href: "/submerchant/dashboard/terminals",
      icon: <IconDevices className="w-5 h-5" />,
      label: "Terminals",
    },
    {
      href: "/submerchant/dashboard/profile",
      icon: <IconUser className="w-5 h-5" />,
      label: "Profile",
    },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-6 lg:justify-start">
            <div className="flex items-center space-x-2 px-3">
              <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0"></div>
              <span className="text-lg sm:text-xl font-bold">BluPay SubMerchant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={closeSidebar}
            >
              <IconX className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
                onClick={closeSidebar}
              />
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t bg-card">
          <button
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="flex items-center space-x-3 px-3 py-2 rounded-md w-full transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <div className="w-5 h-5">
              <IconLogout className="w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <IconMenu2 className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary"></div>
            <span className="font-semibold text-sm">SubMerchant</span>
          </div>
        </header>
        
        {/* Page content */}
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
} 
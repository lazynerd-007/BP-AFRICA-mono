"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IconHome, 
  IconTransfer,
  IconCreditCard, 
  IconUsers,
  IconUser,
  IconBuildingBank,
  IconLogout,
  IconMenu2,
  IconX
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { showLogoutSuccess } from "@/components/success-toast";

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
        <div className="w-5 h-5 flex-shrink-0">{icon}</div>
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
}

export default function PartnerBankDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = async () => {
    // Show logout success toast
    await showLogoutSuccess("partner-bank");
    
    // Clear user data and redirect
    setTimeout(() => {
      window.location.href = "/login/partner-bank";
    }, 500);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const sidebarItems = [
    {
      href: "/partner-bank/dashboard",
      icon: <IconHome className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/partner-bank/dashboard/transactions",
      icon: <IconTransfer className="w-5 h-5" />,
      label: "Transactions",
    },
    {
      href: "/partner-bank/dashboard/settlements",
      icon: <IconCreditCard className="w-5 h-5" />,
      label: "Settlements",
    },
    {
      href: "/partner-bank/dashboard/merchants",
      icon: <IconBuildingBank className="w-5 h-5" />,
      label: "Merchants",
    },
    {
      href: "/partner-bank/dashboard/users",
      icon: <IconUsers className="w-5 h-5" />,
      label: "User Management",
    },
    {
      href: "/partner-bank/dashboard/profile",
      icon: <IconUser className="w-5 h-5" />,
      label: "Profile",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-card flex-col h-screen sticky top-0 z-30">
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-6 px-3">
            <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0"></div>
            <span className="text-lg font-bold truncate">BluPay Partner</span>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t bg-card">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 rounded-md w-full transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <div className="w-5 h-5 flex-shrink-0">
              <IconLogout className="w-5 h-5" />
            </div>
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 w-64 h-full bg-card z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex-1 overflow-y-auto">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-6 px-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0"></div>
                <span className="text-lg font-bold truncate">BluPay Partner</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={closeSidebar}
                className="h-8 w-8"
              >
                <IconX className="h-4 w-4" />
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
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-md w-full transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <div className="w-5 h-5 flex-shrink-0">
                <IconLogout className="w-5 h-5" />
              </div>
              <span className="truncate">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-card border-b px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9"
          >
            <IconMenu2 className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary"></div>
            <span className="font-semibold text-sm">BluPay Partner</span>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 
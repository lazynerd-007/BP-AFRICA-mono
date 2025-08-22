"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IconHome, 
  IconCreditCard, 
  IconWallet,
  IconReceipt,
  IconDeviceMobile,
  IconUser,
  IconCode,
  IconUsers,
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

export default function MerchantDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = async () => {
    // Show logout success toast
    await showLogoutSuccess("merchant");
    
    // Clear user data and redirect
    setTimeout(() => {
      window.location.href = "/login/merchant";
    }, 500);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const sidebarItems = [
    {
      href: "/merchant/dashboard",
      icon: <IconHome className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/merchant/dashboard/transactions",
      icon: <IconReceipt className="w-5 h-5" />,
      label: "Transactions",
    },
    {
      href: "/merchant/dashboard/payments",
      icon: <IconCreditCard className="w-5 h-5" />,
      label: "Payments",
    },
    {
      href: "/merchant/dashboard/wallet",
      icon: <IconWallet className="w-5 h-5" />,
      label: "Wallet",
    },
    {
      href: "/merchant/dashboard/terminals",
      icon: <IconDeviceMobile className="w-5 h-5" />,
      label: "Terminals",
    },
    {
      href: "/merchant/dashboard/developer",
      icon: <IconCode className="w-5 h-5" />,
      label: "Developer",
    },
    {
      href: "/merchant/dashboard/users",
      icon: <IconUsers className="w-5 h-5" />,
      label: "Users",
    },
    {
      href: "/merchant/dashboard/profile",
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
      <aside className="hidden lg:flex w-64 border-r bg-card p-4 flex-col h-screen fixed left-0 top-0 z-30">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-6 px-3 flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0"></div>
          <span className="text-lg font-bold truncate">BluPay Merchant</span>
        </div>
        
        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto space-y-1 pr-2">
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
        
        {/* Logout Button - Fixed at bottom */}
        <div className="pt-4 border-t flex-shrink-0">
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
        <div className="flex flex-col h-full p-4">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-6 px-3 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0"></div>
              <span className="text-lg font-bold truncate">BluPay Merchant</span>
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
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto space-y-1 pr-2">
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
          
          {/* Logout Button - Fixed at bottom */}
          <div className="pt-4 border-t flex-shrink-0">
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
      <div className="flex-1 lg:ml-64">
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
            <span className="font-semibold text-sm">BluPay Merchant</span>
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
"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const pathname = usePathname()
  
  // Function to get the page title based on the current path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname.startsWith("/dashboard/merchant")) return "Merchant Management"

    if (pathname.startsWith("/dashboard/transactions")) return "Transactions Report"
    if (pathname.startsWith("/dashboard/users")) return "User Management"
    
    // Default case
    const path = pathname.split("/").filter(Boolean)
    const lastSegment = path[path.length - 1]
    return lastSegment 
      ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
      : "Dashboard"
  }
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
      </div>
    </header>
  )
}

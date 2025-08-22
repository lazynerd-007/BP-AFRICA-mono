"use client"

import * as React from "react"
import Link from "next/link"
import { IconChevronRight, IconHome, IconDots } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  current?: boolean
  disabled?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  maxItems?: number
  showHome?: boolean
  homeHref?: string
  separator?: React.ReactNode
  className?: string
  itemClassName?: string
  currentClassName?: string
}

export function Breadcrumb({
  items,
  maxItems = 3,
  showHome = true,
  homeHref = "/",
  separator = <IconChevronRight className="h-4 w-4 text-muted-foreground" />,
  className,
  itemClassName,
  currentClassName,
}: BreadcrumbProps) {
  const allItems = React.useMemo(() => {
    const breadcrumbItems = [...items]
    
    if (showHome && breadcrumbItems[0]?.href !== homeHref) {
      breadcrumbItems.unshift({
        label: "Home",
        href: homeHref,
        icon: IconHome,
      })
    }
    
    return breadcrumbItems
  }, [items, showHome, homeHref])

  const { visibleItems, hiddenItems } = React.useMemo(() => {
    if (allItems.length <= maxItems) {
      return { visibleItems: allItems, hiddenItems: [] }
    }

    // Always show first item, last item, and current item
    const first = allItems[0]
    const last = allItems[allItems.length - 1]
    const remaining = allItems.slice(1, -1)
    
    if (remaining.length <= maxItems - 2) {
      return { visibleItems: allItems, hiddenItems: [] }
    }

    // Show first, ellipsis, and last few items
    const visibleCount = maxItems - 2 // Account for first item and ellipsis
    const visibleRemaining = remaining.slice(-visibleCount)
    const hiddenRemaining = remaining.slice(0, -visibleCount)

    return {
      visibleItems: [first, ...visibleRemaining, last],
      hiddenItems: hiddenRemaining,
    }
  }, [allItems, maxItems])

  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === visibleItems.length - 1
    const isCurrent = item.current || isLast
    const Icon = item.icon

    const content = (
      <span className={cn(
        "flex items-center gap-1 text-sm",
        isCurrent 
          ? cn("font-medium text-foreground", currentClassName)
          : "text-muted-foreground hover:text-foreground transition-colors",
        item.disabled && "opacity-50 cursor-not-allowed",
        itemClassName
      )}>
        {Icon && <Icon className="h-4 w-4" />}
        {item.label}
      </span>
    )

    if (item.disabled || isCurrent || !item.href) {
      return content
    }

    return (
      <Link href={item.href} className="hover:underline">
        {content}
      </Link>
    )
  }

  const renderEllipsis = () => {
    if (hiddenItems.length === 0) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-muted-foreground hover:text-foreground"
          >
            <IconDots className="h-4 w-4" />
            <span className="sr-only">Show hidden breadcrumb items</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {hiddenItems.map((item, index) => (
            <DropdownMenuItem key={index} asChild={!!item.href} disabled={item.disabled}>
              {item.href ? (
                <Link href={item.href} className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1", className)}>
      <ol className="flex items-center space-x-1">
        {visibleItems.map((item, index) => (
          <React.Fragment key={index}>
            <li className="flex items-center">
              {/* Show ellipsis after first item if there are hidden items */}
              {index === 1 && hiddenItems.length > 0 && (
                <>
                  {renderEllipsis()}
                  <span className="mx-1">{separator}</span>
                </>
              )}
              {renderBreadcrumbItem(item, index)}
            </li>
            {index < visibleItems.length - 1 && (
              <li className="flex items-center">
                <span className="mx-1">{separator}</span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbs(
  pathname: string,
  routeMap?: Record<string, string>
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = routeMap?.[href] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    breadcrumbs.push({
      label,
      href,
      current: index === segments.length - 1,
    })
  })

  return breadcrumbs
} 
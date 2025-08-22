"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { IconLoader2, IconRefresh } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// Spinner component
export function Spinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <IconLoader2 
      className={cn("animate-spin", sizeClasses[size], className)} 
    />
  )
}

// Full page loading
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

// Component loading overlay
export function LoadingOverlay({ 
  isLoading, 
  children, 
  message = "Loading..." 
}: { 
  isLoading: boolean
  children: React.ReactNode
  message?: string 
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center space-y-2">
            <Spinner />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Button loading state
export function LoadingButton({ 
  loading, 
  children, 
  disabled,
  ...props 
}: React.ComponentProps<typeof Button> & { loading?: boolean }) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading && <Spinner size="sm" className="mr-2" />}
      {children}
    </Button>
  )
}

// Table loading skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Card loading skeleton
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )
}

// List loading skeleton
export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Form loading skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/5" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-10 w-1/4" />
    </div>
  )
}

// Dashboard stats loading
export function StatsLoading({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Empty state component
export function EmptyState({ 
  title, 
  description, 
  action,
  icon: Icon 
}: { 
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      {action}
    </div>
  )
}

// Retry component for failed states
export function RetryState({ 
  onRetry, 
  message = "Something went wrong" 
}: { 
  onRetry: () => void
  message?: string 
}) {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        <IconRefresh className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  )
}

// Loading wrapper for async operations
export function AsyncWrapper<T>({ 
  data, 
  loading, 
  error, 
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children 
}: {
  data: T | null | undefined
  loading: boolean
  error: Error | null
  onRetry?: () => void
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
  children: (data: T) => React.ReactNode
}) {
  if (loading) {
    return <>{loadingComponent || <PageLoading />}</>
  }

  if (error) {
    return <>{errorComponent || <RetryState onRetry={onRetry || (() => {})} message={error.message} />}</>
  }

  if (!data) {
    return <>{emptyComponent || <EmptyState title="No data available" />}</>
  }

  return <>{children(data)}</>
} 
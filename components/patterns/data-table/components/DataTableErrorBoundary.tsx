"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { IconRefresh, IconAlertTriangle } from "@tabler/icons-react"

interface DataTableErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface DataTableErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; retry: () => void }>
}

export class DataTableErrorBoundary extends React.Component<
  DataTableErrorBoundaryProps,
  DataTableErrorBoundaryState
> {
  constructor(props: DataTableErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): DataTableErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('DataTable Error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} retry={this.handleRetry} />
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ 
  error, 
  retry 
}: { 
  error: Error | null
  retry: () => void 
}) {
  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
      <div className="flex items-center gap-2 mb-3">
        <IconAlertTriangle className="h-5 w-5 text-destructive" />
        <h3 className="font-semibold text-destructive">
          Failed to load table
        </h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        {error?.message || "An unexpected error occurred while loading the data table."}
      </p>
      
      <Button
        variant="outline"
        size="sm"
        onClick={retry}
        className="gap-2"
      >
        <IconRefresh className="h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}

// Hook for error boundary in functional components
export function useDataTableErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)
  
  const resetError = React.useCallback(() => {
    setError(null)
  }, [])
  
  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])
  
  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])
  
  return { captureError, resetError }
} 
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconAlertTriangle, IconRefresh, IconHome, IconBug } from "@tabler/icons-react"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
  componentStack?: string | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by ErrorBoundary:", error)
      console.error("Error info:", errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // In production, you might want to log this to an error reporting service
    // Example: logErrorToService(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((resetKey, idx) => resetKey !== prevProps.resetKeys?.[idx])) {
        this.resetErrorBoundary()
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary()
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId)
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      })
    }, 0)
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId)
    }
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { fallback: Fallback, children } = this.props

    if (hasError && error) {
      if (Fallback) {
        return (
          <Fallback
            error={error}
            resetErrorBoundary={this.resetErrorBoundary}
            componentStack={errorInfo?.componentStack}
          />
        )
      }

      return (
        <DefaultErrorFallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
          componentStack={errorInfo?.componentStack}
        />
      )
    }

    return children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, resetErrorBoundary, componentStack }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <IconAlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <IconBug className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>
              {error.message || "An unexpected error occurred"}
            </AlertDescription>
          </Alert>

          {isDevelopment && (
            <div className="space-y-2">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground group-open:text-foreground">
                  Stack Trace
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-48">
                  {error.stack}
                </pre>
              </details>
              
              {componentStack && (
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground group-open:text-foreground">
                    Component Stack
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-48">
                    {componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={resetErrorBoundary} className="flex-1">
              <IconRefresh className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/"} 
              className="flex-1"
            >
              <IconHome className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Specific error fallback components for different contexts
export function PageErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <IconAlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">Page Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || "This page encountered an error"}
          </p>
          <Button onClick={resetErrorBoundary} className="w-full">
            <IconRefresh className="h-4 w-4 mr-2" />
            Reload Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function ComponentErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <IconAlertTriangle className="h-4 w-4" />
      <AlertTitle>Component Error</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>{error.message || "This component failed to load"}</p>
        <Button size="sm" variant="outline" onClick={resetErrorBoundary}>
          <IconRefresh className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export function FormErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <IconAlertTriangle className="h-4 w-4" />
      <AlertTitle>Form Error</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>{error.message || "Form submission failed"}</p>
        <Button size="sm" variant="outline" onClick={resetErrorBoundary}>
          <IconRefresh className="h-3 w-3 mr-1" />
          Reset Form
        </Button>
      </AlertDescription>
    </Alert>
  )
}

// Hook for using error boundary imperatively
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    throw error
  }, [])
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={errorFallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary 
import { toast } from "sonner"

// Error types for consistent categorization
export enum ErrorType {
  VALIDATION = "validation",
  NETWORK = "network",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  NOT_FOUND = "not_found",
  SERVER = "server",
  CLIENT = "client",
  UNKNOWN = "unknown",
}

// Error severity levels
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Standard error interface
export interface StandardError {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  code?: string | number
  context?: Record<string, unknown>
  originalError?: Error
  timestamp?: Date
  userId?: string
  sessionId?: string
}

// Error message templates
const ERROR_MESSAGES = {
  [ErrorType.VALIDATION]: {
    default: "Please check your input and try again",
    required: "This field is required",
    email: "Please enter a valid email address",
    password: "Password must be at least 6 characters long",
    phone: "Please enter a valid phone number",
    amount: "Please enter a valid amount",
    positive: "Value must be greater than zero",
  },
  [ErrorType.NETWORK]: {
    default: "Network error. Please check your connection and try again",
    timeout: "Request timed out. Please try again",
    offline: "You appear to be offline. Please check your connection",
    slow: "Slow connection detected. This may take a while...",
  },
  [ErrorType.AUTHENTICATION]: {
    default: "Authentication failed. Please log in again",
    invalid: "Invalid credentials. Please check your email and password",
    expired: "Your session has expired. Please log in again",
    blocked: "Your account has been temporarily blocked",
  },
  [ErrorType.AUTHORIZATION]: {
    default: "You don't have permission to perform this action",
    insufficient: "Insufficient permissions",
    expired: "Your access has expired. Please contact an administrator",
  },
  [ErrorType.NOT_FOUND]: {
    default: "The requested resource was not found",
    user: "User not found",
    merchant: "Merchant not found",
    transaction: "Transaction not found",
    page: "Page not found",
  },
  [ErrorType.SERVER]: {
    default: "Server error. Please try again later",
    maintenance: "Service is temporarily unavailable for maintenance",
    overload: "Service is currently experiencing high traffic. Please try again later",
  },
  [ErrorType.CLIENT]: {
    default: "Something went wrong. Please try again",
    unsupported: "This action is not supported in your current browser",
    storage: "Unable to save data locally. Please clear your browser cache",
  },
  [ErrorType.UNKNOWN]: {
    default: "An unexpected error occurred. Please try again",
  },
}

// Standard success messages
export const SUCCESS_MESSAGES = {
  CREATE: {
    merchant: "Merchant created successfully",
    user: "User created successfully",
    transaction: "Transaction completed successfully",
    default: "Item created successfully",
  },
  UPDATE: {
    profile: "Profile updated successfully",
    settings: "Settings updated successfully",
    merchant: "Merchant updated successfully",
    default: "Item updated successfully",
  },
  DELETE: {
    merchant: "Merchant deleted successfully",
    user: "User deleted successfully",
    default: "Item deleted successfully",
  },
  PROCESS: {
    payment: "Payment processed successfully",
    settlement: "Settlement completed successfully",
    reversal: "Reversal processed successfully",
    default: "Process completed successfully",
  },
  AUTH: {
    login: "Login successful",
    logout: "Logged out successfully",
    reset: "Password reset email sent",
    change: "Password changed successfully",
    default: "Authentication successful",
  },
}

// Create a standardized error
export function createError(
  type: ErrorType,
  message?: string,
  options?: {
    severity?: ErrorSeverity
    code?: string | number
    context?: Record<string, unknown>
    originalError?: Error
  }
): StandardError {
  const now = new Date()
  const defaultMessage = ERROR_MESSAGES[type]?.default || ERROR_MESSAGES[ErrorType.UNKNOWN].default

  return {
    type,
    severity: options?.severity || ErrorSeverity.MEDIUM,
    message: message || defaultMessage,
    code: options?.code,
    context: options?.context,
    originalError: options?.originalError,
    timestamp: now,
  }
}

// Parse and standardize errors from different sources
export function parseError(error: unknown): StandardError {
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes("Network")) {
      return createError(ErrorType.NETWORK, error.message, { originalError: error })
    }
    
    if (error.message.includes("401") || error.message.includes("Unauthorized")) {
      return createError(ErrorType.AUTHENTICATION, undefined, { originalError: error })
    }
    
    if (error.message.includes("403") || error.message.includes("Forbidden")) {
      return createError(ErrorType.AUTHORIZATION, undefined, { originalError: error })
    }
    
    if (error.message.includes("404") || error.message.includes("Not Found")) {
      return createError(ErrorType.NOT_FOUND, undefined, { originalError: error })
    }
    
    if (error.message.includes("validation") || error.message.includes("required")) {
      return createError(ErrorType.VALIDATION, error.message, { originalError: error })
    }
    
    return createError(ErrorType.CLIENT, error.message, { originalError: error })
  }
  
  if (typeof error === "string") {
    return createError(ErrorType.CLIENT, error)
  }
  
  return createError(ErrorType.UNKNOWN, "An unexpected error occurred")
}

// Log errors (in production, this would send to a logging service)
export function logError(error: StandardError): void {
  const logData = {
    ...error,
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  }
  
  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", logData)
  } else {
    // In production, send to logging service
    // Example: sendToLoggingService(logData)
  }
}

// Display error messages to users
export function showError(error: StandardError | string | Error): void {
  const standardError = typeof error === "string" || error instanceof Error 
    ? parseError(error) 
    : error

  logError(standardError)

  // Show toast notification based on severity
  switch (standardError.severity) {
    case ErrorSeverity.CRITICAL:
      toast.error(standardError.message, {
        duration: 10000,
        action: {
          label: "Report",
          onClick: () => reportError(standardError),
        },
      })
      break
    case ErrorSeverity.HIGH:
      toast.error(standardError.message, { duration: 8000 })
      break
    case ErrorSeverity.MEDIUM:
      toast.error(standardError.message, { duration: 5000 })
      break
    case ErrorSeverity.LOW:
      toast.error(standardError.message, { duration: 3000 })
      break
  }
}

// Display success messages
export function showSuccess(
  category: keyof typeof SUCCESS_MESSAGES,
  action: string,
  customMessage?: string
): void {
  const message = customMessage || 
    SUCCESS_MESSAGES[category]?.[action as keyof typeof SUCCESS_MESSAGES[typeof category]] ||
    SUCCESS_MESSAGES[category]?.default ||
    "Operation completed successfully"
  
  toast.success(message, { duration: 4000 })
}

// Validation error helpers
export function createValidationError(field: string, rule: string): StandardError {
  const messages = ERROR_MESSAGES[ErrorType.VALIDATION]
  const message = messages[rule as keyof typeof messages] || `Invalid ${field}`
  
  return createError(ErrorType.VALIDATION, message, {
    severity: ErrorSeverity.LOW,
    context: { field, rule },
  })
}

// Network error helpers
export function createNetworkError(details?: string): StandardError {
  return createError(ErrorType.NETWORK, details, {
    severity: ErrorSeverity.HIGH,
  })
}

// Authentication error helpers
export function createAuthError(details?: string): StandardError {
  return createError(ErrorType.AUTHENTICATION, details, {
    severity: ErrorSeverity.HIGH,
  })
}

// Server error helpers
export function createServerError(details?: string): StandardError {
  return createError(ErrorType.SERVER, details, {
    severity: ErrorSeverity.HIGH,
  })
}

// Report critical errors (for user feedback)
function reportError(error: StandardError): void {
  // In a real app, this would open a feedback form or send error report
  console.log("Error reported:", error)
  toast.success("Error report sent. Thank you for your feedback!")
}

// Retry mechanisms
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (i === maxRetries) {
        throw lastError
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
  
  throw lastError!
}

// Async error handling wrapper
export function handleAsync<T>(
  promise: Promise<T>,
  errorHandler?: (error: StandardError) => void
): Promise<[StandardError | null, T | null]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[StandardError, null]>((error) => {
      const standardError = parseError(error)
      if (errorHandler) {
        errorHandler(standardError)
      } else {
        logError(standardError)
      }
      return [standardError, null]
    })
}

// Form validation helper
export function validateField(value: unknown, rules: string[]): StandardError[] {
  const errors: StandardError[] = []
  
  for (const rule of rules) {
    switch (rule) {
      case "required":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors.push(createValidationError("field", "required"))
        }
        break
      case "email":
        if (value && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(createValidationError("email", "email"))
        }
        break
      case "phone":
        if (value && typeof value === "string" && !/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
          errors.push(createValidationError("phone", "phone"))
        }
        break
      case "positive":
        if (value && typeof value === "string" && parseFloat(value) <= 0) {
          errors.push(createValidationError("amount", "positive"))
        }
        break
    }
  }
  
  return errors
}

// Export commonly used functions
export {
  ERROR_MESSAGES,
} 
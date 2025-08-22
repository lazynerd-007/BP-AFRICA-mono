"use client"

import { useCallback, useState } from "react"
import { 
  StandardError, 
  parseError, 
  showError, 
  showSuccess, 
  logError,
  ErrorType,
  ErrorSeverity,
  SUCCESS_MESSAGES
} from "@/lib/error-utils"

interface UseErrorHandlerReturn {
  error: StandardError | null
  isError: boolean
  showError: (error: unknown) => void
  showSuccess: (category: keyof typeof SUCCESS_MESSAGES, action: string, customMessage?: string) => void
  clearError: () => void
  handleAsync: <T>(promise: Promise<T>) => Promise<T | null>
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = useState<StandardError | null>(null)

  const handleError = useCallback((error: unknown) => {
    const standardError = parseError(error)
    setError(standardError)
    showError(standardError)
  }, [])

  const handleSuccess = useCallback((
    category: keyof typeof SUCCESS_MESSAGES, 
    action: string, 
    customMessage?: string
  ) => {
    showSuccess(category, action, customMessage)
    setError(null) // Clear any existing error
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleAsync = useCallback(async <T>(promise: Promise<T>): Promise<T | null> => {
    try {
      const result = await promise
      setError(null) // Clear error on success
      return result
    } catch (err) {
      handleError(err)
      return null
    }
  }, [handleError])

  return {
    error,
    isError: error !== null,
    showError: handleError,
    showSuccess: handleSuccess,
    clearError,
    handleAsync,
  }
}

// Hook for form error handling
interface UseFormErrorHandlerReturn {
  errors: Record<string, string>
  setFieldError: (field: string, message: string) => void
  clearFieldError: (field: string) => void
  clearAllErrors: () => void
  hasErrors: boolean
  getFieldError: (field: string) => string | undefined
}

export function useFormErrorHandler(): UseFormErrorHandlerReturn {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  const getFieldError = useCallback((field: string) => {
    return errors[field]
  }, [errors])

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors: Object.keys(errors).length > 0,
    getFieldError,
  }
}

// Hook for API call error handling
interface UseApiErrorHandlerOptions {
  onSuccess?: (data: any) => void
  onError?: (error: StandardError) => void
  showSuccessToast?: boolean
  showErrorToast?: boolean
}

interface UseApiErrorHandlerReturn {
  isLoading: boolean
  error: StandardError | null
  execute: <T>(apiCall: () => Promise<T>, options?: UseApiErrorHandlerOptions) => Promise<T | null>
  reset: () => void
}

export function useApiErrorHandler(): UseApiErrorHandlerReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<StandardError | null>(null)

  const execute = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options: UseApiErrorHandlerOptions = {}
  ): Promise<T | null> => {
    const {
      onSuccess,
      onError,
      showSuccessToast = false,
      showErrorToast = true
    } = options

    setIsLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      
      if (showSuccessToast) {
        showSuccess("PROCESS", "default")
      }
      
      onSuccess?.(result)
      return result
    } catch (err) {
      const standardError = parseError(err)
      setError(standardError)
      
      if (showErrorToast) {
        showError(standardError)
      }
      
      onError?.(standardError)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    execute,
    reset,
  }
}

// Hook for validation error handling
interface ValidationRule {
  validator: (value: any) => boolean
  message: string
}

interface UseValidationReturn {
  validate: (value: any, rules: ValidationRule[]) => string[]
  validateField: (field: string, value: any, rules: ValidationRule[]) => void
  errors: Record<string, string[]>
  hasErrors: boolean
  clearErrors: () => void
  clearFieldErrors: (field: string) => void
}

export function useValidation(): UseValidationReturn {
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const validate = useCallback((value: any, rules: ValidationRule[]): string[] => {
    const fieldErrors: string[] = []
    
    for (const rule of rules) {
      if (!rule.validator(value)) {
        fieldErrors.push(rule.message)
      }
    }
    
    return fieldErrors
  }, [])

  const validateField = useCallback((field: string, value: any, rules: ValidationRule[]) => {
    const fieldErrors = validate(value, rules)
    
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors
    }))
  }, [validate])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const clearFieldErrors = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  return {
    validate,
    validateField,
    errors,
    hasErrors: Object.values(errors).some(fieldErrors => fieldErrors.length > 0),
    clearErrors,
    clearFieldErrors,
  }
}

// Common validation rules
export const validationRules = {
  required: (value: any): ValidationRule => ({
    validator: (val) => val !== null && val !== undefined && val !== "",
    message: "This field is required"
  }),
  
  email: (value: string): ValidationRule => ({
    validator: (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    message: "Please enter a valid email address"
  }),
  
  minLength: (min: number): ValidationRule => ({
    validator: (val) => !val || val.length >= min,
    message: `Must be at least ${min} characters long`
  }),
  
  maxLength: (max: number): ValidationRule => ({
    validator: (val) => !val || val.length <= max,
    message: `Must be no more than ${max} characters long`
  }),
  
  positive: (): ValidationRule => ({
    validator: (val) => !val || parseFloat(val) > 0,
    message: "Must be a positive number"
  }),
  
  phone: (): ValidationRule => ({
    validator: (val) => !val || /^\+?[\d\s\-\(\)]{10,}$/.test(val),
    message: "Please enter a valid phone number"
  }),
} 
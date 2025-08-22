"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { FormFieldProps } from "./types"

export function FormField({
  config,
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled = false,
}: FormFieldProps) {
  const hasError = error && error.length > 0 && touched

  const renderField = () => {
    switch (config.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
      case 'search':
        return (
          <Input
            type={config.type}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={config.placeholder}
            disabled={disabled || config.disabled}
            readOnly={config.readOnly}
            min={config.min}
            max={config.max}
            step={config.step}
            minLength={config.minLength}
            maxLength={config.maxLength}
            pattern={config.pattern}
            className={cn(hasError && "border-destructive")}
          />
        )

      case 'textarea':
        return (
          <Textarea
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={config.placeholder}
            disabled={disabled || config.disabled}
            readOnly={config.readOnly}
            minLength={config.minLength}
            maxLength={config.maxLength}
            className={cn(hasError && "border-destructive")}
          />
        )

      case 'select':
        return (
          <Select
            value={value as string || ''}
            onValueChange={onChange}
            disabled={disabled || config.disabled}
          >
            <SelectTrigger className={cn(hasError && "border-destructive")}>
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value as boolean || false}
              onCheckedChange={onChange}
              disabled={disabled || config.disabled}
              className={cn(hasError && "border-destructive")}
            />
            <Label className="text-sm font-normal">
              {config.label}
            </Label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {config.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={config.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled || config.disabled || option.disabled}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <Label className="text-sm font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => e.target.files && onChange(e.target.files)}
            onBlur={onBlur}
            disabled={disabled || config.disabled}
            accept={config.accept}
            className={cn(hasError && "border-destructive")}
          />
        )

      case 'hidden':
        return (
          <input
            type="hidden"
            name={config.name}
            value={value as string || ''}
          />
        )

      case 'custom':
        if (config.component) {
          const CustomComponent = config.component
          return (
            <CustomComponent
              config={config}
              value={value}
              error={error}
              touched={touched}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              {...config.componentProps}
            />
          )
        }
        return null

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Unsupported field type: {config.type}
          </div>
        )
    }
  }

  // For checkbox, the label is rendered inline
  if (config.type === 'checkbox') {
    return (
      <div className={cn("space-y-2", config.className)}>
        {renderField()}
        {config.description && (
          <p className="text-sm text-muted-foreground">
            {config.description}
          </p>
        )}
        {hasError && (
          <div className="text-sm text-destructive">
            {error?.join(', ')}
          </div>
        )}
      </div>
    )
  }

  // For hidden fields, don't render any wrapper
  if (config.type === 'hidden') {
    return renderField()
  }

  return (
    <div className={cn("space-y-2", config.className)}>
      <Label 
        htmlFor={config.name}
        className={cn(
          config.required && "after:content-['*'] after:ml-0.5 after:text-destructive"
        )}
      >
        {config.label}
      </Label>
      {renderField()}
      {config.description && (
        <p className="text-sm text-muted-foreground">
          {config.description}
        </p>
      )}
      {hasError && (
        <div className="text-sm text-destructive">
          {error?.join(', ')}
        </div>
      )}
    </div>
  )
} 
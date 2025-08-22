"use client"

import * as React from "react"
import { IconSearch, IconX } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SearchConfig } from "../types"

interface TableSearchProps {
  value: string
  onChange: (value: string) => void
  config?: SearchConfig
  className?: string
  disabled?: boolean
}

export function TableSearch({
  value,
  onChange,
  config = {},
  className,
  disabled = false,
}: TableSearchProps) {
  const {
    placeholder = "Search...",
    debounceMs = 300,
  } = config

  const [localValue, setLocalValue] = React.useState(value)
  const debounceRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  // Sync local value with prop value
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounced onChange
  React.useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      onChange(localValue)
    }, debounceMs)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [localValue, onChange, debounceMs])

  const handleClear = () => {
    setLocalValue("")
    onChange("")
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <IconSearch className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-10 pr-10"
      />
      {localValue && !disabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 h-8 w-8 p-0 hover:bg-transparent"
        >
          <IconX className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
} 
"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface PaginationProps {
  paginationInfo: PaginationInfo
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  itemsPerPageOptions?: number[]
  showItemsPerPage?: boolean
  showPageInfo?: boolean
  maxVisiblePages?: number
  className?: string
  disabled?: boolean
}

export function Pagination({
  paginationInfo,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  showItemsPerPage = true,
  showPageInfo = true,
  className,
  disabled = false,
}: PaginationProps) {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
  } = paginationInfo

  if (totalPages <= 1 && !showItemsPerPage) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center space-x-6">
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showPageInfo && (
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage + 1).toLocaleString()} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems).toLocaleString()} of{' '}
            {totalItems.toLocaleString()} entries
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage || disabled}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage || disabled}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Simple pagination for basic use cases
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || disabled}
      >
        <IconChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || disabled}
      >
        Next
        <IconChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
} 
"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
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
import { PaginationInfo } from "../types"

interface TablePaginationProps {
  paginationInfo: PaginationInfo
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showPageInfo?: boolean
  showFirstLastButtons?: boolean
  className?: string
  disabled?: boolean
}

export function TablePagination({
  paginationInfo,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showPageInfo = true,
  showFirstLastButtons = true,
  className,
  disabled = false,
}: TablePaginationProps) {
  const {
    total,
    pageCount,
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage,
  } = paginationInfo

  const startItem = currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, total)

  const handleFirstPage = () => onPageChange(0)
  const handlePreviousPage = () => onPageChange(currentPage - 1)
  const handleNextPage = () => onPageChange(currentPage + 1)
  const handleLastPage = () => onPageChange(pageCount - 1)

  if (total === 0) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      {/* Page info and page size selector */}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {showPageSizeSelector && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showPageInfo && (
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage + 1} of {pageCount}
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          {total > 0 ? (
            <>
              Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of{" "}
              {total.toLocaleString()} entries
            </>
          ) : (
            "No entries"
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center space-x-2">
        {showFirstLastButtons && (
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleFirstPage}
            disabled={!hasPreviousPage || disabled}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage || disabled}
        >
          <span className="sr-only">Go to previous page</span>
          <IconChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleNextPage}
          disabled={!hasNextPage || disabled}
        >
          <span className="sr-only">Go to next page</span>
          <IconChevronRight className="h-4 w-4" />
        </Button>
        
        {showFirstLastButtons && (
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleLastPage}
            disabled={!hasNextPage || disabled}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
} 
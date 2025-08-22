"use client"

import { useState, useCallback, useMemo } from "react"
import { SortingState, ColumnFiltersState, VisibilityState, Updater } from "@tanstack/react-table"
import { TableState, TableConfig } from "../types"

interface UseTableStateProps {
  config: TableConfig
  initialState?: Partial<TableState>
  onStateChange?: (state: Partial<TableState>) => void
}

export function useTableState({
  config,
  initialState = {},
  onStateChange
}: UseTableStateProps) {
  // Initialize state with defaults
  const [sorting, setSorting] = useState<SortingState>(initialState.sorting || [])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState.columnFilters || [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState.columnVisibility || {})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(initialState.rowSelection || {})
  const [globalFilter, setGlobalFilter] = useState<string>(initialState.globalFilter || "")
  const [pagination, setPagination] = useState({
    pageIndex: initialState.pagination?.pageIndex || 0,
    pageSize: initialState.pagination?.pageSize || config.pageSize || 10
  })

  // Memoized current state
  const currentState = useMemo<TableState>(() => ({
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
    pagination
  }), [sorting, columnFilters, columnVisibility, rowSelection, globalFilter, pagination])

  // State update handlers
  const handleSortingChange = useCallback((updater: Updater<SortingState>) => {
    setSorting(prev => {
      const newValue = typeof updater === 'function' ? updater(prev) : updater
      onStateChange?.({ sorting: newValue })
      return newValue
    })
  }, [onStateChange])

  const handleColumnFiltersChange = useCallback((updater: Updater<ColumnFiltersState>) => {
    setColumnFilters(prev => {
      const newValue = typeof updater === 'function' ? updater(prev) : updater
      onStateChange?.({ columnFilters: newValue })
      return newValue
    })
  }, [onStateChange])

  const handleColumnVisibilityChange = useCallback((updater: Updater<VisibilityState>) => {
    setColumnVisibility(prev => {
      const newValue = typeof updater === 'function' ? updater(prev) : updater
      onStateChange?.({ columnVisibility: newValue })
      return newValue
    })
  }, [onStateChange])

  const handleRowSelectionChange = useCallback((updater: Updater<Record<string, boolean>>) => {
    setRowSelection(prev => {
      const newValue = typeof updater === 'function' ? updater(prev) : updater
      onStateChange?.({ rowSelection: newValue })
      return newValue
    })
  }, [onStateChange])

  const handleGlobalFilterChange = useCallback((value: string) => {
    setGlobalFilter(value)
    onStateChange?.({ globalFilter: value })
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [onStateChange])

  const handlePaginationChange = useCallback((updater: Updater<{ pageIndex: number; pageSize: number }>) => {
    setPagination(prev => {
      const newValue = typeof updater === 'function' ? updater(prev) : updater
      onStateChange?.({ pagination: newValue })
      return newValue
    })
  }, [onStateChange])

  // Reset functions
  const resetSorting = useCallback(() => {
    setSorting([])
    onStateChange?.({ sorting: [] })
  }, [onStateChange])

  const resetFilters = useCallback(() => {
    setColumnFilters([])
    setGlobalFilter("")
    onStateChange?.({ columnFilters: [], globalFilter: "" })
  }, [onStateChange])

  const resetSelection = useCallback(() => {
    setRowSelection({})
    onStateChange?.({ rowSelection: {} })
  }, [onStateChange])

  const resetPagination = useCallback(() => {
    const newPagination = {
      pageIndex: 0,
      pageSize: config.pageSize || 10
    }
    setPagination(newPagination)
    onStateChange?.({ pagination: newPagination })
  }, [config.pageSize, onStateChange])

  const resetAll = useCallback(() => {
    resetSorting()
    resetFilters()
    resetSelection()
    resetPagination()
  }, [resetSorting, resetFilters, resetSelection, resetPagination])

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return columnFilters.length > 0 || globalFilter.length > 0
  }, [columnFilters, globalFilter])

  const hasSelection = useMemo(() => {
    return Object.keys(rowSelection).length > 0
  }, [rowSelection])

  const selectedRowCount = useMemo(() => {
    return Object.values(rowSelection).filter(Boolean).length
  }, [rowSelection])

  return {
    // Current state
    state: currentState,
    
    // Individual state pieces
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
    pagination,
    
    // State setters
    setSorting: handleSortingChange,
    setColumnFilters: handleColumnFiltersChange,
    setColumnVisibility: handleColumnVisibilityChange,
    setRowSelection: handleRowSelectionChange,
    setGlobalFilter: handleGlobalFilterChange,
    setPagination: handlePaginationChange,
    
    // Reset functions
    resetSorting,
    resetFilters,
    resetSelection,
    resetPagination,
    resetAll,
    
    // Computed values
    hasActiveFilters,
    hasSelection,
    selectedRowCount,
  }
} 
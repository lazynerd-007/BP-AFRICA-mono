import { z } from "zod"
import { ColumnDef, SortingState, ColumnFiltersState, VisibilityState } from "@tanstack/react-table"

// Base data schema - can be extended for specific use cases
export const baseDataSchema = z.object({
  id: z.union([z.string(), z.number()]),
})

export type BaseData = z.infer<typeof baseDataSchema>

// Table configuration interface
export interface TableConfig {
  enableSorting?: boolean
  enableFiltering?: boolean
  enableRowSelection?: boolean
  enableDragDrop?: boolean
  enablePagination?: boolean
  enableColumnVisibility?: boolean
  enableExport?: boolean
  stickyHeader?: boolean
  virtualized?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
}

// Table state interface
export interface TableState {
  sorting: SortingState
  columnFilters: ColumnFiltersState
  columnVisibility: VisibilityState
  rowSelection: Record<string, boolean>
  globalFilter: string
  pagination: {
    pageIndex: number
    pageSize: number
  }
}

// Filter configuration
export interface FilterConfig {
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange'
  label: string
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  defaultValue?: string | number | Date
}

// Column configuration with additional metadata
export type ExtendedColumnDef<TData extends BaseData = BaseData> = ColumnDef<TData> & {
  filterConfig?: FilterConfig
  exportable?: boolean
  description?: string
  width?: number | string
  minWidth?: number
  maxWidth?: number
}

// Export configuration
export interface ExportConfig<TData extends BaseData = BaseData> {
  filename?: string
  formats?: Array<'csv' | 'excel' | 'pdf'>
  includeFilters?: boolean
  customFields?: Record<string, (data: TData) => string>
}

// Table action configuration
export interface TableAction<TData extends BaseData = BaseData> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (selectedRows: TData[]) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  disabled?: (selectedRows: TData[]) => boolean
  requiresSelection?: boolean
  confirmationMessage?: string
}

// Search configuration
export interface SearchConfig {
  placeholder?: string
  searchableColumns?: string[]
  debounceMs?: number
  enableAdvancedSearch?: boolean
}

// Loading and error states
export interface TableLoadingState {
  isLoading: boolean
  isError: boolean
  error?: Error | null
  isEmpty: boolean
}

// Pagination info
export interface PaginationInfo {
  total: number
  pageCount: number
  currentPage: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Table context type
export interface TableContextType<TData extends BaseData = BaseData> {
  config: TableConfig
  state: Partial<TableState>
  actions: TableAction<TData>[]
  onStateChange: (newState: Partial<TableState>) => void
  onExport?: (config: ExportConfig<TData>) => void
  loadingState: TableLoadingState
  paginationInfo?: PaginationInfo
} 
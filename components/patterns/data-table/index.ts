// Core components
export { DataTable } from './core/DataTable'
export { EnhancedDataTable, SafeEnhancedDataTable } from './EnhancedDataTable'

// Individual components
export { TableSearch } from './components/TableSearch'
export { TablePagination } from './components/TablePagination'
export { TableActions, commonTableActions } from './components/TableActions'
export { DataTableErrorBoundary, useDataTableErrorBoundary } from './components/DataTableErrorBoundary'

// Hooks
export { useTableState } from './hooks/useTableState'

// Types
export type {
  BaseData,
  TableConfig,
  TableState,
  FilterConfig,
  ExtendedColumnDef,
  ExportConfig,
  TableAction,
  SearchConfig,
  TableLoadingState,
  PaginationInfo,
  TableContextType,
} from './types'

// Re-export TanStack Table types for convenience
export type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Table,
} from '@tanstack/react-table' 
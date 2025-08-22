"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/ui/loading-states"
import { TableConfig, ExtendedColumnDef, BaseData } from "../types"
import { useTableState } from "../hooks/useTableState"

interface DataTableProps<TData extends BaseData> {
  data: TData[]
  columns: ExtendedColumnDef<TData>[]
  config?: TableConfig
  className?: string
  emptyStateMessage?: string
  emptyStateDescription?: string
  onRowClick?: (row: TData) => void
  getRowId?: (row: TData) => string
  children?: React.ReactNode
}

export function DataTable<TData extends BaseData>({
  data,
  columns,
  config = {},
  className,
  emptyStateMessage = "No data available",
  emptyStateDescription = "There are no items to display at the moment.",
  onRowClick,
  getRowId,
  children,
}: DataTableProps<TData>) {
  const {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
    pagination,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
    setGlobalFilter,
    setPagination,
  } = useTableState({ config })

  // Configure table instance
  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData>[],
    state: {
      sorting: config.enableSorting ? sorting : undefined,
      columnFilters: config.enableFiltering ? columnFilters : undefined,
      columnVisibility: config.enableColumnVisibility ? columnVisibility : undefined,
      rowSelection: config.enableRowSelection ? rowSelection : undefined,
      globalFilter: config.enableFiltering ? globalFilter : undefined,
      pagination: config.enablePagination ? pagination : undefined,
    },
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    enableRowSelection: config.enableRowSelection,
    enableSorting: config.enableSorting,
    enableFilters: config.enableFiltering,
    enableGlobalFilter: config.enableFiltering,
    onSortingChange: config.enableSorting ? setSorting : undefined,
    onColumnFiltersChange: config.enableFiltering ? setColumnFilters : undefined,
    onColumnVisibilityChange: config.enableColumnVisibility ? setColumnVisibility : undefined,
    onRowSelectionChange: config.enableRowSelection ? setRowSelection : undefined,
    onGlobalFilterChange: config.enableFiltering ? setGlobalFilter : undefined,
    onPaginationChange: config.enablePagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: config.enableFiltering ? getFilteredRowModel() : undefined,
    getSortedRowModel: config.enableSorting ? getSortedRowModel() : undefined,
    getFacetedRowModel: config.enableFiltering ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues: config.enableFiltering ? getFacetedUniqueValues() : undefined,
    getPaginationRowModel: config.enablePagination ? getPaginationRowModel() : undefined,
    initialState: {
      pagination: {
        pageSize: config.pageSize || 10,
      },
    },
  })

  const isEmpty = table.getRowModel().rows?.length === 0

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Render children (filters, actions, etc.) */}
      {children}
      
      {/* Table container */}
      <div className="relative">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            {/* Table Header */}
            <TableHeader 
              className={cn(
                config.stickyHeader && "sticky top-0 z-10 bg-background"
              )}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnDef = header.column.columnDef as ExtendedColumnDef<TData>
                    return (
                      <TableHead 
                        key={header.id} 
                        colSpan={header.colSpan}
                        style={{
                          width: columnDef.width,
                          minWidth: columnDef.minWidth,
                          maxWidth: columnDef.maxWidth,
                        }}
                        title={columnDef.description}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {!isEmpty ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      onRowClick && "cursor-pointer hover:bg-muted/50",
                      "transition-colors"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <EmptyState
                      title={emptyStateMessage}
                      description={emptyStateDescription}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

// Export table instance type for advanced usage
export type { Table } from "@tanstack/react-table" 
"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconRefresh } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import {
  SafeEnhancedDataTable,
  ExtendedColumnDef,
  TableConfig,
  TableAction,
  PaginationInfo,
  commonTableActions,
  BaseData,
} from "@/components/patterns/data-table"
import { useErrorHandler } from "@/hooks/use-error-handler"

// Demo data type
interface Transaction extends BaseData {
  id: string
  merchant: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  type: 'payment' | 'refund' | 'settlement'
  currency: string
}

// Mock data generator
const generateMockData = (count: number): Transaction[] => {
  const merchants = ['BluPay Store', 'Tech Solutions', 'Fashion Hub', 'Food Corner', 'Book World']
  const statuses: Transaction['status'][] = ['completed', 'pending', 'failed']
  const types: Transaction['type'][] = ['payment', 'refund', 'settlement']
  const currencies = ['GHS', 'USD', 'EUR']

  return Array.from({ length: count }, (_, i) => ({
    id: `TXN${String(i + 1).padStart(6, '0')}`,
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    amount: Math.floor(Math.random() * 10000) / 100,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: types[Math.floor(Math.random() * types.length)],
    currency: currencies[Math.floor(Math.random() * currencies.length)],
  }))
}

export default function DemoTablePage() {
  const { showSuccess } = useErrorHandler()
  const [data, setData] = React.useState<Transaction[]>(() => generateMockData(50))
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [isLoading] = React.useState(false)

  // Column definitions
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'id',
      header: 'Transaction ID',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.id}</div>
      ),
    },
    {
      accessorKey: 'merchant',
      header: 'Merchant',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.merchant}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.original.currency} {row.original.amount.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        const variant = status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'
        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.date).toLocaleDateString()}
        </div>
      ),
    },
  ]

  // Table configuration
  const config: TableConfig = {
    enableSorting: true,
    enableFiltering: true,
    enableRowSelection: true,
    enablePagination: true,
    pageSize,
    pageSizeOptions: [5, 10, 20, 50],
  }

  // Table actions
  const actions: TableAction<Transaction>[] = [
    commonTableActions.export((rows) => {
      showSuccess('PROCESS', 'default', `Exporting ${rows.length} transactions`)
    }),
    commonTableActions.delete((rows) => {
      setData(prev => prev.filter(item => !rows.some(row => row.id === item.id)))
      showSuccess('DELETE', 'default', `Deleted ${rows.length} transactions`)
    }),
  ]

  // Pagination info
  const paginationInfo: PaginationInfo = {
    total: data.length,
    pageCount: Math.ceil(data.length / pageSize),
    currentPage: currentPage - 1,
    pageSize,
    hasNextPage: currentPage < Math.ceil(data.length / pageSize),
    hasPreviousPage: currentPage > 1,
  }

  // Paginated data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [data, currentPage, pageSize])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Enhanced DataTable Demo</h1>
          <p className="text-muted-foreground">
            Showcase of the new modular DataTable system
          </p>
        </div>
        <Button onClick={() => setData(generateMockData(50))}>
          <IconRefresh className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Enhanced DataTable */}
      <SafeEnhancedDataTable
        data={paginatedData}
        columns={columns as ExtendedColumnDef<Transaction>[]}
        config={config}
        enableSearch={true}
        searchConfig={{
          placeholder: 'Search transactions...',
          debounceMs: 300,
        }}
        actions={actions}
        paginationInfo={paginationInfo}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
        loadingState={{
          isLoading,
          isError: false,
          error: null,
          isEmpty: data.length === 0,
        }}
        emptyStateMessage="No transactions found"
        emptyStateDescription="Try adjusting your search criteria."
      />
    </div>
  )
} 
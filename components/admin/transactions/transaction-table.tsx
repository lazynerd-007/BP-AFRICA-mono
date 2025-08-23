"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { IconSearch, IconLoader, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { DataTable } from "@/components/data-table"
import { TransformedTransaction, TransactionType } from "./types"

interface TransactionTableProps {
  data: TransformedTransaction[]
  transactionType: TransactionType
  onTransactionTypeChange: (type: TransactionType) => void
  searchTerm: string
  onSearchChange: (search: string) => void
  perPage: string
  onPerPageChange: (perPage: string) => void
  loading?: boolean
  selectedRows?: TransformedTransaction[]
  onRowSelectionChange?: (selectedRows: TransformedTransaction[]) => void
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  totalCount?: number
}

export function TransactionTable({
  data,
  transactionType,
  onTransactionTypeChange,
  searchTerm,
  onSearchChange,
  perPage,
  onPerPageChange,
  loading = false,
  selectedRows = [],
  onRowSelectionChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalCount = 0
}: TransactionTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          All Transactions
          {loading && <IconLoader className="h-4 w-4 animate-spin" />}
        </CardTitle>
        <CardDescription>
          View all {transactionType} transactions below.
        </CardDescription>
        <Tabs value={transactionType} onValueChange={(value) => onTransactionTypeChange(value as TransactionType)} className="mt-2">
          <TabsList>
            <TabsTrigger value="collection" disabled={loading}>
              Collection
            </TabsTrigger>
            <TabsTrigger value="reversal" disabled={loading}>
              Reversal
            </TabsTrigger>
            <TabsTrigger value="payout" disabled={loading}>
              Payout
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <Select value={perPage} onValueChange={onPerPageChange} disabled={loading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="10 per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative w-full max-w-sm">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLoader className="h-5 w-5 animate-spin" />
              <span>Loading {transactionType} transactions...</span>
            </div>
          </div>
        ) : (
          <>
            <DataTable
              data={data}
              enableRowSelection={true}
              enablePagination={false}
            />
            
            {/* Custom pagination info and controls */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {selectedRows.length > 0 ? (
                  <span>{selectedRows.length} of {data.length} row(s) selected.</span>
                ) : (
                  <span>Showing {data.length} of {totalCount} transaction(s)</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                >
                  <IconChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                >
                  <IconChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
} 
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconSearch } from "@tabler/icons-react"
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
}

export function TransactionTable({
  data,
  transactionType,
  onTransactionTypeChange,
  searchTerm,
  onSearchChange,
  perPage,
  onPerPageChange
}: TransactionTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>View all MoMo transactions below.</CardDescription>
        <Tabs value={transactionType} onValueChange={(value) => onTransactionTypeChange(value as TransactionType)} className="mt-2">
          <TabsList>
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="reversal">Reversal</TabsTrigger>
            <TabsTrigger value="payout">Payout</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <Select value={perPage} onValueChange={onPerPageChange}>
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
            />
          </div>
        </div>
        
        <DataTable 
          data={data} 
          enableRowSelection={false}
          enablePagination={true}
        />
      </CardContent>
    </Card>
  )
} 
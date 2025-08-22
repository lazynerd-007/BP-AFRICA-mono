"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconSearch, IconFilter, IconDownload, IconArrowUp, IconArrowDown, IconRefresh } from "@tabler/icons-react"
import { Transaction } from "./types"

interface TransactionHistoryProps {
  transactions: Transaction[]
  onRefresh?: () => void
  onExport?: () => void
  showMerchant?: boolean
  className?: string
}

export function TransactionHistory({ 
  transactions, 
  onRefresh, 
  onExport, 
  showMerchant = false,
  className 
}: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.merchantName && transaction.merchantName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'pending':
        return 'outline'
      case 'failed':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusBadgeClasses = (status: string) => {
    if (status === 'completed') {
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400"
    }
    return ""
  }

  const getTransactionIcon = (type: string) => {
    return type === 'credit' 
      ? <IconArrowDown className="h-4 w-4 text-green-600" />
      : <IconArrowUp className="h-4 w-4 text-red-600" />
  }

  const formatAmount = (amount: string, type: string) => {
    const prefix = type === 'credit' ? '+' : '-'
    return `${prefix}${amount}`
  }

  const getAmountTextColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View your recent financial transactions
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <IconRefresh className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <IconDownload className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <IconFilter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Reference</TableHead>
                {showMerchant && <TableHead>Merchant</TableHead>}
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          {transaction.channel && (
                            <div className="text-sm text-muted-foreground">
                              via {transaction.channel}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.reference}
                    </TableCell>
                    {showMerchant && (
                      <TableCell>
                        {transaction.merchantName || '-'}
                      </TableCell>
                    )}
                    <TableCell className={`font-medium ${getAmountTextColor(transaction.type)}`}>
                      {transaction.currency} {formatAmount(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(transaction.status)}
                        className={getStatusBadgeClasses(transaction.status)}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transaction.timestamp.toLocaleDateString()} {transaction.timestamp.toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={showMerchant ? 6 : 5} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionStats } from "./types"

interface TransactionStatsProps {
  stats: TransactionStats
}

export function TransactionStatsComponent({ stats }: TransactionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Successful Collections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Count</p>
              <p className="text-2xl font-bold">{stats.successfulCollections.count}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">{stats.successfulCollections.amount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Failed Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Count</p>
              <p className="text-2xl font-bold">{stats.failedTransactions.count}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">{stats.failedTransactions.amount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Successful Payouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Count</p>
              <p className="text-2xl font-bold">{stats.successfulPayouts.count}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">{stats.successfulPayouts.amount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
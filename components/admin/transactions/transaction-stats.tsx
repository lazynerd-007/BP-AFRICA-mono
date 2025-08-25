"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionStats } from "./types"
import { IconLoader, IconTrendingUp, IconTrendingDown, IconArrowRight } from "@tabler/icons-react"

interface TransactionStatsProps {
  stats: TransactionStats
  loading?: boolean
  startDate?: string
  endDate?: string
  merchantId?: string
  subMerchantId?: string
  partnerBankId?: string
}

export function TransactionStatsComponent({ 
  stats, 
  loading = false, 
  startDate,
  endDate,
  merchantId,
  subMerchantId,
  partnerBankId
}: TransactionStatsProps) {

  // Helper function to get filter description
  const getFilterDescription = () => {
    const filters = [];
    
    // Date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      if (startDate === todayStr && endDate === todayStr) {
        filters.push("Today");
      } else if (startDate === endDate) {
        filters.push(start.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: start.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        }));
      } else {
        filters.push(`${start.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })} - ${end.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: end.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        })}`);
      }
    }

    // Partner Bank filter
    if (partnerBankId && partnerBankId !== 'all') {
      filters.push("Partner Bank filtered");
    }

    // Merchant filter  
    if (merchantId && merchantId !== 'all') {
      filters.push("Merchant filtered");
    }

    // Sub-merchant filter
    if (subMerchantId && subMerchantId !== 'all') {
      filters.push("Sub-merchant filtered");
    }

    return filters.length > 0 ? filters.join(" • ") : "All transactions";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Transaction Statistics</h2>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <IconLoader className="h-4 w-4 animate-spin" />
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Count</p>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Transaction Statistics</h2>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{getFilterDescription()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <IconTrendingUp className="h-4 w-4 text-green-600" />
            Successful Collections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Count</p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? (
                  <IconLoader className="h-6 w-6 animate-spin" />
                ) : (
                  stats.successfulCollections.count.toLocaleString()
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? (
                  <IconLoader className="h-6 w-6 animate-spin" />
                ) : (
                  stats.successfulCollections.amount
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <IconTrendingDown className="h-4 w-4 text-red-600" />
            Reversal Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Count</p>
              <p className="text-2xl font-bold text-red-600">
                {loading ? (
                  <IconLoader className="h-6 w-6 animate-spin" />
                ) : (
                  stats.failedTransactions.count.toLocaleString()
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold text-red-600">
                {loading ? (
                  <IconLoader className="h-6 w-6 animate-spin" />
                ) : (
                  stats.failedTransactions.amount
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <IconArrowRight className="h-4 w-4 text-blue-600" />
            Successful Payouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Count</p>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? (
                  <IconLoader className="h-6 w-6 animate-spin" />
                ) : (
                  stats.successfulPayouts.count.toLocaleString()
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? (
                  <IconLoader className="h-6 w-6 animate-spin" />
                ) : (
                  stats.successfulPayouts.amount
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
} 
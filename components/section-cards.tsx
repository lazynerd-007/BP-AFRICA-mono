"use client"

import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp, IconCreditCard, IconAlertTriangle, IconWallet } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrency } from "@/lib/currency-context"
import { transactionService } from "@/lib/api"
import { TransactionAnalytics } from "@/lib/api/types"

// Add interface for props at the top of the file after imports
interface SectionCardsProps {
  partnerBankId?: string; // UUID of selected partner bank
  timeRange?: string;
  onTimeRangeChange?: (timeRange: string) => void;
}

// Update the component signature
export function SectionCards({ 
  partnerBankId, 
  timeRange = '7days',
  onTimeRangeChange 
}: SectionCardsProps = {}) {
  const { formatCurrency } = useCurrency();
  const [analytics, setAnalytics] = useState<TransactionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        console.log('📊 Fetching analytics for partner bank:', partnerBankId || 'All banks');
        console.log('📊 Time range:', timeRange);
        
        // Calculate date range based on timeRange
        const now = new Date();
        const analyticsParams: any = {};
        
        if (timeRange) {
          let startDate: Date;
          
          switch (timeRange) {
            case 'today':
              startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              break;
            case '7days':
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case 'month':
              startDate = new Date(now.getFullYear(), 0, 1); // January to present
              break;
            default:
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          }
          
          analyticsParams.startDate = startDate.toISOString().split('T')[0];
          analyticsParams.endDate = now.toISOString().split('T')[0];
          
          console.log('📊 Date range:', analyticsParams.startDate, 'to', analyticsParams.endDate);
        }
        
        // Add partner bank filter if selected
        if (partnerBankId && partnerBankId !== 'all') {
          analyticsParams.partnerBankId = partnerBankId;
          console.log('📊 Filtering by partner bank UUID:', partnerBankId);
        }
        
        const data = await transactionService.getTransactionAnalytics(analyticsParams);
        console.log('📊 Analytics data received:', data);
        
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [partnerBankId, timeRange]); // Add timeRange to dependencies

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm mt-auto">
              <Skeleton className="h-4 w-40" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
        <Card className="flex flex-col h-full border-red-200 bg-red-50/50">
          <CardHeader>
            <CardDescription className="text-red-700">Error loading analytics</CardDescription>
            <CardTitle className="text-sm text-red-600">{error}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Helper function to get time range description
  const getTimeRangeDescription = () => {
    switch (timeRange) {
      case 'today':
        return 'today';
      case '7days':
        return 'last 7 days';
      case 'month':
        return 'year to date';
      default:
        return 'selected period';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
      {/* Collections Card */}
      <Card className="flex flex-col h-full border-green-200 bg-green-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <IconCreditCard className="size-5 text-green-600" />
            </div>
            <CardDescription className="text-green-700">Collections</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums text-green-800">
            {formatCurrency(analytics?.successTotalMoneyInAmount || 0)}
          </CardTitle>
          <CardAction className="pr-1.5 ml-2">
            <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap text-xs border-green-300 text-green-700">
              <IconTrendingUp className="size-3" />
              {analytics?.successTotalMoneyInCount || 0} transactions
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm mt-auto">
          <div className="text-green-600/70">
            Total amount collected {getTimeRangeDescription()}
            {partnerBankId && partnerBankId !== 'all' && ' (Partner Bank filtered)'}
          </div>
        </CardFooter>
      </Card>

      {/* Failed Transactions Card */}
      <Card className="flex flex-col h-full border-red-200 bg-red-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <IconAlertTriangle className="size-5 text-red-600" />
            </div>
            <CardDescription className="text-red-700">Failed Transactions</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums text-red-800">
            {formatCurrency(analytics?.failedTotalAmount || 0)}
          </CardTitle>
          <CardAction className="pr-1.5 ml-2">
            <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap text-xs border-red-300 text-red-700">
              <IconTrendingDown className="size-3" />
              {analytics?.failedTotalCount || 0} failed
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm mt-auto">
          <div className="text-red-600/70">
            Failed transactions {getTimeRangeDescription()}
            {partnerBankId && partnerBankId !== 'all' && ' (Partner Bank filtered)'}
          </div>
        </CardFooter>
      </Card>

      {/* Payout Card */}
      <Card className="flex flex-col h-full border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <IconWallet className="size-5 text-blue-600" />
            </div>
            <CardDescription className="text-blue-700">Payout</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums text-blue-800">
            {formatCurrency(analytics?.successTotalMoneyOutAmount || 0)}
          </CardTitle>
          <CardAction className="pr-1.5 ml-2">
            <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap text-xs border-blue-300 text-blue-700">
              <IconTrendingUp className="size-3" />
              {analytics?.successTotalMoneyOutCount || 0} payouts
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm mt-auto">
          <div className="text-blue-600/70">
            Total payouts {getTimeRangeDescription()}
            {partnerBankId && partnerBankId !== 'all' && ' (Partner Bank filtered)'}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

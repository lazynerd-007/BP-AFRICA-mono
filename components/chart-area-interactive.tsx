"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { useCategorizedTransactions } from '@/hooks/use-categorized-transactions';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"
import { transactionService } from "@/lib/api"
import { TransactionAnalytics, Transaction } from "@/lib/api/types"

export const description = "An interactive area chart with live transaction data"

// Chart data interface
interface ChartDataPoint {
  date: string;
  failed: number;
  approved: number;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  failed: {
    label: "Failed",
    color: "hsl(0, 84%, 60%)", // Red for Failed
  },
  approved: {
    label: "Approved",
    color: "hsl(142, 76%, 36%)", // Green for Approved
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  timeRange?: string;
  onTimeRangeChange?: (timeRange: string) => void;
  partnerBankId?: string; // Add this back
}

export function ChartAreaInteractive({ 
  timeRange: externalTimeRange, 
  onTimeRangeChange,
  partnerBankId // Add this back
}: ChartAreaInteractiveProps = {}) {
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = React.useState(false)
  const [chartData, setChartData] = React.useState<any[]>([])
  
  // Use external timeRange if provided, otherwise use internal state
  const [internalTimeRange, setInternalTimeRange] = React.useState("7days")
  const timeRange = externalTimeRange || internalTimeRange
  
  const handleTimeRangeChange = (newTimeRange: string) => {
    if (onTimeRangeChange) {
      onTimeRangeChange(newTimeRange);
    } else {
      setInternalTimeRange(newTimeRange);
    }
  };

  // Use hook for default data (when no partner bank selected)
  const { currentData: transactionData, fetchTransactions } = useCategorizedTransactions('collection');
  
  // Update the main useEffect to handle both cases properly:
  React.useEffect(() => {
    if (partnerBankId && partnerBankId !== 'all') {
      // Use direct transaction fetching for partner bank filtering
      console.log('📊 Using direct transaction fetch for partner bank:', partnerBankId);
      fetchAnalyticsData();
    } else {
      // Use existing hook for all banks
      console.log('📊 Using hook for all banks');
      fetchHookData();
    }
  }, [timeRange, partnerBankId]);

  // Update the fetchAnalyticsData function to fetch individual transactions instead:
  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range based on timeframe
      const now = new Date();
      let startDate: Date;
      let perPage: number;
      
      switch (timeRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          perPage = 500; // Get enough data for the day
          break;
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          perPage = 1000; // Get enough data for the week
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), 0, 1);
          perPage = 2000; // Get enough data for the year
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          perPage = 1000;
      }
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = now.toISOString().split('T')[0];
      
      console.log(`📊 Fetching partner bank transactions: ${partnerBankId}`);
      console.log(`📊 Date range: ${startDateStr} to ${endDateStr}, perPage: ${perPage}`);
      
      // Fetch transactions directly with partner bank filter
      const response = await transactionService.getTransactions({
        page: 1,
        perPage: perPage,
        startDate: startDateStr,
        endDate: endDateStr,
        partnerBankId: partnerBankId,
        transactionType: 'money_in'
      });
      
      console.log('📊 Partner bank transactions received:', response);
      
      // Extract transactions from response
      let transactions: any[] = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        transactions = response.data.data;
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        transactions = response.data.items;
      } else if (Array.isArray(response.data)) {
        transactions = response.data;
      }
      
      console.log('📊 Extracted transactions:', transactions.length);
      
      // Transform transactions to chart format (same logic as hook)
      const chartPoints = transformTransactionsToChart(transactions);
      setChartData(chartPoints);
      
    } catch (error) {
      console.error('📊 Error fetching partner bank transactions:', error);
      
      // Fallback: If direct transaction fetch fails, try with partnerBankId as query param
      try {
        console.log('📊 Trying fallback approach...');
        await fetchTransactions('collection', {
          page: 1,
          perPage: 1000,
          startDate: startDate.toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0],
          partnerBankId: partnerBankId
        });
      } catch (fallbackError) {
        console.error('📊 Fallback also failed:', fallbackError);
        setChartData([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Hook-based data fetching (for all banks)
  const fetchHookData = async () => {
    const now = new Date();
    let startDate: Date;
    let perPage: number;
    
    switch (timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        perPage = 100;
        break;
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        perPage = 300;
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), 0, 1);
        perPage = 500;
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        perPage = 300;
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = now.toISOString().split('T')[0];
    
    console.log(`📊 Fetching all banks data: ${timeRange}, from ${startDateStr} to ${endDateStr}`);
    
    await fetchTransactions('collection', {
      page: 1,
      perPage,
      startDate: startDateStr,
      endDate: endDateStr,
    });
  };

  // Transform analytics data to chart format
  const transformAnalyticsToChart = (analyticsData: any, timeRange: string) => {
    console.log('📊 Transforming analytics data:', analyticsData);
    
    // Handle different analytics data structures
    if (analyticsData.dailyStats && Array.isArray(analyticsData.dailyStats)) {
      // If we have daily breakdown
      return analyticsData.dailyStats.map((stat: any) => ({
        date: stat.date,
        approved: stat.successfulTransactions || stat.approved || 0,
        failed: stat.failedTransactions || stat.failed || 0,
      })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      // Create single data point from totals
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      
      return [{
        date: dateStr,
        approved: analyticsData.successTotalMoneyInCount || 0,
        failed: analyticsData.failedTotalCount || 0,
      }];
    }
  };

  // Process hook data when using all banks
  React.useEffect(() => {
    if (!partnerBankId || partnerBankId === 'all') {
      setIsLoading(transactionData.loading);
      
      if (transactionData.data && transactionData.data.length > 0) {
        console.log('📊 Processing hook data:', transactionData.data.length, 'transactions');
        
        // Existing transformation logic
        const dateMap = new Map<string, { failed: number; approved: number }>();
        
        transactionData.data.forEach(transaction => {
          const transactionDate = transaction.createdAt || transaction.updatedAt || new Date().toISOString();
          const date = new Date(transactionDate).toISOString().split('T')[0];
          
          if (!dateMap.has(date)) {
            dateMap.set(date, { failed: 0, approved: 0 });
          }
          
          const entry = dateMap.get(date)!;
          const status = transaction.status?.toLowerCase() || 'unknown';
          
          if (status === 'completed' || status === 'success' || status === 'successful' || 
              status === 'settled' || status === 'confirmed' || status === 'approved') {
            entry.approved += 1;
          } else if (status === 'failed' || status === 'error' || status === 'rejected' || 
                     status === 'declined' || status === 'cancelled' || status === 'timeout' ||
                     status === 'expired' || status === 'blocked') {
            entry.failed += 1;
          } else if (status === 'pending' || status === 'processing' || status === 'initiated' ||
                     status === 'in_progress' || status === 'submitted') {
            entry.approved += 1;
          }
        });
        
        const chartDataPoints = Array.from(dateMap.entries())
          .map(([date, counts]) => ({
            date,
            failed: counts.failed,
            approved: counts.approved
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        console.log('📊 Hook chart data points:', chartDataPoints);
        setChartData(chartDataPoints);
        
      } else if (!transactionData.loading) {
        console.log('📊 No hook data available');
        setChartData([]);
      }
    }
  }, [transactionData, timeRange, partnerBankId]);

  // Add this helper function to transform transactions to chart data
  const transformTransactionsToChart = (transactions: any[]) => {
    console.log('📊 Transforming', transactions.length, 'transactions to chart data');
    
    if (!transactions || transactions.length === 0) {
      return [];
    }
    
    // Group transactions by date and count status
    const dateMap = new Map<string, { failed: number; approved: number }>();
    
    transactions.forEach(transaction => {
      // Extract date from transaction
      const transactionDate = transaction.createdAt || transaction.updatedAt || new Date().toISOString();
      const date = new Date(transactionDate).toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Initialize date entry if it doesn't exist
      if (!dateMap.has(date)) {
        dateMap.set(date, { failed: 0, approved: 0 });
      }
      
      // Count based on transaction status with comprehensive mapping
      const entry = dateMap.get(date)!;
      const status = transaction.status?.toLowerCase() || 'unknown';
      
      // Success statuses
      if (status === 'completed' || status === 'success' || status === 'successful' || 
          status === 'settled' || status === 'confirmed' || status === 'approved') {
        entry.approved += 1;
      } 
      // Failure statuses
      else if (status === 'failed' || status === 'error' || status === 'rejected' || 
               status === 'declined' || status === 'cancelled' || status === 'timeout' ||
               status === 'expired' || status === 'blocked') {
        entry.failed += 1;
      } 
      // Pending/processing statuses - count as approved to show activity
      else if (status === 'pending' || status === 'processing' || status === 'initiated' ||
               status === 'in_progress' || status === 'submitted') {
        entry.approved += 1;
      }
      // Unknown statuses
      else {
        console.log('📊 Unknown transaction status:', status);
        // You can choose to count unknown as failed or ignore
        // entry.failed += 1; // Uncomment if you want to count unknown as failed
      }
    });
    
    // Convert Map to array and sort by date
    const chartDataPoints = Array.from(dateMap.entries())
      .map(([date, counts]) => ({
        date,
        failed: counts.failed,
        approved: counts.approved
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log('📊 Generated chart data points:', chartDataPoints);
    
    // Fill in missing dates for better visualization
    return fillMissingDates(chartDataPoints, timeRange);
  };

  // Helper function to fill missing dates
  const fillMissingDates = (chartData: any[], timeRange: string) => {
    if (chartData.length === 0) return [];
    
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'today':
        // For today, just return what we have
        return chartData;
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    const filledData = [];
    const dataMap = new Map(chartData.map(item => [item.date, item]));
    
    // Generate all dates in range
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (dataMap.has(dateStr)) {
        filledData.push(dataMap.get(dateStr));
      } else {
        filledData.push({
          date: dateStr,
          approved: 0,
          failed: 0
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return filledData;
  };

  // Since the API already filters data based on the date range we provide,
  // we don't need additional client-side filtering
  const filteredData = chartData

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Transaction Analytics</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Transaction success and failure rates for {timeRange === 'today' ? 'today' : timeRange === '7days' ? 'the last 7 days' : 'year to date'}
            {partnerBankId && partnerBankId !== 'all' && ' (Partner Bank filtered)'}
          </span>
          <span className="@[540px]/card:hidden">
            Transaction overview - {timeRange}
            {partnerBankId && partnerBankId !== 'all' && ' (Filtered)'}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={handleTimeRangeChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="today">Today</ToggleGroupItem>
            <ToggleGroupItem value="7days">7 days</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="today" className="rounded-lg">
                Today
              </SelectItem>
              <SelectItem value="7days" className="rounded-lg">
                7 days
              </SelectItem>
              <SelectItem value="month" className="rounded-lg">
                Month
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-[200px] w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-failed)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-failed)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-approved)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-approved)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={timeRange === 'month' ? 80 : 32}
                interval={timeRange === 'month' ? 'preserveStartEnd' : undefined}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  if (timeRange === 'month') {
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  } else {
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : Math.max(0, filteredData.length - 1)}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="approved"
                type="natural"
                fill="url(#fillApproved)"
                stroke="var(--color-approved)"
                stackId="a"
              />
              <Area
                dataKey="failed"
                type="natural"
                fill="url(#fillFailed)"
                stroke="var(--color-failed)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">
                {partnerBankId && partnerBankId !== 'all' 
                  ? 'No transactions found for selected partner bank' 
                  : 'No live transaction data available'
                }
              </p>
              <p className="text-xs mt-1">
                {timeRange === 'today' ? 'No transactions recorded today' : 
                 timeRange === '7days' ? 'No transactions in the last 7 days' : 
                 'No transactions this period'}
                {partnerBankId && partnerBankId !== 'all' && ' for this partner bank'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

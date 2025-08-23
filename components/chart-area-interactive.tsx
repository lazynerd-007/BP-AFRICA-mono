"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
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

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("month")
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [, setAnalytics] = React.useState<TransactionAnalytics | null>(null)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7days")
    }
  }, [isMobile])

  // Calculate date range based on timeRange
  const getDateRange = React.useCallback(() => {
    const endDate = new Date()
    const startDate = new Date()
    
    if (timeRange === "today") {
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
    } else if (timeRange === "7days") {
      startDate.setDate(startDate.getDate() - 7)
    } else if (timeRange === "month") {
      startDate.setDate(startDate.getDate() - 30)
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  }, [timeRange])

  // Fetch transaction data for chart
  React.useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setIsLoading(true)
        
        console.log(`📊 Fetching transaction data for chart using working endpoint`)
        
        // Use the working transactions endpoint instead of analytics
        const response = await transactionService.getTransactions({
          page: 1,
          perPage: 50 // Get more transactions to have better chart data
        })
        
        console.log('📈 Chart transaction response:', response)
        
        // Transform transaction data to chart format
        let transactions: Transaction[] = []
        if (Array.isArray(response)) {
          transactions = response
        } else if (response && response.data && Array.isArray(response.data)) {
          transactions = response.data
        }
        
        if (transactions.length > 0) {
          // Group transactions by date and status
          const dataMap = new Map<string, { approved: number; failed: number }>()
          const { startDate: filterStartDate, endDate: filterEndDate } = getDateRange()
          const startFilter = new Date(filterStartDate)
          const endFilter = new Date(filterEndDate)
          
          transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.createdAt)
            
            // Filter transactions within the selected time range
            if (transactionDate >= startFilter && transactionDate <= endFilter) {
              const dateKey = transactionDate.toISOString().split('T')[0]
              
              if (!dataMap.has(dateKey)) {
                dataMap.set(dateKey, { approved: 0, failed: 0 })
              }
              
              const dayData = dataMap.get(dateKey)!
              const status = transaction.status?.toLowerCase()
              
              if (status === 'completed' || status === 'success' || status === 'successful') {
                dayData.approved++
              } else if (status === 'failed' || status === 'error' || status === 'declined') {
                dayData.failed++
              } else {
                // Treat other statuses as approved for chart purposes
                dayData.approved++
              }
            }
          })
          
          // Convert map to array and sort by date
          const transformedData = Array.from(dataMap.entries())
            .map(([date, counts]) => ({
              date,
              approved: counts.approved,
              failed: counts.failed
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          
          console.log('📊 Transformed chart data from transactions:', transformedData)
          setChartData(transformedData)
        } else {
          // Create empty data for the selected time range
          const { startDate, endDate } = getDateRange()
          const start = new Date(startDate)
          const end = new Date(endDate)
          const dateArray = []
          
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dateArray.push({
              date: d.toISOString().split('T')[0],
              approved: 0,
              failed: 0
            })
          }
          
          console.log('📊 Using empty chart data:', dateArray)
          setChartData(dateArray)
        }
      } catch (error) {
        console.error('Failed to fetch transaction data for chart:', error)
        setChartData([]) // Empty data on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionData()
  }, [timeRange, getDateRange])

  // Since the API already filters data based on the date range we provide,
  // we don't need additional client-side filtering
  const filteredData = chartData

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Collections</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total collections for the selected period
          </span>
          <span className="@[540px]/card:hidden">Collections overview</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="today">Today</ToggleGroupItem>
            <ToggleGroupItem value="7days">7 days</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
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
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
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
              <p className="text-sm">No transaction data available</p>
              <p className="text-xs mt-1">Try selecting a different time range</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

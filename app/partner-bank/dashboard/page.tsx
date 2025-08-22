"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconArrowUpRight,
  IconCash,
  IconCheck,
  IconBuildingStore,
  IconReportMoney,
  IconEye,
  IconDownload,
} from "@tabler/icons-react";

// Sample data - would be replaced with real API data
const chartData = [
  { name: 'Jan', settlements: 4500000, commissions: 135000 },
  { name: 'Feb', settlements: 3800000, commissions: 114000 },
  { name: 'Mar', settlements: 5200000, commissions: 156000 },
  { name: 'Apr', settlements: 4900000, commissions: 147000 },
  { name: 'May', settlements: 6100000, commissions: 183000 },
  { name: 'Jun', settlements: 5800000, commissions: 174000 },
  { name: 'Jul', settlements: 6500000, commissions: 195000 },
];

const dailyTransactionsData = [
  { date: 'Mon', collections: 3500, payouts: 2100 },
  { date: 'Tue', collections: 2800, payouts: 1800 },
  { date: 'Wed', collections: 3200, payouts: 2400 },
  { date: 'Thu', collections: 4100, payouts: 3000 },
  { date: 'Fri', collections: 4800, payouts: 3600 },
  { date: 'Sat', collections: 3900, payouts: 2900 },
  { date: 'Sun', collections: 3300, payouts: 2500 },
];

const settlementTransactions = [
  { 
    id: 'ST-123456', 
    merchantName: 'BluWave Limited', 
    amount: 'GHS2,450,000.00', 
    date: '2023-10-15',
    transactionCount: 123,
    status: 'Completed'
  },
  { 
    id: 'ST-123457', 
    merchantName: 'Chensha City Ghana Ltd', 
    amount: 'GHS1,875,000.00', 
    date: '2023-10-15',
    transactionCount: 98,
    status: 'Pending'
  },
  { 
    id: 'ST-123458', 
    merchantName: 'Blu Penguin', 
    amount: 'GHS3,125,000.00', 
    date: '2023-10-14',
    transactionCount: 156,
    status: 'Completed'
  },
  { 
    id: 'ST-123459', 
    merchantName: 'Timings Ltd', 
    amount: 'GHS1,250,000.00', 
    date: '2023-10-14',
    transactionCount: 67,
    status: 'Completed'
  },
  { 
    id: 'ST-123460', 
    merchantName: 'QuickServe Ltd', 
    amount: 'GHS950,000.00', 
    date: '2023-10-13',
    transactionCount: 45,
    status: 'Failed'
  },
];

const topMerchants = [
  { id: '1', name: 'BluWave Limited', transactionVolume: 'GHS12,500,000.00', growth: '+12%' },
  { id: '2', name: 'Blu Penguin', transactionVolume: 'GHS8,750,000.00', growth: '+8%' },
  { id: '3', name: 'Chensha City Ghana Ltd', transactionVolume: 'GHS7,250,000.00', growth: '+5%' },
  { id: '4', name: 'Timings Ltd', transactionVolume: 'GHS5,125,000.00', growth: '+3%' },
  { id: '5', name: 'QuickServe Ltd', transactionVolume: 'GHS3,850,000.00', growth: '-2%' },
];

export default function PartnerBankDashboardPage() {
  const [timeFilter, setTimeFilter] = useState("7days");

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Partner Bank Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome to your financial operations center</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={timeFilter === "today" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeFilter("today")}
            className="text-xs px-3"
          >
            Today
          </Button>
          <Button 
            variant={timeFilter === "7days" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeFilter("7days")}
            className="text-xs px-3"
          >
            7 Days
          </Button>
          <Button 
            variant={timeFilter === "30days" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeFilter("30days")}
            className="text-xs px-3"
          >
            30 Days
          </Button>
          <Button 
            variant={timeFilter === "ytd" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeFilter("ytd")}
            className="text-xs px-3"
          >
            Year to Date
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Settlements</CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">GHS42,350,000.00</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1" />
              <span>+12.5% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <IconReportMoney className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">GHS1,270,500.00</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1" />
              <span>+8.3% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
            <IconBuildingStore className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">24</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1" />
              <span>+2 from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Transaction Success Rate</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">98.7%</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1" />
              <span>+0.5% from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Settlement & Commission Trends</CardTitle>
            <CardDescription className="text-sm">Monthly financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `GHS${value.toLocaleString()}`} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="settlements" 
                    name="Settlements" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="commissions" 
                    name="Commissions" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Transaction Volume</CardTitle>
            <CardDescription className="text-sm">Daily collections vs payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyTransactionsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                  <Bar 
                    dataKey="collections" 
                    name="Collections" 
                    fill="#8884d8" 
                  />
                  <Bar 
                    dataKey="payouts" 
                    name="Payouts" 
                    fill="#82ca9d" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Settlements and Top Merchants */}
      <Tabs defaultValue="settlements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settlements" className="text-sm">Recent Settlements</TabsTrigger>
          <TabsTrigger value="merchants" className="text-sm">Top Merchants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settlements" className="mt-4">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                  <CardTitle className="text-lg sm:text-xl">Recent Settlement Transactions</CardTitle>
                  <CardDescription className="text-sm">Latest settlement activities</CardDescription>
              </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1 w-full sm:w-auto">
                <IconDownload className="h-4 w-4" />
                <span>Export</span>
              </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden sm:block">
                <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Settlement ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlementTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.merchantName}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.transactionCount}</TableCell>
                      <TableCell className="text-right">{transaction.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "Completed" 
                              ? "default" 
                              : transaction.status === "Pending" 
                                ? "outline" 
                                : "destructive"
                          }
                          className={
                            transaction.status === "Completed" 
                              ? "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400" 
                              : ""
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3">
                {settlementTransactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-sm">{transaction.id}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <Badge
                        variant={
                          transaction.status === "Completed" 
                            ? "default" 
                            : transaction.status === "Pending" 
                              ? "outline" 
                              : "destructive"
                        }
                        className={
                          transaction.status === "Completed" 
                            ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400" 
                            : ""
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold">{transaction.amount}</p>
                        <p className="text-sm text-muted-foreground">{transaction.merchantName}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">{transaction.transactionCount} transactions</p>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t px-6 py-4">
              <Button variant="outline" className="w-full sm:w-auto">View All Settlements</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="merchants" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Top Performing Merchants</CardTitle>
              <CardDescription className="text-sm">Merchants with highest transaction volumes</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden sm:block">
                <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Transaction Volume</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topMerchants.map((merchant) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">{merchant.name}</TableCell>
                      <TableCell className="text-right">{merchant.transactionVolume}</TableCell>
                      <TableCell className="text-right">
                        <span className={`${
                          merchant.growth.startsWith('+') 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {merchant.growth}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3">
                {topMerchants.map((merchant) => (
                  <Card key={merchant.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{merchant.name}</p>
                        <p className="text-sm font-semibold mt-1">{merchant.transactionVolume}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          merchant.growth.startsWith('+') 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {merchant.growth}
                        </span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t px-6 py-4">
              <Button variant="outline" className="w-full sm:w-auto">View All Merchants</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
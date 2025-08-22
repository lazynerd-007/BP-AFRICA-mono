"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Sample data - would be replaced with real API data
const chartData = [
  { name: 'Mon', collections: 4000, payouts: 2400 },
  { name: 'Tue', collections: 3000, payouts: 1398 },
  { name: 'Wed', collections: 2000, payouts: 9800 },
  { name: 'Thu', collections: 2780, payouts: 3908 },
  { name: 'Fri', collections: 1890, payouts: 4800 },
  { name: 'Sat', collections: 2390, payouts: 3800 },
  { name: 'Sun', collections: 3490, payouts: 4300 },
];

const transactionsData = [
  { id: '1', reference: 'TR-123456', amount: 'GHS15,000.00', type: 'Collection', status: 'Successful', date: '2023-05-12' },
  { id: '2', reference: 'TR-123457', amount: 'GHS25,000.00', type: 'Payout', status: 'Pending', date: '2023-05-12' },
  { id: '3', reference: 'TR-123458', amount: 'GHS5,000.00', type: 'Collection', status: 'Failed', date: '2023-05-11' },
  { id: '4', reference: 'TR-123459', amount: 'GHS12,000.00', type: 'Collection', status: 'Successful', date: '2023-05-11' },
  { id: '5', reference: 'TR-123460', amount: 'GHS8,000.00', type: 'Payout', status: 'Successful', date: '2023-05-10' },
  { id: '6', reference: 'TR-123461', amount: 'GHS9,500.00', type: 'Collection', status: 'Successful', date: '2023-05-10' },
  { id: '7', reference: 'TR-123462', amount: 'GHS18,000.00', type: 'Collection', status: 'Failed', date: '2023-05-09' },
  { id: '8', reference: 'TR-123463', amount: 'GHS22,000.00', type: 'Payout', status: 'Successful', date: '2023-05-09' },
  { id: '9', reference: 'TR-123464', amount: 'GHS7,000.00', type: 'Collection', status: 'Successful', date: '2023-05-08' },
  { id: '10', reference: 'TR-123465', amount: 'GHS13,000.00', type: 'Payout', status: 'Pending', date: '2023-05-08' },
];

const submerchants = [
  { id: '1', name: 'Store A' },
  { id: '2', name: 'Store B' },
  { id: '3', name: 'Store C' },
  { id: '4', name: 'Store D' },
];

export default function MerchantDashboardPage() {
  const [timeFilter, setTimeFilter] = useState("today");
  const [selectedSubmerchant, setSelectedSubmerchant] = useState("All Submerchants");
  const [transactionFilter, setTransactionFilter] = useState("all");

  // Filter transactions based on selected filter
  const filteredTransactions = transactionsData.filter(transaction => {
    if (transactionFilter === "all") return true;
    return transaction.status.toLowerCase() === transactionFilter.toLowerCase();
  }).slice(0, 10); // Show max 10 transactions

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Merchant Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your merchant activities and performance
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <span className="truncate">{selectedSubmerchant}</span>
              <ChevronDown size={16} className="flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setSelectedSubmerchant("All Submerchants")}>
              All Submerchants
            </DropdownMenuItem>
            {submerchants.map((merchant) => (
              <DropdownMenuItem 
                key={merchant.id} 
                onClick={() => setSelectedSubmerchant(merchant.name)}
              >
                {merchant.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <CardDescription className="text-xs">Total amount collected</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">GHS456,890.00</p>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
            <CardDescription className="text-xs">Number of failed transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">12</p>
            <p className="text-xs text-muted-foreground mt-1">
              -3% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <CardDescription className="text-xs">Current available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">GHS235,410.00</p>
            <p className="text-xs text-muted-foreground mt-1">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
              <CardTitle className="text-lg sm:text-xl">Collections & Payouts</CardTitle>
              <CardDescription className="text-sm">Overview of your financial activity</CardDescription>
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
              variant={timeFilter === "monthly" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeFilter("monthly")}
                className="text-xs px-3"
            >
              Monthly
            </Button>
            </div>
          </div>
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
                <Tooltip />
                <Area type="monotone" dataKey="collections" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="payouts" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
              <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
              <CardDescription className="text-sm">Your latest transaction activities</CardDescription>
          </div>
            <div className="flex flex-wrap gap-2">
            <Button 
              variant={transactionFilter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("all")}
                className="text-xs px-3"
            >
              All
            </Button>
            <Button 
              variant={transactionFilter === "successful" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("successful")}
                className="text-xs px-3"
            >
              Successful
            </Button>
            <Button 
              variant={transactionFilter === "pending" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("pending")}
                className="text-xs px-3"
            >
              Pending
            </Button>
            <Button 
              variant={transactionFilter === "failed" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("failed")}
                className="text-xs px-3"
            >
              Failed
            </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.reference}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'Successful' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-sm">{transaction.reference}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                    transaction.status === 'Successful' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="font-semibold">{transaction.amount}</p>
                    <p className="text-xs text-muted-foreground">{transaction.type}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
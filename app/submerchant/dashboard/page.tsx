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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

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
  { id: '1', reference: 'TR-123456', amount: '₵15,000.00', type: 'Collection', status: 'Successful', date: '2023-05-12' },
  { id: '2', reference: 'TR-123457', amount: '₵25,000.00', type: 'Payout', status: 'Pending', date: '2023-05-12' },
  { id: '3', reference: 'TR-123458', amount: '₵5,000.00', type: 'Collection', status: 'Failed', date: '2023-05-11' },
  { id: '4', reference: 'TR-123459', amount: '₵12,000.00', type: 'Collection', status: 'Successful', date: '2023-05-11' },
  { id: '5', reference: 'TR-123460', amount: '₵8,000.00', type: 'Payout', status: 'Successful', date: '2023-05-10' },
  { id: '6', reference: 'TR-123461', amount: '₵9,500.00', type: 'Collection', status: 'Successful', date: '2023-05-10' },
  { id: '7', reference: 'TR-123462', amount: '₵18,000.00', type: 'Collection', status: 'Failed', date: '2023-05-09' },
  { id: '8', reference: 'TR-123463', amount: '₵22,000.00', type: 'Payout', status: 'Successful', date: '2023-05-09' },
  { id: '9', reference: 'TR-123464', amount: '₵7,000.00', type: 'Collection', status: 'Successful', date: '2023-05-08' },
  { id: '10', reference: 'TR-123465', amount: '₵13,000.00', type: 'Payout', status: 'Pending', date: '2023-05-08' },
];

export default function SubmerchantDashboardPage() {
  const [timeFilter, setTimeFilter] = useState("today");
  const [transactionFilter, setTransactionFilter] = useState("all");

  // Filter transactions based on selected filter
  const filteredTransactions = transactionsData.filter(transaction => {
    if (transactionFilter === "all") return true;
    return transaction.status.toLowerCase() === transactionFilter.toLowerCase();
  }).slice(0, 10); // Show max 10 transactions

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Submerchant Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your business performance
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collections</CardTitle>
            <CardDescription className="text-xs">Total amount collected</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">GHS456,890.00</p>
            <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Transactions</CardTitle>
            <CardDescription className="text-xs">Number of failed transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">12</p>
            <p className="text-xs text-red-600 mt-1">-2.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
            <CardDescription className="text-xs">Current available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">GHS235,410.00</p>
            <p className="text-xs text-blue-600 mt-1">Available for withdrawal</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="text-lg sm:text-xl">Collections & Payouts</CardTitle>
            <CardDescription className="text-sm">Overview of your financial activity</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={timeFilter === "today" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeFilter("today")}
              className="text-xs sm:text-sm"
            >
              Today
            </Button>
            <Button 
              variant={timeFilter === "7days" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeFilter("7days")}
              className="text-xs sm:text-sm"
            >
              7 Days
            </Button>
            <Button 
              variant={timeFilter === "monthly" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeFilter("monthly")}
              className="text-xs sm:text-sm"
            >
              Monthly
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Area type="monotone" dataKey="collections" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="payouts" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
            <CardDescription className="text-sm">Your latest transaction activities</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={transactionFilter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("all")}
              className="text-xs sm:text-sm"
            >
              All
            </Button>
            <Button 
              variant={transactionFilter === "successful" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("successful")}
              className="text-xs sm:text-sm"
            >
              Successful
            </Button>
            <Button 
              variant={transactionFilter === "pending" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("pending")}
              className="text-xs sm:text-sm"
            >
              Pending
            </Button>
            <Button 
              variant={transactionFilter === "failed" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("failed")}
              className="text-xs sm:text-sm"
            >
              Failed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium">{transaction.reference}</div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.status === 'Successful' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium text-foreground">{transaction.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{transaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{transaction.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                    <TableHead className="min-w-[120px]">Reference</TableHead>
                    <TableHead className="min-w-[100px]">Amount</TableHead>
                    <TableHead className="min-w-[80px]">Type</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Date</TableHead>
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
                      transaction.status === 'Successful' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
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

          {/* Empty state */}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found for the selected filter.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
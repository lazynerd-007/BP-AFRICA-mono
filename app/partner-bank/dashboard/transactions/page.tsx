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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  IconSearch,
  IconCalendar,
  IconFilter,
  IconDownload,
  IconEye,
  IconArrowDown,
  IconArrowUp,
  IconExclamationCircle,
} from "@tabler/icons-react";

// Sample data for transactions
const transactions = [
  {
    id: "TXN-123456",
    merchantName: "BluWave Limited",
    amount: "GHS2,450,000.00",
    date: "2023-10-15T14:30:00",
    type: "Payment",
    status: "Successful",
    reference: "REF-987654",
    paymentMethod: "Card",
    customerName: "John Doe",
    commissionEarned: "GHS24,500.00",
  },
  {
    id: "TXN-123457",
    merchantName: "Chensha City Ghana Ltd",
    amount: "GHS1,875,000.00",
    date: "2023-10-15T11:15:00",
    type: "Payout",
    status: "Pending",
    reference: "REF-987655",
    paymentMethod: "Bank Transfer",
    customerName: "Sarah Johnson",
    commissionEarned: "GHS18,750.00",
  },
  {
    id: "TXN-123458",
    merchantName: "Blu Penguin",
    amount: "GHS3,125,000.00",
    date: "2023-10-14T09:45:00",
    type: "Payment",
    status: "Successful",
    reference: "REF-987656",
    paymentMethod: "Card",
    customerName: "Michael Smith",
    commissionEarned: "GHS31,250.00",
  },
  {
    id: "TXN-123459",
    merchantName: "Timings Ltd",
    amount: "GHS1,250,000.00",
    date: "2023-10-14T16:20:00",
    type: "Refund",
    status: "Successful",
    reference: "REF-987657",
    paymentMethod: "Card",
    customerName: "Emma Wilson",
    commissionEarned: "GHS0.00",
  },
  {
    id: "TXN-123460",
    merchantName: "QuickServe Ltd",
    amount: "GHS950,000.00",
    date: "2023-10-13T10:05:00",
    type: "Payment",
    status: "Failed",
    reference: "REF-987658",
    paymentMethod: "Card",
    customerName: "David Asante",
    commissionEarned: "GHS0.00",
    failureReason: "Insufficient funds"
  },
  {
    id: "TXN-123461",
    merchantName: "GhanaTech Solutions",
    amount: "GHS2,850,000.00",
    date: "2023-10-13T13:45:00",
    type: "Payout",
    status: "Successful",
    reference: "REF-987659",
    paymentMethod: "Bank Transfer",
    customerName: "Samuel Boateng",
    commissionEarned: "GHS28,500.00",
  },
  {
    id: "TXN-123462",
    merchantName: "BluWave Limited",
    amount: "GHS1,950,000.00",
    date: "2023-10-12T15:10:00",
    type: "Payment",
    status: "Successful",
    reference: "REF-987660",
    paymentMethod: "Card",
    customerName: "Francis Appiah",
    commissionEarned: "GHS19,500.00",
  },
  {
    id: "TXN-123463",
    merchantName: "Chensha City Ghana Ltd",
    amount: "GHS750,000.00",
    date: "2023-10-12T09:15:00",
    type: "Refund",
    status: "Successful",
    reference: "REF-987661",
    paymentMethod: "Card",
    customerName: "Janet Kwakye",
    commissionEarned: "GHS0.00",
  },
  {
    id: "TXN-123464",
    merchantName: "QuickServe Ltd",
    amount: "GHS1,350,000.00",
    date: "2023-10-11T14:30:00",
    type: "Payment",
    status: "Successful",
    reference: "REF-987662",
    paymentMethod: "Card",
    customerName: "Daniel Mensah",
    commissionEarned: "GHS13,500.00",
  },
  {
    id: "TXN-123465",
    merchantName: "Blu Penguin",
    amount: "GHS2,250,000.00",
    date: "2023-10-11T10:00:00",
    type: "Payout",
    status: "Successful",
    reference: "REF-987663",
    paymentMethod: "Bank Transfer",
    customerName: "Kofi Annan",
    commissionEarned: "GHS22,500.00",
  },
];

// Merchants for filtering
const merchants = [
  { id: "1", name: "BluWave Limited" },
  { id: "2", name: "Chensha City Ghana Ltd" },
  { id: "3", name: "Blu Penguin" },
  { id: "4", name: "Timings Ltd" },
  { id: "5", name: "QuickServe Ltd" },
  { id: "6", name: "GhanaTech Solutions" },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = 
      searchTerm === "" || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Type filter
    const matchesType = typeFilter === "all" || transaction.type.toLowerCase() === typeFilter.toLowerCase();
    
    // Merchant filter
    const matchesMerchant = merchantFilter === "all" || transaction.merchantName === merchantFilter;
    
    // Payment method filter
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter;
    
    // Date filter
    const transactionDate = new Date(transaction.date);
    const matchesStartDate = !startDate || transactionDate >= startDate;
    const matchesEndDate = !endDate || transactionDate <= endDate;
    
    return matchesSearch && matchesStatus && matchesType && matchesMerchant && 
           matchesPaymentMethod && matchesStartDate && matchesEndDate;
  });

  // Status badge variant mapper
  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const statusMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      "Successful": "default",
      "Pending": "outline",
      "Failed": "destructive"
    };
    
    return statusMap[status] || "secondary";
  };

  // Get badge classes based on status
  const getStatusClasses = (status: string): string => {
    if (status === "Successful") {
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400";
    }
    return "";
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Payment":
        return <IconArrowDown className="h-4 w-4 text-green-500" />;
      case "Payout":
        return <IconArrowUp className="h-4 w-4 text-blue-500" />;
      case "Refund":
        return <IconArrowUp className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy • h:mm a");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Monitor and track all merchant transactions processed through your bank
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="text-lg sm:text-xl">Transaction History</CardTitle>
              <CardDescription className="text-sm">
                View all transactions processed through your bank
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8 w-full sm:w-[240px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-muted" : ""}
                >
                  <IconFilter className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" className="flex items-center gap-1 flex-1 sm:flex-none">
                  <IconDownload className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="payout">Payout</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Merchant</label>
                <Select value={merchantFilter} onValueChange={setMerchantFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by merchant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Merchants</SelectItem>
                    {merchants.map(merchant => (
                      <SelectItem key={merchant.id} value={merchant.name}>{merchant.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setMerchantFilter("all");
                    setPaymentMethodFilter("all");
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                  className="mr-2"
                >
                  Reset Filters
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.merchantName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(transaction.type)}
                        <span>{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="text-right">{transaction.amount}</TableCell>
                    <TableCell className="text-right">{transaction.commissionEarned}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(transaction.status)}
                        className={getStatusClasses(transaction.status)}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDetailsDialog(true);
                        }}
                        title="View Details"
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredTransactions.length}</strong> of <strong>{transactions.length}</strong> transactions
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="px-4">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
             style={{ display: showDetailsDialog ? "flex" : "none" }}
             onClick={() => setShowDetailsDialog(false)}>
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6 m-4"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">Transaction Details</h2>
                <p className="text-muted-foreground">{selectedTransaction.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowDetailsDialog(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reference</p>
                  <p>{selectedTransaction.reference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Merchant</p>
                  <p>{selectedTransaction.merchantName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p>{selectedTransaction.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                  <p>{formatDate(selectedTransaction.date)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(selectedTransaction.type)}
                    <span>{selectedTransaction.type}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="text-lg font-bold">{selectedTransaction.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commission Earned</p>
                  <p className="text-lg font-bold">{selectedTransaction.commissionEarned}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p>{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge 
                    variant={getStatusVariant(selectedTransaction.status)}
                    className={getStatusClasses(selectedTransaction.status)}
                  >
                    {selectedTransaction.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            {selectedTransaction.status === "Failed" && selectedTransaction.failureReason && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-md flex items-start gap-2">
                <IconExclamationCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Failure Reason</p>
                  <p className="text-red-600">{selectedTransaction.failureReason}</p>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
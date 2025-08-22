"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { IconSearch, IconDownload, IconFilter, IconCalendar, IconEye, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock transactions data
const mockTransactions = [
  {
    date: "2023-11-15T10:32:15",
    merchantName: "JD Enterprises",
    terminalId: "TRM-001",
    amount: 1250.00,
    netAmount: 1225.00,
    currency: "GHS",
    status: "completed",
    type: "payment",
    customer: "John Doe",
    customerNumber: "+233 24 123 4567",
    reference: "REF-12345",
    scheme: "MTN Mobile Money"
  },
  {
    date: "2023-11-15T09:18:43",
    merchantName: "JD Enterprises",
    terminalId: "TRM-002",
    amount: 500.00,
    netAmount: 487.50,
    currency: "GHS",
    status: "completed",
    type: "payment",
    customer: "Sarah Johnson",
    customerNumber: "+233 24 987 6543",
    reference: "REF-12346",
    scheme: "AirtelTigo Money"
  },
  {
    date: "2023-11-14T16:45:22",
    merchantName: "JD Enterprises",
    terminalId: "TRM-001",
    amount: 1850.75,
    netAmount: 1813.23,
    currency: "GHS",
    status: "pending",
    type: "payment",
    customer: "Michael Brown",
    customerNumber: "+233 20 555 1234",
    reference: "REF-12347",
    scheme: "Telecel"
  },
  {
    date: "2023-11-14T14:20:11",
    merchantName: "JD Enterprises",
    terminalId: "TRM-003",
    amount: 750.50,
    netAmount: 731.99,
    currency: "GHS",
    status: "completed",
    type: "payment",
    customer: "Emma Wilson",
    customerNumber: "+233 26 777 8888",
    reference: "REF-12348",
    scheme: "American Express"
  },
  {
    date: "2023-11-14T11:05:38",
    merchantName: "JD Enterprises",
    terminalId: "TRM-002",
    amount: 2500.00,
    netAmount: 2450.00,
    currency: "GHS",
    status: "failed",
    type: "payment",
    customer: "David Lee",
    customerNumber: "+233 24 999 0000",
    reference: "REF-12349",
    scheme: "MTN Mobile Money"
  }
];

// Transaction types
const transactionTypes = [
  { id: "all", name: "All Types" },
  { id: "payment", name: "Payment" },
  { id: "refund", name: "Refund" },
  { id: "payout", name: "Payout" },
  { id: "chargeback", name: "Chargeback" },
];

// Table columns for export selection
const tableColumns = [
  { id: "date", name: "Date", checked: true },
  { id: "terminalId", name: "Terminal ID", checked: true },
  { id: "customer", name: "Customer", checked: true },
  { id: "customerNumber", name: "Customer Number", checked: true },
  { id: "amount", name: "Amount", checked: true },
  { id: "scheme", name: "Scheme", checked: true },
  { id: "reference", name: "Reference", checked: true },
  { id: "status", name: "Status", checked: true },
  { id: "type", name: "Type", checked: true },
];

// List of submerchants for filtering
const submerchants = [
  { id: "all", name: "All Submerchants" },
  { id: "store-a", name: "Store A" },
  { id: "store-b", name: "Store B" },
  { id: "store-c", name: "Store C" },
  { id: "online-store", name: "Online Store" },
];

// Export transaction types
const exportTransactionTypes = [
  { id: "all", name: "All Transactions" },
  { id: "collection", name: "Collection" },
  { id: "payout", name: "Payout" },
  { id: "reversal", name: "Reversal" },
];

// Transaction interface
interface Transaction {
  date: string;
  merchantName: string;
  terminalId: string;
  amount: number;
  netAmount: number;
  currency: string;
  status: string;
  type: string;
  customer: string;
  customerNumber: string;
  reference: string;
  scheme: string;
}

export default function MerchantTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [timeframeFilter, setTimeframeFilter] = useState("30days");
  
  // Filter state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [transactionType, setTransactionType] = useState("");
  const [selectedSubmerchant, setSelectedSubmerchant] = useState("all");
  
  // Export state
  const [exportColumns, setExportColumns] = useState(tableColumns);
  const [exportTransactionType, setExportTransactionType] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Transaction details modal state
  const [viewTransactionOpen, setViewTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Filter transactions based on all filters
  const filteredTransactions = mockTransactions.filter(transaction => {
    // Search filter
    const matchesSearch = 
      transaction.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.terminalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Transaction type filter
    const matchesType = !transactionType || transactionType === "all" || 
      transaction.type === transactionType;
    
    // Date range filter
    const transactionDate = new Date(transaction.date);
    const afterStartDate = !startDate || transactionDate >= startDate;
    const beforeEndDate = !endDate || transactionDate <= endDate;
    
    return matchesSearch && matchesType && afterStartDate && beforeEndDate;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // View transaction details
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setViewTransactionOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "completed":
        return "secondary";
      case "pending":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Handle export column selection
  const handleColumnToggle = (columnId: string) => {
    setExportColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, checked: !col.checked } : col
      )
    );
  };
  
  // Reset filters
  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setTransactionType("");
    setSelectedSubmerchant("all");
    setCurrentPage(1);
  };

  // Apply filters and close modal
  const applyFilters = () => {
    setFilterOpen(false);
  };

  // Handle export
  const handleExport = () => {
    // In a real application, this would handle the actual export functionality
    console.log("Exporting with columns:", exportColumns.filter(col => col.checked).map(col => col.id));
    setExportOpen(false);
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-sm text-muted-foreground">
          View and manage your payment transactions
        </p>
      </div>
      
      {/* Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Label htmlFor="timeframe-filter" className="text-sm font-medium whitespace-nowrap">
          Time Period:
        </Label>
        <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-2xl">126</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {timeframeFilter === "today" ? "Today" : 
               timeframeFilter === "7days" ? "Last 7 days" :
               timeframeFilter === "30days" ? "Last 30 days" :
               timeframeFilter === "90days" ? "Last 90 days" :
               timeframeFilter === "6months" ? "Last 6 months" :
               timeframeFilter === "1year" ? "Last year" : "Selected period"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Collections</CardDescription>
            <CardTitle className="text-2xl">GHS 12,450.75</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {timeframeFilter === "today" ? "Today" : 
               timeframeFilter === "7days" ? "Last 7 days" :
               timeframeFilter === "30days" ? "Last 30 days" :
               timeframeFilter === "90days" ? "Last 90 days" :
               timeframeFilter === "6months" ? "Last 6 months" :
               timeframeFilter === "1year" ? "Last year" : "Selected period"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Payout</CardDescription>
            <CardTitle className="text-2xl">GHS 8,325.50</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {timeframeFilter === "today" ? "Today" : 
               timeframeFilter === "7days" ? "Last 7 days" :
               timeframeFilter === "30days" ? "Last 30 days" :
               timeframeFilter === "90days" ? "Last 90 days" :
               timeframeFilter === "6months" ? "Last 6 months" :
               timeframeFilter === "1year" ? "Last year" : "Selected period"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="text-lg sm:text-xl">Transaction History</CardTitle>
              <CardDescription className="text-sm">View your recent transactions</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                {/* Filter Dialog */}
                <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <IconFilter className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Filter Transactions</DialogTitle>
                      <DialogDescription>
                        Apply filters to narrow down your transaction list
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Start Date</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!startDate ? 'text-muted-foreground' : ''}`}
                            type="button"
                            onClick={() => {
                              const datePickerElement = document.getElementById('start-date-picker');
                              if (datePickerElement) {
                                datePickerElement.click();
                              }
                            }}
                          >
                            <IconCalendar className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : "Select date"}
                          </Button>
                          <div className="hidden">
                            <Calendar
                              id="start-date-picker"
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>End Date</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!endDate ? 'text-muted-foreground' : ''}`}
                            type="button"
                            onClick={() => {
                              const datePickerElement = document.getElementById('end-date-picker');
                              if (datePickerElement) {
                                datePickerElement.click();
                              }
                            }}
                          >
                            <IconCalendar className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : "Select date"}
                          </Button>
                          <div className="hidden">
                            <Calendar
                              id="end-date-picker"
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="transaction-type">Transaction Type</Label>
                        <select
                          id="transaction-type"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={transactionType}
                          onChange={(e) => setTransactionType(e.target.value)}
                        >
                          {transactionTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="submerchant">Submerchant</Label>
                        <select
                          id="submerchant"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedSubmerchant}
                          onChange={(e) => setSelectedSubmerchant(e.target.value)}
                        >
                          {submerchants.map((merchant) => (
                            <option key={merchant.id} value={merchant.id}>
                              {merchant.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                      <Button onClick={applyFilters}>Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Export Dialog */}
                <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <IconDownload className="h-4 w-4" />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Export Transactions</DialogTitle>
                      <DialogDescription>
                        Select columns to include in your export
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="export-transaction-type">Transaction Type</Label>
                        <select
                          id="export-transaction-type"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={exportTransactionType}
                          onChange={(e) => setExportTransactionType(e.target.value)}
                        >
                          {exportTransactionTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Label>Columns to Export</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {exportColumns.map((column) => (
                          <div key={column.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`column-${column.id}`} 
                              checked={column.checked}
                              onCheckedChange={() => handleColumnToggle(column.id)}
                            />
                            <Label htmlFor={`column-${column.id}`}>{column.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setExportOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleExport}>Export</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <div className="rounded-md border min-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Date</TableHead>
                    <TableHead className="min-w-[100px]">Terminal ID</TableHead>
                    <TableHead className="min-w-[120px]">Customer</TableHead>
                    <TableHead className="min-w-[130px]">Customer Number</TableHead>
                    <TableHead className="min-w-[100px] text-right">Amount</TableHead>
                    <TableHead className="min-w-[100px]">Scheme</TableHead>
                    <TableHead className="min-w-[120px]">Reference</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.reference}>
                      <TableCell className="font-medium whitespace-nowrap">{formatDate(transaction.date)}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.terminalId}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.customer}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{transaction.customerNumber}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {transaction.currency} {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.scheme}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{transaction.reference}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(transaction.status) as "secondary" | "destructive" | "default" | "outline"}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => handleViewTransaction(transaction)}>
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {paginatedTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No transactions found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="items-per-page" className="text-sm">
                  Rows per page:
                </Label>
                <select
                  id="items-per-page"
                  className="h-8 w-16 rounded border border-input bg-transparent px-2 py-1 text-sm"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <IconChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 px-2 text-sm">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <IconChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <Dialog open={viewTransactionOpen} onOpenChange={setViewTransactionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about transaction {selectedTransaction?.reference}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Transaction Reference</Label>
                  <div className="text-sm font-mono bg-muted p-2 rounded">
                    {selectedTransaction.reference}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date & Time</Label>
                  <div className="text-sm p-2">
                    {formatDate(selectedTransaction.date)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Terminal ID</Label>
                  <div className="text-sm p-2">
                    {selectedTransaction.terminalId}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Payment Scheme</Label>
                  <div className="text-sm p-2">
                    {selectedTransaction.scheme}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Customer Name</Label>
                  <div className="text-sm p-2">
                    {selectedTransaction.customer}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Customer Number</Label>
                  <div className="text-sm font-mono p-2">
                    {selectedTransaction.customerNumber}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Amount</Label>
                  <div className="text-sm font-medium p-2">
                    {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Net Amount</Label>
                  <div className="text-sm font-medium p-2">
                    {selectedTransaction.currency} {selectedTransaction.netAmount?.toFixed(2) || (selectedTransaction.amount * 0.98).toFixed(2)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Charges</Label>
                  <div className="text-sm font-medium p-2">
                    {selectedTransaction.currency} {(selectedTransaction.amount - (selectedTransaction.netAmount || selectedTransaction.amount * 0.98)).toFixed(2)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="p-2">
                    <Badge variant={getStatusBadgeVariant(selectedTransaction.status) as "secondary" | "destructive" | "default" | "outline"}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Transaction Type</Label>
                  <div className="text-sm p-2 capitalize">
                    {selectedTransaction.type}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Currency</Label>
                  <div className="text-sm p-2">
                    {selectedTransaction.currency}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTransactionOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TransactionFiltersComponent,
  TransactionStatsComponent,
  TransactionTable,
  TransformedTransaction,
  TransactionStats,
  TransactionType
} from "@/components/admin/transactions";
import { useCategorizedTransactions, useTransactionStats } from "@/hooks/use-categorized-transactions";
import { Transaction, EnhancedTransactionFilters } from "@/lib/api/types";
import { transactionService } from "@/lib/api/services/transactions.service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

// Transform API transaction data to match the expected format
const transformTransactionData = (transactions: Transaction[]): TransformedTransaction[] => {
  if (!transactions || !Array.isArray(transactions)) {
    return [];
  }

  return transactions.map((transaction, index) => ({
    id: parseInt(transaction.id) || index + 1,
    merchant: (transaction as Transaction & { merchant?: { merchantName?: string } }).merchant?.merchantName || transaction.merchantName || 'Unknown Merchant',
    date: transaction.createdAt || new Date().toISOString(),
    tid: transaction.transactionRef || transaction.id,
    scheme: transaction.processor || transaction.telco || 'Unknown',
    amount: `GHS ${parseFloat(String(transaction.amount || '0')).toFixed(2)}`,
    status: transaction.status?.toUpperCase() || 'UNKNOWN'
  }));
};

// Helper function to safely format numbers for CSV
const safeFormatNumber = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(numValue)) {
    return '0.00';
  }
  
  return numValue.toFixed(2);
};

// Helper function to calculate surcharge percentage
const calculateSurchargePercentage = (fees: any, amount: any): string => {
  const feeNum = typeof fees === 'string' ? parseFloat(fees) : Number(fees);
  const amountNum = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  
  if (isNaN(feeNum) || isNaN(amountNum) || amountNum === 0) {
    return '0';
  }
  
  const percentage = (feeNum / amountNum) * 100;
  return percentage.toFixed(1);
};

// Helper function to format date for CSV
const formatTransactionDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().replace('T', ' ').slice(0, 19); // Format: YYYY-MM-DD HH:MM:SS
  } catch {
    return dateString;
  }
};

// Helper function to safely extract merchant data
const getMerchantInfo = (transaction: any) => {
  // Try different possible merchant code field structures
  const merchantCode = 
    transaction.merchantId || 
    transaction.merchantCode ||
    transaction.merchant?.id ||
    transaction.merchant?.merchantId ||
    transaction.merchant?.code ||
    transaction.merchant?.merchantCode ||
    transaction.subMerchantId ||
    transaction.id ||
    transaction.ref ||
    transaction.reference ||
    '';
    
  const merchantName = 
    transaction.merchantName || 
    transaction.merchant?.merchantName ||
    transaction.merchant?.name ||
    transaction.merchant?.title ||
    (transaction as any).merchant?.merchantName ||
    'Unknown Merchant';
  
  return {
    code: merchantCode,
    name: merchantName
  };
};

// CSV Generation Functions
const convertToCSV = (transactions: Transaction[]): string => {
  // Define CSV headers to match the reference image exactly
  const headers = [
    'Transaction Date',
    'Merchant Code',
    'Merchant Name',
    'Processor',
    'Status',
    'Payment Method',
    'Transaction Type',
    'Invoice Amount',
    'Net Amount',
    'Transaction Amount',
    'Surcharge',
    'Surcharge Amount',
    'Surcharge %',
    'Customer Mobile Number',
    'Transaction Reference',
    'Terminal ID'
  ];

  // Convert transactions to CSV rows matching the reference format
  const csvRows = transactions.map(transaction => {
    const merchantInfo = getMerchantInfo(transaction);
    
    return [
      formatTransactionDate(transaction.createdAt || ''),          // Transaction Date
      merchantInfo.code,                                           // Merchant Code
      merchantInfo.name,                                           // Merchant Name
      transaction.processor || transaction.telco || 'Unknown',    // Processor
      transaction.status?.toLowerCase() || 'unknown',             // Status (lowercase like in image)
      transaction.type || 'mobile_money',                         // Payment Method
      transaction.type || 'payout/cashout',                       // Transaction Type
      safeFormatNumber(transaction.amount),                       // Invoice Amount
      safeFormatNumber(transaction.netAmount),                    // Net Amount
      safeFormatNumber(transaction.amount),                       // Transaction Amount
      safeFormatNumber(transaction.fees),                         // Surcharge
      safeFormatNumber(transaction.fees),                         // Surcharge Amount (same as surcharge)
      calculateSurchargePercentage(transaction.fees, transaction.amount), // Surcharge %
      transaction.customerPhone || '',                            // Customer Mobile Number
      transaction.transactionRef || transaction.id,               // Transaction Reference
      transaction.processorRef || transaction.telco || ''         // Terminal ID
    ];
  });

  // Combine headers and rows
  const allRows = [headers, ...csvRows];
  
  // Convert to CSV string
  return allRows.map(row => 
    row.map(field => {
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const escapedField = String(field).replace(/"/g, '""');
      return /[",\n\r]/.test(escapedField) ? `"${escapedField}"` : escapedField;
    }).join(',')
  ).join('\n');
};

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export default function TransactionsPage() {
  const [transactionType, setTransactionType] = useState<TransactionType>("collection");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<TransformedTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentFilters, setCurrentFilters] = useState<EnhancedTransactionFilters>({
    partnerBankId: "all",
    merchantId: "all",
    subMerchantId: "all",
    startDate: "",
    endDate: "",
    transactionType: "all",
    searchTerm: "",
    perPage: "10"
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Use our custom hooks
  const {
    currentData,
    fetchTransactions,
    setCurrentCategory,
    currentCategory,
  } = useCategorizedTransactions(transactionType);

  const { stats } = useTransactionStats({
    startDate: currentFilters.startDate,
    endDate: currentFilters.endDate,
    partnerBankId: currentFilters.partnerBankId,
    merchantId: currentFilters.merchantId,
    subMerchantId: currentFilters.subMerchantId,
  });

  // Update category when transaction type changes
  useEffect(() => {
    setCurrentCategory(transactionType);
  }, [transactionType, setCurrentCategory]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearch !== "") {
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  // Handle filter changes from the filter component
  const handleFiltersChange = useCallback((newFilters: EnhancedTransactionFilters) => {
    setCurrentFilters(newFilters);
    setCurrentPage(1); // Reset page when filters change
  }, []);

  // Refetch data when filters, page, or search changes
  // NOTE: Transaction table is NOT filtered by date, merchant, or subMerchant - only stats are filtered
  useEffect(() => {
    const queryParams = {
      page: currentPage,
      perPage: parseInt(currentFilters.perPage) || 10,
      // ❌ REMOVED: Date filtering for transaction table
      // ...(currentFilters.startDate && { startDate: currentFilters.startDate }),
      // ...(currentFilters.endDate && { endDate: currentFilters.endDate }),
      ...(currentFilters.partnerBankId !== "all" && { partnerBankId: currentFilters.partnerBankId }),
      // ❌ REMOVED: merchantId and subMerchantId filtering for transaction table
      // ...(currentFilters.merchantId !== "all" && { merchantId: currentFilters.merchantId }),
      // ...(currentFilters.subMerchantId !== "all" && { subMerchantId: currentFilters.subMerchantId }),
      ...(debouncedSearch && { search: debouncedSearch }),
    };

    fetchTransactions(currentCategory, queryParams);
  }, [
    currentCategory,
    currentPage,
    // ✅ Removed date filters from dependencies - only partner bank, search, and pagination affect table
    currentFilters.partnerBankId,
    currentFilters.perPage,
    debouncedSearch,
    fetchTransactions
  ]);

  // Reset page when transaction type changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
  }, [transactionType]);

  // Transform current data - no client-side filtering needed since search is server-side
  const transformedData = transformTransactionData(currentData.data);

  // Handle search input change
  const handleSearchChange = useCallback((search: string) => {
    setSearchQuery(search);
    setCurrentFilters(prev => ({ ...prev, searchTerm: search })); // Keep for UI display
  }, []);

  // Handle download report - Frontend CSV generation
  // NOTE: Download report uses ALL filters (including merchant/subMerchant) 
  // and fetches ALL matching transactions (not paginated)
  const handleDownloadReport = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      // Build query parameters with ALL filters for download
      const downloadParams = {
        perPage: 10000, // Fetch large number to get all transactions
        ...(currentFilters.startDate && { startDate: currentFilters.startDate }),
        ...(currentFilters.endDate && { endDate: currentFilters.endDate }),
        ...(currentFilters.partnerBankId !== "all" && { partnerBankId: currentFilters.partnerBankId }),
        ...(currentFilters.merchantId !== "all" && { merchantId: currentFilters.merchantId }),
        ...(currentFilters.subMerchantId !== "all" && { subMerchantId: currentFilters.subMerchantId }),
        ...(currentFilters.transactionType !== "all" && { transactionType: currentFilters.transactionType }),
        ...(currentFilters.searchTerm && { search: currentFilters.searchTerm }),
      };

      // Fetch all transactions with filters
      const response = await transactionService.getTransactions(downloadParams);
      
      let allTransactions: Transaction[] = [];
      if (response.data?.items && Array.isArray(response.data.items)) {
        allTransactions = response.data.items;
      } else if (Array.isArray(response.data)) {
        allTransactions = response.data;
      }

      console.log(`📥 Fetched ${allTransactions.length} transactions for CSV`);

      if (allTransactions.length === 0) {
        console.warn('No transactions found for download');
        // You could show a warning message here
        return;
      }

      // Basic logging for CSV generation
      console.log(`📥 Fetched ${allTransactions.length} transactions for CSV generation`);

      // Generate CSV content with error handling
      let csvContent: string;
      try {
        csvContent = convertToCSV(allTransactions);
      } catch (csvError) {
        console.error('❌ Error during CSV conversion:', csvError);
        throw new Error(`CSV generation failed: ${csvError instanceof Error ? csvError.message : 'Unknown error'}`);
      }
      
      // Generate filename with current date and filters
      const date = new Date().toISOString().split('T')[0];
      const time = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
      
      // Create descriptive filename based on active filters
      const filterParts = [];
      if (currentFilters.startDate || currentFilters.endDate) {
        filterParts.push('filtered');
      }
      if (currentFilters.partnerBankId !== 'all') {
        filterParts.push('bank');
      }
      if (currentFilters.merchantId !== 'all') {
        filterParts.push('merchant');
      }
      if (currentFilters.transactionType !== 'all') {
        filterParts.push(currentFilters.transactionType);
      }
      
      const filterSuffix = filterParts.length > 0 ? `_${filterParts.join('_')}` : '';
      const fileName = `transactions_${date}_${time}${filterSuffix}.csv`;
      
      // Trigger download
      downloadCSV(csvContent, fileName);
      
      setDownloadSuccess(true);
      console.log(`✅ CSV downloaded: ${fileName}`);
      
      // Hide success message after 3 seconds
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('❌ Failed to generate CSV report:', error);
      // Could show error toast here
    } finally {
      setIsDownloading(false);
    }
  }, [currentFilters, isDownloading]);

  // Convert stats to expected format
  const transactionStats: TransactionStats = {
    successfulCollections: {
      count: stats.collection.count,
      amount: stats.collection.amount
    },
    failedTransactions: {
      count: stats.reversal.count,
      amount: stats.reversal.amount
    },
    successfulPayouts: {
      count: stats.payout.count,
      amount: stats.payout.amount
    }
  };

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            View all transactions. Date/merchant filters affect statistics only. Partner bank filters and search affect both table and stats.
          </p>
        </div>
      </div>

      {/* Show download success message */}
      {downloadSuccess && (
        <Alert>
          <IconCheck className="h-4 w-4" />
          <AlertDescription>
            CSV transaction report generated and downloaded successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Show error if API call failed */}
      {currentData.error && (
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>
            {currentData.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Show loading state in stats */}
      {stats.loading && (
        <Alert>
          <AlertDescription>
            Loading transaction statistics...
          </AlertDescription>
        </Alert>
      )}
      
      <TransactionFiltersComponent
        onFiltersChange={handleFiltersChange}
        onDownloadReport={handleDownloadReport}
        isDownloading={isDownloading}
      />
      
      <TransactionStatsComponent
        stats={transactionStats}
        loading={stats.loading}
        startDate={currentFilters.startDate}
        endDate={currentFilters.endDate}
        merchantId={currentFilters.merchantId}
        subMerchantId={currentFilters.subMerchantId}
        partnerBankId={currentFilters.partnerBankId}
      />
      
      <TransactionTable
        data={transformedData}
        transactionType={transactionType}
        onTransactionTypeChange={setTransactionType}
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
        perPage={currentFilters.perPage}
        onPerPageChange={(perPage) => setCurrentFilters(prev => ({ ...prev, perPage }))}
        loading={currentData.loading}
        selectedRows={selectedRows}
        currentPage={currentPage}
        totalPages={currentData.meta?.totalPages || 1}
        onPageChange={setCurrentPage}
        totalCount={currentData.meta?.total || 0}
      />
    </div>
  );
}
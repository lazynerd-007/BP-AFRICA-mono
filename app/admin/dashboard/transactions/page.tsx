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
import { reportsService } from "@/lib/api/services/reports.service";
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
  useEffect(() => {
    const queryParams = {
      page: currentPage,
      perPage: parseInt(currentFilters.perPage) || 10,
      ...(currentFilters.startDate && { startDate: currentFilters.startDate }),
      ...(currentFilters.endDate && { endDate: currentFilters.endDate }),
      ...(currentFilters.partnerBankId !== "all" && { partnerBankId: currentFilters.partnerBankId }),
      ...(currentFilters.merchantId !== "all" && { merchantId: currentFilters.merchantId }),
      ...(currentFilters.subMerchantId !== "all" && { subMerchantId: currentFilters.subMerchantId }),
      ...(debouncedSearch && { search: debouncedSearch }),
    };

    fetchTransactions(currentCategory, queryParams);
  }, [
    currentCategory,
    currentPage,
    currentFilters,
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

  // Handle download report
  const handleDownloadReport = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const blob = await reportsService.downloadTransactionFile(currentFilters, 'csv');
      
      // Generate filename with current date and filters
      const date = new Date().toISOString().split('T')[0];
      const filterSuffix = currentFilters.partnerBankId !== 'all' ? `_${currentFilters.partnerBankId}` : '';
      const fileName = `transactions_${date}${filterSuffix}.csv`;
      
      reportsService.triggerFileDownload(blob, fileName);
      setDownloadSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to download report:', error);
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
            Filter and download transaction reports within a date range
          </p>
        </div>
      </div>

      {/* Show download success message */}
      {downloadSuccess && (
        <Alert>
          <IconCheck className="h-4 w-4" />
          <AlertDescription>
            Transaction report downloaded successfully!
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
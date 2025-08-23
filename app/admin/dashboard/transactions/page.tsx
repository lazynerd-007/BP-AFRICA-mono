"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import {
  TransactionFiltersComponent,
  TransactionStatsComponent,
  TransactionTable,
  TransformedTransaction,
  TransactionStats,
  TransactionType
} from "@/components/admin/transactions";

// Mock data for transactions
const transactionData: Transaction[] = [
  {
    id: 1,
    merchantName: "TechStore Ghana",
    date: "2024-05-15",
    tid: "TID123456",
    terminalId: "AB123456",
    scheme: "MTN Mobile Money",
    reference: "REF78901234",
    amount: "GHS 2,500.00",
    netAmount: "GHS 2,475.00",
    customerNumber: "233541234567",
    status: "SUCCESS"
  },
  {
    id: 2,
    merchantName: "FoodMart Accra",
    date: "2024-05-14",
    tid: "TID789012",
    terminalId: "CD789012",
    scheme: "Telecel",
    reference: "REF56789012",
    amount: "GHS 850.00",
    netAmount: "GHS 841.50",
    customerNumber: "233551234567",
    status: "SUCCESS"
  },
  {
    id: 3,
    merchantName: "Pharmacy Plus",
    date: "2024-05-14",
    tid: "TID345678",
    terminalId: "EF345678",
    scheme: "AirtelTigo Money",
    reference: "REF34567890",
    amount: "GHS 1,200.00",
    netAmount: "GHS 1,188.00",
    customerNumber: "233561234567",
    status: "PENDING"
  },
  {
    id: 4,
    merchantName: "ElectroWorld",
    date: "2024-05-13",
    tid: "TID901234",
    terminalId: "GH901234",
    scheme: "MTN Mobile Money",
    reference: "REF12345678",
    amount: "GHS 5,000.00",
    netAmount: "GHS 4,950.00",
    customerNumber: "233571234567",
    status: "SUCCESS"
  },
  {
    id: 5,
    merchantName: "Fashion House",
    date: "2024-05-13",
    tid: "TID567890",
    terminalId: "IJ567890",
    scheme: "Telecel",
    reference: "REF90123456",
    amount: "GHS 3,200.00",
    netAmount: "GHS 3,168.00",
    customerNumber: "233581234567",
    status: "FAILED"
  }
];

// Convert to the schema format expected by DataTable
const transformedData: TransformedTransaction[] = transactionData.map(item => ({
  id: item.id,
  merchant: item.merchantName,
  date: item.date,
  tid: item.terminalId,
  scheme: item.scheme,
  amount: item.amount,
  status: item.status
}));

// Mock stats data
const mockStats: TransactionStats = {
  successfulCollections: {
    count: 2,
    amount: "GHS0.02"
  },
  failedTransactions: {
    count: 1868,
    amount: "GHS950,421.45"
  },
  successfulPayouts: {
    count: 0,
    amount: "GHS0.00"
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
        searchTerm={filters.searchTerm}
        onSearchChange={(search) => setFilters(prev => ({ ...prev, searchTerm: search }))}
        perPage={filters.perPage}
        onPerPageChange={(perPage) => setFilters(prev => ({ ...prev, perPage }))}
      />
    </div>
  );
}
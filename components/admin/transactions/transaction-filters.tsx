"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconLoader, IconAlertCircle } from "@tabler/icons-react"
import { useTransactionFilters } from "@/hooks/use-transaction-filters"
import { Button } from "@/components/ui/button"

interface TransactionFiltersComponentProps {
<<<<<<< HEAD
  onFiltersChange: (filters: import("@/lib/api/types").EnhancedTransactionFilters) => void
=======
  onFiltersChange: (filters: any) => void
>>>>>>> 998f0609d66907cc6ede657345cf78594e449e65
  onDownloadReport: () => void
  isDownloading?: boolean
}

export function TransactionFiltersComponent({
  onFiltersChange,
  onDownloadReport,
  isDownloading = false
}: TransactionFiltersComponentProps) {
  const { filters, filterData, actions, hasError } = useTransactionFilters()

  // Notify parent component when filters change
  React.useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  // Handle individual filter changes
  const handlePartnerBankChange = (value: string) => {
    actions.setPartnerBank(value)
  }

  const handleMerchantChange = (value: string) => {
    actions.setMerchant(value)
  }

  const handleSubMerchantChange = (value: string) => {
    actions.setSubMerchant(value)
  }

  const handleStartDateChange = (value: string) => {
    actions.setDateRange(value, filters.endDate)
  }

  const handleEndDateChange = (value: string) => {
    actions.setDateRange(filters.startDate, value)
  }

  const handleTransactionTypeChange = (value: string) => {
    actions.setTransactionType(value)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Filter Transactions</span>
          <Button
            onClick={onDownloadReport}
            disabled={isDownloading}
            size="sm"
            variant="outline"
          >
            {isDownloading ? (
              <>
                <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              'Download Report'
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Refine your search with the filters below. Select partner bank to load merchants, then select merchant to load sub-merchants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Show error alert if any API calls failed */}
        {hasError && (
          <Alert variant="destructive" className="mb-4">
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              {filterData.error.partnerBanks || filterData.error.merchants || filterData.error.subMerchants}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Partner Bank Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Partner Bank</label>
            <Select
              value={filters.partnerBankId}
              onValueChange={handlePartnerBankChange}
              disabled={filterData.loading.partnerBanks}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- All --" />
                {filterData.loading.partnerBanks && (
                  <IconLoader className="h-4 w-4 animate-spin ml-2" />
                )}
              </SelectTrigger>
              <SelectContent>
                {filterData.partnerBanks.map((bank, index) => (
                  <SelectItem key={`partner-bank-${bank.id}-${index}`} value={bank.value}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Merchant Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Merchant</label>
            <Select
              value={filters.merchantId}
              onValueChange={handleMerchantChange}
              disabled={filterData.loading.merchants || filters.partnerBankId === 'all'}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- All --" />
                {filterData.loading.merchants && (
                  <IconLoader className="h-4 w-4 animate-spin ml-2" />
                )}
              </SelectTrigger>
              <SelectContent>
                {filterData.merchants.map((merchant, index) => (
                  <SelectItem key={`merchant-${merchant.id}-${index}`} value={merchant.value}>
                    {merchant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Sub-Merchant Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sub Merchant</label>
            <Select
              value={filters.subMerchantId}
              onValueChange={handleSubMerchantChange}
              disabled={filterData.loading.subMerchants || filters.merchantId === 'all'}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- All --" />
                {filterData.loading.subMerchants && (
                  <IconLoader className="h-4 w-4 animate-spin ml-2" />
                )}
              </SelectTrigger>
              <SelectContent>
                {filterData.subMerchants.map((subMerchant, index) => (
                  <SelectItem key={`sub-merchant-${subMerchant.id}-${index}`} value={subMerchant.value}>
                    {subMerchant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <div className="relative">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
              />
            </div>
          </div>
          
          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <div className="relative">
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
              />
            </div>
          </div>
          
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <Select
              value={filters.transactionType}
              onValueChange={handleTransactionTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- All --</SelectItem>
                <SelectItem value="money_in">Collection</SelectItem>
                <SelectItem value="money_out">Payout</SelectItem>
                <SelectItem value="reversal">Reversal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={actions.clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionFilters, GHANA_BANKS } from "./types"

interface TransactionFiltersProps {
  filters: TransactionFilters
  onFiltersChange: (filters: TransactionFilters) => void
}

export function TransactionFiltersComponent({ filters, onFiltersChange }: TransactionFiltersProps) {
  const {
    selectedBank,
    parentMerchant,
    subMerchant,
    startDate,
    endDate,
    transactionFilter
  } = filters

  const updateFilter = (key: keyof TransactionFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filter Transactions</CardTitle>
        <CardDescription>
          Refine your search with the filters below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Partner Bank</label>
            <Select value={selectedBank} onValueChange={(value) => updateFilter('selectedBank', value)}>
              <SelectTrigger>
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                {GHANA_BANKS.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Parent Merchant</label>
            <Select value={parentMerchant} onValueChange={(value) => updateFilter('parentMerchant', value)}>
              <SelectTrigger>
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- All --</SelectItem>
                <SelectItem value="bluwave">BluWave Limited</SelectItem>
                <SelectItem value="blupenguin">Blu Penguin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sub Merchant</label>
            <Select value={subMerchant} onValueChange={(value) => updateFilter('subMerchant', value)}>
              <SelectTrigger>
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- All --</SelectItem>
                <SelectItem value="chensha">Chensha City Ghana Ltd</SelectItem>
                <SelectItem value="timings">Timings Ltd</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <div className="relative">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => updateFilter('startDate', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <div className="relative">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => updateFilter('endDate', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <Select value={transactionFilter} onValueChange={(value) => updateFilter('transactionFilter', value)}>
              <SelectTrigger>
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- All --</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
                <SelectItem value="payout">Payout</SelectItem>
                <SelectItem value="reversal">Reversal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
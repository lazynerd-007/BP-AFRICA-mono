export interface Transaction {
  id: number
  merchantName: string
  date: string
  tid: string
  terminalId: string
  scheme: string
  reference: string
  amount: string
  netAmount: string
  customerNumber: string
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
}

export interface TransformedTransaction {
  id: number
  merchant: string
  date: string
  tid: string
  scheme: string
  amount: string
  status: string
}

export interface TransactionFilters {
  selectedBank: string
  parentMerchant: string
  subMerchant: string
  startDate: string
  endDate: string
  transactionFilter: string
  searchTerm: string
  perPage: string
}

export interface TransactionStats {
  successfulCollections: {
    count: number
    amount: string
  }
  failedTransactions: {
    count: number
    amount: string
  }
  successfulPayouts: {
    count: number
    amount: string
  }
}

export interface Bank {
  id: string
  name: string
}

export const GHANA_BANKS: Bank[] = [
  { id: "all", name: "-- All --" },
  { id: "gcb", name: "Ghana Commercial Bank (GCB)" },
  { id: "ecobank", name: "Ecobank Ghana" },
  { id: "stanbic", name: "Stanbic Bank Ghana" },
  { id: "zenith", name: "Zenith Bank Ghana" },
  { id: "scb", name: "Standard Chartered Bank Ghana" },
]

export const TRANSACTION_TYPES = ['collection', 'reversal', 'payout'] as const
export type TransactionType = typeof TRANSACTION_TYPES[number] 
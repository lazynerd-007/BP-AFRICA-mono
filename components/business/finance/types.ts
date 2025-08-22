// Finance Business Component Types

export interface WalletData {
  id: string
  balance: string
  currency: string
  accountNumber?: string
  type: 'collection' | 'payout' | 'settlement'
  status: 'active' | 'inactive' | 'frozen'
  lastUpdated: Date
}

export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: string
  currency: string
  description: string
  reference: string
  status: 'completed' | 'pending' | 'failed'
  timestamp: Date
  merchantName?: string
  channel?: string
}

export interface PaymentMethod {
  id: string
  type: 'momo' | 'bank' | 'card' | 'bluepay'
  name: string
  details: Record<string, string>
  isDefault: boolean
  status: 'active' | 'inactive'
}

export interface Settlement {
  id: string
  merchantName: string
  amount: string
  currency: string
  date: string
  transactionCount: number
  status: 'completed' | 'pending' | 'failed'
  reference: string
  commissionEarned: string
  totalMerchantVolume: string
  settlementTime: string
  bankName?: string
  account?: string
  failureReason?: string
}

export interface Commission {
  totalAmount: string
  partnerShare: string
  merchantShare: string
  systemShare: string
  telcoShare: string
  currency: string
  percentage: number
}

export interface FinancialMetrics {
  totalTransactions: number
  totalAmount: string
  totalCommission: string
  averageTransaction: string
  currency: string
}

export interface DisbursementRequest {
  amount: string
  currency: string
  recipientBank: string
  recipientAccount: string
  narration: string
  reference?: string
}

export interface BalanceInfo {
  available: string
  pending: string
  total: string
  currency: string
  lastUpdated: Date
} 
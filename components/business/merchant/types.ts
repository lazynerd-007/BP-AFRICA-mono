// Merchant Business Component Types

export interface MerchantData {
  id: string
  merchantCode: string
  merchantName: string
  merchantAddress: string
  notificationEmail: string
  country: string
  tinNumber?: string
  phoneNumber: string
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  createdAt: Date
  updatedAt: Date
  
  // Business Details
  organizationType: 'business' | 'individual' | 'ngo'
  merchantCategory: string
  
  // Financial Settings
  settlementFrequency: 'daily' | 'weekly' | 'monthly'
  surchargeOn: 'merchant' | 'customer' | 'shared'
  partnerBank: string
  terminalId?: string
  
  // Surcharge Configuration
  totalSurcharge: number
  merchantSurcharge: number
  customerSurcharge: number
  noSurchargeCap: boolean
  
  // OVA Settings
  ovaSettings: {
    mtn?: string
    airtel?: string
    telecel?: string
  }
  
  // User Details
  userDetails: {
    firstName: string
    lastName: string
    email: string
  }
  
  // Bank Details
  bankDetails: {
    merchantBank: string
    branch: string
    accountType: string
    accountNumber: string
    accountName: string
  }
  
  // KYC
  kyc: MerchantKYCData
  
  // Sub-merchants
  subMerchants?: SubMerchant[]
}

export interface MerchantKYCData {
  status: 'pending' | 'approved' | 'rejected' | 'incomplete'
  documents: {
    businessRegistration?: string
    tinCertificate?: string
    bankStatement?: string
    directorId?: string
    utilityBill?: string
  }
  verificationDate?: Date
  verifiedBy?: string
  rejectionReason?: string
  notes?: string
}

export interface MerchantSettings {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    webhook: boolean
  }
  security: {
    twoFactorAuth: boolean
    ipWhitelist: string[]
    webhookSecurity: boolean
  }
  business: {
    operatingHours: {
      start: string
      end: string
      timezone: string
    }
    supportContact: {
      email: string
      phone: string
    }
  }
  api: {
    enabled: boolean
    apiKey?: string
    callbackUrl?: string
    webhookSecret?: string
  }
}

export interface SubMerchant {
  id: string
  parentMerchantId: string
  merchantCode: string
  merchantName: string
  merchantAddress: string
  notificationEmail: string
  phoneNumber: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Date
  
  // Simplified settings
  merchantCategory: string
  surchargeSettings: {
    totalSurcharge: number
    merchantSurcharge: number
    customerSurcharge: number
  }
  
  userDetails: {
    firstName: string
    lastName: string
    email: string
  }
}

export interface MerchantStats {
  totalTransactions: number
  totalVolume: string
  currency: string
  transactionCount: {
    today: number
    week: number
    month: number
  }
  revenue: {
    today: string
    week: string
    month: string
  }
  growth: {
    transactions: number
    volume: number
  }
  avgTransactionSize: string
  successRate: number
}

export interface MerchantFormData {
  // Merchant Details
  merchantCode: string
  merchantName: string
  merchantAddress: string
  notificationEmail: string
  country: string
  tinNumber?: string
  settlementFrequency: string
  surchargeOn: string
  partnerBank: string
  bdm?: string
  terminalId?: string
  subMerchantSettlementAccount?: string
  phoneNumber: string
  
  // Surcharge Details
  totalSurcharge: string
  merchantSurcharge: string
  customerSurcharge: string
  noSurchargeCap: boolean
  
  // OVA Settings
  mtn?: string
  airtel?: string
  telecel?: string
  
  // User Details
  firstName: string
  lastName: string
  email: string
  
  // Bank Details
  merchantBank: string
  branch: string
  accountType: string
  accountNumber: string
  accountName: string
  organizationType: string
  merchantCategory: string
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  current: boolean
  optional: boolean
  component?: React.ComponentType<Record<string, unknown>>
} 
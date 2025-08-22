/**
 * TypeScript interfaces for BluPay Africa Backend API
 * Based on OpenAPI specification
 */

// Base API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination
export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    meta: PaginationMeta;
  };
  errors?: string[];
}

// Authentication Types
export interface AuthEmailLoginDto {
  email: string;
  password: string;
  userType?: 'administrator' | 'merchant' | 'submerchant' | 'partner-bank';
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profileImage?: string;
  phoneNumber?: string;
  merchantId?: string;
  partnerBankId?: string;
}

export enum UserRole {
  ADMINISTRATOR = 'administrator',
  MERCHANT = 'merchant',
  SUB_MERCHANT = 'submerchant',
  PARTNER_BANK = 'partner-bank',
  AGENT = 'agent'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export interface RequestOtpDto {
  purpose: 'password_reset' | 'transaction_reversal' | 'account_verification';
  identifier?: string;
}

export interface VerifyOtpDto {
  otp: string;
  purpose: string;
}

export interface InitiatePwdReset {
  email: string;
}

export interface CompleteResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Transaction Types
export interface CreateTransactionDto {
  amount: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  description?: string;
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  telco?: TelcoProvider;
}

export enum TelcoProvider {
  MTN = 'mtn',
  ORANGE = 'orange',
  VODAFONE = 'vodafone',
  AIRTELTIGO = 'airteltigo'
}

export interface TransactionResponse {
  transactionRef: string;
  status: TransactionStatus;
  amount: number;
  currency: string;
  customerPhone: string;
  description?: string;
  paymentUrl?: string;
  qrCode?: string;
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PROCESSING = 'processing',
  EXPIRED = 'expired'
}

export interface Transaction {
  id: string;
  transactionRef: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  description?: string;
  merchantId: string;
  merchantName: string;
  partnerBankId?: string;
  partnerBankName?: string;
  telco?: TelcoProvider;
  processor?: string; // Added processor field for scheme column
  fees: number;
  netAmount: number;
  processorRef?: string;
  processorResponse?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export enum TransactionType {
  MOBILE_MONEY = 'mobile_money',
  CARD = 'card',
  CASHOUT = 'cashout',
  TRANSFER = 'transfer',
  WALLET_FUNDING = 'wallet_funding'
}

export interface CreateCashoutDto {
  recipients: CashoutRecipient[];
  description?: string;
  reference?: string;
}

export interface CashoutRecipient {
  name: string;
  phone: string;
  amount: number;
  telco: TelcoProvider;
}

export interface Bp2BpTransferDto {
  recipientMerchantId: string;
  amount: number;
  description?: string;
  reference?: string;
}

export interface FundWalletDto {
  amount: number;
  description?: string;
}

export interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

// Analytics Types
export interface AnalyticsResponse {
  totalTransactions: number;
  totalAmount: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  averageTransactionAmount: number;
  transactionsByDay: DailyTransaction[];
  transactionsByTelco: TelcoTransaction[];
  revenueByMonth: MonthlyRevenue[];
}

export interface DailyTransaction {
  date: string;
  count: number;
  amount: number;
}

export interface TelcoTransaction {
  telco: TelcoProvider;
  count: number;
  amount: number;
  percentage: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  transactions: number;
}

export type QueryRange = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'last_month' | 'this_year' | 'custom';

// Merchant Types
export interface CreateMerchantDto {
  businessName: string;
  businessType: string;
  businessDescription?: string;
  businessAddress: string;
  businessCity: string;
  businessRegion: string;
  businessCountry: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite?: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  contactPersonPosition: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankBranch?: string;
  partnerBankId?: string;
}

export interface UpdateMerchantDto {
  businessName?: string;
  businessType?: string;
  businessDescription?: string;
  businessAddress?: string;
  businessCity?: string;
  businessRegion?: string;
  businessCountry?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessWebsite?: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  contactPersonFirstName?: string;
  contactPersonLastName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  contactPersonPosition?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  bankBranch?: string;
  webhookUrl?: string;
  status?: MerchantStatus;
  partnerBankId?: string;
}

export interface MerchantAnalytics {
  totalTransactions: number;
  totalRevenue: number;
  averageTransactionValue: number;
  successRate: number;
  dailyTransactions: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  transactionsByType: Array<{
    type: TransactionType;
    count: number;
    amount: number;
    percentage: number;
  }>;
  transactionsByStatus: Array<{
    status: TransactionStatus;
    count: number;
    percentage: number;
  }>;
}

export interface Terminal {
  id: string;
  merchantId: string;
  terminalId: string;
  terminalName: string;
  terminalType: string;
  location: string;
  status: 'active' | 'inactive' | 'suspended';
  serialNumber: string;
  model: string;
  manufacturer: string;
  installationDate: string;
  lastTransactionAt?: string;
  totalTransactions: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTerminalDto {
  terminalId: string;
  terminalName: string;
  terminalType: string;
  location: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
}

export interface TransactionAnalytics {
  successTotalMoneyInAmount: number;
  successTotalMoneyInCount: number;
  successTotalMoneyOutAmount: number;
  successTotalMoneyOutCount: number;
  failedTotalAmount: number;
  failedTotalCount: number;
  transactionsByStatus?: Record<string, number>;
  transactionsByDate?: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  topMerchants?: Array<{
    merchantId: string;
    merchantName: string;
    transactionCount: number;
    totalAmount: number;
  }>;
}

export interface TransactionSummary {
  date: string;
  totalTransactions: number;
  totalAmount: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  averageAmount: number;
}

export interface Merchant {
  id: string;
  businessName: string;
  businessType: string;
  businessDescription?: string;
  businessAddress: string;
  businessCity: string;
  businessRegion: string;
  businessCountry: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite?: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  contactPersonPosition: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankBranch?: string;
  merchantCode: string;
  apiKey: string;
  secretKey: string;
  webhookUrl?: string;
  status: MerchantStatus;
  isVerified: boolean;
  partnerBankId?: string;
  partnerBankName?: string;
  createdAt: string;
  updatedAt: string;
  lastTransactionAt?: string;
  totalTransactions: number;
  totalRevenue: number;
  walletBalance: number;
}

export enum MerchantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export interface CreateSubMerchantDto {
  parentMerchantId: string;
  businessName: string;
  businessType: string;
  businessDescription?: string;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  commissionRate?: number;
}

export interface SubMerchant {
  id: string;
  parentMerchantId: string;
  businessName: string;
  businessType: string;
  businessDescription?: string;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  merchantCode: string;
  apiKey: string;
  secretKey: string;
  status: MerchantStatus;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
  totalTransactions: number;
  totalRevenue: number;
}

// Top Performing Merchant Types
export interface TopPerformingMerchant {
  merchantId: string;
  merchantName: string;
  merchantCode?: string;
  totalAmount: number;
  transactionCount?: number;
  currency?: string;
  rank?: number;
}

// Transaction Count and Volume Types
export interface TransactionCountAndVolume {
  totalTrxnVolume: string;  // Correct field name from API response
  totalTrxnCount: string;   // Correct field name from API response  
  processor: string;
  date?: string;
  currency?: string;
  transactionType?: string;
  status?: string;
}

// Bank Types
export interface Bank {
  id: string;
  name: string;
  code?: string;
  country?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

// Partner Bank Types
export interface PartnerBank {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  region: string;
  country: string;
  status: PartnerBankStatus;
  commissionRate: number;
  settlementSchedule: SettlementSchedule;
  createdAt: string;
  updatedAt: string;
  totalMerchants: number;
  totalTransactions: number;
  totalRevenue: number;
}

export enum PartnerBankStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum SettlementSchedule {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface CreatePartnerBankDto {
  name: string;
  slug: string;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  region: string;
  country: string;
  commissionRate: number;
  settlementSchedule: SettlementSchedule;
}

// Webhook Types
export interface MtnWebhookResponse {
  transactionRef: string;
  status: string;
  amount: number;
  currency: string;
  customerPhone: string;
  processorRef: string;
  timestamp: string;
}

// Query Parameters
export interface TransactionQueryParams {
  page?: number;
  perPage?: number;
  startDate?: string;
  endDate?: string;
  partnerBankId?: string;
  merchantBank?: string;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  telco?: TelcoProvider;
  merchantName?: string;
}

export interface MerchantQueryParams {
  page?: number;
  perPage?: number;
  startDate?: string;
  endDate?: string;
  merchantName?: string;
  status?: MerchantStatus;
  partnerBankId?: string;
}

export interface AnalyticsQueryParams {
  range?: QueryRange;
  month?: string;
  year?: string;
  partnerBankId?: string;
  merchantId?: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

// Settings Types
export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: SettingsCategory;
  isPublic: boolean;
  updatedAt: string;
  updatedBy: string;
}

export enum SettingsCategory {
  GENERAL = 'general',
  PAYMENT = 'payment',
  NOTIFICATION = 'notification',
  SECURITY = 'security',
  INTEGRATION = 'integration'
}

export interface UpdateSettingsDto {
  settings: Array<{
    key: string;
    value: string;
  }>;
}

// User Management Types
export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  phoneNumber?: string;
  merchantId?: string;
  partnerBankId?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  status?: UserStatus;
  merchantId?: string;
  partnerBankId?: string;
}

export interface UserQueryParams {
  page?: number;
  perPage?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  merchantId?: string;
  partnerBankId?: string;
  startDate?: string;
  endDate?: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalUsers: number;
  totalMerchants: number;
  totalTransactions: number;
  totalRevenue: number;
  activeUsers: number;
  activeMerchants: number;
  todayTransactions: number;
  todayRevenue: number;
  monthlyGrowth: {
    users: number;
    merchants: number;
    transactions: number;
    revenue: number;
  };
  recentTransactions: Transaction[];
  topMerchants: Merchant[];
}

// Report Types
export interface ReportParams {
  type: ReportType;
  startDate: string;
  endDate: string;
  format?: 'pdf' | 'excel' | 'csv';
  merchantId?: string;
  partnerBankId?: string;
  includeDetails?: boolean;
}

export enum ReportType {
  TRANSACTIONS = 'transactions',
  MERCHANTS = 'merchants',
  REVENUE = 'revenue',
  AUDIT = 'audit',
  SETTLEMENTS = 'settlements'
}

// Partner Bank Update Types
export interface UpdatePartnerBankDto {
  name?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  status?: PartnerBankStatus;
  commissionRate?: number;
  settlementSchedule?: SettlementSchedule;
}
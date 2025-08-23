/**
 * API Endpoints for BluPay Africa Backend API
 * Organized by functionality based on OpenAPI specification
 */

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  PARTNER_BANK_LOGIN: (partnerbank: string) => `/auth/login/${partnerbank}`,
  ME: '/auth/me',
  OTP_REQUEST: '/auth/otp-request',
  INITIATE_RESET_PASSWORD: '/auth/initiate-reset-password',
  COMPLETE_RESET_PASSWORD: '/auth/complete-reset-password',
} as const;

// Transaction Endpoints
export const TRANSACTION_ENDPOINTS = {
  // Core transaction operations
  TRANSACTIONS: '/transactions',
  CARD_TRANSACTIONS: '/transactions/card',
  TRANSACTION_BY_REF: (transactionRef: string) => `/transactions/${transactionRef}`,
  RE_QUERY_TRANSACTION: (transactionRef: string) => `/transactions/${transactionRef}/re-query`,
  REVERSE_TRANSACTION: (transactionRef: string) => `/transactions/${transactionRef}/reverse`,
  
  // Analytics and reporting
  ANALYTICS: '/transactions/analytics',
  COUNT_AND_VOLUME: '/transactions/count-and-volume',
  
  // Wallet operations
  FUND_WALLET: '/transactions/wallet/fund',
  WALLET_BALANCE: '/transactions/wallet/balance',
  
  // Transfer operations
  CASHOUT: '/transactions/cashout',
  INTERNAL_TRANSFER: '/transactions/transfer/internal',
  
  // Partner bank specific
  PARTNER_TRANSACTIONS: (partnerBankId: string) => `/transactions/partners/${partnerBankId}`,
} as const;

// Webhook Endpoints
export const WEBHOOK_ENDPOINTS = {
  MTN_WEBHOOK: '/transactions/webhook/mtn',
  ORANGE_WEBHOOK: '/transactions/webhook/orange',
} as const;

// Merchant Endpoints
export const MERCHANT_ENDPOINTS = {
  // Core merchant operations
  MERCHANTS: '/merchants',
  MERCHANT_BY_ID: (merchantId: string) => `/merchants/${merchantId}`,
  CREATE_SUB_MERCHANT: '/merchants/create-submerchant',
  
  // Public merchant endpoints
  MERCHANT_BY_SLUG: (slug: string) => `/merchants/web/${slug}`,
  
  // Merchant management
  UPDATE_MERCHANT: (merchantId: string) => `/merchants/${merchantId}`,
  DELETE_MERCHANT: (merchantId: string) => `/merchants/${merchantId}`,
  MERCHANT_TRANSACTIONS: (merchantId: string) => `/merchants/${merchantId}/transactions`,
  MERCHANT_ANALYTICS: (merchantId: string) => `/merchants/${merchantId}/analytics`,
  
  // Merchant settings
  MERCHANT_SETTINGS: (merchantId: string) => `/merchants/${merchantId}/settings`,
  MERCHANT_WEBHOOK: (merchantId: string) => `/merchants/${merchantId}/webhook`,
  MERCHANT_API_KEYS: (merchantId: string) => `/merchants/${merchantId}/api-keys`,
  
  // Sub-merchant operations
  SUB_MERCHANTS: '/merchants/sub-merchants',
  SUB_MERCHANT_BY_ID: (subMerchantId: string) => `/merchants/sub-merchants/${subMerchantId}`,
  
  // Top performing merchants
  TOP_PERFORMING_MONEY_IN: '/merchants/top-performing/money_in',
} as const;

// Bank Endpoints
export const BANK_ENDPOINTS = {
  // Partner banks
  PARTNERS: '/banks/partners',
  PARTNER_BY_ID: (id: string) => `/banks/partners/${id}`,
  
  // General bank operations
  BANKS: '/banks',
  BANK_BY_ID: (id: string) => `/banks/${id}`,
} as const;

// Partner Bank Endpoints
export const PARTNER_BANK_ENDPOINTS = {
  // Core partner bank operations
  PARTNER_BANKS: '/partner-banks',
  PARTNER_BANK_BY_ID: (partnerBankId: string) => `/partner-banks/${partnerBankId}`,
  
  // Partner bank management
  CREATE_PARTNER_BANK: '/partner-banks',
  UPDATE_PARTNER_BANK: (partnerBankId: string) => `/partner-banks/${partnerBankId}`,
  DELETE_PARTNER_BANK: (partnerBankId: string) => `/partner-banks/${partnerBankId}`,
  
  // Partner bank analytics
  PARTNER_BANK_ANALYTICS: (partnerBankId: string) => `/partner-banks/${partnerBankId}/analytics`,
  PARTNER_BANK_MERCHANTS: (partnerBankId: string) => `/partner-banks/${partnerBankId}/merchants`,
  PARTNER_BANK_TRANSACTIONS: (partnerBankId: string) => `/partner-banks/${partnerBankId}/transactions`,
  
  // Partner bank settings
  PARTNER_BANK_SETTINGS: (partnerBankId: string) => `/partner-banks/${partnerBankId}/settings`,
} as const;

// User Management Endpoints (Admin)
export const USER_ENDPOINTS = {
  // Core user operations
  USERS: '/users',
  USER_BY_ID: (userId: string) => `/users/${userId}`,
  
  // User management
  CREATE_USER: '/users',
  UPDATE_USER: (userId: string) => `/users/${userId}`,
  DELETE_USER: (userId: string) => `/users/${userId}`,
  
  // User status management
  ACTIVATE_USER: (userId: string) => `/users/${userId}/activate`,
  DEACTIVATE_USER: (userId: string) => `/users/${userId}/deactivate`,
  SUSPEND_USER: (userId: string) => `/users/${userId}/suspend`,
  
  // User roles and permissions
  USER_ROLES: '/users/roles',
  USER_PERMISSIONS: (userId: string) => `/users/${userId}/permissions`,
  
  // Password management
  RESET_USER_PASSWORD: (userId: string) => `/users/${userId}/reset-password`,
  CHANGE_USER_PASSWORD: (userId: string) => `/users/${userId}/change-password`,
} as const;

// System Settings Endpoints (Admin)
export const SETTINGS_ENDPOINTS = {
  // Core settings operations
  SETTINGS: '/settings',
  SETTING_BY_KEY: (key: string) => `/settings/${key}`,
  
  // Settings management
  UPDATE_SETTINGS: '/settings',
  RESET_SETTINGS: '/settings/reset',
  
  // Settings categories
  SETTINGS_BY_CATEGORY: (category: string) => `/settings/category/${category}`,
  
  // System configuration
  SYSTEM_INFO: '/settings/system-info',
  HEALTH_CHECK: '/settings/health',
} as const;

// Reports and Analytics Endpoints (Admin)
export const REPORTS_ENDPOINTS = {
  // Transaction reports
  TRANSACTION_REPORTS: '/reports/transactions',
  MERCHANT_REPORTS: '/reports/merchants',
  PARTNER_BANK_REPORTS: '/reports/partner-banks',
  
  // Financial reports
  REVENUE_REPORTS: '/reports/revenue',
  COMMISSION_REPORTS: '/reports/commissions',
  SETTLEMENT_REPORTS: '/reports/settlements',
  
  // Export functionality
  EXPORT_TRANSACTIONS: '/reports/export/transactions',
  EXPORT_MERCHANTS: '/reports/export/merchants',
  EXPORT_REVENUE: '/reports/export/revenue',
  
  // Transaction export with filters
  EXPORT_FILTERED_TRANSACTIONS: '/reports/transactions/export',
  
  // Dashboard analytics
  DASHBOARD_ANALYTICS: '/reports/dashboard',
  REAL_TIME_STATS: '/reports/real-time-stats',
} as const;

// Notification Endpoints
export const NOTIFICATION_ENDPOINTS = {
  // Core notification operations
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (notificationId: string) => `/notifications/${notificationId}`,
  
  // Notification management
  MARK_AS_READ: (notificationId: string) => `/notifications/${notificationId}/read`,
  MARK_ALL_AS_READ: '/notifications/mark-all-read',
  
  // Notification settings
  NOTIFICATION_SETTINGS: '/notifications/settings',
  UPDATE_NOTIFICATION_SETTINGS: '/notifications/settings',
  
  // Email and SMS templates
  EMAIL_TEMPLATES: '/notifications/email-templates',
  SMS_TEMPLATES: '/notifications/sms-templates',
} as const;

// Audit and Logging Endpoints (Admin)
export const AUDIT_ENDPOINTS = {
  // Audit logs
  AUDIT_LOGS: '/audit/logs',
  AUDIT_LOG_BY_ID: (logId: string) => `/audit/logs/${logId}`,
  
  // Activity tracking
  USER_ACTIVITIES: (userId: string) => `/audit/users/${userId}/activities`,
  MERCHANT_ACTIVITIES: (merchantId: string) => `/audit/merchants/${merchantId}/activities`,
  
  // System logs
  SYSTEM_LOGS: '/audit/system-logs',
  ERROR_LOGS: '/audit/error-logs',
  
  // Export audit data
  EXPORT_AUDIT_LOGS: '/audit/export',
} as const;

// File Upload Endpoints
export const UPLOAD_ENDPOINTS = {
  // Document uploads
  UPLOAD_DOCUMENT: '/uploads/documents',
  UPLOAD_PROFILE_IMAGE: '/uploads/profile-image',
  UPLOAD_MERCHANT_LOGO: '/uploads/merchant-logo',
  
  // File management
  FILES: '/uploads/files',
  FILE_BY_ID: (fileId: string) => `/uploads/files/${fileId}`,
  DELETE_FILE: (fileId: string) => `/uploads/files/${fileId}`,
} as const;

// Integration Endpoints
export const INTEGRATION_ENDPOINTS = {
  // Third-party integrations
  TELCO_PROVIDERS: '/integrations/telco-providers',
  PAYMENT_GATEWAYS: '/integrations/payment-gateways',
  
  // API management
  API_KEYS: '/integrations/api-keys',
  WEBHOOKS: '/integrations/webhooks',
  
  // Testing endpoints
  TEST_CONNECTION: '/integrations/test-connection',
  SANDBOX_MODE: '/integrations/sandbox',
} as const;

// All endpoints combined for easy access
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  TRANSACTIONS: TRANSACTION_ENDPOINTS,
  WEBHOOKS: WEBHOOK_ENDPOINTS,
  MERCHANTS: MERCHANT_ENDPOINTS,
  BANKS: BANK_ENDPOINTS,
  PARTNER_BANKS: PARTNER_BANK_ENDPOINTS,
  USERS: USER_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
  REPORTS: REPORTS_ENDPOINTS,
  NOTIFICATIONS: NOTIFICATION_ENDPOINTS,
  AUDIT: AUDIT_ENDPOINTS,
  UPLOADS: UPLOAD_ENDPOINTS,
  INTEGRATIONS: INTEGRATION_ENDPOINTS,
} as const;

export default API_ENDPOINTS;
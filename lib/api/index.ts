/**
 * BluPay Africa API Services
 * 
 * This module provides a comprehensive API service layer for the BluPay Africa Backend API.
 * It includes services for authentication, transactions, merchants, and admin operations.
 * 
 * @example
 * ```typescript
 * import { authService, transactionService, merchantService, adminService, bankService } from '@/lib/api';
 * 
 * // Authentication
 * const loginResponse = await authService.login({ email, password });
 * 
 * // Transactions
 * const transactions = await transactionService.getTransactions({ page: 1, limit: 10 });
 * 
 * // Merchants
 * const merchants = await merchantService.getMerchants({ status: 'active' });
 * 
 * // Admin operations
 * const users = await adminService.getUsers({ role: 'admin' });
 * 
 * // Bank operations
 * const partnerBanks = await bankService.getPartnerBanks();
 * ```
 */

// Export API client
export { apiClient } from './client';

// Export types
export * from './types';

// Export endpoints
export * from './endpoints';

// Import services first
import { authService } from './services/auth.service';
import { transactionService } from './services/transactions.service';
import { merchantService } from './services/merchants.service';
import { adminService } from './services/admin.service';
import { bankService } from './services/banks.service';

// Export services
export { authService, AuthService } from './services/auth.service';
export { transactionService, TransactionService } from './services/transactions.service';
export { merchantService, MerchantService } from './services/merchants.service';
export { adminService, AdminService } from './services/admin.service';
export { bankService, BankService } from './services/banks.service';

// Export all services as a single object for convenience
export const apiServices = {
  auth: authService,
  transactions: transactionService,
  merchants: merchantService,
  admin: adminService,
  banks: bankService,
};

// Default export
export default apiServices;
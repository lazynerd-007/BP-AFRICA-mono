import { apiClient } from '../client';
import { TRANSACTION_ENDPOINTS } from '../endpoints';
import {
  CreateTransactionDto,
  Transaction,
  TransactionStatus,
  TransactionQueryParams,
  PaginatedResponse,
  ApiResponse,
  TransactionAnalytics,
  TransactionSummary,
  TransactionCountAndVolume,
} from '../types';

/**
 * Transaction Service
 * Handles all transaction-related API calls
 */
export class TransactionService {
  /**
   * Get all transactions with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated transaction list
   */
  async getTransactions(params?: TransactionQueryParams): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
          TRANSACTION_ENDPOINTS.TRANSACTIONS,
          { params }
        );
      return response;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  }

  /**
   * Get categorized transactions (Collection - money_in)
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated collection transactions
   */
  async getCollectionTransactions(params?: Omit<TransactionQueryParams, 'transactionType'>): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        TRANSACTION_ENDPOINTS.TRANSACTIONS,
        {
          params: {
            ...params,
            transactionType: 'money_in',
            paginateData: true
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch collection transactions:', error);
      throw error;
    }
  }

  /**
   * Get categorized transactions (Reversal)
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated reversal transactions
   */
  async getReversalTransactions(params?: Omit<TransactionQueryParams, 'transactionType'>): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        TRANSACTION_ENDPOINTS.TRANSACTIONS,
        {
          params: {
            ...params,
            transactionType: 'reversal',
            paginateData: true
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch reversal transactions:', error);
      throw error;
    }
  }

  /**
   * Get categorized transactions (Payout - money_out)
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated payout transactions
   */
  async getPayoutTransactions(params?: Omit<TransactionQueryParams, 'transactionType'>): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        TRANSACTION_ENDPOINTS.TRANSACTIONS,
        {
          params: {
            ...params,
            transactionType: 'money_out',
            paginateData: true
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch payout transactions:', error);
      throw error;
    }
  }

  /**
   * Get categorized transactions by type
   * @param transactionType - Type of transaction (money_in, reversal, money_out)
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated transactions
   */
  async getCategorizedTransactions(
    transactionType: 'money_in' | 'reversal' | 'money_out',
    params?: Omit<TransactionQueryParams, 'transactionType'>
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        TRANSACTION_ENDPOINTS.TRANSACTIONS,
        {
          params: {
            ...params,
            transactionType,
            paginateData: true
          }
        }
      );
      
      return response;
    } catch (error) {
      console.error(`Failed to fetch ${transactionType} transactions:`, error);
      throw error;
    }
  }

  /**
   * Get a specific transaction by ID
   * @param id - Transaction ID
   * @returns Promise with transaction data
   */
  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await apiClient.get<ApiResponse<Transaction>>(
        TRANSACTION_ENDPOINTS.TRANSACTION_BY_REF(id)
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to fetch transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new transaction
   * @param transactionData - Transaction creation data
   * @returns Promise with created transaction
   */
  async createTransaction(transactionData: CreateTransactionDto): Promise<Transaction> {
    try {
      const response = await apiClient.post<ApiResponse<Transaction>>(
        TRANSACTION_ENDPOINTS.TRANSACTIONS,
        transactionData
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  }

  /**
   * Update an existing transaction
   * @param id - Transaction ID
   * @param updateData - Transaction update data
   * @returns Promise with updated transaction
   */
  async updateTransaction(id: string, updateData: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await apiClient.patch<ApiResponse<Transaction>>(
        `${TRANSACTION_ENDPOINTS.TRANSACTION_BY_REF(id)}`,
        updateData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to update transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a transaction
   * @param id - Transaction ID
   * @returns Promise with API response
   */
  async deleteTransaction(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `${TRANSACTION_ENDPOINTS.TRANSACTION_BY_REF(id)}`
      );
      return response;
    } catch (error) {
      console.error(`Failed to delete transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update transaction status
   * @param id - Transaction ID
   * @param status - New transaction status
   * @param reason - Optional reason for status change
   * @returns Promise with updated transaction
   */
  async updateTransactionStatus(
    id: string,
    status: TransactionStatus,
    reason?: string
  ): Promise<Transaction> {
    try {
      const response = await apiClient.patch<ApiResponse<Transaction>>(
        `${TRANSACTION_ENDPOINTS.TRANSACTION_BY_REF(id)}/status`,
        { status, reason }
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to update transaction status ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get transaction analytics and statistics
   * @param params - Query parameters for analytics filtering
   * @returns Promise with transaction analytics data
   */
  async getTransactionAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    partnerBankId?: string;
    merchantId?: string;
    subMerchantId?: string;
    status?: TransactionStatus;
    transactionType?: string;
  }): Promise<TransactionAnalytics> {
    try {
      const response = await apiClient.get<ApiResponse<TransactionAnalytics>>(
        TRANSACTION_ENDPOINTS.ANALYTICS,
        { params }
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to fetch transaction analytics:', error);
      throw error;
    }
  }

  /**
   * Get transaction summary for a specific period
   * @param params - Query parameters for summary filtering
   * @returns Promise with transaction summary data
   */
  async getTransactionSummary(params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<TransactionSummary[]> {
    try {
      const response = await apiClient.get<ApiResponse<TransactionSummary[]>>(
        '/transactions/summary',
        { params }
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to fetch transaction summary:', error);
      throw error;
    }
  }

  /**
   * Get transaction count and volume data
   * @param params - Query parameters for filtering
   * @returns Promise with transaction count and volume data
   */
  async getTransactionCountAndVolume(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'today' | 'week' | 'month' | 'year';
    groupBy?: 'day' | 'week' | 'month';
    transactionType?: string;
    status?: string;
  }): Promise<TransactionCountAndVolume[]> {
    try {
      const response = await apiClient.get<ApiResponse<TransactionCountAndVolume[]>>(
        TRANSACTION_ENDPOINTS.COUNT_AND_VOLUME,
        { params }
      );
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch transaction count and volume:', error);
      throw error;
    }
  }

  /**
   * Get transactions by merchant ID
   * @param merchantId - Merchant ID
   * @param params - Additional query parameters
   * @returns Promise with paginated merchant transactions
   */
  async getTransactionsByMerchant(
    merchantId: string,
    params?: TransactionQueryParams
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        `/transactions/merchants/${merchantId}`,
        { params }
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch transactions for merchant ${merchantId}:`, error);
      throw error;
    }
  }

  /**
   * Get transactions by status
   * @param status - Transaction status
   * @param params - Additional query parameters
   * @returns Promise with paginated transactions by status
   */
  async getTransactionsByStatus(
    status: TransactionStatus,
    params?: TransactionQueryParams
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        TRANSACTION_ENDPOINTS.TRANSACTIONS,
        { params: { ...params, status } }
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch transactions with status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Search transactions by reference or other criteria
   * @param searchTerm - Search term
   * @param params - Additional query parameters
   * @returns Promise with paginated search results
   */
  async searchTransactions(
    searchTerm: string,
    params?: TransactionQueryParams
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        TRANSACTION_ENDPOINTS.TRANSACTIONS,
        { 
          params: {
            ...params,
            search: searchTerm
          }
        }
      );
      return response;
    } catch (error) {
      console.error(`Failed to search transactions with term "${searchTerm}":`, error);
      throw error;
    }
  }

  /**
   * Export transactions to CSV or Excel
   * @param params - Export parameters
   * @param format - Export format (csv or excel)
   * @returns Promise with download URL and file name
   */
  async exportTransactions(
    params?: TransactionQueryParams,
    format: 'csv' | 'excel' = 'csv'
  ): Promise<ApiResponse<{ downloadUrl: string; fileName: string }>> {
    try {
      const response = await apiClient.get<ApiResponse<{ downloadUrl: string; fileName: string }>>(
        '/transactions/export',
        {
          params: {
            ...params,
            format
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to export transactions:', error);
      throw error;
    }
  }

  /**
   * Bulk update transaction statuses
   * @param transactionIds - Array of transaction IDs
   * @param status - New status for all transactions
   * @param reason - Optional reason for bulk update
   * @returns Promise with API response
   */
  async bulkUpdateTransactionStatus(
    transactionIds: string[],
    status: TransactionStatus,
    reason?: string
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.patch<ApiResponse>(
        '/transactions/bulk-update',
        {
          transactionIds,
          status,
          reason
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to bulk update transaction statuses:', error);
      throw error;
    }
  }

  /**
   * Get transaction fees and charges
   * @param id - Transaction ID
   * @returns Promise with transaction fees data
   */
  async getTransactionFees(id: string): Promise<{ processingFee: number; networkFee: number; totalFee: number; currency: string }> {
    try {
      const response = await apiClient.get<ApiResponse<{ processingFee: number; networkFee: number; totalFee: number; currency: string }>>(
        `${TRANSACTION_ENDPOINTS.TRANSACTION_BY_REF(id)}/fees`
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to fetch transaction fees for ${id}:`, error);
      throw error;
    }
  }

  /**
   * Retry a failed transaction
   * @param id - Transaction ID
   * @returns Promise with updated transaction
   */
  async retryTransaction(id: string): Promise<Transaction> {
    try {
      const response = await apiClient.post<ApiResponse<Transaction>>(
        `${TRANSACTION_ENDPOINTS.TRANSACTION_BY_REF(id)}/retry`
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to retry transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cancel a pending transaction
   * @param id - Transaction ID
   * @param reason - Cancellation reason
   * @returns Promise with updated transaction
   */
  async cancelTransaction(id: string, reason?: string): Promise<Transaction> {
    try {
      const response = await apiClient.post<ApiResponse<Transaction>>(
        `${TRANSACTION_ENDPOINTS.TRANSACTION_BY_REF(id)}/cancel`,
        { reason }
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to cancel transaction ${id}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const transactionService = new TransactionService();
export default transactionService;
import { apiClient } from '../client';
import { MERCHANT_ENDPOINTS } from '../endpoints';
import {
  Merchant,
  CreateMerchantDto,
  UpdateMerchantDto,
  MerchantQueryParams,
  PaginatedResponse,
  ApiResponse,
  MerchantStatus,
  MerchantAnalytics,
  Terminal,
  CreateTerminalDto,
  Transaction,
  TopPerformingMerchant,
} from '../types';

/**
 * Merchant Service
 * Handles all merchant-related API calls
 */
export class MerchantService {
  /**
   * Get all merchants with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated merchant list
   */
  async getMerchants(params?: MerchantQueryParams): Promise<PaginatedResponse<Merchant>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Merchant>>(
        MERCHANT_ENDPOINTS.MERCHANTS,
        { params }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch merchants:', error);
      throw error;
    }
  }

  /**
   * Get a specific merchant by ID
   * @param id - Merchant ID
   * @returns Promise with merchant data
   */
  async getMerchantById(id: string): Promise<Merchant> {
    try {
      const response = await apiClient.get<ApiResponse<Merchant>>(
        MERCHANT_ENDPOINTS.MERCHANT_BY_ID(id)
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to fetch merchant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new merchant
   * @param merchantData - Merchant creation data
   * @returns Promise with created merchant
   */
  async createMerchant(merchantData: CreateMerchantDto): Promise<Merchant> {
    try {
      const response = await apiClient.post<ApiResponse<Merchant>>(
        MERCHANT_ENDPOINTS.MERCHANTS,
        merchantData
      );
      return response.data!;
    } catch (error) {
      console.error('Failed to create merchant:', error);
      throw error;
    }
  }

  /**
   * Update an existing merchant
   * @param id - Merchant ID
   * @param updateData - Merchant update data
   * @returns Promise with updated merchant
   */
  async updateMerchant(id: string, updateData: UpdateMerchantDto): Promise<Merchant> {
    try {
      const response = await apiClient.put<ApiResponse<Merchant>>(
        MERCHANT_ENDPOINTS.UPDATE_MERCHANT(id),
        updateData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to update merchant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a merchant
   * @param id - Merchant ID
   * @returns Promise with API response
   */
  async deleteMerchant(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(
        MERCHANT_ENDPOINTS.DELETE_MERCHANT(id)
      );
      return response;
    } catch (error) {
      console.error(`Failed to delete merchant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update merchant status
   * @param id - Merchant ID
   * @param status - New merchant status
   * @param reason - Optional reason for status change
   * @returns Promise with updated merchant
   */
  async updateMerchantStatus(
    id: string,
    status: MerchantStatus,
    reason?: string
  ): Promise<Merchant> {
    try {
      const response = await apiClient.patch<ApiResponse<Merchant>>(
        `${MERCHANT_ENDPOINTS.MERCHANT_BY_ID(id)}/status`,
        { status, reason }
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to update merchant status ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get merchant analytics and statistics
   * @param id - Merchant ID
   * @param params - Query parameters for analytics filtering
   * @returns Promise with merchant analytics data
   */
  async getMerchantAnalytics(
    id: string,
    params?: {
      startDate?: string;
      endDate?: string;
      period?: 'day' | 'week' | 'month' | 'year';
    }
  ): Promise<MerchantAnalytics> {
    try {
      const response = await apiClient.get<ApiResponse<MerchantAnalytics>>(
        MERCHANT_ENDPOINTS.MERCHANT_ANALYTICS(id),
        { params }
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to fetch merchant analytics for ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get merchants by status
   * @param status - Merchant status
   * @param params - Additional query parameters
   * @returns Promise with paginated merchants by status
   */
  async getMerchantsByStatus(
    status: MerchantStatus,
    params?: MerchantQueryParams
  ): Promise<PaginatedResponse<Merchant>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Merchant>>(
        MERCHANT_ENDPOINTS.MERCHANTS,
        { params: { ...params, status } }
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch merchants with status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Search merchants by name, email, or other criteria
   * @param searchTerm - Search term
   * @param params - Additional query parameters
   * @returns Promise with paginated search results
   */
  async searchMerchants(
    searchTerm: string,
    params?: MerchantQueryParams
  ): Promise<PaginatedResponse<Merchant>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Merchant>>(
        MERCHANT_ENDPOINTS.MERCHANTS,
        {
          params: {
            ...params,
            q: searchTerm
          }
        }
      );
      return response;
    } catch (error) {
      console.error(`Failed to search merchants with term "${searchTerm}":`, error);
      throw error;
    }
  }

  /**
   * Get merchant terminals
   * @param id - Merchant ID
   * @returns Promise with merchant terminals
   */
  async getMerchantTerminals(id: string): Promise<Terminal[]> {
    try {
      const response = await apiClient.get<ApiResponse<Terminal[]>>(
        `${MERCHANT_ENDPOINTS.MERCHANT_BY_ID(id)}/terminals`
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to fetch terminals for merchant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new terminal for a merchant
   * @param merchantId - Merchant ID
   * @param terminalData - Terminal creation data
   * @returns Promise with created terminal
   */
  async createMerchantTerminal(
    merchantId: string,
    terminalData: CreateTerminalDto
  ): Promise<Terminal> {
    try {
      const response = await apiClient.post<ApiResponse<Terminal>>(
        `${MERCHANT_ENDPOINTS.MERCHANT_BY_ID(merchantId)}/terminals`,
        terminalData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to create terminal for merchant ${merchantId}:`, error);
      throw error;
    }
  }

  /**
   * Update a merchant terminal
   * @param merchantId - Merchant ID
   * @param terminalId - Terminal ID
   * @param updateData - Terminal update data
   * @returns Promise with updated terminal
   */
  async updateMerchantTerminal(
    merchantId: string,
    terminalId: string,
    updateData: Partial<Terminal>
  ): Promise<Terminal> {
    try {
      const response = await apiClient.patch<ApiResponse<Terminal>>(
        `${MERCHANT_ENDPOINTS.MERCHANT_BY_ID(merchantId)}/terminals/${terminalId}`,
        updateData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to update terminal ${terminalId} for merchant ${merchantId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a merchant terminal
   * @param merchantId - Merchant ID
   * @param terminalId - Terminal ID
   * @returns Promise with API response
   */
  async deleteMerchantTerminal(merchantId: string, terminalId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `${MERCHANT_ENDPOINTS.MERCHANT_BY_ID(merchantId)}/terminals/${terminalId}`
      );
      return response;
    } catch (error) {
      console.error(`Failed to delete terminal ${terminalId} for merchant ${merchantId}:`, error);
      throw error;
    }
  }

  /**
   * Get merchant transactions
   * @param id - Merchant ID
   * @param params - Query parameters for filtering
   * @returns Promise with merchant transactions
   */
  async getMerchantTransactions(
    id: string,
    params?: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
      status?: string;
    }
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        MERCHANT_ENDPOINTS.MERCHANT_TRANSACTIONS(id),
        { params }
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch transactions for merchant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Approve merchant onboarding
   * @param id - Merchant ID
   * @param approvalData - Approval data
   * @returns Promise with updated merchant
   */
  async approveMerchant(
    id: string,
    approvalData?: {
      notes?: string;
      approvedBy?: string;
    }
  ): Promise<Merchant> {
    try {
      const response = await apiClient.patch<ApiResponse<Merchant>>(
        `${MERCHANT_ENDPOINTS.MERCHANT_BY_ID(id)}/approve`,
        approvalData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to approve merchant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reject merchant onboarding
   * @param id - Merchant ID
   * @param rejectionData - Rejection data
   * @returns Promise with updated merchant
   */
  async rejectMerchant(
    id: string,
    rejectionData: {
      reason: string;
      notes?: string;
      rejectedBy?: string;
    }
  ): Promise<Merchant> {
    try {
      const response = await apiClient.patch<ApiResponse<Merchant>>(
        `${MERCHANT_ENDPOINTS.MERCHANT_BY_ID(id)}/reject`,
        rejectionData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to reject merchant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Suspend a merchant
   * @param id - Merchant ID
   * @param suspensionData - Suspension data
   * @returns Promise with updated merchant
   */
  async suspendMerchant(
    id: string,
    suspensionData: {
      reason: string;
      notes?: string;
      suspendedBy?: string;
      suspensionDuration?: number; // in days
    }
  ): Promise<Merchant> {
    try {
      const response = await apiClient.post<ApiResponse<Merchant>>(
        `${MERCHANT_ENDPOINTS.MERCHANT_BY_ID(id)}/suspend`,
        suspensionData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to suspend merchant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reactivate a suspended merchant
   * @param id - Merchant ID
   * @param reactivationData - Reactivation data
   * @returns Promise with updated merchant
   */
  async reactivateMerchant(
    id: string,
    reactivationData?: {
      notes?: string;
      reactivatedBy?: string;
    }
  ): Promise<Merchant> {
    try {
      const response = await apiClient.post<ApiResponse<Merchant>>(
        `${MERCHANT_ENDPOINTS.MERCHANT_BY_ID(id)}/reactivate`,
        reactivationData
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to reactivate merchant ${id}:`, error);
      throw error;
    }
  }

  /**
   * Export merchants to CSV or Excel
   * @param params - Export parameters
   * @param format - Export format (csv or excel)
   * @returns Promise with file blob
   */
  async exportMerchants(
    params?: MerchantQueryParams,
    format: 'csv' | 'excel' = 'csv'
  ): Promise<ApiResponse<{ downloadUrl: string; fileName: string }>> {
    try {
      const response = await apiClient.get(
        '/merchants/export',
        {
          params: {
            ...params,
            format
          },
          responseType: 'blob'
        }
      );
      return response as unknown as ApiResponse<{ downloadUrl: string; fileName: string }>;
    } catch (error) {
      console.error('Failed to export merchants:', error);
      throw error;
    }
  }

  /**
   * Bulk update merchant statuses
   * @param merchantIds - Array of merchant IDs
   * @param status - New status for all merchants
   * @param reason - Optional reason for bulk update
   * @returns Promise with API response
   */
  async bulkUpdateMerchantStatus(
    merchantIds: string[],
    status: MerchantStatus,
    reason?: string
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.patch<ApiResponse>(
        '/merchants/bulk-update',
        {
          merchantIds,
          status,
          reason
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to bulk update merchant statuses:', error);
      throw error;
    }
  }

  /**
   * Get top performing merchants by money in
   * @param params - Query parameters for filtering
   * @returns Promise with top performing merchants
   */
  async getTopPerformingMerchantsMoneyIn(params?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
    period?: 'today' | 'week' | 'month' | 'year';
  }): Promise<TopPerformingMerchant[]> {
    try {
      const response = await apiClient.get<ApiResponse<TopPerformingMerchant[]>>(
        MERCHANT_ENDPOINTS.TOP_PERFORMING_MONEY_IN,
        { params }
      );
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch top performing merchants (money in):', error);
      throw error;
    }
  }
}

// Export singleton instance
export const merchantService = new MerchantService();
export default merchantService;
import { apiClient } from '../client';
import { BANK_ENDPOINTS, PARTNER_BANK_ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  Bank,
  PartnerBank,
} from '../types';

/**
 * Bank Service
 * Handles all bank-related API calls
 */
export class BankService {
  /**
   * Get all partner banks from /banks/partners endpoint
   * Falls back to /partner-banks if the first endpoint fails
   * @param params - Query parameters for filtering
   * @returns Promise with partner banks array
   */
  async getPartnerBanks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PartnerBank[]> {
    try {
      // First try the /banks/partners endpoint
      const response = await apiClient.get<ApiResponse<PartnerBank[]>>(
        BANK_ENDPOINTS.PARTNERS,
        { params }
      );
      
      console.log('Partner banks API response:', response);
      
      // Handle different response formats
      let partnerBanks: PartnerBank[] = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          partnerBanks = response.data;
        } else if ((response as any).data && Array.isArray((response as any).data)) {
          partnerBanks = (response as any).data;
        }
      } else if ((response as any).data && Array.isArray((response as any).data)) {
        partnerBanks = (response as any).data;
      }
      
      console.log('Processed partner banks:', partnerBanks);
      return partnerBanks;
    } catch (error) {
      console.warn('Failed to fetch from /banks/partners, trying fallback /partner-banks:', error);
      
      try {
        // Fallback to /partner-banks endpoint
        const fallbackResponse = await apiClient.get<ApiResponse<{items: PartnerBank[]}>>(
          PARTNER_BANK_ENDPOINTS.PARTNER_BANKS,
          { params }
        );
        return fallbackResponse.data?.items || [];
      } catch (fallbackError) {
        console.error('Both partner bank endpoints failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Get partner bank by ID from /banks/partners/{id} endpoint
   * @param id - Partner bank ID
   * @returns Promise with partner bank data
   */
  async getPartnerBankById(id: string): Promise<PartnerBank> {
    try {
      const response = await apiClient.get<ApiResponse<PartnerBank>>(
        BANK_ENDPOINTS.PARTNER_BY_ID(id)
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to fetch partner bank ${id} from /banks/partners:`, error);
      throw error;
    }
  }

  /**
   * Get all banks from /banks endpoint
   * @param params - Query parameters for filtering
   * @returns Promise with banks array
   */
  async getBanks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<Bank[]> {
    try {
      const response = await apiClient.get<ApiResponse<Bank[]>>(
        BANK_ENDPOINTS.BANKS,
        { params }
      );
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch banks from /banks:', error);
      throw error;
    }
  }

  /**
   * Get bank by ID from /banks/{id} endpoint
   * @param id - Bank ID
   * @returns Promise with bank data
   */
  async getBankById(id: string): Promise<Bank> {
    try {
      const response = await apiClient.get<ApiResponse<Bank>>(
        BANK_ENDPOINTS.BANK_BY_ID(id)
      );
      return response.data!;
    } catch (error) {
      console.error(`Failed to fetch bank ${id} from /banks:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const bankService = new BankService();
export default bankService;

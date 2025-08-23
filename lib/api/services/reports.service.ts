import { apiClient } from '../client';
import { REPORTS_ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  EnhancedTransactionFilters,
} from '../types';

/**
 * Reports Service
 * Handles all report generation and export API calls
 */
export class ReportsService {
  /**
   * Export transactions with filters to file
   * @param filters - Transaction filter parameters
   * @param format - Export format (csv, excel, pdf)
   * @returns Promise with download URL and file name
   */
  async exportTransactions(
    filters: Partial<EnhancedTransactionFilters>,
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<ApiResponse<{ downloadUrl: string; fileName: string }>> {
    try {
      const response = await apiClient.get<ApiResponse<{ downloadUrl: string; fileName: string }>>(
        REPORTS_ENDPOINTS.EXPORT_TRANSACTIONS,
        {
          params: {
            ...filters,
            format,
            // Map our filter properties to API expected parameters
            ...(filters.partnerBankId && filters.partnerBankId !== 'all' && { partnerBankId: filters.partnerBankId }),
            ...(filters.merchantId && filters.merchantId !== 'all' && { merchantId: filters.merchantId }),
            ...(filters.subMerchantId && filters.subMerchantId !== 'all' && { subMerchantId: filters.subMerchantId }),
            ...(filters.startDate && { startDate: filters.startDate }),
            ...(filters.endDate && { endDate: filters.endDate }),
            ...(filters.transactionType && filters.transactionType !== 'all' && { transactionType: filters.transactionType }),
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
   * Generate transaction report with filters
   * @param filters - Transaction filter parameters
   * @returns Promise with report data
   */
  async generateTransactionReport(
    filters: Partial<EnhancedTransactionFilters>
<<<<<<< HEAD
  ): Promise<ApiResponse<{
    summary: {
      totalTransactions: number;
      totalAmount: number;
      successfulTransactions: number;
      failedTransactions: number;
    };
    data: Array<{[key: string]: unknown}>;
    meta?: {
      startDate: string;
      endDate: string;
      generatedAt: string;
    };
  }>> {
    try {
      const response = await apiClient.get<ApiResponse<{
        summary: {
          totalTransactions: number;
          totalAmount: number;
          successfulTransactions: number;
          failedTransactions: number;
        };
        data: Array<{[key: string]: unknown}>;
        meta?: {
          startDate: string;
          endDate: string;
          generatedAt: string;
        };
      }>>(
=======
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
>>>>>>> 998f0609d66907cc6ede657345cf78594e449e65
        REPORTS_ENDPOINTS.TRANSACTION_REPORTS,
        {
          params: {
            ...filters,
            // Map our filter properties to API expected parameters
            ...(filters.partnerBankId && filters.partnerBankId !== 'all' && { partnerBankId: filters.partnerBankId }),
            ...(filters.merchantId && filters.merchantId !== 'all' && { merchantId: filters.merchantId }),
            ...(filters.subMerchantId && filters.subMerchantId !== 'all' && { subMerchantId: filters.subMerchantId }),
            ...(filters.startDate && { startDate: filters.startDate }),
            ...(filters.endDate && { endDate: filters.endDate }),
            ...(filters.transactionType && filters.transactionType !== 'all' && { transactionType: filters.transactionType }),
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to generate transaction report:', error);
      throw error;
    }
  }

  /**
   * Download file directly (for handling blob responses)
   * @param filters - Transaction filter parameters
   * @param format - Export format
   * @returns Promise with blob data
   */
  async downloadTransactionFile(
    filters: Partial<EnhancedTransactionFilters>,
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<Blob> {
    try {
      const response = await apiClient.getInstance().get(
        REPORTS_ENDPOINTS.EXPORT_TRANSACTIONS,
        {
          params: {
            ...filters,
            format,
            // Map our filter properties to API expected parameters
            ...(filters.partnerBankId && filters.partnerBankId !== 'all' && { partnerBankId: filters.partnerBankId }),
            ...(filters.merchantId && filters.merchantId !== 'all' && { merchantId: filters.merchantId }),
            ...(filters.subMerchantId && filters.subMerchantId !== 'all' && { subMerchantId: filters.subMerchantId }),
            ...(filters.startDate && { startDate: filters.startDate }),
            ...(filters.endDate && { endDate: filters.endDate }),
            ...(filters.transactionType && filters.transactionType !== 'all' && { transactionType: filters.transactionType }),
          },
          responseType: 'blob'
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to download transaction file:', error);
      throw error;
    }
  }

  /**
   * Utility function to trigger file download in browser
   * @param blob - File blob data
   * @param fileName - Name of the file to download
   */
  triggerFileDownload(blob: Blob, fileName: string): void {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to trigger file download:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const reportsService = new ReportsService();
export default reportsService;
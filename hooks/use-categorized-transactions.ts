import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '@/lib/api/services/transactions.service';
import { 
  Transaction, 
  PaginatedResponse, 
  TransactionQueryParams,
  TransactionCategory,
  TRANSACTION_CATEGORIES,
  CategorizedTransactionType
} from '@/lib/api/types';

interface UseCategorizedTransactionsState {
  data: Transaction[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

interface UseCategorizedTransactionsParams extends Omit<TransactionQueryParams, 'transactionType'> {
  category: TransactionCategory;
  enabled?: boolean;
}

interface UseCategorizedTransactionsReturn {
  // Data states for each category
  collection: UseCategorizedTransactionsState;
  reversal: UseCategorizedTransactionsState;
  payout: UseCategorizedTransactionsState;
  
  // Current active category data
  currentData: UseCategorizedTransactionsState;
  
  // Actions
  fetchTransactions: (category: TransactionCategory, params?: Omit<TransactionQueryParams, 'transactionType'>) => Promise<void>;
  refetch: () => Promise<void>;
  
  // State management
  setCurrentCategory: (category: TransactionCategory) => void;
  currentCategory: TransactionCategory;
}

const initialState: UseCategorizedTransactionsState = {
  data: [],
  meta: null,
  loading: false,
  error: null,
};

export function useCategorizedTransactions(
  initialCategory: TransactionCategory = 'collection'
): UseCategorizedTransactionsReturn {
  // Individual states for each category
  const [collection, setCollection] = useState<UseCategorizedTransactionsState>(initialState);
  const [reversal, setReversal] = useState<UseCategorizedTransactionsState>(initialState);
  const [payout, setPayout] = useState<UseCategorizedTransactionsState>(initialState);
  
  // Current active category
  const [currentCategory, setCurrentCategory] = useState<TransactionCategory>(initialCategory);
  
  // Get the setter function for a specific category
  const getCategorySetter = useCallback((category: TransactionCategory) => {
    switch (category) {
      case 'collection':
        return setCollection;
      case 'reversal':
        return setReversal;
      case 'payout':
        return setPayout;
      default:
        return setCollection;
    }
  }, []);
  
  // Get the state for a specific category
  const getCategoryState = useCallback((category: TransactionCategory) => {
    switch (category) {
      case 'collection':
        return collection;
      case 'reversal':
        return reversal;
      case 'payout':
        return payout;
      default:
        return collection;
    }
  }, [collection, reversal, payout]);
  
  // Fetch transactions for a specific category
  const fetchTransactions = useCallback(async (
    category: TransactionCategory,
    params?: Omit<TransactionQueryParams, 'transactionType'>
  ) => {
    const setState = getCategorySetter(category);
    const transactionType = TRANSACTION_CATEGORIES[category];
    
    // Set loading state
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: PaginatedResponse<Transaction> = await transactionService.getCategorizedTransactions(
        transactionType,
        {
          page: params?.page || 1,
          perPage: params?.perPage || 10,
          ...params,
        }
      );
      
      // Handle different response formats - the API might return {status: "success"} instead of {success: true}
      const isSuccess = response.success || (response as any).status === "success";
      const responseData = response.data || (response as any).data;
      
      // Debug logging to see actual response structure
      console.log('Full API Response:', response);
      console.log('Response Data:', responseData);
      console.log('Is Success:', isSuccess);
      
      if (isSuccess && responseData) {
        // Try different possible data structures
        let transactions: Transaction[] = [];
        let meta = null;
        
        // Case 1: Data has nested data array (our API structure)
        if ((responseData as any).data && Array.isArray((responseData as any).data)) {
          transactions = (responseData as any).data;
          // Build meta from pagination properties
          meta = {
            page: (responseData as any).currentPage || 1,
            perPage: (responseData as any).perPage || 10,
            total: (responseData as any).total || 0,
            totalPages: (responseData as any).lastPage || 1
          };
        }
        // Case 2: Data has items array (alternative paginated response)
        else if ((responseData as any).items && Array.isArray((responseData as any).items)) {
          transactions = (responseData as any).items;
          meta = (responseData as any).meta;
        }
        // Case 3: Data is directly an array
        else if (Array.isArray(responseData)) {
          transactions = responseData;
        }
        // Case 4: Data has transactions array
        else if ((responseData as any).transactions && Array.isArray((responseData as any).transactions)) {
          transactions = (responseData as any).transactions;
          meta = (responseData as any).meta;
        }
        // Case 5: Fallback - try to find any array in the response
        else {
          console.log('Unexpected response structure. Available properties:', Object.keys(responseData));
          const possibleArrays = Object.values(responseData).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            transactions = possibleArrays[0] as Transaction[];
          }
        }
        
        console.log('Extracted transactions:', transactions);
        console.log('Transactions count:', transactions.length);
        
        setState({
          data: transactions,
          meta: meta || {
            page: 1,
            perPage: 10,
            total: transactions.length,
            totalPages: Math.ceil(transactions.length / 10)
          },
          loading: false,
          error: null,
        });
      } else {
        console.log('API call failed or no data returned');
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch transactions',
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error(`Error fetching ${category} transactions:`, error);
    }
  }, [getCategorySetter]);
  
  // Refetch current category
  const refetch = useCallback(async () => {
    await fetchTransactions(currentCategory);
  }, [currentCategory, fetchTransactions]);
  
  // Load initial data when category changes
  useEffect(() => {
    fetchTransactions(currentCategory);
  }, [currentCategory, fetchTransactions]);
  
  // Get current category data
  const currentData = getCategoryState(currentCategory);
  
  return {
    collection,
    reversal,
    payout,
    currentData,
    fetchTransactions,
    refetch,
    setCurrentCategory,
    currentCategory,
  };
}

// Hook for fetching transaction statistics by category
export function useTransactionStats() {
  const [stats, setStats] = useState<{
    collection: { count: number; amount: string };
    reversal: { count: number; amount: string };
    payout: { count: number; amount: string };
    loading: boolean;
    error: string | null;
  }>({
    collection: { count: 0, amount: 'GHS 0.00' },
    reversal: { count: 0, amount: 'GHS 0.00' },
    payout: { count: 0, amount: 'GHS 0.00' },
    loading: false,
    error: null,
  });
  
  const fetchStats = useCallback(async () => {
    setStats(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Fetch analytics data from the analytics endpoint
      const analyticsData = await transactionService.getTransactionAnalytics();
      
      console.log('Analytics Data:', analyticsData);
      
      setStats({
        collection: {
          count: analyticsData.successTotalMoneyInCount || 0,
          amount: `GHS ${(analyticsData.successTotalMoneyInAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
        reversal: {
          count: analyticsData.failedTotalCount || 0,
          amount: `GHS ${(analyticsData.failedTotalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
        payout: {
          count: analyticsData.successTotalMoneyOutCount || 0,
          amount: `GHS ${(analyticsData.successTotalMoneyOutAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch statistics';
      setStats(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error('Error fetching transaction stats:', error);
    }
  }, []);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  return {
    stats,
    refetchStats: fetchStats,
  };
}
import { useState, useEffect, useCallback } from 'react';
import { bankService } from '@/lib/api/services/banks.service';
import { merchantService } from '@/lib/api/services/merchants.service';
import { 
  TransactionFilterData, 
  EnhancedTransactionFilters, 
  FilterOption,
  PartnerBank,
  Merchant
} from '@/lib/api/types';

interface UseTransactionFiltersReturn {
  filters: EnhancedTransactionFilters;
  filterData: TransactionFilterData;
  actions: {
    setPartnerBank: (id: string) => void;
    setMerchant: (id: string) => void;
    setSubMerchant: (id: string) => void;
    setDateRange: (start: string, end: string) => void;
    setTransactionType: (type: string) => void;
    setSearchTerm: (term: string) => void;
    setPerPage: (perPage: string) => void;
    clearFilters: () => void;
  };
  isLoading: boolean;
  hasError: boolean;
}

const initialFilters: EnhancedTransactionFilters = {
  partnerBankId: 'all',
  merchantId: 'all',
  subMerchantId: 'all',
  startDate: '',
  endDate: '',
  transactionType: 'all',
  searchTerm: '',
  perPage: '10',
};

const createInitialOption = (): FilterOption => ({ id: 'all', name: '-- All --', value: 'all' });

const initialFilterData: TransactionFilterData = {
  partnerBanks: [createInitialOption()],
  merchants: [createInitialOption()],
  subMerchants: [createInitialOption()],
  loading: {
    partnerBanks: false,
    merchants: false,
    subMerchants: false,
  },
  error: {
    partnerBanks: null,
    merchants: null,
    subMerchants: null,
  },
};

export function useTransactionFilters(): UseTransactionFiltersReturn {
  const [filters, setFilters] = useState<EnhancedTransactionFilters>(initialFilters);
  const [filterData, setFilterData] = useState<TransactionFilterData>(initialFilterData);

  // Convert PartnerBank to FilterOption
  const convertPartnerBanksToOptions = useCallback((partnerBanks: PartnerBank[]): FilterOption[] => {
    const allOption: FilterOption = { id: 'all', name: '-- All --', value: 'all' };
    const bankOptions = partnerBanks.map(bank => {
      console.log('Converting partner bank:', bank);
      console.log('Partner bank keys:', Object.keys(bank));
      
      // Try different possible ID fields
      const bankId = (bank as any).id || (bank as any).uuid || (bank as any)._id || (bank as any).bankId || bank.name;
      const bankName = (bank as any).name || (bank as any).bankName || (bank as any).title || bankId;
      
      console.log('Using bankId:', bankId, 'bankName:', bankName);
      
      return {
        id: bankId,
        name: bankName,
        value: bankId
      };
    });
    console.log('All partner bank options:', [allOption, ...bankOptions]);
    return [allOption, ...bankOptions];
  }, []);

  // Convert Merchant to FilterOption
  const convertMerchantsToOptions = useCallback((merchants: Merchant[]): FilterOption[] => {
    const allOption: FilterOption = { id: 'all', name: '-- All --', value: 'all' };
    const merchantOptions = merchants.map(merchant => {
      console.log('Converting merchant:', merchant);
      console.log('Merchant keys:', Object.keys(merchant));
      
      // Try different possible ID fields
      const merchantId = (merchant as any).id || (merchant as any).uuid || (merchant as any)._id || (merchant as any).merchantId || (merchant as any).name;
      const merchantName = (merchant as any).businessName || (merchant as any).name || (merchant as any).merchantName || (merchant as any).title || merchantId;
      
      console.log('Using merchantId:', merchantId, 'merchantName:', merchantName);
      
      return {
        id: merchantId,
        name: merchantName,
        value: merchantId
      };
    });
    console.log('All merchant options:', [allOption, ...merchantOptions]);
    return [allOption, ...merchantOptions];
  }, []);

  // Convert Sub-merchants to FilterOption
  const convertSubMerchantsToOptions = useCallback((subMerchants: any[]): FilterOption[] => {
    const allOption: FilterOption = { id: 'all', name: '-- All --', value: 'all' };
    const subMerchantOptions = subMerchants.map(subMerchant => ({
      id: subMerchant.id,
      name: subMerchant.businessName || subMerchant.name,
      value: subMerchant.id
    }));
    return [allOption, ...subMerchantOptions];
  }, []);

  // Fetch partner banks
  const fetchPartnerBanks = useCallback(async () => {
    setFilterData(prev => ({
      ...prev,
      loading: { ...prev.loading, partnerBanks: true },
      error: { ...prev.error, partnerBanks: null }
    }));

    try {
      const partnerBanks = await bankService.getPartnerBanks();
      const options = convertPartnerBanksToOptions(partnerBanks);
      
      setFilterData(prev => ({
        ...prev,
        partnerBanks: options,
        loading: { ...prev.loading, partnerBanks: false }
      }));
      
      console.log('Partner banks loaded:', options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch partner banks';
      setFilterData(prev => ({
        ...prev,
        loading: { ...prev.loading, partnerBanks: false },
        error: { ...prev.error, partnerBanks: errorMessage }
      }));
      console.error('Error fetching partner banks:', error);
    }
  }, [convertPartnerBanksToOptions]);

  // Fetch merchants by partner bank
  const fetchMerchantsByPartnerBank = useCallback(async (partnerBankId: string) => {
    console.log('Fetching merchants for partner bank:', partnerBankId);
    
    if (partnerBankId === 'all') {
      setFilterData(prev => ({
        ...prev,
        merchants: [createInitialOption()]
      }));
      return;
    }

    setFilterData(prev => ({
      ...prev,
      loading: { ...prev.loading, merchants: true },
      error: { ...prev.error, merchants: null }
    }));

    try {
      const merchants = await merchantService.getMerchantsByPartnerBank(partnerBankId);
      const options = convertMerchantsToOptions(merchants);
      
      setFilterData(prev => ({
        ...prev,
        merchants: options,
        loading: { ...prev.loading, merchants: false }
      }));
      
      console.log('Merchants loaded for partner bank:', partnerBankId, options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch merchants';
      setFilterData(prev => ({
        ...prev,
        merchants: [createInitialOption()], // Reset to default option on error
        loading: { ...prev.loading, merchants: false },
        error: { ...prev.error, merchants: errorMessage }
      }));
      console.error('Error fetching merchants for partner bank:', partnerBankId, error);
    }
  }, [convertMerchantsToOptions]);

  // Fetch sub-merchants by merchant
  const fetchSubMerchantsByMerchant = useCallback(async (merchantId: string) => {
    console.log('Fetching sub-merchants for merchant:', merchantId);
    
    if (merchantId === 'all') {
      setFilterData(prev => ({
        ...prev,
        subMerchants: [createInitialOption()]
      }));
      return;
    }

    setFilterData(prev => ({
      ...prev,
      loading: { ...prev.loading, subMerchants: true },
      error: { ...prev.error, subMerchants: null }
    }));

    try {
      const subMerchants = await merchantService.getSubMerchantsByMerchant(merchantId);
      const options = convertSubMerchantsToOptions(subMerchants);
      
      setFilterData(prev => ({
        ...prev,
        subMerchants: options,
        loading: { ...prev.loading, subMerchants: false }
      }));
      
      console.log('Sub-merchants loaded for merchant:', merchantId, options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sub-merchants';
      setFilterData(prev => ({
        ...prev,
        subMerchants: [createInitialOption()], // Reset to default option on error
        loading: { ...prev.loading, subMerchants: false },
        error: { ...prev.error, subMerchants: errorMessage }
      }));
      console.error('Error fetching sub-merchants for merchant:', merchantId, error);
    }
  }, [convertSubMerchantsToOptions]);

  // Load initial partner banks
  useEffect(() => {
    fetchPartnerBanks();
  }, [fetchPartnerBanks]);

  // Actions
  const setPartnerBank = useCallback((id: string) => {
    console.log('Setting partner bank:', id);
    
    setFilters(prev => ({
      ...prev,
      partnerBankId: id,
      merchantId: 'all', // Reset dependent filters
      subMerchantId: 'all'
    }));
    
    // Reset dependent filter data
    setFilterData(prev => ({
      ...prev,
      merchants: [createInitialOption()],
      subMerchants: [createInitialOption()]
    }));
    
    // Fetch merchants for the selected partner bank
    fetchMerchantsByPartnerBank(id);
  }, [fetchMerchantsByPartnerBank]);

  const setMerchant = useCallback((id: string) => {
    console.log('Setting merchant:', id);
    
    setFilters(prev => ({
      ...prev,
      merchantId: id,
      subMerchantId: 'all' // Reset dependent filters
    }));
    
    // Reset dependent filter data
    setFilterData(prev => ({
      ...prev,
      subMerchants: [createInitialOption()]
    }));
    
    // Fetch sub-merchants for the selected merchant
    fetchSubMerchantsByMerchant(id);
  }, [fetchSubMerchantsByMerchant]);

  const setSubMerchant = useCallback((id: string) => {
    setFilters(prev => ({ ...prev, subMerchantId: id }));
  }, []);

  const setDateRange = useCallback((start: string, end: string) => {
    setFilters(prev => ({ ...prev, startDate: start, endDate: end }));
  }, []);

  const setTransactionType = useCallback((type: string) => {
    setFilters(prev => ({ ...prev, transactionType: type }));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const setPerPage = useCallback((perPage: string) => {
    setFilters(prev => ({ ...prev, perPage }));
  }, []);

  const clearFilters = useCallback(() => {
    console.log('Clearing all filters');
    setFilters(initialFilters);
    setFilterData(prev => ({
      ...prev,
      merchants: [createInitialOption()],
      subMerchants: [createInitialOption()]
    }));
  }, []);

  // Compute derived states
  const isLoading = filterData.loading.partnerBanks || filterData.loading.merchants || filterData.loading.subMerchants;
  const hasError = Boolean(filterData.error.partnerBanks || filterData.error.merchants || filterData.error.subMerchants);

  return {
    filters,
    filterData,
    actions: {
      setPartnerBank,
      setMerchant,
      setSubMerchant,
      setDateRange,
      setTransactionType,
      setSearchTerm,
      setPerPage,
      clearFilters,
    },
    isLoading,
    hasError,
  };
}
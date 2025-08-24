"use client";

import { useAuthStore } from "@/lib/store";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

import { useCurrency } from "@/lib/currency-context";
import { bankService, merchantService, transactionService } from "@/lib/api";
import { PartnerBank, TopPerformingMerchant, TransactionCountAndVolume, Transaction } from "@/lib/api/types";


import { Input } from "@/components/ui/input";
import { IconSearch, IconBuildingBank } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// No more mock data imports
import { useCategorizedTransactions } from '@/hooks/use-categorized-transactions';

export function DashboardContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      // Give Zustand a moment to hydrate from storage
      const timer = setTimeout(() => {
        if (!useAuthStore.getState().user) {
          router.push("/login/merchant");
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setLoaded(true);
    }
  }, [user, router]);



  if (!loaded) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <DashboardSkeleton />;
  }

  return user.role === "administrator" ? <AdminDashboard /> : <MerchantDashboard />;
}

function AdminDashboard() {
  const { currency } = useCurrency();
  const [transactionTab, setTransactionTab] = useState("recent");
  const [selectedBank, setSelectedBank] = useState("all");
  const [timeRange, setTimeRange] = useState("7days"); // Add this line
  const [partnerBanks, setPartnerBanks] = useState<PartnerBank[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [topMerchants, setTopMerchants] = useState<TopPerformingMerchant[]>([]);
  const [merchantsLoading, setMerchantsLoading] = useState(true);
  const [countAndVolume, setCountAndVolume] = useState<TransactionCountAndVolume[]>([]);
  const [countVolumeLoading, setCountVolumeLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [recentTransactionsLoading, setRecentTransactionsLoading] = useState(true);

  // Fetch partner banks on component mount
  useEffect(() => {
    const fetchPartnerBanks = async () => {
      try {
        setBanksLoading(true);
        const response = await bankService.getPartnerBanks();
        if (response && Array.isArray(response)) {
          setPartnerBanks(response);
        }
      } catch (error) {
        console.error('Failed to fetch partner banks:', error);
      } finally {
        setBanksLoading(false);
      }
    };

    fetchPartnerBanks();
  }, []);

  // Fetch top performing merchants on component mount
  useEffect(() => {
    const fetchTopMerchants = async () => {
      try {
        setMerchantsLoading(true);
        const response = await merchantService.getTopPerformingMerchantsMoneyIn({
          limit: 10,
          period: 'month'
        });
        if (response && Array.isArray(response)) {
          console.log('Top merchants fetched:', response); // Debug log
          setTopMerchants(response);
        } else {
          console.log('No top merchants data or invalid format:', response); // Debug log
        }
      } catch (error) {
        console.error('Failed to fetch top performing merchants:', error);
        setTopMerchants([]);
      } finally {
        setMerchantsLoading(false);
      }
    };

    fetchTopMerchants();
  }, []);

  // Fetch transaction count and volume on component mount
  useEffect(() => {
    const fetchCountAndVolume = async () => {
      try {
        setCountVolumeLoading(true);
        const response = await transactionService.getTransactionCountAndVolume({
          period: 'month',
          groupBy: 'day'
        });
        if (response && Array.isArray(response)) {
          console.log('Count and volume data fetched:', response); // Debug log
          setCountAndVolume(response);
        } else {
          console.log('No count and volume data or invalid format:', response); // Debug log
        }
      } catch (error) {
        console.error('Failed to fetch transaction count and volume:', error);
        setCountAndVolume([]);
      } finally {
        setCountVolumeLoading(false);
      }
    };

    fetchCountAndVolume();
  }, []);

  const { currentData: recentTransactionsData } = useCategorizedTransactions('collection');

  useEffect(() => {
    setRecentTransactionsLoading(recentTransactionsData.loading);
    if (recentTransactionsData.data && recentTransactionsData.data.length > 0) {
      setRecentTransactions(recentTransactionsData.data.slice(0, 10)); // Take first 10 for dashboard
    } else if (!recentTransactionsData.loading) {
      setRecentTransactions([]);
    }
  }, [recentTransactionsData]);

  // Create bank options including "All" option
  const bankOptions = [
    { id: "all", name: "All Partner Banks" },
    ...partnerBanks.map(bank => {
      // Try different possible ID fields (same fix as in useTransactionFilters)
      // Handle different possible bank object structures
      const bankWithDynamicProps = bank as PartnerBank & {
        uuid?: string;
        _id?: string;
        bankId?: string;
        bankName?: string;
        title?: string;
      };
      const bankId = bankWithDynamicProps.id || bankWithDynamicProps.uuid || bankWithDynamicProps._id || bankWithDynamicProps.bankId || bank.name;
      const bankName = bankWithDynamicProps.name || bankWithDynamicProps.bankName || bankWithDynamicProps.title || bankId;
      
      return { id: bankId, name: bankName };
    })
  ];
  
  // No more static bank data - all data comes from APIs

  // Transform top merchants data for DataTable (limit to 10 items)
  const transformTopMerchantsData = () => {
    if (merchantsLoading) return [];
    
    // Limit to 10 merchants
    const limitedMerchants = topMerchants.slice(0, 10);
    
    const transformedData = limitedMerchants.map((merchant, index) => ({
      id: parseInt(merchant.merchantId) || index + 1,
      merchant: merchant.merchantName || `Merchant ${index + 1}`,
      date: new Date().toISOString().split('T')[0], // Current date as placeholder
      tid: merchant.merchantCode || merchant.merchantId || `MID-${index + 1}`,
      scheme: "Top Performer", // Placeholder scheme
      amount: `${merchant.currency || currency} ${merchant.totalAmount?.toLocaleString() || '0'}`,
      status: "active", // Placeholder status
    }));
    
    console.log('Transformed top merchants data:', transformedData); // Debug log
    return transformedData;
  };

  const topMerchantsTableData = transformTopMerchantsData();

  // Transform count and volume data for DataTable (limit to 10 items)
  const transformCountVolumeData = () => {
    if (countVolumeLoading) return [];
    
    console.log('Raw count and volume data for transformation:', countAndVolume); // Debug log
    
    // Limit to 10 items
    const limitedCountVolume = countAndVolume.slice(0, 10);
    
    const transformedData = limitedCountVolume.map((item, index) => {
      // Debug each item to see what fields are available
      console.log(`Item ${index}:`, item);
      console.log(`Available fields:`, Object.keys(item));
      
      // Use the correct field names from API response  
      const volumeValue = item.totalTrxnVolume || '0';
      const countValue = item.totalTrxnCount || '0';
      
      console.log(` Top Product ${index}: Volume="${volumeValue}", Count="${countValue}"`);
      console.log(` Parsed values: Volume=${parseFloat(volumeValue)}, Count=${parseInt(countValue)}`);
      
      return {
        id: index + 1,
        merchant: item.processor || `Processor ${index + 1}`,
        date: item.date || new Date().toISOString().split('T')[0],
        tid: `TXN-${countValue}`,
        scheme: item.processor || "unknown",
        amount: `${item.currency || currency} ${parseFloat(volumeValue).toLocaleString()}`,
        status: "active",
        count: parseInt(countValue),
        volume: parseFloat(volumeValue)
      };
    });
    
    console.log('Transformed count and volume data:', transformedData); // Debug log
    return transformedData;
  };

  // Transform recent transactions data for DataTable (limit to 10 items)
  const transformRecentTransactionsData = () => {
    if (recentTransactionsLoading) return [];
    
    try {
      console.log('Raw recent transactions data for transformation:', recentTransactions); // Debug log
      
      // Limit to 10 transactions
      const limitedTransactions = recentTransactions.slice(0, 10);
      
      const transformedData = limitedTransactions.map((transaction, index) => {
        // Ensure transaction is a valid object
        if (!transaction || typeof transaction !== 'object') {
          console.warn(`Invalid transaction at index ${index}:`, transaction);
          return {
            id: index + 1,
            merchant: `Invalid Transaction ${index + 1}`,
            date: new Date().toISOString(),
            tid: `INVALID-${index + 1}`,
            scheme: 'unknown',
            amount: 'N/A',
            status: 'error',
          };
        }
        // Debug each transaction to see what fields are available
        console.log(`Transaction ${index}:`, transaction);
        console.log(`Available fields:`, Object.keys(transaction));
        
        // Use processor field for scheme (for colorful badges)
        const processorValue = transaction.processor || transaction.telco || transaction.type || 'Unknown';
        let schemeName: string = String(processorValue).toLowerCase();
        
        // Map processor names to proper display names for color coding
        if (schemeName.includes('mtn')) {
          schemeName = 'mtn';
        } else if (schemeName.includes('vodafone')) {
          schemeName = 'vodafone';
        } else if (schemeName.includes('airteltigo')) {
          schemeName = 'airteltigo';
        } else if (schemeName.includes('telecel')) {
          schemeName = 'telecel';
        }
        
        // Enhanced merchant name extraction with multiple fallback options
        const transactionAny = transaction as any; // Cast to any to access potentially missing properties
        const merchantName = transaction.merchantName || 
                            (transactionAny.merchant && typeof transactionAny.merchant === 'object' ? 
                              transactionAny.merchant.merchantName || transactionAny.merchant.name : transactionAny.merchant) ||
                            transactionAny.merchantCode || 
                            transaction.customerName || 
                            transaction.processor ||
                            `Transaction #${transaction.transactionRef || transaction.id || index + 1}`;
        
        console.log(`📊 Transaction ${index}:`, {
          merchantName: transaction.merchantName,
          merchant: transactionAny.merchant,
          merchantCode: transactionAny.merchantCode,
          customerName: transaction.customerName,
          processor: transaction.processor,
          resolvedName: merchantName,
          allFields: Object.keys(transaction).slice(0, 10) // Show first 10 fields
        });
        
        return {
          id: index + 1,
          merchant: merchantName,
          date: transaction.createdAt || new Date().toISOString(),
          tid: transaction.transactionRef || transaction.id,
          scheme: schemeName, // ✅ Uses processor from API (mapped for colors)
          amount: `${transaction.currency || currency} ${typeof transaction.amount === 'number' ? transaction.amount.toLocaleString() : '0'}`,
          status: transaction.status || 'pending',
        };
      });
      
      console.log('Transformed recent transactions data:', transformedData); // Debug log
      return transformedData;
    } catch (error) {
      console.error('Error transforming recent transactions data:', error);
      return [];
    }
  };

  const countVolumeTableData = transformCountVolumeData();
  const recentTransactionsTableData = transformRecentTransactionsData();
  
  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <IconBuildingBank className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Partner Bank:</span>
            <Select value={selectedBank} onValueChange={setSelectedBank} disabled={banksLoading}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={banksLoading ? "Loading banks..." : "Select a bank"} />
              </SelectTrigger>
              <SelectContent>
                {bankOptions.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-8">
          <SectionCards 
            partnerBankId={selectedBank === 'all' ? undefined : selectedBank}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <div className="mt-6">
            <ChartAreaInteractive 
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              partnerBankId={selectedBank === 'all' ? undefined : selectedBank}
            />
            {selectedBank !== "all" && (
              <div className="mt-2 text-sm text-muted-foreground flex items-center justify-end">
                <IconBuildingBank className="h-4 w-4 mr-1" />
                Showing data for: {bankOptions.find(b => b.id === selectedBank)?.name}
              </div>
            )}
          </div>
          <div className="mt-6">
            <Tabs value={transactionTab} onValueChange={setTransactionTab}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Transactions</h2>
                <div className="flex items-center justify-between">
                  <TabsList className="mr-auto">
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="top-merchants">Top Merchants</TabsTrigger>
                    <TabsTrigger value="top-products">Top Products</TabsTrigger>
                  </TabsList>
                </div>
              </div>
                             <TabsContent value="recent" className="mt-4">
                              {recentTransactionsLoading ? (
                                <div className="space-y-3">
                                  {[...Array(5)].map((_, i) => (
                                    <div key={`recent-skeleton-${i}`} className="flex space-x-4">
                                      <Skeleton key={`recent-skeleton-${i}-1`} className="h-4 w-1/4" />
                                      <Skeleton key={`recent-skeleton-${i}-2`} className="h-4 w-1/4" />
                                      <Skeleton key={`recent-skeleton-${i}-3`} className="h-4 w-1/4" />
                                      <Skeleton key={`recent-skeleton-${i}-4`} className="h-4 w-1/4" />
                                    </div>
                                  ))}
                                </div>
                              ) : recentTransactionsTableData.length > 0 ? (
                                <DataTable data={recentTransactionsTableData} currentTab="recent" />
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  No recent transactions available
                                </div>
                              )}
                            </TabsContent>
              <TabsContent value="top-merchants" className="mt-4">
                {merchantsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={`merchants-skeleton-${i}`} className="flex space-x-4">
                        <Skeleton key={`merchants-skeleton-${i}-1`} className="h-4 w-1/4" />
                        <Skeleton key={`merchants-skeleton-${i}-2`} className="h-4 w-1/4" />
                        <Skeleton key={`merchants-skeleton-${i}-3`} className="h-4 w-1/4" />
                        <Skeleton key={`merchants-skeleton-${i}-4`} className="h-4 w-1/4" />
                      </div>
                    ))}
                  </div>
                ) : topMerchantsTableData.length > 0 ? (
                  <DataTable data={topMerchantsTableData} currentTab="top-merchants" />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No top merchants data available
                  </div>
                )}
              </TabsContent>
              <TabsContent value="top-products" className="mt-4">
                {countVolumeLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={`products-skeleton-${i}`} className="flex space-x-4">
                        <Skeleton key={`products-skeleton-${i}-1`} className="h-4 w-1/4" />
                        <Skeleton key={`products-skeleton-${i}-2`} className="h-4 w-1/4" />
                        <Skeleton key={`products-skeleton-${i}-3`} className="h-4 w-1/4" />
                        <Skeleton key={`products-skeleton-${i}-4`} className="h-4 w-1/4" />
                      </div>
                    ))}
                  </div>
                ) : countVolumeTableData.length > 0 ? (
                  <DataTable data={countVolumeTableData} currentTab="top-products" />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transaction data available
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

function MerchantDashboard() {
  const [transactionTab, setTransactionTab] = useState("recent");
  
  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="mb-8">
          <SectionCards />
          <div className="mt-6">
            <ChartAreaInteractive />
          </div>
          <div className="mt-6">
            <Tabs value={transactionTab} onValueChange={setTransactionTab}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Transactions</h2>
                <div className="flex items-center justify-between">
                  <TabsList className="mr-auto">
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="top-merchants">Top Merchants</TabsTrigger>
                    <TabsTrigger value="top-products">Top Products</TabsTrigger>
                  </TabsList>
                  <div className="relative max-w-xs w-72">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8"
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
              <TabsContent value="recent" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  No transaction data available - API integration needed for merchant dashboard
                </div>
              </TabsContent>
              <TabsContent value="top-merchants" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  No merchant data available - API integration needed for merchant dashboard
                </div>
              </TabsContent>
              <TabsContent value="top-products" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  No product data available - API integration needed for merchant dashboard
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={`dashboard-skeleton-${i}`} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
/**
 * API Usage Example Component
 * 
 * This component demonstrates how to use the BluPay Africa API services
 * in React components with proper error handling and loading states.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Users, CreditCard, Building } from 'lucide-react';
import { toast } from 'sonner';

// Import API services
import { 
  authService, 
  transactionService, 
  merchantService, 
  adminService,
  type User,
  type Transaction,
  type Merchant
} from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalMerchants: number;
  totalRevenue: number;
}

export function ApiUsageExample() {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  /**
   * Fetch current user information
   */
  const fetchCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      toast.success('User profile loaded successfully');
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      toast.error('Failed to load user profile');
    }
  };

  /**
   * Fetch dashboard statistics
   */
  const fetchDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    }
  };

  /**
   * Fetch recent transactions
   */
  const fetchRecentTransactions = async () => {
    try {
      const response = await transactionService.getTransactions({
        page: 1,
        perPage: 5
      });
      setRecentTransactions(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load recent transactions');
    }
  };

  /**
   * Fetch merchants
   */
  const fetchMerchants = async () => {
    try {
      const response = await merchantService.getMerchants({
        page: 1,
        perPage: 5
      });
      setMerchants(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch merchants:', error);
      toast.error('Failed to load merchants');
    }
  };

  /**
   * Load all dashboard data
   */
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCurrentUser(),
        fetchDashboardStats(),
        fetchRecentTransactions(),
        fetchMerchants()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    loadDashboardData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Usage Example</h1>
          <p className="text-muted-foreground">
            Demonstrating BluPay Africa API integration
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Current User */}
      {currentUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> 
                <Badge variant="outline" className="ml-2">
                  {currentUser.role}
                </Badge>
              </p>
              <p><strong>Status:</strong> 
                <Badge 
                  variant={currentUser.status === 'active' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {currentUser.status}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMerchants.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHS {stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest transactions from the API
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.transactionRef}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.customerName} • {transaction.customerPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">GHS {transaction.amount}</p>
                    <Badge 
                      variant={transaction.status === 'success' ? 'default' : 'secondary'}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No transactions found</p>
          )}
        </CardContent>
      </Card>

      {/* Merchants */}
      <Card>
        <CardHeader>
          <CardTitle>Merchants</CardTitle>
          <CardDescription>
            Active merchants in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {merchants.length > 0 ? (
            <div className="space-y-4">
              {merchants.map((merchant) => (
                <div key={merchant.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{merchant.businessName}</p>
                    <p className="text-sm text-muted-foreground">
                      {merchant.businessEmail} • {merchant.businessPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={merchant.status === 'active' ? 'default' : 'secondary'}
                    >
                      {merchant.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No merchants found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ApiUsageExample;
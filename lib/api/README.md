# BluPay Africa API Service Layer

A comprehensive API service layer for consuming the BluPay Africa Backend API. This service layer provides type-safe, well-documented methods for all API operations with proper error handling and authentication.

## Features

- 🔒 **Authentication**: Bearer token and Secret key authentication
- 📝 **TypeScript**: Full type safety with interfaces for all API responses
- 🛡️ **Error Handling**: Comprehensive error handling with proper HTTP status codes
- 🔄 **Interceptors**: Request/response interceptors for authentication and error handling
- 📊 **Admin Panel**: Complete admin functionality for user and merchant management
- 🏦 **Transactions**: Full transaction processing and monitoring capabilities
- 🏢 **Merchants**: Merchant management and analytics
- 🔑 **Partner Banks**: Partner bank management and configuration

## Quick Start

### 1. Environment Setup

Ensure your `.env.local` file contains the API URL:

```env
NEXT_PUBLIC_API_URL=https://staging-api.blupayafrica.com/api
```

### 2. Basic Usage

```typescript
import { authService, transactionService, merchantService, adminService } from '@/lib/api';

// Authentication
const loginResponse = await authService.login({
  email: 'admin@blupay.africa',
  password: 'password123'
});

// Get current user
const currentUser = await authService.getCurrentUser();

// Fetch transactions
const transactions = await transactionService.getTransactions({
  page: 1,
  limit: 10,
  status: 'successful'
});

// Get merchants
const merchants = await merchantService.getMerchants({
  page: 1,
  limit: 20,
  status: 'active'
});

// Admin operations
const users = await adminService.getUsers({ role: 'merchant' });
const dashboardStats = await adminService.getDashboardStats();
```

## Service Overview

### Authentication Service (`authService`)

Handles user authentication and profile management:

```typescript
// Login
const response = await authService.login({ email, password });

// Partner bank login
const response = await authService.partnerBankLogin('bank-slug', { email, password });

// Get current user
const user = await authService.getCurrentUser();

// Request OTP
await authService.requestOtp({ purpose: 'password_reset' });

// Password reset
await authService.initiatePasswordReset({ email });
await authService.completePasswordReset({ token, newPassword });

// Logout
await authService.logout();
```

### Transaction Service (`transactionService`)

Manages all transaction-related operations:

```typescript
// Get transactions with filtering
const transactions = await transactionService.getTransactions({
  page: 1,
  limit: 10,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: 'successful',
  merchantId: 'merchant-uuid'
});

// Create transaction
const transaction = await transactionService.createTransaction({
  amount: 100,
  customerName: 'John Doe',
  customerPhone: '+233123456789',
  network: 'MTN',
  type: 'mobile_money'
});

// Get transaction analytics
const analytics = await transactionService.getAnalytics({
  range: 'last_30_days',
  partnerBankId: 'bank-uuid'
});

// Update transaction status
await transactionService.updateTransactionStatus('transaction-id', 'completed');

// Export transactions
const exportData = await transactionService.exportTransactions({
  format: 'csv',
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

### Merchant Service (`merchantService`)

Handles merchant management and operations:

```typescript
// Get merchants
const merchants = await merchantService.getMerchants({
  page: 1,
  limit: 20,
  status: 'active',
  category: 'retail'
});

// Create merchant
const merchant = await merchantService.createMerchant({
  businessName: 'Test Business',
  email: 'business@example.com',
  phone: '+233123456789',
  category: 'retail'
});

// Update merchant
await merchantService.updateMerchant('merchant-id', {
  businessName: 'Updated Business Name'
});

// Approve/reject merchant
await merchantService.approveMerchant('merchant-id');
await merchantService.rejectMerchant('merchant-id', 'Incomplete documentation');

// Get merchant analytics
const analytics = await merchantService.getMerchantAnalytics('merchant-id', {
  range: 'last_30_days'
});

// Manage merchant status
await merchantService.suspendMerchant('merchant-id', 'Policy violation');
await merchantService.reactivateMerchant('merchant-id');
```

### Admin Service (`adminService`)

Provides admin-specific functionality:

```typescript
// User management
const users = await adminService.getUsers({
  page: 1,
  limit: 20,
  role: 'merchant',
  status: 'active'
});

const newUser = await adminService.createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'merchant',
  password: 'securePassword123'
});

await adminService.updateUserRole('user-id', 'administrator');
await adminService.updateUserStatus('user-id', 'suspended');

// Dashboard and analytics
const dashboardStats = await adminService.getDashboardStats();
const systemHealth = await adminService.getSystemHealth();

// Reports
const transactionReport = await adminService.generateTransactionReport({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  format: 'pdf'
});

const merchantReport = await adminService.generateMerchantReport({
  status: 'active',
  format: 'excel'
});

// System settings
const settings = await adminService.getSystemSettings();
await adminService.updateSystemSettings({
  maintenanceMode: false,
  maxTransactionAmount: 10000
});

// Partner bank management
const partnerBanks = await adminService.getPartnerBanks();
const newPartnerBank = await adminService.createPartnerBank({
  name: 'Test Bank',
  slug: 'test-bank',
  apiUrl: 'https://api.testbank.com'
});
```

## Error Handling

All services include comprehensive error handling:

```typescript
try {
  const transactions = await transactionService.getTransactions({ page: 1 });
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized - redirect to login
    console.log('User not authenticated');
  } else if (error.response?.status === 403) {
    // Handle forbidden - insufficient permissions
    console.log('Insufficient permissions');
  } else if (error.response?.status === 404) {
    // Handle not found
    console.log('Resource not found');
  } else {
    // Handle other errors
    console.error('API Error:', error.message);
  }
}
```

## Authentication

The API client automatically handles authentication:

1. **Bearer Token**: Stored in localStorage/sessionStorage after login
2. **Secret Key**: Used for transaction processing endpoints
3. **Auto-refresh**: Tokens are automatically refreshed when expired
4. **Auto-logout**: Users are logged out on 401 responses

## TypeScript Support

All services are fully typed with TypeScript interfaces:

```typescript
import type {
  User,
  Transaction,
  Merchant,
  ApiResponse,
  PaginatedResponse,
  CreateTransactionDto,
  UpdateMerchantDto
} from '@/lib/api';

// Type-safe API calls
const response: ApiResponse<PaginatedResponse<Transaction>> = 
  await transactionService.getTransactions({ page: 1 });

const transactions: Transaction[] = response.data.transactions;
```

## File Structure

```
lib/api/
├── index.ts                 # Main exports
├── client.ts               # HTTP client configuration
├── types.ts                # TypeScript interfaces
├── endpoints.ts            # API endpoint constants
└── services/
    ├── auth.service.ts     # Authentication service
    ├── transactions.service.ts # Transaction service
    ├── merchants.service.ts    # Merchant service
    └── admin.service.ts        # Admin service
```

## Example Component

See `components/examples/api-usage-example.tsx` for a complete React component demonstrating API usage with proper loading states and error handling.

## Contributing

When adding new API endpoints:

1. Add the endpoint constant to `endpoints.ts`
2. Add TypeScript interfaces to `types.ts`
3. Implement the service method in the appropriate service file
4. Add JSDoc comments for documentation
5. Update this README with usage examples

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | BluPay Africa API base URL | Yes |
| `NEXTAUTH_URL` | NextAuth.js URL for authentication | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |

## API Documentation

For complete API documentation, refer to the OpenAPI specification at `postman/openapi.yaml`.
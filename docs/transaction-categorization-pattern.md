# Transaction Categorization Implementation Pattern

This document outlines the pattern implemented for categorizing transactions using specific API endpoints for Collection, Reversal, and Payout transactions.

## Overview

The implementation provides a reusable pattern for fetching and displaying categorized transaction data across different dashboard pages (Admin, Merchant, Partner Bank).

## Architecture Components

### 1. API Service Layer (`lib/api/services/transactions.service.ts`)

Added new methods to the `TransactionService` class:

```typescript
// Individual category methods
async getCollectionTransactions(params?: Omit<TransactionQueryParams, 'transactionType'>)
async getReversalTransactions(params?: Omit<TransactionQueryParams, 'transactionType'>)
async getPayoutTransactions(params?: Omit<TransactionQueryParams, 'transactionType'>)

// Generic categorized method
async getCategorizedTransactions(
  transactionType: 'money_in' | 'reversal' | 'money_out',
  params?: Omit<TransactionQueryParams, 'transactionType'>
)
```

### 2. Type Definitions (`lib/api/types.ts`)

Enhanced type system with categorized transaction types:

```typescript
export enum CategorizedTransactionType {
  MONEY_IN = 'money_in',
  REVERSAL = 'reversal', 
  MONEY_OUT = 'money_out'
}

export const TRANSACTION_CATEGORIES = {
  collection: CategorizedTransactionType.MONEY_IN,
  reversal: CategorizedTransactionType.REVERSAL,
  payout: CategorizedTransactionType.MONEY_OUT
} as const;

export type TransactionCategory = keyof typeof TRANSACTION_CATEGORIES;
```

### 3. Custom Hook (`hooks/use-categorized-transactions.ts`)

Provides state management and API integration:

```typescript
const {
  currentData,           // Current category's data and loading state
  collection,           // Collection transactions state
  reversal,             // Reversal transactions state  
  payout,               // Payout transactions state
  fetchTransactions,    // Fetch data for specific category
  refetch,              // Refetch current category
  setCurrentCategory,   // Switch between categories
  currentCategory       // Currently selected category
} = useCategorizedTransactions('collection');

const { stats, refetchStats } = useTransactionStats();
```

### 4. UI Components

#### TransactionTable Component
- Added loading state support
- Tab-based category switching
- Real-time data updates
- Disabled state during loading

#### TransactionStats Component  
- Loading states with skeleton UI
- Color-coded statistics per category
- Enhanced visual indicators
- Real-time stat updates

## API Endpoint Mapping

| UI Category | API Parameter | Endpoint |
|-------------|---------------|----------|
| Collection  | `money_in`    | `/transactions?transactionType=money_in&paginateData=true` |
| Reversal    | `reversal`    | `/transactions?transactionType=reversal&paginateData=true` |
| Payout      | `money_out`   | `/transactions?transactionType=money_out&paginateData=true` |

## Usage Pattern

### 1. Import Required Dependencies

```typescript
import { useCategorizedTransactions, useTransactionStats } from '@/hooks/use-categorized-transactions';
import { Transaction } from '@/lib/api/types';
```

### 2. Initialize Hooks

```typescript
const {
  currentData,
  fetchTransactions,
  setCurrentCategory,
  currentCategory,
} = useCategorizedTransactions('collection');

const { stats } = useTransactionStats();
```

### 3. Handle Category Changes

```typescript
useEffect(() => {
  setCurrentCategory(selectedCategory);
}, [selectedCategory, setCurrentCategory]);
```

### 4. Handle Filter Changes

```typescript
useEffect(() => {
  const queryParams = {
    page: 1,
    perPage: parseInt(filters.perPage) || 10,
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    // Add other filters as needed
  };

  fetchTransactions(currentCategory, queryParams);
}, [currentCategory, filters, fetchTransactions]);
```

### 5. Transform and Display Data

```typescript
// Transform API data to UI format
const transformedData = transformTransactionData(currentData.data);

// Filter client-side for search
const filteredData = transformedData.filter(transaction => {
  if (!searchTerm) return true;
  return transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase());
});
```

## Error Handling

The pattern includes comprehensive error handling:

- Network errors are caught and displayed in Alert components
- Loading states prevent user interaction during API calls
- Graceful degradation when API is unavailable
- User-friendly error messages

## Performance Considerations

- **Caching**: Each category maintains its own state to avoid refetching
- **Client-side filtering**: Search is handled client-side to reduce API calls
- **Lazy loading**: Data is only fetched when category is selected
- **Debounced search**: Prevents excessive filtering operations

## Implementation Steps for New Pages

1. **Import the custom hook** in your page component
2. **Set up state management** for filters and current category
3. **Add useEffect handlers** for category and filter changes
4. **Transform API data** to match your UI requirements
5. **Handle loading and error states** in your UI
6. **Update UI components** to accept loading props

## Example Implementation

See `app/admin/dashboard/transactions/page.tsx` for a complete implementation example.

## Benefits

- **Reusable**: Same pattern works across Admin, Merchant, and Partner Bank pages
- **Type-safe**: Full TypeScript support with proper error handling
- **Performance**: Efficient state management and caching
- **User Experience**: Loading states and error handling
- **Maintainable**: Clean separation of concerns and clear data flow

## Testing

The pattern supports easy testing of:
- API integration with different transaction types
- Loading states and error conditions
- Tab switching and data filtering
- Client-side search functionality

## Future Enhancements

- Add pagination controls to the hook
- Implement real-time updates via WebSocket
- Add export functionality per category
- Cache management with TTL
- Offline support with service workers
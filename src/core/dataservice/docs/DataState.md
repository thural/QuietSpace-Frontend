# Data Service Module - Data State Features

## Overview

The Data Service Module now provides comprehensive data state management features that track loading, error, and success states for all data operations.

## Data State Interface

### `IDataState`
```typescript
interface IDataState {
  isLoading: boolean;      // Initial loading state
  isFetching: boolean;     // Refresh/fetching state
  isError: boolean;        // Error state
  isSuccess: boolean;      // Success state
  error: Error | null;     // Error information
  lastUpdated: number | null;  // Timestamp of last update
  refetchCount: number;    // Number of refetches
}
```

### `IDataStateWithMetadata<T>`
```typescript
interface IDataStateWithMetadata<T> extends IDataState {
  data: T | null;           // Actual data payload
  metadata?: {
    source: 'cache' | 'network' | 'websocket';
    cacheHit: boolean;
    requestDuration: number;
    retryCount: number;
  };
}
```

## Usage Examples

### Basic State Tracking
```typescript
import { createDataService } from '@/core/dataservice';
import { BaseDataService } from '@/core/dataservice';

class MyDataService extends BaseDataService {
  async fetchData(id: string) {
    // Set loading state
    this.stateManager.setLoading(true);
    
    try {
      const data = await fetch(`/api/data/${id}`);
      const result = await data.json();
      
      // Set success state with metadata
      this.stateManager.setSuccess(result, {
        source: 'network',
        cacheHit: false,
        requestDuration: 150,
        retryCount: 0
      });
      
      return result;
    } catch (error) {
      // Set error state
      this.stateManager.setError(error as Error);
      throw error;
    }
  }
}
```

### State Monitoring
```typescript
const dataService = createDataService(MyDataService);

// Get current state
const state = dataService.getDataState();
console.log('Loading:', state.isLoading);
console.log('Error:', state.isError);
console.log('Success:', state.isSuccess);

// Get state with data
const stateWithData = dataService.getStateManager().getStateWithData<DataType>();
console.log('Data:', stateWithData.data);
console.log('Metadata:', stateWithData.metadata);

// Use state helpers
const helpers = dataService.getStateManager().helpers;
console.log('Is stale (5s)?', helpers.isStale(5000));
console.log('Error message:', helpers.getError());
```

### Reactive State Updates
```typescript
// Subscribe to state changes
const unsubscribe = dataService.getStateManager().subscribe((state) => {
  console.log('State changed:', {
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error?.message
  });
});

// Later, cleanup
unsubscribe();
```

### Manual State Management
```typescript
const stateManager = dataService.getStateManager();

// Set loading state
stateManager.setLoading(true);

// Set success state
stateManager.setSuccess({ id: '123', name: 'Test' });

// Set error state
stateManager.setError(new Error('Failed to fetch'));

// Reset state
stateManager.reset();
```

## State Properties

### Loading States
- **`isLoading`**: `true` during initial data load
- **`isFetching`**: `true` during refresh/refetch operations

### Result States
- **`isSuccess`**: `true` when data was successfully loaded
- **`isError`**: `true` when an error occurred
- **`error`**: Contains the Error object when `isError` is `true`

### Metadata
- **`source`**: Where the data came from ('cache', 'network', 'websocket')
- **`cacheHit`**: `true` if data came from cache
- **`requestDuration`**: Time taken for the request in milliseconds
- **`retryCount`**: Number of retry attempts

### Tracking
- **`lastUpdated`**: Unix timestamp of last successful update
- **`refetchCount`**: Number of times data has been refetched

## Integration with React

### Custom Hook Example
```typescript
function useDataServiceState<T>(dataService: BaseDataService) {
  const [state, setState] = React.useState(dataService.getDataState());
  
  React.useEffect(() => {
    const unsubscribe = dataService.getStateManager().subscribe(setState);
    return unsubscribe;
  }, [dataService]);
  
  return {
    ...state,
    isLoading: state.isLoading,
    isFetching: state.isFetching,
    isError: state.isError,
    isSuccess: state.isSuccess,
    error: state.error,
    data: state.data
  };
}
```

### Component Usage
```typescript
function DataComponent({ dataService }) {
  const state = useDataServiceState(dataService);
  
  if (state.isLoading) return <div>Loading...</div>;
  if (state.isError) return <div>Error: {state.error?.message}</div>;
  
  return (
    <div>
      <div>Data loaded successfully!</div>
      <div>Last updated: {new Date(state.lastUpdated).toLocaleString()}</div>
      <div>Refetch count: {state.refetchCount}</div>
    </div>
  );
}
```

## Benefits

1. **Consistent State Management**: All data services use the same state pattern
2. **Automatic State Tracking**: State is updated automatically during operations
3. **Reactive Updates**: Subscribe to state changes for reactive UI updates
4. **Rich Metadata**: Track data source, cache hits, request duration, etc.
5. **Helper Functions**: Convenient methods for common state checks
6. **Type Safety**: Full TypeScript support with proper typing

## Available Methods

### IDataStateManager
- `getState()`: Get current state
- `getStateWithData<T>()`: Get state with data payload
- `setLoading(isFetching?)`: Set loading state
- `setSuccess<T>(data, metadata?)`: Set success state
- `setError(error)`: Set error state
- `reset()`: Reset to initial state
- `subscribe(callback)`: Subscribe to state changes
- `helpers`: Get helper functions for state checks

### IBaseDataService
- `getDataState()`: Get current data state
- `getStateManager()`: Get state manager instance
- `getCacheStats()`: Get cache statistics
- `destroy()`: Clean up resources

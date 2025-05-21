import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Import your slice reducers
import testReducer from './slices/testSlice';
import authReducer from './slices/authSlice';
import analysisReducer from './slices/analysisSlice';
import timeTrackingReducer from './slices/timeTrackingSlice';
import uiReducer from './slices/uiSlice';
import questionReducer from './slices/questionSlice';

// Combine all your reducers
const rootReducer = combineReducers({
  test: testReducer,
  auth: authReducer,
  analysis: analysisReducer,
  timeTracking: timeTrackingReducer,
  ui: uiReducer,
  question: questionReducer,
});

// Create store without persistence first (for SSR support)
let store: any;
let persistor: any;

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  version: 1,
  whitelist: ['auth', 'test'], // Whitelist reducers you wish to persist
};

// Create the store
if (typeof window !== 'undefined') {
  // Client-side only
  const storage = require('redux-persist/lib/storage').default;
  
  const persistedReducer = persistReducer({
    ...persistConfig,
    storage,
  }, rootReducer);

  // Add error handling middleware
  const apiErrorLoggerMiddleware = (store: any) => (next: any) => (action: any) => {
    // Log rejected actions (API errors)
    if (action.type.endsWith('/rejected')) {
      console.group(`🚨 API Error: ${action.type}`);
      console.error('Error payload:', action.payload);
      console.error('Error details:', action.error);
      console.groupEnd();
    }
    return next(action);
  };

  // Create the store using the persisted reducer
  store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiErrorLoggerMiddleware),
  });

  persistor = persistStore(store);
} else {
  // Server-side
  store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
}

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };

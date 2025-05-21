'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import React, { ReactNode, useEffect, useState } from 'react';

export function ReduxProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      {isClient ? (
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
}

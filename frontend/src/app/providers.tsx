"use client";

import React, { ReactNode } from 'react';
import { ReduxProvider } from '@/redux/provider';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </ErrorBoundary>
  );
}
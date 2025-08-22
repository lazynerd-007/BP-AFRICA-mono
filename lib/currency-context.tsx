"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

interface CurrencyProviderProps {
  children: ReactNode;
  defaultCurrency?: string;
}

export function CurrencyProvider({ children, defaultCurrency = "USD" }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<string>(defaultCurrency);

  const formatCurrency = (amount: number) => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
    });
    return formatter.format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
} 
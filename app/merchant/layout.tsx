"use client";

import { ReactNode } from "react";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col">
        {/* Merchant-specific layout components will go here */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 
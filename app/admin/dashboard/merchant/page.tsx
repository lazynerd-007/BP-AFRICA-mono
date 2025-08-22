"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewMerchants } from "@/components/merchant/view-merchants";
import { ViewSubMerchants } from "@/components/merchant/view-sub-merchants";
import { CreateMerchant } from "@/components/merchant/create-merchant-form";
import { CreateSubMerchant } from "@/components/merchant/create-sub-merchant-form";

// Client component that uses useSearchParams
function MerchantTabs() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("view");
  
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "create" || tab === "view" || tab === "create-sub" || tab === "view-sub") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList>
        <TabsTrigger value="view">View Merchants</TabsTrigger>
        <TabsTrigger value="view-sub">View Sub-Merchants</TabsTrigger>
        <TabsTrigger value="create">Create Merchant</TabsTrigger>
        <TabsTrigger value="create-sub">Create Sub-Merchant</TabsTrigger>
      </TabsList>
      
      <TabsContent value="view" className="mt-4">
        <ViewMerchants />
      </TabsContent>
      
      <TabsContent value="view-sub" className="mt-4">
        <ViewSubMerchants />
      </TabsContent>
      
      <TabsContent value="create" className="mt-4">
        <CreateMerchant />
      </TabsContent>
      
      <TabsContent value="create-sub" className="mt-4">
        <CreateSubMerchant />
      </TabsContent>
    </Tabs>
  );
}

export default function MerchantPage() {
  return (
    <div className="px-4 lg:px-6">
      <Suspense fallback={<div>Loading...</div>}>
        <MerchantTabs />
      </Suspense>
    </div>
  );
} 
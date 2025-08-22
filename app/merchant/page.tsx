"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MerchantPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/merchant/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting to Merchant Dashboard...</h1>
        <p className="mt-2 text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  );
} 
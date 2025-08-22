"use client";

import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function SubmerchantForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">BluPay SubMerchant</h1>
          <p className="text-xl text-blue-100">
            Reset your password to continue accessing your submerchant dashboard and business tools.
          </p>
        </div>
        
        <div className="text-white/80 text-sm">
          <p>Powered by BluPay • Secure • Reliable</p>
        </div>
      </div>
      
      {/* Right side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0V17a2 2 0 002 2m-2 0a2 2 0 01-2-2M9 7a2 2 0 00-2 2m0 0a2 2 0 00-2 2m2-2a2 2 0 012 2m0 0V17a2 2 0 01-2 2"
                />
              </svg>
            </div>
          </div>
          
          <ForgotPasswordForm userType="submerchant" />
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login/submerchant" className="text-blue-600 hover:text-blue-500 hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export default function MerchantLoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between items-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            BluPay
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Admin Portal</span>
            <Link 
              href="/login/admin" 
              className="text-sm underline-offset-4 hover:underline text-primary"
            >
              Login Here
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm userType="merchant" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 relative hidden lg:block">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10">
          <h2 className="text-3xl font-bold mb-4">Merchant Portal</h2>
          <p className="text-center max-w-md mb-6">
            Access your merchant dashboard to manage payments, transactions, and customer data.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Process Payments</div>
              <p className="text-sm">Accept payments securely from customers worldwide</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Track Analytics</div>
              <p className="text-sm">Monitor your business growth with detailed insights</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Manage Customers</div>
              <p className="text-sm">Build relationships with your customer base</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">View Reports</div>
              <p className="text-sm">Access financial reports and statements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
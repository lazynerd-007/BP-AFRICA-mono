import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export default function PartnerBankLoginPage() {
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
            <span className="text-sm text-muted-foreground">Other Portals:</span>
            <Link 
              href="/login/merchant" 
              className="text-sm underline-offset-4 hover:underline text-primary"
            >
              Merchant
            </Link>
            <span className="text-sm text-muted-foreground">|</span>
            <Link 
              href="/login/admin" 
              className="text-sm underline-offset-4 hover:underline text-primary"
            >
              Admin
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm userType="partner-bank" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 relative hidden lg:block">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10">
          <h2 className="text-3xl font-bold mb-4">Partner Bank Portal</h2>
          <p className="text-center max-w-md mb-6">
            Access your banking partner dashboard to manage settlements, merchants, and monitor financial transactions.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Settlement Management</div>
              <p className="text-sm">Process and monitor merchant settlements</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Merchant Oversight</div>
              <p className="text-sm">Monitor merchants connected to your bank</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Financial Reports</div>
              <p className="text-sm">Access comprehensive financial analytics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Commission Tracking</div>
              <p className="text-sm">Monitor and manage your commission earnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
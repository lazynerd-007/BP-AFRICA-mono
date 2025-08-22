import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export default function AdminLoginPage() {
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
            <span className="text-sm text-muted-foreground">Merchant Portal</span>
            <Link 
              href="/login/merchant" 
              className="text-sm underline-offset-4 hover:underline text-primary"
            >
              Login Here
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm userType="administrator" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 relative hidden lg:block">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10">
          <h2 className="text-3xl font-bold mb-4">Admin Portal</h2>
          <p className="text-center max-w-md mb-6">
            Access administrative tools to manage the platform, merchants, and system settings.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Merchant Management</div>
              <p className="text-sm">Oversee and manage all merchant accounts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Transaction Monitoring</div>
              <p className="text-sm">Monitor all payments across the platform</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">System Settings</div>
              <p className="text-sm">Configure platform settings and parameters</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="font-bold mb-2">Admin Analytics</div>
              <p className="text-sm">View comprehensive platform statistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function AdminForgotPasswordPage() {
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
            <ForgotPasswordForm userType="administrator" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 relative hidden lg:block">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10">
          <h2 className="text-3xl font-bold mb-4">Admin Recovery</h2>
          <p className="text-center max-w-md mb-6">
            Reset your administrative account password to regain access to the platform.
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg max-w-md">
            <div className="font-bold mb-2 text-xl">Security Notice</div>
            <p className="mb-4">
              As an administrative user, your account has elevated permissions. For security reasons:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-2 items-start">
                <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</div>
                <p>Password reset links expire after 1 hour</p>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</div>
                <p>New passwords must meet our strong password requirements</p>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</div>
                <p>All account activities are logged for security auditing</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
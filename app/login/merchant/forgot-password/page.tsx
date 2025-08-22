import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function MerchantForgotPasswordPage() {
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
            <ForgotPasswordForm userType="merchant" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 relative hidden lg:block">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10">
          <h2 className="text-3xl font-bold mb-4">Account Recovery</h2>
          <p className="text-center max-w-md mb-6">
            We&apos;ll help you reset your password and get back to managing your business.
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg max-w-md">
            <div className="font-bold mb-2 text-xl">Password Reset Process</div>
            <ul className="space-y-3">
              <li className="flex gap-2 items-start">
                <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <p>Enter your email address</p>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <p>Check your inbox for a recovery link</p>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <p>Follow the link to create a new password</p>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                <p>Log in with your new password</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 
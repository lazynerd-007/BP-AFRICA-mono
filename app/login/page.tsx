import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="flex items-center p-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="text-xl font-bold">BluPay</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Welcome to BluPay</h1>
            <p className="text-muted-foreground">
              Select the appropriate portal to log in to your account
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Merchant Portal */}
            <Link href="/login/merchant" 
              className="group rounded-lg border p-6 transition-colors hover:border-primary hover:bg-muted/50">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 21l18 0" />
                    <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
                    <path d="M5 21l0 -10.15" />
                    <path d="M19 21l0 -10.15" />
                    <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Merchant Portal</h2>
                  <p className="text-sm text-muted-foreground">
                    Access your merchant dashboard to manage payments and transactions
                  </p>
                </div>
                <span className="text-primary font-medium text-sm group-hover:underline">
                  Login to Merchant Portal
                </span>
              </div>
            </Link>

            {/* SubMerchant Portal */}
            <Link href="/login/submerchant" 
              className="group rounded-lg border p-6 transition-colors hover:border-primary hover:bg-muted/50">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600 dark:text-orange-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">SubMerchant Portal</h2>
                  <p className="text-sm text-muted-foreground">
                    Access your submerchant dashboard for business operations
                  </p>
                </div>
                <span className="text-primary font-medium text-sm group-hover:underline">
                  Login to SubMerchant Portal
                </span>
              </div>
            </Link>

            {/* Admin Portal */}
            <Link href="/login/admin" 
              className="group rounded-lg border p-6 transition-colors hover:border-primary hover:bg-muted/50">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Admin Portal</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage merchants, transactions, and system settings
                  </p>
                </div>
                <span className="text-primary font-medium text-sm group-hover:underline">
                  Login to Admin Portal
                </span>
              </div>
            </Link>

            {/* Partner Bank Portal */}
            <Link href="/login/partner-bank" 
              className="group rounded-lg border p-6 transition-colors hover:border-primary hover:bg-muted/50">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 dark:text-emerald-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 21l18 0" />
                    <path d="M3 10l18 0" />
                    <path d="M5 6l0 4" />
                    <path d="M19 6l0 4" />
                    <path d="M7 18l0 -8" />
                    <path d="M11 18l0 -8" />
                    <path d="M15 18l0 -8" />
                    <path d="M19 18l0 -8" />
                    <path d="M4 6c0 -1.657 1.343 -3 3 -3h10c1.657 0 3 1.343 3 3" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">Partner Bank Portal</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage settlements, merchants, and financial operations
                  </p>
                </div>
                <span className="text-primary font-medium text-sm group-hover:underline">
                  Login to Partner Bank Portal
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t p-6 text-center text-sm text-muted-foreground">
        © 2023 BluPay. All rights reserved.
      </footer>
    </div>
  )
}

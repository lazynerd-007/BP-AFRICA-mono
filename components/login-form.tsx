"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { showLoginSuccess } from "@/components/success-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { LoadingButton } from "@/components/ui/loading-states";
import ErrorBoundary, { FormErrorFallback } from "@/components/error-boundary";

// Define validation schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps extends React.ComponentProps<"form"> {
  userType: "administrator" | "merchant" | "partner-bank" | "submerchant";
}

export function LoginForm({
  className,
  userType,
  ...props
}: LoginFormProps) {
  const { login, isLoading } = useAuthStore();
  const { showError } = useErrorHandler();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data.email, data.password, userType);
      if (result === true) {
        // Create user object from form data for toast
        const userForToast = { email: data.email, name: data.email.split('@')[0] };
        
        // Show success toast
        await showLoginSuccess(userType, userForToast);
        
        // Navigate after toast is shown
        setTimeout(() => {
          if (userType === "administrator") {
            window.location.href = "/admin/dashboard";
          } else if (userType === "merchant") {
            window.location.href = "/merchant/dashboard";
          } else if (userType === "partner-bank") {
            window.location.href = "/partner-bank/dashboard";
          } else if (userType === "submerchant") {
            window.location.href = "/submerchant/dashboard";
          }
        }, 500);
      }
    } catch (error) {
      showError(error);
    }
  };

  const getLoginTitle = () => {
    switch (userType) {
      case "administrator": return "Admin Login";
      case "merchant": return "Merchant Login";
      case "partner-bank": return "Partner Bank Login";
      case "submerchant": return "SubMerchant Login";
      default: return "Login";
    }
  };

  const getLoginDescription = () => {
    switch (userType) {
      case "administrator": 
        return "Enter your admin credentials to access the admin portal";
      case "merchant": 
        return "Enter your credentials to access your merchant dashboard";
      case "partner-bank": 
        return "Enter your credentials to access the partner bank portal";
      case "submerchant": 
        return "Enter your credentials to access your submerchant dashboard";
      default: 
        return "Enter your credentials to continue";
    }
  };

  const getForgotPasswordLink = () => {
    switch (userType) {
      case "administrator": return "/login/admin/forgot-password";
      case "merchant": return "/login/merchant/forgot-password";
      case "partner-bank": return "/login/partner-bank/forgot-password";
      case "submerchant": return "/login/submerchant/forgot-password";
      default: return "/login/forgot-password";
    }
  };

  const getEmailPlaceholder = () => {
    switch (userType) {
      case "administrator": return "admin@example.com";
      case "merchant": return "merchant@example.com";
      case "partner-bank": return "you@bankname.com";
      case "submerchant": return "submerchant@example.com";
      default: return "you@example.com";
    }
  };

  return (
    <ErrorBoundary fallback={FormErrorFallback}>
      <form 
        className={cn("flex flex-col gap-6", className)} 
        {...props}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            {getLoginTitle()}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            {getLoginDescription()}
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder={getEmailPlaceholder()} 
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href={getForgotPasswordLink()}
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>
          <LoadingButton type="submit" className="w-full" loading={isLoading}>
            Login
          </LoadingButton>
        </div>
      </form>
    </ErrorBoundary>
  );
}

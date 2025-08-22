"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconLock, IconRefresh, IconAlertTriangle, IconCheck } from "@tabler/icons-react";

interface OTPVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp?: string) => Promise<void>;
  title: string;
  description: string;
  actionLabel: string;
  actionDetails?: {
    amount?: string;
    recipient?: string;
    reference?: string;
    [key: string]: string | undefined;
  };
  isProcessing?: boolean;
  otpLength?: number;
}

export function OTPVerification({
  isOpen,
  onClose,
  onVerify,
  title,
  description,
  actionLabel,
  actionDetails,
  isProcessing = false,
  otpLength = 6
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setOtpError("");
      setResendCooldown(0);
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = otp.split("");
    newOtp[index] = value;
    const newOtpString = newOtp.join("");
    
    setOtp(newOtpString);
    setOtpError("");

    // Auto-focus next input
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength);
    setOtp(pastedData);
    setOtpError("");
    
    // Focus the last filled input or first empty one
    const nextIndex = Math.min(pastedData.length, otpLength - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendCooldown(60); // 60 second cooldown
      setOtp("");
      setOtpError("");
      inputRefs.current[0]?.focus();
    } catch {
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Handle verify
  const handleVerify = async () => {
    if (otp.length !== otpLength) {
      setOtpError(`Please enter a valid ${otpLength}-digit OTP`);
      return;
    }

    try {
      await onVerify(otp);
      setOtp("");
      setOtpError("");
    } catch {
      setOtpError("Invalid OTP. Please try again.");
      setOtp("");
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconLock className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Action Details */}
          {actionDetails && (
            <Alert>
              <IconAlertTriangle className="h-4 w-4" />
              <AlertTitle>Confirm Action Details</AlertTitle>
              <AlertDescription>
                <div className="space-y-1 mt-2 text-sm">
                  {Object.entries(actionDetails).map(([key, value]) => 
                    value && (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span>{value}</span>
                      </div>
                    )
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* OTP Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Enter OTP</Label>
              <div className="flex justify-center gap-2">
                {Array.from({ length: otpLength }, (_, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-mono"
                    autoComplete="off"
                  />
                ))}
              </div>
              
              {otpError && (
                <div className="text-sm text-red-500 text-center">
                  {otpError}
                </div>
              )}
              
              <div className="text-center text-xs text-muted-foreground">
                OTP sent to your registered mobile number and email
              </div>
            </div>

            {/* Resend OTP */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isResending}
                className="text-xs"
              >
                <IconRefresh className="h-3 w-3 mr-1" />
                {isResending 
                  ? "Sending..." 
                  : resendCooldown > 0 
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"
                }
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleVerify}
            disabled={otp.length !== otpLength || isProcessing}
            className="min-w-[120px]"
          >
            {isProcessing ? (
              <>
                <IconRefresh className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IconCheck className="h-4 w-4 mr-2" />
                {actionLabel}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  IconBuilding, 
  IconUser, 
  IconCreditCard, 
  IconSettings, 
  IconBuildingBank,
  IconPhone,
  IconDeviceMobile,
  IconWallet,
  IconCoins,
  IconArrowLeft
} from "@tabler/icons-react";
import { mockCharges } from "@/components/admin/charges/types";
import { useCurrency } from "@/lib/currency-context";

// Mock parent merchants data
const parentMerchants = [
  { id: "bluwave", name: "BluWave Limited" },
  { id: "blupenguin", name: "Blu Penguin" },
  { id: "skynet", name: "SkyNet Ghana" },
  { id: "smartpay", name: "SmartPay Solutions" },
];

const formSchema = z.object({
  // Parent Merchant
  parentMerchant: z.string({ required_error: "Parent merchant is required" }),
  
  // Sub-Merchant Details
  merchantCode: z.string().min(1, { message: "Merchant code is required" }),
  merchantName: z.string().min(3, { message: "Merchant name is required" }),
  merchantAddress: z.string().min(5, { message: "Address is required" }),
  notificationEmail: z.string().email({ message: "Valid email is required" }),
  tinNumber: z.string().optional(),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  
  // Surcharge Details
  inheritSurcharge: z.boolean().default(true),
  surchargeOn: z.string().optional(),
  
  // Settlement Account
  useParentSettlement: z.boolean().default(true),
  settlementType: z.string().optional(),
  merchantBank: z.string().optional(),
  branch: z.string().optional(),
  accountType: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  // MOMO Settlement fields
  momoProvider: z.string().optional(),
  momoNumber: z.string().optional(),
  momoAccountName: z.string().optional(),
  
  // Custom Charge Fields for all charge types
  customWalletToWalletAmount: z.string().optional(),
  customWalletToWalletPercentage: z.string().optional(),
  customWalletToWalletCap: z.string().optional(),
  customWalletToWalletType: z.string().optional(),
  
  customMomoSettlementAmount: z.string().optional(),
  customMomoSettlementPercentage: z.string().optional(),
  customMomoSettlementCap: z.string().optional(),
  customMomoSettlementType: z.string().optional(),
  
  customBankSettlementAmount: z.string().optional(),
  customBankSettlementPercentage: z.string().optional(),
  customBankSettlementCap: z.string().optional(),
  customBankSettlementType: z.string().optional(),
  
  customMomoPayoutAmount: z.string().optional(),
  customMomoPayoutPercentage: z.string().optional(),
  customMomoPayoutCap: z.string().optional(),
  customMomoPayoutType: z.string().optional(),
  
  customBankPayoutAmount: z.string().optional(),
  customBankPayoutPercentage: z.string().optional(),
  customBankPayoutCap: z.string().optional(),
  customBankPayoutType: z.string().optional(),
  
  customBankCollectionAmount: z.string().optional(),
  customBankCollectionPercentage: z.string().optional(),
  customBankCollectionCap: z.string().optional(),
  customBankCollectionType: z.string().optional(),
  
  customMomoCollectionAmount: z.string().optional(),
  customMomoCollectionPercentage: z.string().optional(),
  customMomoCollectionCap: z.string().optional(),
  customMomoCollectionType: z.string().optional(),
  
  // OVA Settings
  mtn: z.string().optional(),
  airtel: z.string().optional(),
  telecel: z.string().optional(),
  
  // User Details
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  

}).refine(
  (data) => {
    if (!data.useParentSettlement) {
      if (data.settlementType === "bank") {
        return !!data.merchantBank && !!data.branch && !!data.accountType && !!data.accountNumber && !!data.accountName;
      }
      if (data.settlementType === "momo") {
        return !!data.momoProvider && !!data.momoNumber && !!data.momoAccountName;
      }
    }
    return true;
  },
  {
    message: "Settlement account details are required when not using parent settlement",
    path: ["settlementType"],
  }
);

export function CreateSubMerchant() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subMerchantId = searchParams.get('id');
  const isEditMode = Boolean(subMerchantId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [useParentSettlement, setUseParentSettlement] = useState(true);
  const [settlementType, setSettlementType] = useState<string>("");
  const [inheritSurcharge, setInheritSurcharge] = useState(true);
  const { currency } = useCurrency();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      parentMerchant: "",
      merchantCode: "",
      merchantName: "",
      merchantAddress: "",
      notificationEmail: "",
      tinNumber: "",
      phoneNumber: "",
      inheritSurcharge: true,
      surchargeOn: "",
      useParentSettlement: true,
      settlementType: "",
      merchantBank: "",
      branch: "",
      accountType: "",
      accountNumber: "",
      accountName: "",
      momoProvider: "",
      momoNumber: "",
      momoAccountName: "",
      
      // Custom charge defaults
      customWalletToWalletAmount: "",
      customWalletToWalletPercentage: "",
      customWalletToWalletCap: "",
      customWalletToWalletType: "fixed",
      
      customMomoSettlementAmount: "",
      customMomoSettlementPercentage: "",
      customMomoSettlementCap: "",
      customMomoSettlementType: "percentage",
      
      customBankSettlementAmount: "",
      customBankSettlementPercentage: "",
      customBankSettlementCap: "",
      customBankSettlementType: "percentage",
      
      customMomoPayoutAmount: "",
      customMomoPayoutPercentage: "",
      customMomoPayoutCap: "",
      customMomoPayoutType: "percentage",
      
      customBankPayoutAmount: "",
      customBankPayoutPercentage: "",
      customBankPayoutCap: "",
      customBankPayoutType: "percentage",
      
      customBankCollectionAmount: "",
      customBankCollectionPercentage: "",
      customBankCollectionCap: "",
      customBankCollectionType: "percentage",
      
      customMomoCollectionAmount: "",
      customMomoCollectionPercentage: "",
      customMomoCollectionCap: "",
      customMomoCollectionType: "percentage",
      mtn: "",
      airtel: "",
      telecel: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const loadSubMerchantData = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      
      // Mock sub-merchant data - in production, this would be an API call using id
      console.log("Loading sub-merchant data for ID:", id);
      const mockSubMerchantData = {
        parentMerchant: "bluwave",
        merchantCode: "SUB001",
        merchantName: "BluWave Store 1",
        merchantAddress: "123 Main St, Accra",
        notificationEmail: "store1@bluwave.com",
        tinNumber: "",
        phoneNumber: "+233 24 123 4567",
        inheritSurcharge: true,
        surchargeOn: "merchant",
        useParentSettlement: true,
        settlementType: "bank",
        merchantBank: "gcb",
        branch: "Accra Main",
        accountType: "current",
        accountNumber: "1234567890",
        accountName: "BluWave Store 1",
        momoProvider: "mtn",
        momoNumber: "024 123 4567",
        momoAccountName: "Store 1",
        mtn: "mtn_ova_001",
        airtel: "airtel_ova_001",
        telecel: "telecel_ova_001",
        firstName: "John",
        lastName: "Doe",
        email: "john@bluwave.com",
      };
      
      // Set form values
      form.reset(mockSubMerchantData);
      setUseParentSettlement(mockSubMerchantData.useParentSettlement);
      setInheritSurcharge(mockSubMerchantData.inheritSurcharge);
      setSettlementType(mockSubMerchantData.settlementType);
      
    } catch (error) {
      console.error("Error loading sub-merchant data:", error);
      toast.error("Failed to load sub-merchant data");
    } finally {
      setIsLoading(false);
    }
  }, [form, setUseParentSettlement, setInheritSurcharge, setSettlementType]);

  // Load sub-merchant data when in edit mode
  useEffect(() => {
    if (isEditMode && subMerchantId) {
      loadSubMerchantData(subMerchantId);
    }
  }, [isEditMode, subMerchantId, loadSubMerchantData]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      
      if (isEditMode) {
        toast.success("Sub-merchant updated successfully");
        router.push(`/admin/dashboard/merchant/${subMerchantId}`);
      } else {
        toast.success("Sub-merchant created successfully");
        form.reset();
        router.push("/admin/dashboard/merchant?tab=view-sub");
      }
      
      setIsSubmitting(false);
    }, 1500);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sub-merchant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {isEditMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="mr-4"
              >
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full">
              <IconBuilding className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {isEditMode ? "Edit Sub-Merchant" : "Create Sub-Merchant"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditMode 
                  ? "Update sub-merchant information and configuration"
                  : "Add a new sub-merchant to an existing parent merchant account"
                }
              </p>
            </div>

          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left Column - Main Details */}
              <div className="space-y-6">
                
                {/* Parent Merchant Selection */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconBuilding className="h-5 w-5" />
                      Parent Merchant Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="parentMerchant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Select Parent Merchant</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a parent merchant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {parentMerchants.map((merchant) => (
                                <SelectItem key={merchant.id} value={merchant.id}>
                                  {merchant.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Sub-Merchant Details */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUser className="h-5 w-5" />
                      Sub-Merchant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="merchantCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Merchant Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter merchant code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="merchantName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Merchant Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter merchant name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="merchantAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="notificationEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Notification Email</FormLabel>
                            <FormControl>
                              <Input placeholder="notifications@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="0244123456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="tinNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">TIN Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter TIN number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* OVA Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconPhone className="h-5 w-5" />
                      OVA Configuration
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Select OVA accounts for mobile money providers
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="mtn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">MTN OVA</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mtn_ova_001">EGANOW</SelectItem>
                                <SelectItem value="mtn_ova_002">BLUPAY</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="airtel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">AirtelTigo OVA</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="airtel_ova_001">AIRTEL BLUPAY</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="telecel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Telecel OVA</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="telecel_ova_001">BLUPAY3</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Configuration */}
              <div className="space-y-6">
                
                {/* Settlement Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconCreditCard className="h-5 w-5" />
                      Settlement Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="useParentSettlement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 bg-muted/50 rounded-lg">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                setUseParentSettlement(!!checked);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">Use Parent Settlement Account</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Funds will be settled to the parent merchant&apos;s account
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {!useParentSettlement && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <IconCreditCard className="h-4 w-4" />
                          Custom Settlement Account
                        </h4>
                        
                        <FormField
                          control={form.control}
                          name="settlementType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Settlement Type</FormLabel>
                              <Select onValueChange={(value) => {
                                field.onChange(value);
                                setSettlementType(value);
                              }} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select settlement type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="bank">
                                    <div className="flex items-center gap-2">
                                      <IconBuildingBank className="h-4 w-4" />
                                      Bank Account
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="momo">
                                    <div className="flex items-center gap-2">
                                      <IconDeviceMobile className="h-4 w-4" />
                                      Mobile Money
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {settlementType === "bank" && (
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="merchantBank"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Bank</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select bank" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="gcb">GCB Bank</SelectItem>
                                        <SelectItem value="ecobank">Ecobank</SelectItem>
                                        <SelectItem value="absa">Absa Bank</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="branch"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Branch</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Bank branch" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="accountType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Account Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="savings">Savings</SelectItem>
                                        <SelectItem value="current">Current</SelectItem>
                                        <SelectItem value="corporate">Corporate</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Account Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Account number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="accountName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Account Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Account holder name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}
                        
                        {settlementType === "momo" && (
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="momoProvider"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Mobile Money Provider</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select provider" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                                      <SelectItem value="airtel">AirtelTigo Money</SelectItem>
                                      <SelectItem value="telecel">Telecel Cash</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="momoNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Mobile Money Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="0244123456" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="momoAccountName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Account Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Account holder name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Surcharge Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconSettings className="h-5 w-5" />
                      Surcharge Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="inheritSurcharge"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 bg-muted/50 rounded-lg">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                setInheritSurcharge(!!checked);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">Inherit Parent Surcharge</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Use the same surcharge configuration as parent merchant
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    

                    {!inheritSurcharge && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                          <IconSettings className="h-4 w-4" />
                          Custom charge configuration is available below in the &quot;Charge Configuration&quot; section.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Admin User Setup */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUser className="h-5 w-5" />
                      Admin User Setup
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Configure the primary admin user for this sub-merchant
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Charge Configuration - Full Width Section */}
            {!inheritSurcharge && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <IconWallet className="h-6 w-6" />
                    Charge Configuration
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">
                    Configure custom charges for this sub-merchant - these will override the parent merchant charges
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
                      <IconSettings className="h-5 w-5" />
                      Applied Default Charges
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {Object.entries(mockCharges).map(([key, charge]) => (
                        <div key={key} className="p-4 bg-background rounded-lg border shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            {key.includes('wallet') && <IconWallet className="h-5 w-5 text-blue-600" />}
                            {key.includes('momo') && !key.includes('Collection') && <IconDeviceMobile className="h-5 w-5 text-green-600" />}
                            {key.includes('bank') && !key.includes('Collection') && <IconBuildingBank className="h-5 w-5 text-purple-600" />}
                            {key.includes('Collection') && key.includes('momo') && <IconCoins className="h-5 w-5 text-orange-600" />}
                            {key.includes('Collection') && key.includes('bank') && <IconCoins className="h-5 w-5 text-red-600" />}
                            <span className="font-medium text-sm">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Type</span>
                              <Badge variant="secondary" className="text-xs">
                                {charge.chargeType}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Rate</span>
                              <span className="font-medium text-sm">
                                {charge.chargeType === "fixed" 
                                  ? `${currency}${charge.amount.toFixed(2)}` 
                                  : `${charge.percentage}%`}
                              </span>
                            </div>
                            {charge.chargeType === "percentage" && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Cap</span>
                                <span className="text-sm font-medium">{currency}{charge.cap.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Status</span>
                              <Badge variant={charge.status === "Active" ? "default" : "secondary"} className="text-xs">
                                {charge.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Charges Configuration */}
                  <div className="space-y-6">
                    <h4 className="font-medium text-lg flex items-center gap-2">
                      <IconWallet className="h-5 w-5" />
                      Custom Charge Configuration
                    </h4>
                    
                    {/* Surcharge Applied To */}
                    <div className="max-w-md">
                      <FormField
                        control={form.control}
                        name="surchargeOn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Surcharge Applied To</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="merchant">Merchant</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {Object.entries(mockCharges).map(([key, defaultCharge]) => {
                      const fieldPrefix = `custom${key.charAt(0).toUpperCase() + key.slice(1)}`;
                      const chargeTypeField = `${fieldPrefix}Type` as keyof z.infer<typeof formSchema>;
                      const currentChargeType = form.watch(chargeTypeField) || defaultCharge.chargeType;
                      
                      return (
                        <div key={key} className="p-6 bg-muted/30 rounded-lg border">
                          <div className="flex items-center gap-2 mb-4">
                            {key.includes('wallet') && <IconWallet className="h-5 w-5 text-blue-600" />}
                            {key.includes('momo') && !key.includes('Collection') && <IconDeviceMobile className="h-5 w-5 text-green-600" />}
                            {key.includes('bank') && !key.includes('Collection') && <IconBuildingBank className="h-5 w-5 text-purple-600" />}
                            {key.includes('Collection') && key.includes('momo') && <IconCoins className="h-5 w-5 text-orange-600" />}
                            {key.includes('Collection') && key.includes('bank') && <IconCoins className="h-5 w-5 text-red-600" />}
                            <h4 className="font-medium text-lg">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Charges
                            </h4>
                            <Badge variant="outline" className="text-xs ml-auto">
                              Default: {defaultCharge.chargeType === "fixed" 
                                ? `${currency}${defaultCharge.amount.toFixed(2)}` 
                                : `${defaultCharge.percentage}%`}
                            </Badge>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <FormField
                              control={form.control}
                              name={chargeTypeField}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">Charge Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value || defaultCharge.chargeType}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                                      <SelectItem value="percentage">Percentage</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            {currentChargeType === "fixed" && (
                              <FormField
                                control={form.control}
                                name={`${fieldPrefix}Amount` as keyof z.infer<typeof formSchema>}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">Fixed Amount ({currency})</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        step="0.01" 
                                        placeholder={defaultCharge.amount.toString()} 
                                        {...field}
                                        value={field.value as string || ""}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            
                            {currentChargeType === "percentage" && (
                              <>
                                <FormField
                                  control={form.control}
                                  name={`${fieldPrefix}Percentage` as keyof z.infer<typeof formSchema>}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">Percentage (%)</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          step="0.01" 
                                          placeholder={defaultCharge.percentage.toString()} 
                                          {...field}
                                          value={field.value as string || ""}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`${fieldPrefix}Cap` as keyof z.infer<typeof formSchema>}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">Cap Amount ({currency})</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          step="0.01" 
                                          placeholder={defaultCharge.cap.toString()} 
                                          {...field}
                                          value={field.value as string || ""}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                {isSubmitting ? (
                  <>
                    <IconSettings className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditMode ? "Update Sub-Merchant" : "Create Sub-Merchant"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 
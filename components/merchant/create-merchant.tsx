"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  // Merchant Details
  merchantCode: z.string().min(1, { message: "Merchant code is required" }),
  merchantName: z.string().min(3, { message: "Merchant name is required" }),
  merchantAddress: z.string().min(5, { message: "Address is required" }),
  notificationEmail: z.string().email({ message: "Valid email is required" }),
  country: z.string({ required_error: "Country is required" }),
  tinNumber: z.string().optional(),
  settlementFrequency: z.string({ required_error: "Settlement frequency is required" }),
  surchargeOn: z.string({ required_error: "Surcharge setting is required" }),
  partnerBank: z.string({ required_error: "Partner bank is required" }),
  bdm: z.string().optional(),
  terminalId: z.string().optional(),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  
  // Surcharge Details
  totalSurcharge: z.string().min(1, { message: "Total surcharge is required" }),
  merchantSurcharge: z.string().min(1, { message: "Merchant surcharge is required" }),
  customerSurcharge: z.string().min(1, { message: "Customer surcharge is required" }),
  noSurchargeCap: z.boolean().default(false),
  
  // OVA Settings
  mtn: z.string().optional(),
  airtel: z.string().optional(),
  telecel: z.string().optional(),
  
  // User Details
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  
  // Bank Details
  merchantBank: z.string({ required_error: "Merchant bank is required" }),
  branch: z.string({ required_error: "Branch is required" }),
  accountType: z.string({ required_error: "Account type is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  accountName: z.string().min(1, { message: "Account name is required" }),
  organizationType: z.string({ required_error: "Organization type is required" }),
  merchantCategory: z.string({ required_error: "Merchant category is required" }),
});

export function CreateMerchant() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      merchantCode: "",
      merchantName: "",
      merchantAddress: "",
      notificationEmail: "",
      country: "",
      tinNumber: "",
      settlementFrequency: "",
      surchargeOn: "",
      partnerBank: "",
      bdm: "",
      terminalId: "",
      phoneNumber: "",
      totalSurcharge: "1.5",
      merchantSurcharge: "0",
      customerSurcharge: "0",
      noSurchargeCap: false,
      mtn: "",
      airtel: "",
      telecel: "",
      firstName: "",
      lastName: "",
      email: "",
      merchantBank: "",
      branch: "",
      accountType: "",
      accountNumber: "",
      accountName: "",
      organizationType: "",
      merchantCategory: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      toast.success("Merchant created successfully");
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-semibold">Create New BluPay Merchant</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">Setup new parent merchant with the appropriate information.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Merchant Details Section */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">Merchant Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="merchantCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant code</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
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
                        <FormLabel>Merchant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="merchantAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant Address</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notificationEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Email</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ghana">Ghana</SelectItem>
                            <SelectItem value="nigeria">Nigeria</SelectItem>
                            <SelectItem value="kenya">Kenya</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tinNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TIN Number</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="surchargeOn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surcharge On</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="partnerBank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner Bank</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bank1">Bank 1</SelectItem>
                            <SelectItem value="bank2">Bank 2</SelectItem>
                            <SelectItem value="bank3">Bank 3</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="terminalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terminal ID</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="term1">Terminal 1</SelectItem>
                            <SelectItem value="term2">Terminal 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Surcharge Details Section */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">Surcharge Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="totalSurcharge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Surcharge (%)</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="merchantSurcharge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant Surcharge (%)</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customerSurcharge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Surcharge (%)</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="noSurchargeCap"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500"
                          />
                        </FormControl>
                        <div className="leading-none pt-0.5">
                          <FormLabel>No Surcharge Cap applied</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* OVA Settings Section */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">OVA Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="mtn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MTN</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                            <SelectItem value="option2">Option 2</SelectItem>
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
                        <FormLabel>Airtel</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                            <SelectItem value="option2">Option 2</SelectItem>
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
                        <FormLabel>Telecel</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                            <SelectItem value="option2">Option 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* User Details Section */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">User Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Bank Details Section */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="settlementFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Settlement Frequency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="merchantBank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant Bank</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bank1">Bank 1</SelectItem>
                            <SelectItem value="bank2">Bank 2</SelectItem>
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
                        <FormLabel>Branch</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="branch1">Branch 1</SelectItem>
                            <SelectItem value="branch2">Branch 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="savings">Savings</SelectItem>
                            <SelectItem value="current">Current</SelectItem>
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
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
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
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="ngo">NGO</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="merchantCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="food">Food & Beverage</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={isSubmitting} 
                  onClick={() => form.reset()}
                  size="lg"
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting} size="lg">
                  {isSubmitting ? "Creating..." : "Create Merchant"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 
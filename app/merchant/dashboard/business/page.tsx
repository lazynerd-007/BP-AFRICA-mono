"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusinessPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Business Settings</h1>
        <p className="text-muted-foreground">Manage your business information and settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Your business profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Company Name</h3>
                <p>BluPay Technologies Ltd</p>
              </div>
              <div>
                <h3 className="font-medium">Business Type</h3>
                <p>Technology Services</p>
              </div>
              <div>
                <h3 className="font-medium">Registration Number</h3>
                <p>BPT-2023-8740</p>
              </div>
              <div>
                <h3 className="font-medium">Tax ID</h3>
                <p>TAX-9384-2023-BP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Your business contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email Address</h3>
                <p>contact@blupay.com</p>
              </div>
              <div>
                <h3 className="font-medium">Phone Number</h3>
                <p>+234 800 123 4567</p>
              </div>
              <div>
                <h3 className="font-medium">Address</h3>
                <p>12 Tech Boulevard, Lagos, Nigeria</p>
              </div>
              <div>
                <h3 className="font-medium">Website</h3>
                <p>www.blupay.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

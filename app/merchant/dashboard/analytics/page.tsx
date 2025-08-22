"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  IconChartBar, 
  IconChartPie, 
  IconUsers, 
  IconMoneybag,
  IconArrowUpRight,
  IconArrowDownRight,
  IconCalendarStats
} from "@tabler/icons-react";

export default function MerchantAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View insights and performance metrics for your business
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS 85,240.50</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Sale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS 66.39</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">3.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">962</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <IconArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
              <span className="text-red-500 font-medium">1.5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4 mb-6">
          <TabsTrigger value="sales">
            <IconMoneybag className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="customers">
            <IconUsers className="h-4 w-4 mr-2" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="products">
            <IconChartPie className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="reports">
            <IconCalendarStats className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Your sales performance over time
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[350px] w-full flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <IconChartBar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">Sales Chart Placeholder</h3>
                  <p className="text-sm text-muted-foreground">Sales data visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Your best-selling products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="font-medium">Product A</div>
                    <div className="text-right">
                      <div className="font-medium">GHS 12,240.00</div>
                      <div className="text-sm text-muted-foreground">184 sales</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="font-medium">Product B</div>
                    <div className="text-right">
                      <div className="font-medium">GHS 9,850.50</div>
                      <div className="text-sm text-muted-foreground">132 sales</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="font-medium">Product C</div>
                    <div className="text-right">
                      <div className="font-medium">GHS 7,625.00</div>
                      <div className="text-sm text-muted-foreground">98 sales</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Distribution by payment type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <IconChartPie className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium">Pie Chart Placeholder</h3>
                    <p className="text-sm text-muted-foreground">Payment method breakdown</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>
                Customer data and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <IconUsers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Customer Analytics Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We&apos;re working on advanced customer analytics features. Check back soon for detailed customer insights.
                </p>
                <Button className="mt-4">
                  Export Customer Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>
                Analyze your product performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <IconChartPie className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Product Analytics Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We&apos;re working on detailed product performance analytics. Check back soon for product insights.
                </p>
                <Button className="mt-4">
                  Export Product Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and download reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Sales Report</h3>
                    <p className="text-sm text-muted-foreground">Detailed sales breakdown by product and date</p>
                  </div>
                  <Button>Generate</Button>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Customer Report</h3>
                    <p className="text-sm text-muted-foreground">Customer acquisition and retention data</p>
                  </div>
                  <Button>Generate</Button>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Financial Report</h3>
                    <p className="text-sm text-muted-foreground">Profit, revenue and transaction statistics</p>
                  </div>
                  <Button>Generate</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
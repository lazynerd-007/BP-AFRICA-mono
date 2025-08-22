"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { IconQrcode, IconReceipt, IconPlus, IconCopy, IconDownload, IconEye, IconTrash } from "@tabler/icons-react";

// Type definitions
interface PaymentLink {
  id: string;
  title: string;
  amount: number;
  currency: string;
  description: string;
  type: "one-time" | "recurring";
  url: string;
  created: string;
}

interface QrCode {
  id: string;
  title: string;
  currency: string;
  description: string;
  qrCodeUrl: string;
  created: string;
}

export default function SubmerchantPaymentsPage() {
  // State for modals
  const [paymentLinkModalOpen, setPaymentLinkModalOpen] = useState(false);
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
  const [viewLinkModalOpen, setViewLinkModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null);
  
  // Loading states
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isCreatingQr, setIsCreatingQr] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [deletingQrId, setDeletingQrId] = useState<string | null>(null);
  
  // State for multiple items
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  
  // Form states for payment link
  const [linkTitle, setLinkTitle] = useState("");
  const [linkAmount, setLinkAmount] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [linkType, setLinkType] = useState<"one-time" | "recurring">("one-time");
  
  // Form states for QR code
  const [qrTitle, setQrTitle] = useState("");
  const [qrDescription, setQrDescription] = useState("");
  
  // Handle form submissions
  const handleCreatePaymentLink = async () => {
    if (!linkTitle || (linkType === "one-time" && !linkAmount)) return;
    
    setIsCreatingLink(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newLink: PaymentLink = {
        id: `PLK-${Date.now()}`,
        title: linkTitle,
        amount: linkType === "one-time" ? parseFloat(linkAmount) : 0,
        currency: "GHS",
        description: linkDescription,
        type: linkType,
        url: `https://pay.bluepay.com/link/PLK-${Date.now()}`,
        created: new Date().toISOString()
      };

      setPaymentLinks([...paymentLinks, newLink]);
      setPaymentLinkModalOpen(false);
      
      // Reset form
      setLinkTitle("");
      setLinkAmount("");
      setLinkDescription("");
      setLinkType("one-time");
    } catch (error) {
      console.error("Failed to create payment link:", error);
    } finally {
      setIsCreatingLink(false);
    }
  };
  
  const handleCreateQrCode = async () => {
    if (!qrTitle) return;
    
    setIsCreatingQr(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newQrCode: QrCode = {
        id: `QRC-${Date.now()}`,
        title: qrTitle,
        currency: "GHS",
        description: qrDescription,
        qrCodeUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        created: new Date().toISOString()
      };

      setQrCodes([...qrCodes, newQrCode]);
      setQrCodeModalOpen(false);
      
      // Reset form
      setQrTitle("");
      setQrDescription("");
    } catch (error) {
      console.error("Failed to create QR code:", error);
    } finally {
      setIsCreatingQr(false);
    }
  };

  const handleDeletePaymentLink = async (id: string) => {
    setDeletingLinkId(id);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setPaymentLinks(paymentLinks.filter(link => link.id !== id));
    } catch (error) {
      console.error("Failed to delete payment link:", error);
    } finally {
      setDeletingLinkId(null);
    }
  };

  const handleDeleteQrCode = async (id: string) => {
    setDeletingQrId(id);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setQrCodes(qrCodes.filter(qr => qr.id !== id));
    } catch (error) {
      console.error("Failed to delete QR code:", error);
    } finally {
      setDeletingQrId(null);
    }
  };

  const handleViewLink = (link: PaymentLink) => {
    setSelectedLink(link);
    setViewLinkModalOpen(true);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage payment links and QR codes
        </p>
      </div>

      <Tabs defaultValue="payment-links" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="payment-links">
            <IconReceipt className="h-4 w-4 mr-2" />
            Payment Links
          </TabsTrigger>
          <TabsTrigger value="qr-codes">
            <IconQrcode className="h-4 w-4 mr-2" />
            QR Codes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment-links" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your Payment Links</h2>
              <Dialog open={paymentLinkModalOpen} onOpenChange={setPaymentLinkModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Create New Link
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Payment Link</DialogTitle>
                    <DialogDescription>
                    Create a payment link to share with your customers for payments.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                    <Label htmlFor="sub-link-title">Title</Label>
                      <Input
                      id="sub-link-title"
                        placeholder="Enter payment link title"
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Payment Type</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="sub-one-time"
                            name="payment-type"
                            value="one-time"
                            checked={linkType === "one-time"}
                            onChange={(e) => setLinkType(e.target.value as "one-time" | "recurring")}
                            className="text-primary"
                          />
                          <Label htmlFor="sub-one-time" className="font-normal cursor-pointer">One-time Payment</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="sub-recurring"
                            name="payment-type"
                            value="recurring"
                            checked={linkType === "recurring"}
                            onChange={(e) => setLinkType(e.target.value as "one-time" | "recurring")}
                            className="text-primary"
                          />
                          <Label htmlFor="sub-recurring" className="font-normal cursor-pointer">Recurring Payment</Label>
                        </div>
                      </div>
                    </div>
                  
                  {linkType === "one-time" && (
                    <div className="grid gap-2">
                      <Label htmlFor="sub-link-amount">Amount (GHS)</Label>
                      <Input
                        id="sub-link-amount"
                        type="number"
                        placeholder="0.00"
                        value={linkAmount}
                        onChange={(e) => setLinkAmount(e.target.value)}
                      />
                    </div>
                  )}
                    
                    <div className="grid gap-2">
                    <Label htmlFor="sub-link-description">Description (Optional)</Label>
                      <Textarea
                      id="sub-link-description"
                        placeholder="Enter payment description"
                        value={linkDescription}
                        onChange={(e) => setLinkDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPaymentLinkModalOpen(false)}>
                      Cancel
                    </Button>
                  <Button onClick={handleCreatePaymentLink} disabled={!linkTitle || (linkType === "one-time" && !linkAmount) || isCreatingLink}>
                    {isCreatingLink ? "Creating..." : "Create Link"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          </div>
          
          {paymentLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentLinks.map((link) => (
                <Card key={link.id}>
              <CardHeader>
                    <div className="flex items-center justify-between">
                  <div>
                        <CardTitle className="text-lg">{link.title}</CardTitle>
                    <CardDescription>
                          Created on {new Date(link.created).toLocaleDateString()}
                    </CardDescription>
                  </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {link.type === "one-time" ? 
                            `${link.currency} ${link.amount.toFixed(2)}` : 
                            'Recurring'
                          }
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {link.type}
                        </div>
                  </div>
                </div>
              </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {link.description || "No description"}
                      </p>
                      
                      <div className="flex items-center gap-2">
                    <Input 
                          value={link.url}
                      readOnly 
                          className="flex-1 text-xs"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                          onClick={() => copyToClipboard(link.url)}
                          title="Copy Link"
                    >
                      <IconCopy className="h-4 w-4" />
                    </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleViewLink(link)}
                          title="View Details"
                        >
                          <IconEye className="h-4 w-4" />
                  </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeletePaymentLink(link.id)}
                          disabled={deletingLinkId === link.id}
                          className="text-red-500 hover:text-red-600"
                          title="Delete Link"
                        >
                          <IconTrash className="h-4 w-4" />
                  </Button>
                      </div>
                </div>
              </CardContent>
            </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>No Payment Links</CardTitle>
                <CardDescription>
                  You haven&apos;t created any payment links yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create a payment link to share with your customers for one-time or recurring payments.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="qr-codes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your QR Codes</h2>
              <Dialog open={qrCodeModalOpen} onOpenChange={setQrCodeModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <IconPlus className="h-4 w-4 mr-2" />
                  Generate QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                  <DialogTitle>Generate QR Code</DialogTitle>
                    <DialogDescription>
                    Generate a QR code for in-person payments at your store.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                    <Label htmlFor="sub-qr-title">Title</Label>
                      <Input
                      id="sub-qr-title"
                      placeholder="Enter QR code title"
                        value={qrTitle}
                        onChange={(e) => setQrTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                    <Label htmlFor="sub-qr-description">Description (Optional)</Label>
                      <Textarea
                      id="sub-qr-description"
                      placeholder="Enter QR code description"
                        value={qrDescription}
                        onChange={(e) => setQrDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setQrCodeModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateQrCode} disabled={!qrTitle || isCreatingQr}>
                    {isCreatingQr ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          </div>
          
          {qrCodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qrCodes.map((qr) => (
                <Card key={qr.id}>
              <CardHeader>
                    <div className="flex items-center justify-between">
                  <div>
                        <CardTitle className="text-lg">{qr.title}</CardTitle>
                    <CardDescription>
                          Created on {new Date(qr.created).toLocaleDateString()}
                    </CardDescription>
                  </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          Dynamic Amount
                        </div>
                  </div>
                </div>
              </CardHeader>
                  <CardContent>
                  <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {qr.description || "No description"}
                      </p>
                      
                      <div className="flex items-center justify-center p-6 bg-white border-2 border-dashed border-muted rounded-lg">
                        <div className="text-center space-y-2">
                          <div className="w-24 h-24 bg-muted/20 border-2 border-muted rounded-lg flex items-center justify-center">
                            <IconQrcode className="h-12 w-12 text-muted-foreground" />
                    </div>
                          <p className="text-xs text-muted-foreground">QR Code Preview</p>
                    </div>
                  </div>
                  
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" size="sm">
                          <IconDownload className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteQrCode(qr.id)}
                          disabled={deletingQrId === qr.id}
                          className="text-red-500 hover:text-red-600"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                </div>
              </CardContent>
            </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>No QR Codes</CardTitle>
                <CardDescription>
                  You haven&apos;t generated any QR codes yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate a QR code for in-person payments. Your customers can scan the code to complete payment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* View Link Details Modal */}
      <Dialog open={viewLinkModalOpen} onOpenChange={setViewLinkModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payment Link Details</DialogTitle>
            <DialogDescription>
              View payment link information and statistics
            </DialogDescription>
          </DialogHeader>
          
          {selectedLink && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <p className="font-medium">{selectedLink.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="capitalize">{selectedLink.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <p>{selectedLink.type === "one-time" ? 
                    `${selectedLink.currency} ${selectedLink.amount.toFixed(2)}` : 
                    'Recurring Payment'
                  }</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p>{new Date(selectedLink.created).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p>{selectedLink.description || "No description provided"}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Payment URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={selectedLink.url}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(selectedLink.url)}
                  >
                    <IconCopy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Payments</Label>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">No payments yet</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                  <p className="text-2xl font-bold">GHS 0.00</p>
                  <p className="text-xs text-muted-foreground">No amount collected</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewLinkModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
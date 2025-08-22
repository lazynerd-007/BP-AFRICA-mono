"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconKey,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconWorldWww,
  IconWebhook,
  IconCopy,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconBook,
  IconExternalLink,
} from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock API Keys
const mockApiKeys = [
  {
    id: "key_1",
    name: "Production API Key",
    key: "sk_prod_2c7f8e9d3b6a5c7f8e9d3b6a5c7f8e9d3b6a5c",
    createdAt: "2023-05-15",
    lastUsed: "2023-11-01",
  },
  {
    id: "key_2",
    name: "Test API Key",
    key: "sk_test_9d3b6a5c7f8e9d3b6a5c7f8e9d3b6a5c7f8e9d3b",
    createdAt: "2023-06-22",
    lastUsed: "2023-10-28",
  },
];

// Mock IP Whitelist
const mockIpWhitelist = [
  {
    id: "ip_1",
    address: "192.168.1.1",
    description: "Office IP",
    createdAt: "2023-05-20",
  },
  {
    id: "ip_2",
    address: "203.0.113.0",
    description: "Development Server",
    createdAt: "2023-07-15",
  },
];

// Mock Webhooks
const mockWebhooks = [
  {
    id: "webhook_1",
    url: "https://example.com/webhook/payments",
    events: ["payment.success", "payment.failed"],
    status: "active",
    createdAt: "2023-06-10",
  },
];

export default function DeveloperPage() {
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnvironment, setNewKeyEnvironment] = useState("");
  const [newIpAddress, setNewIpAddress] = useState("");
  const [newIpDescription, setNewIpDescription] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const toggleKeyVisibility = (keyId: string) => {
    setShowApiKey((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const formatApiKey = (key: string, isVisible: boolean) => {
    if (isVisible) {
      return key;
    }
    return `${key.substring(0, 8)}************************${key.substring(key.length - 4)}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Developer</h1>
        <p className="text-muted-foreground">
          Manage API keys, IP whitelist, and webhooks
        </p>
      </div>

      {/* Documentation Section */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconBook className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-blue-900">API Documentation</CardTitle>
                <CardDescription className="text-blue-700">
                  Complete guide for integrating with BluPay APIs
                </CardDescription>
              </div>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open('https://docs.bluepay.com', '_blank')}
            >
              <IconExternalLink className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-sm">API Reference</p>
                <p className="text-xs text-muted-foreground">Complete endpoint documentation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-sm">Integration Guides</p>
                <p className="text-xs text-muted-foreground">Step-by-step tutorials</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium text-sm">Code Examples</p>
                <p className="text-xs text-muted-foreground">Sample implementations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="api-keys" className="flex items-center gap-1">
            <IconKey className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="ip-whitelist" className="flex items-center gap-1">
            <IconWorldWww className="h-4 w-4" />
            IP Whitelist
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-1">
            <IconWebhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your API keys for authentication
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <IconPlus className="h-4 w-4" />
                      Create New API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Give your API key a name to help you identify it later
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="key-name">API Key Name</Label>
                        <Input
                          id="key-name"
                          placeholder="e.g. Production API Key"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="key-environment">Environment</Label>
                        <Select value={newKeyEnvironment} onValueChange={setNewKeyEnvironment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select environment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="production">Production</SelectItem>
                            <SelectItem value="sandbox">Sandbox</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Create API Key</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">
                          {apiKey.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs max-w-sm truncate flex items-center gap-2">
                          {formatApiKey(apiKey.key, !!showApiKey[apiKey.id])}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="h-6 w-6"
                          >
                            {showApiKey[apiKey.id] ? (
                              <IconEyeOff className="h-4 w-4" />
                            ) : (
                              <IconEye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="h-6 w-6"
                          >
                            {copySuccess && apiKey.key === copySuccess ? (
                              <IconCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <IconCopy className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>{apiKey.createdAt}</TableCell>
                        <TableCell>{apiKey.lastUsed}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <IconRefresh className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IP Whitelist Tab */}
        <TabsContent value="ip-whitelist" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>IP Whitelist</CardTitle>
                  <CardDescription>
                    Restrict API access to specific IP addresses
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <IconPlus className="h-4 w-4" />
                      Add IP Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add IP Address to Whitelist</DialogTitle>
                      <DialogDescription>
                        Add an IP address to restrict API access
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ip-address">IP Address</Label>
                        <Input
                          id="ip-address"
                          placeholder="e.g. 192.168.1.1"
                          value={newIpAddress}
                          onChange={(e) => setNewIpAddress(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="ip-description">Description</Label>
                        <Input
                          id="ip-description"
                          placeholder="e.g. Office IP"
                          value={newIpDescription}
                          onChange={(e) => setNewIpDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Add IP Address</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockIpWhitelist.map((ip) => (
                      <TableRow key={ip.id}>
                        <TableCell className="font-mono">
                          {ip.address}
                        </TableCell>
                        <TableCell>{ip.description}</TableCell>
                        <TableCell>{ip.createdAt}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {mockIpWhitelist.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center"
                        >
                          No IP addresses in whitelist
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>
                    Receive event notifications via webhooks
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <IconPlus className="h-4 w-4" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Webhook</DialogTitle>
                      <DialogDescription>
                        Configure a webhook to receive event notifications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <Input
                          id="webhook-url"
                          placeholder="https://example.com/webhook"
                          value={newWebhookUrl}
                          onChange={(e) => setNewWebhookUrl(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Events to Subscribe</Label>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="cursor-pointer">payment.success</Badge>
                          <Badge className="cursor-pointer" variant="outline">payment.failed</Badge>
                          <Badge className="cursor-pointer" variant="outline">payout.success</Badge>
                          <Badge className="cursor-pointer" variant="outline">payout.failed</Badge>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Webhook</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWebhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell className="font-mono text-xs">
                          {webhook.url}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((event) => (
                              <Badge key={event} variant="secondary" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={webhook.status === "active" ? "secondary" : "outline"}
                          >
                            {webhook.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{webhook.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <IconRefresh className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {mockWebhooks.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center"
                        >
                          No webhooks configured
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
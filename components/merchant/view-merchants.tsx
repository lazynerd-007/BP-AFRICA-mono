"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";
import Link from "next/link";

// Sample merchant data
const merchantData = [
  {
    id: "1",
    name: "Chensha City Ghana Ltd",
    email: "support@chenshacity.com",
    phone: "+233555123456",
    merchantCode: "MCH-001",
  },
  {
    id: "2",
    name: "Timings Ltd",
    email: "contact@timingsltd.com",
    phone: "+233571234567",
    merchantCode: "MCH-002",
  },
  {
    id: "3",
    name: "BluWave Limited",
    email: "info@bluwave.com",
    phone: "+233559876543",
    merchantCode: "MCH-003",
  },
];

export function ViewMerchants() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchants List</CardTitle>
        <CardDescription>
          View and manage merchant accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Merchant code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchantData.map((merchant) => (
              <TableRow key={merchant.id}>
                <TableCell className="font-medium">{merchant.name}</TableCell>
                <TableCell>{merchant.email}</TableCell>
                <TableCell>{merchant.phone}</TableCell>
                <TableCell>{merchant.merchantCode}</TableCell>
                <TableCell>
                  <Link href={`/admin/dashboard/merchant/${merchant.id}`}>
                    <Button variant="ghost" size="icon" title="View Merchant Details">
                      <IconEye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
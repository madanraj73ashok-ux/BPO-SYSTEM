'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchBilling } from '@/lib/api'
import { useBillingStore } from '@/lib/demo-store'
import { BillingInvoice } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

function getPaymentStatusVariant(status: BillingInvoice['paymentStatus']) {
  switch (status) {
    case 'Paid':
      return 'default'
    case 'Overdue':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export default function BillingPage() {
  const { billing, setBilling } = useBillingStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBilling = async () => {
      try {
        const data = await fetchBilling()
        setBilling(data as BillingInvoice[])
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      } finally {
        setIsLoading(false)
      }
    }

    loadBilling()
  }, [setBilling])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">
          Track invoices, payment status, and client billing due dates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices ({billing.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client Company</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Billing Month</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billing.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceId}
                    </TableCell>
                    <TableCell>{invoice.clientCompany}</TableCell>
                    <TableCell>{invoice.serviceType}</TableCell>
                    <TableCell>{invoice.billingMonth}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentStatusVariant(invoice.paymentStatus)}>
                        {invoice.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

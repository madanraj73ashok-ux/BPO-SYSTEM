'use client'

import { useEffect } from 'react'
import {
  CheckCircle,
  PhoneCall,
  PhoneForwarded,
  PhoneMissed,
  UserCheck,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/stat-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchCalls } from '@/lib/api'
import { useCallsStore, useCustomersStore } from '@/lib/demo-store'
import { CallStatus, CustomerCall } from '@/lib/types'

function getCallStatusVariant(status: CallStatus) {
  switch (status) {
    case 'Completed':
      return 'default'
    case 'Missed':
      return 'destructive'
    case 'Callback Required':
    case 'Pending':
      return 'secondary'
    default:
      return 'outline'
  }
}

export default function CustomerPanelPage() {
  const { customers } = useCustomersStore()
  const { calls, setCalls } = useCallsStore()

  useEffect(() => {
    const loadCalls = async () => {
      try {
        const data = await fetchCalls()
        setCalls(data as CustomerCall[])
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      }
    }

    loadCalls()
  }, [setCalls])

  const activeCustomers = customers.filter(
    (customer) => customer.status === 'Active',
  ).length
  const completedCalls = calls.filter((call) => call.status === 'Completed').length
  const missedCalls = calls.filter((call) => call.status === 'Missed').length
  const pendingCallbacks = calls.filter(
    (call) => call.status === 'Callback Required',
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Customer Control Panel
        </h2>
        <p className="text-muted-foreground">
          Customer records and support call overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Customers" value={customers.length} icon={Users} />
        <StatCard
          title="Active Customers"
          value={activeCustomers}
          icon={UserCheck}
          trendUp
        />
        <StatCard title="Total Calls" value={calls.length} icon={PhoneCall} />
        <StatCard
          title="Completed Calls"
          value={completedCalls}
          icon={CheckCircle}
          trendUp
        />
        <StatCard title="Missed Calls" value={missedCalls} icon={PhoneMissed} />
        <StatCard
          title="Pending Callbacks"
          value={pendingCallbacks}
          icon={PhoneForwarded}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Customer Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.slice(0, 5).map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">
                    {call.customerName}
                  </TableCell>
                  <TableCell>{call.phoneNumber}</TableCell>
                  <TableCell>{call.agentName}</TableCell>
                  <TableCell>
                    <Badge variant={getCallStatusVariant(call.status)}>
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{call.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchCalls, updateCallRecord } from '@/lib/api'
import { useCallsStore, useEmployeesStore } from '@/lib/demo-store'
import { CallStatus, CustomerCall } from '@/lib/types'
import { UserPlus } from 'lucide-react'

function getStatusVariant(status: CallStatus) {
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

export default function CallsPage() {
  const { employees } = useEmployeesStore()
  const { calls, setCalls, updateCall } = useCallsStore()
  const [isLoading, setIsLoading] = useState(true)
  const [callToAssign, setCallToAssign] = useState<CustomerCall | null>(null)
  const [selectedAgent, setSelectedAgent] = useState('')

  useEffect(() => {
    const loadCalls = async () => {
      try {
        const data = await fetchCalls()
        setCalls(data as CustomerCall[])
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      } finally {
        setIsLoading(false)
      }
    }

    loadCalls()
  }, [setCalls])

  const handleOpenAssign = (call: CustomerCall) => {
    setCallToAssign(call)
    setSelectedAgent(
      employees.some((employee) => employee.name === call.agentName)
        ? call.agentName
        : '',
    )
  }

  const handleAssignCall = async () => {
    if (!callToAssign || !selectedAgent) return

    const data = { agentName: selectedAgent }
    updateCall(callToAssign.id, data)
    try {
      await updateCallRecord(callToAssign.id, data)
    } catch {
      // The local store already reflects the attempted change.
    }
    setCallToAssign(null)
    setSelectedAgent('')
  }

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
        <h2 className="text-2xl font-bold tracking-tight">Calls</h2>
        <p className="text-muted-foreground">
          Track customer support call records
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Calls ({calls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Call Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.customerName}</TableCell>
                  <TableCell>{call.phoneNumber}</TableCell>
                  <TableCell>{call.agentName}</TableCell>
                  <TableCell>{call.callType}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(call.status)}>
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>{call.time}</TableCell>
                  <TableCell className="max-w-[280px] truncate">
                    {call.notes}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenAssign(call)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!callToAssign} onOpenChange={(open) => !open && setCallToAssign(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Call</DialogTitle>
            <DialogDescription>
              Share this customer call history with an employee.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Call</Label>
              <div className="rounded-md border border-border p-3 text-sm">
                <p className="font-medium">{callToAssign?.customerName}</p>
                <p className="text-muted-foreground">
                  {callToAssign?.phoneNumber} - {callToAssign?.callType}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assigned-agent">Employee</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger id="assigned-agent">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCallToAssign(null)}>
                Cancel
              </Button>
              <Button onClick={handleAssignCall} disabled={!selectedAgent}>
                Share Call
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

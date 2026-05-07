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
import { fetchComplaints } from '@/lib/api'
import { useComplaintsStore } from '@/lib/demo-store'
import { Complaint, ComplaintStatus } from '@/lib/types'

function getComplaintStatusVariant(status: ComplaintStatus) {
  switch (status) {
    case 'Resolved':
    case 'Closed':
      return 'default'
    case 'Escalated':
      return 'destructive'
    case 'In Progress':
      return 'secondary'
    default:
      return 'outline'
  }
}

function getPriorityVariant(priority: Complaint['priority']) {
  switch (priority) {
    case 'Critical':
      return 'destructive'
    case 'High':
      return 'secondary'
    default:
      return 'outline'
  }
}

export default function ComplaintsPage() {
  const { complaints, setComplaints } = useComplaintsStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await fetchComplaints()
        setComplaints(data as Complaint[])
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      } finally {
        setIsLoading(false)
      }
    }

    loadComplaints()
  }, [setComplaints])

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
        <h2 className="text-2xl font-bold tracking-tight">Complaints</h2>
        <p className="text-muted-foreground">
          Manage customer complaints, escalation, and resolution status
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Records ({complaints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complaint ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Complaint Type</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Resolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">
                      {complaint.complaintId}
                    </TableCell>
                    <TableCell>{complaint.customerName}</TableCell>
                    <TableCell>{complaint.complaintType}</TableCell>
                    <TableCell>{complaint.assignedAgent}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(complaint.priority)}>
                        {complaint.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getComplaintStatusVariant(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{complaint.createdDate}</TableCell>
                    <TableCell className="max-w-[320px] truncate">
                      {complaint.resolution}
                    </TableCell>
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

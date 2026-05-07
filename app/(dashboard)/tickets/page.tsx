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
import { fetchTickets } from '@/lib/api'
import { useTicketsStore } from '@/lib/demo-store'
import { CustomerTicket, TicketStatus } from '@/lib/types'

function getTicketStatusVariant(status: TicketStatus) {
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

function getPriorityVariant(priority: CustomerTicket['priority']) {
  switch (priority) {
    case 'Critical':
      return 'destructive'
    case 'High':
      return 'secondary'
    default:
      return 'outline'
  }
}

export default function TicketsPage() {
  const { tickets, setTickets } = useTicketsStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchTickets()
        setTickets(data as CustomerTicket[])
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      } finally {
        setIsLoading(false)
      }
    }

    loadTickets()
  }, [setTickets])

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
        <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
        <p className="text-muted-foreground">
          Track customer issues and support resolutions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Tickets ({tickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Resolution Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">
                      {ticket.ticketId}
                    </TableCell>
                    <TableCell>{ticket.customerName}</TableCell>
                    <TableCell>{ticket.issueType}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.assignedAgent}</TableCell>
                    <TableCell>
                      <Badge variant={getTicketStatusVariant(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.createdDate}</TableCell>
                    <TableCell className="max-w-[320px] truncate">
                      {ticket.resolutionNotes}
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

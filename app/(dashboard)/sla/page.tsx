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
import { fetchSla } from '@/lib/api'
import { useSlaStore } from '@/lib/demo-store'
import { SlaRecord, SlaStatus } from '@/lib/types'

function getSlaStatusVariant(status: SlaStatus) {
  switch (status) {
    case 'Within SLA':
      return 'default'
    case 'SLA Breached':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getRiskVariant(risk: SlaRecord['penaltyRisk']) {
  switch (risk) {
    case 'High':
      return 'destructive'
    case 'Medium':
      return 'secondary'
    default:
      return 'outline'
  }
}

export default function SlaPage() {
  const { slaRecords, setSlaRecords } = useSlaStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSlaRecords = async () => {
      try {
        const data = await fetchSla()
        setSlaRecords(data as SlaRecord[])
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      } finally {
        setIsLoading(false)
      }
    }

    loadSlaRecords()
  }, [setSlaRecords])

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
        <h2 className="text-2xl font-bold tracking-tight">SLA Tracking</h2>
        <p className="text-muted-foreground">
          Monitor client service-level targets and breach risk
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SLA Records ({slaRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SLA ID</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Target Time</TableHead>
                  <TableHead>Actual Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Penalty Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slaRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.slaId}</TableCell>
                    <TableCell>{record.clientName}</TableCell>
                    <TableCell>{record.serviceType}</TableCell>
                    <TableCell>{record.targetTime}</TableCell>
                    <TableCell>{record.actualTime}</TableCell>
                    <TableCell>
                      <Badge variant={getSlaStatusVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRiskVariant(record.penaltyRisk)}>
                        {record.penaltyRisk}
                      </Badge>
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

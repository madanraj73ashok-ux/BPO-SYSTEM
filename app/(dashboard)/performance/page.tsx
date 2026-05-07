'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchPerformance } from '@/lib/api'
import { usePerformanceStore } from '@/lib/demo-store'
import { AgentPerformance } from '@/lib/types'

export default function PerformancePage() {
  const { performance, setPerformance } = usePerformanceStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        const data = await fetchPerformance()
        setPerformance(data as AgentPerformance[])
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      } finally {
        setIsLoading(false)
      }
    }

    loadPerformance()
  }, [setPerformance])

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
        <h2 className="text-2xl font-bold tracking-tight">Performance</h2>
        <p className="text-muted-foreground">
          Agent call handling, ticket resolution, and productivity KPIs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Performance ({performance.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent Name</TableHead>
                  <TableHead className="text-right">Calls Handled</TableHead>
                  <TableHead className="text-right">Tickets Resolved</TableHead>
                  <TableHead>Average Call Time</TableHead>
                  <TableHead className="text-right">Customer Rating</TableHead>
                  <TableHead className="text-right">Productivity Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      {agent.agentName}
                    </TableCell>
                    <TableCell className="text-right">
                      {agent.callsHandled}
                    </TableCell>
                    <TableCell className="text-right">
                      {agent.ticketsResolved}
                    </TableCell>
                    <TableCell>{agent.averageCallTime}</TableCell>
                    <TableCell className="text-right">
                      {agent.customerRating.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      {agent.productivityScore}%
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

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
import { fetchRecruitment } from '@/lib/api'
import { useRecruitmentStore } from '@/lib/demo-store'
import { RecruitmentCandidate } from '@/lib/types'

function getRecruitmentStatusVariant(status: RecruitmentCandidate['status']) {
  switch (status) {
    case 'Selected':
      return 'default'
    case 'Rejected':
      return 'destructive'
    case 'Shortlisted':
    case 'Interview Scheduled':
      return 'secondary'
    default:
      return 'outline'
  }
}

export default function RecruitmentPage() {
  const { recruitment, setRecruitment } = useRecruitmentStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRecruitment = async () => {
      try {
        const data = await fetchRecruitment()
        setRecruitment(data as RecruitmentCandidate[])
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      } finally {
        setIsLoading(false)
      }
    }

    loadRecruitment()
  }, [setRecruitment])

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
        <h2 className="text-2xl font-bold tracking-tight">Recruitment</h2>
        <p className="text-muted-foreground">
          Track candidates, interviews, HR ownership, and hiring status
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidates ({recruitment.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate Name</TableHead>
                  <TableHead>Position Applied</TableHead>
                  <TableHead>Interview Date</TableHead>
                  <TableHead>HR Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recruitment.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">
                      {candidate.candidateName}
                    </TableCell>
                    <TableCell>{candidate.positionApplied}</TableCell>
                    <TableCell>{candidate.interviewDate}</TableCell>
                    <TableCell>{candidate.hrName}</TableCell>
                    <TableCell>
                      <Badge variant={getRecruitmentStatusVariant(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[320px] truncate">
                      {candidate.remarks}
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

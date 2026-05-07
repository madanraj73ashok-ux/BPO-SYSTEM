'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { showErrorToast } from '@/lib/client-errors'
import { Employee } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Mail, Phone, Calendar, Briefcase, GraduationCap, DollarSign } from 'lucide-react'

interface EmployeeProfilePanelProps {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarkAttendance: (employeeId: number, status: 'Present' | 'Absent') => Promise<void>
}

export function EmployeeProfilePanel({
  employee,
  open,
  onOpenChange,
  onMarkAttendance,
}: EmployeeProfilePanelProps) {
  const [attendanceStatus, setAttendanceStatus] = useState<'Present' | 'Absent' | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!employee) return null

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const handleMarkAttendance = async () => {
    if (!attendanceStatus) return
    setIsSubmitting(true)
    try {
      await onMarkAttendance(employee.id, attendanceStatus)
      setAttendanceStatus('')
    } catch (error) {
      showErrorToast('Failed to mark attendance', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Employee Profile</SheetTitle>
          <SheetDescription>
            View employee details and mark attendance
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{employee.name}</h3>
              <Badge variant="secondary" className="mt-1 capitalize">
                {employee.role}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{employee.email}</span>
            </div>
            {employee.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.phone}</span>
              </div>
            )}
            {employee.position && (
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.position}</span>
              </div>
            )}
            {employee.qualification && (
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.qualification}</span>
              </div>
            )}
            {employee.joining_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined: {employee.joining_date}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {formatCurrency(employee.salary)} / year
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Mark Attendance</h4>
            <div className="grid gap-3">
              <Label htmlFor="attendance">Status</Label>
              <Select
                value={attendanceStatus}
                onValueChange={(value: 'Present' | 'Absent') => setAttendanceStatus(value)}
              >
                <SelectTrigger id="attendance">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleMarkAttendance}
                disabled={!attendanceStatus || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { fetchShifts, updateShiftRecord } from '@/lib/api'
import { useEmployeesStore, useShiftsStore } from '@/lib/demo-store'
import { Shift } from '@/lib/types'
import { Pencil } from 'lucide-react'

function getShiftStatusVariant(status: Shift['status']) {
  switch (status) {
    case 'Active':
      return 'default'
    case 'Completed':
      return 'secondary'
    case 'On Hold':
      return 'destructive'
    default:
      return 'outline'
  }
}

export default function ShiftsPage() {
  const { employees } = useEmployeesStore()
  const { shifts, setShifts, updateShift } = useShiftsStore()
  const [isLoading, setIsLoading] = useState(true)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [shiftForm, setShiftForm] = useState<{
    assignedEmployees: string[]
    shiftSupervisor: string
    status: Shift['status']
  }>({
    assignedEmployees: [],
    shiftSupervisor: '',
    status: 'Scheduled',
  })

  useEffect(() => {
    const loadShifts = async () => {
      try {
        const data = await fetchShifts()
        setShifts(data as Shift[])
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      } finally {
        setIsLoading(false)
      }
    }

    loadShifts()
  }, [setShifts])

  const handleOpenEditor = (shift: Shift) => {
    setEditingShift(shift)
    setShiftForm({
      assignedEmployees: shift.assignedEmployees,
      shiftSupervisor: shift.shiftSupervisor,
      status: shift.status,
    })
  }

  const handleToggleEmployee = (employeeName: string, checked: boolean) => {
    setShiftForm((current) => ({
      ...current,
      assignedEmployees: checked
        ? Array.from(new Set([...current.assignedEmployees, employeeName]))
        : current.assignedEmployees.filter((employee) => employee !== employeeName),
    }))
  }

  const handleSaveShift = async () => {
    if (!editingShift) return

    const data = {
      assignedEmployees: shiftForm.assignedEmployees,
      shiftSupervisor: shiftForm.shiftSupervisor,
      status: shiftForm.status,
    }

    updateShift(editingShift.id, data)
    try {
      await updateShiftRecord(editingShift.id, data)
    } catch {
      // The local store already reflects the attempted change.
    }
    setEditingShift(null)
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
        <h2 className="text-2xl font-bold tracking-tight">Shifts</h2>
        <p className="text-muted-foreground">
          Manage BPO shift coverage and supervisors
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shift Schedule ({shifts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift Name</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Assigned Employees</TableHead>
                  <TableHead>Shift Supervisor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">
                      {shift.shiftName}
                    </TableCell>
                    <TableCell>{shift.startTime}</TableCell>
                    <TableCell>{shift.endTime}</TableCell>
                    <TableCell className="max-w-[360px]">
                      {shift.assignedEmployees.join(', ')}
                    </TableCell>
                    <TableCell>{shift.shiftSupervisor}</TableCell>
                    <TableCell>
                      <Badge variant={getShiftStatusVariant(shift.status)}>
                        {shift.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditor(shift)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingShift} onOpenChange={(open) => !open && setEditingShift(null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
            <DialogDescription>
              Update employees, supervisor, and status for {editingShift?.shiftName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Assigned Employees</Label>
              <div className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-2">
                {employees.map((employee) => (
                  <label
                    key={employee.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={shiftForm.assignedEmployees.includes(employee.name)}
                      onCheckedChange={(checked) =>
                        handleToggleEmployee(employee.name, checked === true)
                      }
                    />
                    {employee.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shift-supervisor">Shift Supervisor</Label>
                <Select
                  value={shiftForm.shiftSupervisor}
                  onValueChange={(value) =>
                    setShiftForm({ ...shiftForm, shiftSupervisor: value })
                  }
                >
                  <SelectTrigger id="shift-supervisor">
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift-status">Status</Label>
                <Select
                  value={shiftForm.status}
                  onValueChange={(value) =>
                    setShiftForm({
                      ...shiftForm,
                      status: value as Shift['status'],
                    })
                  }
                >
                  <SelectTrigger id="shift-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditingShift(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveShift}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

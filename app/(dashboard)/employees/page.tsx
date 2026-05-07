'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { EmployeeForm } from '@/components/employee-form'
import { EmployeeProfilePanel } from '@/components/employee-profile-panel'
import { showErrorToast } from '@/lib/client-errors'
import { Employee } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { updateCallRecord, updateShiftRecord } from '@/lib/api'
import {
  useAttendanceStore,
  useCallsStore,
  useEmployeesStore,
  usePerformanceStore,
  useShiftsStore,
  useTasksStore,
} from '@/lib/demo-store'
import { Eye, Pencil, Trash2 } from 'lucide-react'

export default function EmployeesPage() {
  const { employees, addEmployee, deleteEmployee } = useEmployeesStore()
  const { addAttendance, removeAttendanceForEmployee } = useAttendanceStore()
  const { removeTasksForEmployee } = useTasksStore()
  const { shifts, removeEmployeeFromShiftAssignments } = useShiftsStore()
  const { calls, unassignCallsForEmployee } = useCallsStore()
  const { removePerformanceForEmployee } = usePerformanceStore()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)

  const handleAddEmployee = async (data: Parameters<typeof import('@/lib/api').addEmployee>[0]) => {
    await addEmployee(data)
  }

  const handleDeleteEmployee = async (employee: Employee) => {
    const updatedShifts = shifts
      .filter(
        (shift) =>
          shift.assignedEmployees.includes(employee.name) ||
          shift.shiftSupervisor === employee.name,
      )
      .map((shift) => {
        const assignedEmployees = shift.assignedEmployees.filter(
          (assignedEmployee) => assignedEmployee !== employee.name,
        )

        return {
          ...shift,
          assignedEmployees,
          shiftSupervisor:
            shift.shiftSupervisor === employee.name
              ? assignedEmployees[0] ?? 'Unassigned'
              : shift.shiftSupervisor,
        }
      })

    try {
      await deleteEmployee(employee.id)
      removeAttendanceForEmployee(employee.id)
      removeTasksForEmployee(employee.id)
      removeEmployeeFromShiftAssignments(employee.name)
      unassignCallsForEmployee(employee.name)
      removePerformanceForEmployee(employee.name)
    } catch (error) {
      showErrorToast('Failed to delete employee', error)
      return
    }

    if (selectedEmployee?.id === employee.id) {
      setSelectedEmployee(null)
      setProfileOpen(false)
    }

    setEmployeeToDelete(null)

    try {
      await Promise.all([
        ...calls
          .filter((call) => call.agentName === employee.name)
          .map((call) => updateCallRecord(call.id, { agentName: 'Unassigned' })),
        ...updatedShifts.map((shift) => updateShiftRecord(shift.id, shift)),
      ])
    } catch {
      // The local store already reflects the attempted cleanup.
    }
  }

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setProfileOpen(true)
  }

  const handleMarkAttendance = async (employeeId: number, status: 'Present' | 'Absent') => {
    const employee = employees.find((item) => item.id === employeeId)
    if (employee) {
      try {
        await addAttendance(employee, status)
      } catch (error) {
        showErrorToast('Failed to mark attendance', error)
      }
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'manager':
        return 'secondary'
      case 'hr':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">
            Manage your employee records
          </p>
        </div>
        <EmployeeForm onSubmit={handleAddEmployee} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Employees ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(employee.role)} className="capitalize">
                      {employee.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(employee.salary)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewEmployee(employee)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setEmployeeToDelete(employee)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EmployeeProfilePanel
        employee={selectedEmployee}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        onMarkAttendance={handleMarkAttendance}
      />

      <AlertDialog
        open={!!employeeToDelete}
        onOpenChange={(open) => {
          if (!open) setEmployeeToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {employeeToDelete?.name ?? 'this employee'}? This will also remove their attendance and task records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (employeeToDelete) handleDeleteEmployee(employeeToDelete)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

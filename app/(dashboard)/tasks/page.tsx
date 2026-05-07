'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, CheckCircle, Clock, RefreshCcw } from 'lucide-react'
import { showErrorToast } from '@/lib/client-errors'
import { useEmployeesStore, useTasksStore } from '@/lib/demo-store'

export default function TasksPage() {
  const { employees } = useEmployeesStore()
  const { tasks, addTask, toggleTaskStatus } = useTasksStore()
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [taskDescription, setTaskDescription] = useState('')

  const handleAssignTask = async () => {
    if (!selectedEmployee || !taskDescription) return
    
    const employee = employees.find(e => e.id === Number(selectedEmployee))
    if (!employee) return

    try {
      await addTask(employee, taskDescription)
      setSelectedEmployee('')
      setTaskDescription('')
      setAssignOpen(false)
    } catch (error) {
      showErrorToast('Failed to assign task', error)
    }
  }

  const handleUpdateStatus = async (taskId: number) => {
    try {
      await toggleTaskStatus(taskId)
    } catch (error) {
      showErrorToast('Failed to update task', error)
    }
  }

  const pendingCount = tasks.filter(t => t.status === 'Pending').length
  const completedCount = tasks.filter(t => t.status === 'Completed').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">
            Assign and manage employee tasks
          </p>
        </div>
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Assign Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign New Task</DialogTitle>
              <DialogDescription>
                Assign a task to an employee.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-employee">Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger id="task-employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-desc">Task Description</Label>
                <Input
                  id="task-desc"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAssignOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignTask} disabled={!selectedEmployee || !taskDescription}>
                  Assign Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-lg font-bold text-primary">#</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>{task.employee_name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{task.task}</TableCell>
                  <TableCell>
                    <Badge
                      variant={task.status === 'Completed' ? 'default' : 'secondary'}
                      className={task.status === 'Completed' ? 'bg-success text-success-foreground hover:bg-success/90' : 'bg-warning/20 text-warning hover:bg-warning/30'}
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(task.id)}
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Toggle Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

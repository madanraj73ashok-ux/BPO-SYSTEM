'use client'

import * as React from 'react'
import {
  addEmployee as createEmployee,
  createClient,
  createCustomer,
  deleteClientRecord,
  deleteCustomerRecord,
  deleteEmployee as removeEmployee,
  fetchAttendance,
  fetchBilling,
  fetchCalls,
  fetchClients,
  fetchComplaints,
  fetchCustomers,
  fetchEmployees,
  fetchPerformance,
  fetchRecruitment,
  fetchShifts,
  fetchSla,
  fetchTasks,
  fetchTickets,
  markAttendance,
  updateCallRecord,
  updateClientRecord,
  updateCustomerRecord,
  updateShiftRecord,
  updateTask,
  assignTask,
} from '@/lib/api'
import type {
  AgentPerformance,
  Attendance,
  BillingInvoice,
  Client,
  Complaint,
  Customer,
  CustomerCall,
  CustomerTicket,
  Employee,
  RecruitmentCandidate,
  Shift,
  SlaRecord,
  Task,
} from '@/lib/types'

type NewEmployee = Omit<Employee, 'id'>
type NewCustomer = Omit<Customer, 'id'>
type NewClient = Omit<Client, 'id'>

function useApiCollection<T>(loader: () => Promise<T[]>) {
  const [items, setItems] = React.useState<T[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setItems(await loader())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Failed to load records')
    } finally {
      setLoading(false)
    }
  }, [loader])

  React.useEffect(() => {
    queueMicrotask(() => {
      void refresh()
    })
  }, [refresh])

  return { items, setItems, loading, error, refresh }
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

export function useEmployeesStore() {
  const {
    items: employees,
    setItems: setEmployees,
    loading,
    error,
    refresh,
  } = useApiCollection<Employee>(fetchEmployees)

  const addEmployee = React.useCallback(
    async (data: NewEmployee) => {
      const employee = await createEmployee(data)
      setEmployees((current) => [...current, employee])
    },
    [setEmployees],
  )

  const deleteEmployee = React.useCallback(
    async (id: number) => {
      await removeEmployee(id)
      setEmployees((current) => current.filter((employee) => employee.id !== id))
    },
    [setEmployees],
  )

  return { employees, setEmployees, addEmployee, deleteEmployee, loading, error, refresh }
}

export function useCustomersStore() {
  const {
    items: customers,
    setItems: setCustomers,
    loading,
    error,
    refresh,
  } = useApiCollection<Customer>(fetchCustomers)

  const addCustomer = React.useCallback(
    async (data: NewCustomer) => {
      const customer = await createCustomer(data)
      setCustomers((current) => [...current, customer])
    },
    [setCustomers],
  )

  const deleteCustomer = React.useCallback(
    async (id: number) => {
      await deleteCustomerRecord(id)
      setCustomers((current) => current.filter((customer) => customer.id !== id))
    },
    [setCustomers],
  )

  const updateCustomer = React.useCallback(
    async (id: number, data: Partial<Customer>) => {
      const customer = await updateCustomerRecord(id, data)
      setCustomers((current) =>
        current.map((item) => (item.id === id ? customer : item)),
      )
    },
    [setCustomers],
  )

  return {
    customers,
    setCustomers,
    addCustomer,
    deleteCustomer,
    updateCustomer,
    loading,
    error,
    refresh,
  }
}

export function useAttendanceStore() {
  const {
    items: attendance,
    setItems: setAttendance,
    loading,
    error,
    refresh,
  } = useApiCollection<Attendance>(fetchAttendance)

  const addAttendance = React.useCallback(
    async (employee: Pick<Employee, 'id' | 'name'>, status: Attendance['status']) => {
      const record = await markAttendance({ employee_id: employee.id, status }) as Attendance
      setAttendance((current) => {
        const exists = current.some(
          (item) => item.employee_id === employee.id && item.date === record.date,
        )

        if (exists) {
          return current.map((item) => (item.id === record.id ? record : item))
        }

        return [record, ...current]
      })
    },
    [setAttendance],
  )

  const removeAttendanceForEmployee = React.useCallback(
    (employeeId: number) => {
      setAttendance((current) =>
        current.filter((record) => record.employee_id !== employeeId),
      )
    },
    [setAttendance],
  )

  return {
    attendance,
    setAttendance,
    addAttendance,
    removeAttendanceForEmployee,
    loading,
    error,
    refresh,
  }
}

export function useTasksStore() {
  const {
    items: tasks,
    setItems: setTasks,
    loading,
    error,
    refresh,
  } = useApiCollection<Task>(fetchTasks)

  const addTask = React.useCallback(
    async (employee: Pick<Employee, 'id' | 'name'>, task: string) => {
      const created = await assignTask({
        employee_id: employee.id,
        employee_name: employee.name,
        task,
      })
      setTasks((current) => [created, ...current])
    },
    [setTasks],
  )

  const toggleTaskStatus = React.useCallback(
    async (taskId: number) => {
      const task = tasks.find((item) => item.id === taskId)
      if (!task) return

      const status = task.status === 'Pending' ? 'Completed' : 'Pending'
      const updated = await updateTask({ task_id: taskId, status })
      setTasks((current) =>
        current.map((item) => (item.id === taskId ? updated : item)),
      )
    },
    [setTasks, tasks],
  )

  const removeTasksForEmployee = React.useCallback(
    (employeeId: number) => {
      setTasks((current) => current.filter((task) => task.employee_id !== employeeId))
    },
    [setTasks],
  )

  return {
    tasks,
    setTasks,
    addTask,
    toggleTaskStatus,
    removeTasksForEmployee,
    loading,
    error,
    refresh,
  }
}

export function useCallsStore() {
  const {
    items: calls,
    setItems: setCalls,
    loading,
    error,
    refresh,
  } = useApiCollection<CustomerCall>(fetchCalls)

  const updateCall = React.useCallback(
    async (id: number, data: Partial<CustomerCall>) => {
      const call = await updateCallRecord(id, data)
      setCalls((current) => current.map((item) => (item.id === id ? call : item)))
    },
    [setCalls],
  )

  const unassignCallsForEmployee = React.useCallback(
    (employeeName: string) => {
      setCalls((current) =>
        current.map((call) =>
          call.agentName === employeeName ? { ...call, agentName: 'Unassigned' } : call,
        ),
      )
    },
    [setCalls],
  )

  return { calls, setCalls, updateCall, unassignCallsForEmployee, loading, error, refresh }
}

export function useClientsStore() {
  const {
    items: clients,
    setItems: setClients,
    loading,
    error,
    refresh,
  } = useApiCollection<Client>(fetchClients)

  const addClient = React.useCallback(
    async (data: NewClient) => {
      const client = await createClient(data)
      setClients((current) => [...current, client])
    },
    [setClients],
  )

  const deleteClient = React.useCallback(
    async (id: number) => {
      await deleteClientRecord(id)
      setClients((current) => current.filter((client) => client.id !== id))
    },
    [setClients],
  )

  const updateClient = React.useCallback(
    async (id: number, data: Partial<Client>) => {
      const client = await updateClientRecord(id, data)
      setClients((current) => current.map((item) => (item.id === id ? client : item)))
    },
    [setClients],
  )

  return {
    clients,
    setClients,
    addClient,
    deleteClient,
    updateClient,
    loading,
    error,
    refresh,
  }
}

export function useTicketsStore() {
  const {
    items: tickets,
    setItems: setTickets,
    loading,
    error,
    refresh,
  } = useApiCollection<CustomerTicket>(fetchTickets)

  return { tickets, setTickets, loading, error, refresh }
}

export function useShiftsStore() {
  const {
    items: shifts,
    setItems: setShifts,
    loading,
    error,
    refresh,
  } = useApiCollection<Shift>(fetchShifts)

  const updateShift = React.useCallback(
    async (id: number, data: Partial<Shift>) => {
      const shift = await updateShiftRecord(id, data)
      setShifts((current) => current.map((item) => (item.id === id ? shift : item)))
    },
    [setShifts],
  )

  const removeEmployeeFromShiftAssignments = React.useCallback(
    (employeeName: string) => {
      setShifts((current) =>
        current.map((shift) => {
          const assignedEmployees = shift.assignedEmployees.filter(
            (employee) => employee !== employeeName,
          )

          return {
            ...shift,
            assignedEmployees,
            shiftSupervisor:
              shift.shiftSupervisor === employeeName
                ? assignedEmployees[0] ?? 'Unassigned'
                : shift.shiftSupervisor,
          }
        }),
      )
    },
    [setShifts],
  )

  return {
    shifts,
    setShifts,
    updateShift,
    removeEmployeeFromShiftAssignments,
    loading,
    error,
    refresh,
  }
}

export function usePerformanceStore() {
  const {
    items: performance,
    setItems: setPerformance,
    loading,
    error,
    refresh,
  } = useApiCollection<AgentPerformance>(fetchPerformance)

  const removePerformanceForEmployee = React.useCallback(
    (employeeName: string) => {
      setPerformance((current) =>
        current.filter((agent) => agent.agentName !== employeeName),
      )
    },
    [setPerformance],
  )

  return {
    performance,
    setPerformance,
    removePerformanceForEmployee,
    loading,
    error,
    refresh,
  }
}

export function useSlaStore() {
  const {
    items: slaRecords,
    setItems: setSlaRecords,
    loading,
    error,
    refresh,
  } = useApiCollection<SlaRecord>(fetchSla)

  return { slaRecords, setSlaRecords, loading, error, refresh }
}

export function useComplaintsStore() {
  const {
    items: complaints,
    setItems: setComplaints,
    loading,
    error,
    refresh,
  } = useApiCollection<Complaint>(fetchComplaints)

  return { complaints, setComplaints, loading, error, refresh }
}

export function useBillingStore() {
  const {
    items: billing,
    setItems: setBilling,
    loading,
    error,
    refresh,
  } = useApiCollection<BillingInvoice>(fetchBilling)

  return { billing, setBilling, loading, error, refresh }
}

export function useRecruitmentStore() {
  const {
    items: recruitment,
    setItems: setRecruitment,
    loading,
    error,
    refresh,
  } = useApiCollection<RecruitmentCandidate>(fetchRecruitment)

  return { recruitment, setRecruitment, loading, error, refresh }
}

export { getTodayDate }

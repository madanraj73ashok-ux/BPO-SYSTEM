import type {
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
  AgentPerformance,
} from '@/lib/types'

const API_BASE_URL = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    let message = 'Request failed'

    try {
      const body = await res.json()
      message = body.error || message
    } catch {
      message = res.statusText || message
    }

    throw new Error(message)
  }

  return res.json()
}

export const fetchDashboardData = () => request('/dashboard-data')

export const fetchEmployees = () => request<Employee[]>('/employees')
export const fetchAgents = () => request<Employee[]>('/agents')
export const fetchCustomers = () => request<Customer[]>('/customers')
export const fetchAttendance = () => request<Attendance[]>('/attendance')

export function addEmployee(data: Omit<Employee, 'id'>) {
  return request<Employee>('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteEmployee(id: number) {
  return request<{ success: true }>(`/employees/${id}`, { method: 'DELETE' })
}

export function markAttendance(data: {
  employee_id: number
  status: 'Present' | 'Absent'
}) {
  return request('/mark-attendance', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const fetchTasks = () => request<Task[]>('/tasks')
export const fetchCalls = () => request<CustomerCall[]>('/calls')
export const fetchClients = () => request<Client[]>('/clients')
export const fetchTickets = () => request<CustomerTicket[]>('/tickets')
export const fetchShifts = () => request<Shift[]>('/shifts')
export const fetchPerformance = () => request<AgentPerformance[]>('/performance')
export const fetchSla = () => request<SlaRecord[]>('/sla')
export const fetchComplaints = () => request<Complaint[]>('/complaints')
export const fetchBilling = () => request<BillingInvoice[]>('/billing')
export const fetchRecruitment = () => request<RecruitmentCandidate[]>('/recruitment')

export function createCustomer(data: Omit<Customer, 'id'>) {
  return request<Customer>('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateCustomerRecord(id: number, data: Partial<Customer>) {
  return request<Customer>(`/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteCustomerRecord(id: number) {
  return request<{ success: true }>(`/customers/${id}`, { method: 'DELETE' })
}

export function createClient(data: Omit<Client, 'id'>) {
  return request<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateClientRecord(id: number, data: Partial<Client>) {
  return request<Client>(`/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteClientRecord(id: number) {
  return request<{ success: true }>(`/clients/${id}`, { method: 'DELETE' })
}

export function updateCallRecord(id: number, data: Partial<CustomerCall>) {
  return request<CustomerCall>(`/calls/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function updateShiftRecord(id: number, data: Partial<Shift>) {
  return request<Shift>(`/shifts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function assignTask(data: {
  employee_id: number
  employee_name?: string
  task: string
}) {
  return request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateTask(data: {
  task_id: number
  status: 'Pending' | 'Completed'
}) {
  return request<Task>(`/tasks/${data.task_id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: data.status }),
  })
}

export function login(data: { username: string; password: string }) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function register(data: {
  fullname: string
  username: string
  email: string
  role: string
  password: string
}) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

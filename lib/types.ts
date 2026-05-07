export interface Employee {
  id: number
  name: string
  email: string
  role: string
  salary: number
  qualification?: string
  position?: string
  phone?: string
  joining_date?: string
}

export interface Task {
  id: number
  employee_id: number
  employee_name?: string
  task: string
  status: 'Pending' | 'Completed'
}

export interface Attendance {
  id: number
  employee_id: number
  employee_name?: string
  date: string
  status: 'Present' | 'Absent'
}

export interface DashboardData {
  totalEmployees: number
  totalAttendance: number
  pendingTasks: number
  totalSalary: number
  salaryByEmployee: { name: string; salary: number }[]
  attendanceStats: { present: number; absent: number }
  employeeGrowth: { month: string; count: number }[]
}

export type CallStatus =
  | 'Incoming'
  | 'Outgoing'
  | 'Missed'
  | 'Completed'
  | 'Pending'
  | 'Callback Required'

export interface CustomerCall {
  id: number
  customerName: string
  phoneNumber: string
  agentName: string
  callType: string
  status: CallStatus
  duration: string
  time: string
  notes: string
}

export interface Client {
  id: number
  clientCompany: string
  serviceType: string
  contactPerson: string
  contractStatus: 'Active' | 'Pending' | 'Expired' | 'On Hold'
  monthlyBilling: number
  assignedTeam: string
}

export interface Customer {
  id: number
  name: string
  email: string
  phoneNumber: string
  address: string
  city: string
  status: 'Active' | 'Inactive' | 'Pending'
  registrationDate: string
}

export type TicketStatus =
  | 'Open'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  | 'Escalated'

export interface CustomerTicket {
  id: number
  ticketId: string
  customerName: string
  issueType: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  assignedAgent: string
  status: TicketStatus
  createdDate: string
  resolutionNotes: string
}

export interface Shift {
  id: number
  shiftName: string
  startTime: string
  endTime: string
  assignedEmployees: string[]
  shiftSupervisor: string
  status: 'Active' | 'Scheduled' | 'Completed' | 'On Hold'
}

export interface AgentPerformance {
  id: number
  agentName: string
  callsHandled: number
  ticketsResolved: number
  averageCallTime: string
  customerRating: number
  productivityScore: number
}

export type SlaStatus = 'Within SLA' | 'SLA Breached' | 'At Risk'

export interface SlaRecord {
  id: number
  slaId: string
  clientName: string
  serviceType: string
  targetTime: string
  actualTime: string
  status: SlaStatus
  penaltyRisk: 'Low' | 'Medium' | 'High'
}

export type ComplaintStatus =
  | 'Open'
  | 'In Progress'
  | 'Resolved'
  | 'Escalated'
  | 'Closed'

export interface Complaint {
  id: number
  complaintId: string
  customerName: string
  complaintType: string
  assignedAgent: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  status: ComplaintStatus
  createdDate: string
  resolution: string
}

export interface BillingInvoice {
  id: number
  invoiceId: string
  clientCompany: string
  serviceType: string
  billingMonth: string
  amount: number
  paymentStatus: 'Paid' | 'Pending' | 'Overdue'
  dueDate: string
}

export interface RecruitmentCandidate {
  id: number
  candidateName: string
  positionApplied: string
  interviewDate: string
  hrName: string
  status:
    | 'Applied'
    | 'Shortlisted'
    | 'Interview Scheduled'
    | 'Selected'
    | 'Rejected'
  remarks: string
}

export interface User {
  id: number
  fullname: string
  username: string
  email: string
  role: 'admin' | 'hr' | 'employee'
}

'use client'

import { useEffect } from 'react'
import {
  Users,
  ClipboardCheck,
  ListTodo,
  DollarSign,
  PhoneCall,
  Building,
  PhoneForwarded,
  CheckCircle,
  Ticket,
  CalendarClock,
  Trophy,
  ShieldAlert,
  MessageSquareWarning,
  ReceiptText,
  UserPlus,
} from 'lucide-react'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SalaryChart } from '@/components/charts/salary-chart'
import { AttendanceChart } from '@/components/charts/attendance-chart'
import { GrowthChart } from '@/components/charts/growth-chart'
import { DashboardData } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import {
  fetchCalls,
  fetchBilling,
  fetchComplaints,
  fetchClients,
  fetchPerformance,
  fetchRecruitment,
  fetchShifts,
  fetchSla,
  fetchTickets,
} from '@/lib/api'
import {
  useAttendanceStore,
  useBillingStore,
  useCallsStore,
  useComplaintsStore,
  useClientsStore,
  useEmployeesStore,
  usePerformanceStore,
  useRecruitmentStore,
  useShiftsStore,
  useSlaStore,
  useTasksStore,
  useTicketsStore,
} from '@/lib/demo-store'

export default function DashboardPage() {
  const { employees } = useEmployeesStore()
  const { attendance } = useAttendanceStore()
  const { tasks } = useTasksStore()
  const { calls, setCalls } = useCallsStore()
  const { clients, setClients } = useClientsStore()
  const { tickets, setTickets } = useTicketsStore()
  const { shifts, setShifts } = useShiftsStore()
  const { performance: performanceRows, setPerformance } =
    usePerformanceStore()
  const { slaRecords, setSlaRecords } = useSlaStore()
  const { complaints, setComplaints } = useComplaintsStore()
  const { billing, setBilling } = useBillingStore()
  const { recruitment, setRecruitment } = useRecruitmentStore()

  useEffect(() => {
    const loadBpoData = async () => {
      try {
        const [
          callsData,
          clientsData,
          ticketsData,
          shiftsData,
          performanceData,
          slaData,
          complaintsData,
          billingData,
          recruitmentData,
        ] = await Promise.all([
          fetchCalls(),
          fetchClients(),
          fetchTickets(),
          fetchShifts(),
          fetchPerformance(),
          fetchSla(),
          fetchComplaints(),
          fetchBilling(),
          fetchRecruitment(),
        ])
        setCalls(callsData)
        setClients(clientsData)
        setTickets(ticketsData)
        setShifts(shiftsData)
        setPerformance(performanceData)
        setSlaRecords(slaData)
        setComplaints(complaintsData)
        setBilling(billingData)
        setRecruitment(recruitmentData)
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      }
    }

    loadBpoData()
  }, [
    setBilling,
    setCalls,
    setClients,
    setComplaints,
    setPerformance,
    setRecruitment,
    setShifts,
    setSlaRecords,
    setTickets,
  ])

  const present = attendance.filter((record) => record.status === 'Present').length
  const absent = attendance.filter((record) => record.status === 'Absent').length

  const data: DashboardData = {
    totalEmployees: employees.length,
    totalAttendance: attendance.length,
    pendingTasks: tasks.filter((task) => task.status === 'Pending').length,
    totalSalary: employees.reduce((total, employee) => total + employee.salary, 0),
    salaryByEmployee: employees.map((employee) => ({
      name: employee.name,
      salary: employee.salary,
    })),
    attendanceStats: { present, absent },
    employeeGrowth: [
      { month: 'Jan', count: Math.max(employees.length - 5, 0) },
      { month: 'Feb', count: Math.max(employees.length - 4, 0) },
      { month: 'Mar', count: Math.max(employees.length - 3, 0) },
      { month: 'Apr', count: Math.max(employees.length - 2, 0) },
      { month: 'May', count: Math.max(employees.length - 1, 0) },
      { month: 'Jun', count: employees.length },
    ],
  }
  const topPerformer = performanceRows.reduce(
    (best, agent) =>
      !best || agent.productivityScore > best.productivityScore ? agent : best,
    null as (typeof performanceRows)[number] | null,
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your BPO employee management system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={data.totalEmployees}
          icon={Users}
          trend="+12% from last month"
          trendUp
        />
        <StatCard
          title="Total Attendance"
          value={data.totalAttendance}
          icon={ClipboardCheck}
          trend="91% attendance rate"
          trendUp
        />
        <StatCard
          title="Pending Tasks"
          value={data.pendingTasks}
          icon={ListTodo}
          trend="-5 from yesterday"
          trendUp
        />
        <StatCard
          title="Total Salary"
          value={formatCurrency(data.totalSalary)}
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Calls" value={calls.length} icon={PhoneCall} />
        <StatCard
          title="Active Clients"
          value={clients.filter((client) => client.contractStatus === 'Active').length}
          icon={Building}
          trendUp
        />
        <StatCard
          title="Pending Callbacks"
          value={calls.filter((call) => call.status === 'Callback Required').length}
          icon={PhoneForwarded}
        />
        <StatCard
          title="Completed Calls"
          value={calls.filter((call) => call.status === 'Completed').length}
          icon={CheckCircle}
          trendUp
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tickets" value={tickets.length} icon={Ticket} />
        <StatCard
          title="Resolved Tickets"
          value={tickets.filter((ticket) => ticket.status === 'Resolved').length}
          icon={CheckCircle}
          trendUp
        />
        <StatCard
          title="Active Shifts"
          value={shifts.filter((shift) => shift.status === 'Active').length}
          icon={CalendarClock}
          trendUp
        />
        <StatCard
          title="Top Performer"
          value={topPerformer?.agentName ?? 'N/A'}
          icon={Trophy}
          trend={topPerformer ? `${topPerformer.productivityScore}% score` : undefined}
          trendUp
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="SLA Breached"
          value={slaRecords.filter((record) => record.status === 'SLA Breached').length}
          icon={ShieldAlert}
        />
        <StatCard
          title="Open Complaints"
          value={complaints.filter((complaint) => complaint.status === 'Open').length}
          icon={MessageSquareWarning}
        />
        <StatCard
          title="Pending Invoices"
          value={billing.filter((invoice) => invoice.paymentStatus === 'Pending').length}
          icon={ReceiptText}
        />
        <StatCard
          title="Candidates Shortlisted"
          value={recruitment.filter((candidate) => candidate.status === 'Shortlisted').length}
          icon={UserPlus}
          trendUp
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Salary by Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <SalaryChart data={data.salaryByEmployee} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceChart data={data.attendanceStats} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <GrowthChart data={data.employeeGrowth} />
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import {
  Building,
  CheckCircle,
  ClipboardCheck,
  ListTodo,
  PhoneCall,
  PhoneMissed,
} from 'lucide-react'
import { StatCard } from '@/components/stat-card'
import { fetchCalls, fetchClients } from '@/lib/api'
import {
  useAttendanceStore,
  useCallsStore,
  useClientsStore,
  useTasksStore,
} from '@/lib/demo-store'

export default function ReportsPage() {
  const { calls, setCalls } = useCallsStore()
  const { clients, setClients } = useClientsStore()
  const { tasks } = useTasksStore()
  const { attendance } = useAttendanceStore()

  useEffect(() => {
    const loadBpoData = async () => {
      try {
        const [callsData, clientsData] = await Promise.all([
          fetchCalls(),
          fetchClients(),
        ])
        setCalls(callsData)
        setClients(clientsData)
      } catch {
        // Keep the existing screen usable while the API error is shown elsewhere.
      }
    }

    loadBpoData()
  }, [setCalls, setClients])

  const completedCalls = calls.filter((call) => call.status === 'Completed').length
  const missedCalls = calls.filter((call) => call.status === 'Missed').length
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length
  const presentCount = attendance.filter((record) => record.status === 'Present').length
  const attendancePercentage = attendance.length
    ? `${((presentCount / attendance.length) * 100).toFixed(1)}%`
    : '0.0%'
  const activeClients = clients.filter(
    (client) => client.contractStatus === 'Active',
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          BPO operations summary across calls, tasks, attendance, and clients
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Calls" value={calls.length} icon={PhoneCall} />
        <StatCard
          title="Completed Calls"
          value={completedCalls}
          icon={CheckCircle}
          trendUp
        />
        <StatCard
          title="Missed Calls"
          value={missedCalls}
          icon={PhoneMissed}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={ListTodo}
        />
        <StatCard
          title="Attendance Percentage"
          value={attendancePercentage}
          icon={ClipboardCheck}
          trendUp
        />
        <StatCard
          title="Active Clients"
          value={activeClients}
          icon={Building}
          trendUp
        />
      </div>
    </div>
  )
}

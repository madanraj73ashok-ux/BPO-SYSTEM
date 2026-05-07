import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('Set MONGODB_URI before running npm run db:seed')
}

const seedData = {
  employees: [
    { id: 1, name: 'John Doe', email: 'john@bpo.com', role: 'team_lead', salary: 75000, position: 'Senior Developer', qualification: 'B.Tech', phone: '+1 234 567 8901', joining_date: '2023-01-15' },
    { id: 2, name: 'Sarah Miller', email: 'sarah@bpo.com', role: 'employee', salary: 55000, position: 'Frontend Developer', qualification: 'MCA', phone: '+1 234 567 8902', joining_date: '2023-03-20' },
    { id: 3, name: 'Mike Ross', email: 'mike@bpo.com', role: 'manager', salary: 95000, position: 'Project Manager', qualification: 'MBA', phone: '+1 234 567 8903', joining_date: '2022-06-10' },
    { id: 4, name: 'Emily Watson', email: 'emily@bpo.com', role: 'hr', salary: 65000, position: 'HR Specialist', qualification: 'BBA', phone: '+1 234 567 8904', joining_date: '2023-05-01' },
    { id: 5, name: 'David Kim', email: 'david@bpo.com', role: 'employee', salary: 52000, position: 'Backend Developer', qualification: 'B.Sc', phone: '+1 234 567 8905', joining_date: '2023-08-15' },
    { id: 6, name: 'Lisa Park', email: 'lisa@bpo.com', role: 'team_lead', salary: 78000, position: 'QA Lead', qualification: 'M.Tech', phone: '+1 234 567 8906', joining_date: '2022-11-30' },
  ],
  attendance: [
    { id: 1, employee_id: 1, employee_name: 'John Doe', date: '2024-01-15', status: 'Present' },
    { id: 2, employee_id: 2, employee_name: 'Sarah Miller', date: '2024-01-15', status: 'Present' },
    { id: 3, employee_id: 3, employee_name: 'Mike Ross', date: '2024-01-15', status: 'Absent' },
    { id: 4, employee_id: 4, employee_name: 'Emily Watson', date: '2024-01-15', status: 'Present' },
    { id: 5, employee_id: 5, employee_name: 'David Kim', date: '2024-01-15', status: 'Present' },
    { id: 6, employee_id: 6, employee_name: 'Lisa Park', date: '2024-01-15', status: 'Present' },
  ],
  tasks: [
    { id: 1, employee_id: 1, employee_name: 'John Doe', task: 'Complete quarterly report', status: 'Pending' },
    { id: 2, employee_id: 2, employee_name: 'Sarah Miller', task: 'Review code changes', status: 'Completed' },
    { id: 3, employee_id: 3, employee_name: 'Mike Ross', task: 'Client presentation preparation', status: 'Pending' },
    { id: 4, employee_id: 4, employee_name: 'Emily Watson', task: 'Onboard new employees', status: 'Pending' },
  ],
  customers: [
    { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@email.com', phoneNumber: '+91 98765 43210', address: '123 MG Road', city: 'Bangalore', status: 'Active', registrationDate: '2023-01-15' },
    { id: 2, name: 'Priya Nair', email: 'priya.nair@email.com', phoneNumber: '+91 99887 77665', address: '456 Brigade Road', city: 'Bangalore', status: 'Active', registrationDate: '2023-02-20' },
    { id: 3, name: 'Neha Kapoor', email: 'neha.kapoor@email.com', phoneNumber: '+91 91234 56780', address: '789 Indiranagar', city: 'Bangalore', status: 'Inactive', registrationDate: '2023-03-10' },
  ],
  calls: [
    { id: 1, customerName: 'Aarav Sharma', phoneNumber: '+91 98765 43210', agentName: 'John Doe', callType: 'Technical Support', status: 'Completed', duration: '12m 30s', time: '2026-05-02 09:15', notes: 'Resolved login issue and confirmed customer access.' },
    { id: 2, customerName: 'Priya Nair', phoneNumber: '+91 99887 77665', agentName: 'Unassigned', callType: 'Billing', status: 'Callback Required', duration: '6m 45s', time: '2026-05-02 10:05', notes: 'Customer requested callback after invoice verification.' },
    { id: 3, customerName: 'GlobalMart Support', phoneNumber: '+1 415 555 0182', agentName: 'Mike Ross', callType: 'Client Escalation', status: 'Missed', duration: '0m', time: '2026-05-02 11:20', notes: 'Missed escalation call; follow-up task required.' },
    { id: 4, customerName: 'Neha Kapoor', phoneNumber: '+91 91234 56780', agentName: 'Emily Watson', callType: 'Sales Inquiry', status: 'Incoming', duration: '4m 10s', time: '2026-05-02 12:40', notes: 'Shared service package details.' },
    { id: 5, customerName: 'TechNova Helpdesk', phoneNumber: '+44 20 7946 0958', agentName: 'David Kim', callType: 'Outbound Follow-up', status: 'Outgoing', duration: '8m 05s', time: '2026-05-02 14:00', notes: 'Confirmed SLA report delivery timeline.' },
    { id: 6, customerName: 'Rohan Mehta', phoneNumber: '+91 90000 11223', agentName: 'Lisa Park', callType: 'General Query', status: 'Pending', duration: '2m 55s', time: '2026-05-02 15:30', notes: 'Waiting for supervisor approval.' },
  ],
  clients: [
    { id: 1, clientCompany: 'TechNova Solutions', serviceType: 'Customer Support', contactPerson: 'Anita Rao', contractStatus: 'Active', monthlyBilling: 125000, assignedTeam: 'Team Alpha' },
    { id: 2, clientCompany: 'GlobalMart Retail', serviceType: 'Order Processing', contactPerson: 'Michael Chen', contractStatus: 'Active', monthlyBilling: 98000, assignedTeam: 'Team Beta' },
    { id: 3, clientCompany: 'HealthBridge Care', serviceType: 'Appointment Scheduling', contactPerson: 'Dr. Kavita Menon', contractStatus: 'Pending', monthlyBilling: 72000, assignedTeam: 'Team Gamma' },
    { id: 4, clientCompany: 'FinEdge Services', serviceType: 'Back Office Processing', contactPerson: 'Robert Hale', contractStatus: 'On Hold', monthlyBilling: 65000, assignedTeam: 'Team Delta' },
  ],
  tickets: [
    { id: 1, ticketId: 'TCK-1001', customerName: 'Aarav Sharma', issueType: 'Login Issue', priority: 'High', assignedAgent: 'John Doe', status: 'Resolved', createdDate: '2026-05-01', resolutionNotes: 'Password reset completed and customer verified access.' },
    { id: 2, ticketId: 'TCK-1002', customerName: 'Priya Nair', issueType: 'Billing Dispute', priority: 'Critical', assignedAgent: 'Sarah Miller', status: 'Escalated', createdDate: '2026-05-01', resolutionNotes: 'Escalated to billing supervisor for invoice review.' },
    { id: 3, ticketId: 'TCK-1003', customerName: 'Neha Kapoor', issueType: 'Service Request', priority: 'Medium', assignedAgent: 'Emily Watson', status: 'In Progress', createdDate: '2026-05-02', resolutionNotes: 'Awaiting customer confirmation on preferred callback slot.' },
    { id: 4, ticketId: 'TCK-1004', customerName: 'Rohan Mehta', issueType: 'Account Update', priority: 'Low', assignedAgent: 'Lisa Park', status: 'Open', createdDate: '2026-05-02', resolutionNotes: 'New request assigned to support queue.' },
  ],
  shifts: [
    { id: 1, shiftName: 'Morning Support', startTime: '06:00', endTime: '14:00', assignedEmployees: ['John Doe', 'David Kim'], shiftSupervisor: 'Mike Ross', status: 'Active' },
    { id: 2, shiftName: 'Evening Support', startTime: '14:00', endTime: '22:00', assignedEmployees: ['Emily Watson', 'Lisa Park'], shiftSupervisor: 'Emily Watson', status: 'Scheduled' },
    { id: 3, shiftName: 'Night Escalation', startTime: '22:00', endTime: '06:00', assignedEmployees: ['Mike Ross', 'Lisa Park'], shiftSupervisor: 'Lisa Park', status: 'On Hold' },
  ],
  performance: [
    { id: 1, agentName: 'John Doe', callsHandled: 48, ticketsResolved: 18, averageCallTime: '5m 45s', customerRating: 4.8, productivityScore: 94 },
    { id: 2, agentName: 'Sarah Miller', callsHandled: 42, ticketsResolved: 21, averageCallTime: '6m 05s', customerRating: 4.7, productivityScore: 91 },
    { id: 3, agentName: 'Emily Watson', callsHandled: 36, ticketsResolved: 16, averageCallTime: '4m 55s', customerRating: 4.9, productivityScore: 96 },
    { id: 4, agentName: 'Lisa Park', callsHandled: 39, ticketsResolved: 14, averageCallTime: '5m 20s', customerRating: 4.6, productivityScore: 88 },
  ],
  sla: [
    { id: 1, slaId: 'SLA-001', clientName: 'TechNova Solutions', serviceType: 'Customer Support', targetTime: '4 hours', actualTime: '3h 20m', status: 'Within SLA', penaltyRisk: 'Low' },
    { id: 2, slaId: 'SLA-002', clientName: 'GlobalMart Retail', serviceType: 'Order Processing', targetTime: '2 hours', actualTime: '2h 45m', status: 'SLA Breached', penaltyRisk: 'High' },
    { id: 3, slaId: 'SLA-003', clientName: 'HealthBridge Care', serviceType: 'Appointment Scheduling', targetTime: '1 hour', actualTime: '55m', status: 'At Risk', penaltyRisk: 'Medium' },
  ],
  complaints: [
    { id: 1, complaintId: 'CMP-1001', customerName: 'Priya Nair', complaintType: 'Billing Delay', assignedAgent: 'Sarah Miller', priority: 'High', status: 'In Progress', createdDate: '2026-05-01', resolution: 'Billing team is reviewing duplicate invoice details.' },
    { id: 2, complaintId: 'CMP-1002', customerName: 'Aarav Sharma', complaintType: 'Call Quality', assignedAgent: 'John Doe', priority: 'Medium', status: 'Resolved', createdDate: '2026-05-01', resolution: 'Supervisor reviewed call recording and called customer back.' },
    { id: 3, complaintId: 'CMP-1003', customerName: 'Neha Kapoor', complaintType: 'Delayed Callback', assignedAgent: 'Emily Watson', priority: 'Critical', status: 'Escalated', createdDate: '2026-05-02', resolution: 'Escalated to floor manager for same-day closure.' },
  ],
  billing: [
    { id: 1, invoiceId: 'INV-2026-001', clientCompany: 'TechNova Solutions', serviceType: 'Customer Support', billingMonth: 'May 2026', amount: 125000, paymentStatus: 'Paid', dueDate: '2026-05-10' },
    { id: 2, invoiceId: 'INV-2026-002', clientCompany: 'GlobalMart Retail', serviceType: 'Order Processing', billingMonth: 'May 2026', amount: 98000, paymentStatus: 'Pending', dueDate: '2026-05-15' },
    { id: 3, invoiceId: 'INV-2026-003', clientCompany: 'FinEdge Services', serviceType: 'Back Office Processing', billingMonth: 'April 2026', amount: 65000, paymentStatus: 'Overdue', dueDate: '2026-04-30' },
  ],
  recruitment: [
    { id: 1, candidateName: 'Ananya Rao', positionApplied: 'Customer Support Agent', interviewDate: '2026-05-04', hrName: 'Emily Watson', status: 'Shortlisted', remarks: 'Good communication skills and night-shift availability.' },
    { id: 2, candidateName: 'Karan Patel', positionApplied: 'Team Lead', interviewDate: '2026-05-06', hrName: 'Mike Ross', status: 'Interview Scheduled', remarks: 'Has prior BPO floor supervision experience.' },
    { id: 3, candidateName: 'Meera Iyer', positionApplied: 'Quality Analyst', interviewDate: '2026-05-03', hrName: 'Lisa Park', status: 'Selected', remarks: 'Selected for QA process documentation role.' },
  ],
  users: [
    { id: 1, fullname: 'Admin User', username: 'admin', email: 'admin@bpo.com', role: 'admin', password: 'admin' },
  ],
}

seedData.agents = seedData.employees.map((employee) => ({ ...employee }))

await mongoose.connect(uri)

try {
  const db = mongoose.connection.db

  for (const [collectionName, records] of Object.entries(seedData)) {
    const collection = db.collection(collectionName)
    await collection.deleteMany({})

    if (records.length > 0) {
      await collection.insertMany(records)
    }

    console.log(`Seeded ${records.length} ${collectionName} records`)
  }

  console.log('MongoDB seed complete')
} finally {
  await mongoose.disconnect()
}

import mongoose, { Schema, type Model, type SchemaOptions } from 'mongoose'

const baseOptions: SchemaOptions = {
  versionKey: false,
  timestamps: true,
}

const agentLikeFields = {
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  salary: { type: Number, default: 0 },
  qualification: { type: String, default: '' },
  position: { type: String, default: '' },
  phone: { type: String, default: '' },
  joining_date: { type: String, default: '' },
}

const model = (name: string, schema: Schema, collection: string) =>
  (mongoose.models[name] as Model<AnyRecord>) ||
  (mongoose.model(name, schema, collection) as unknown as Model<AnyRecord>)

export type AnyRecord = Record<string, unknown> & { id: number }

export const EmployeeModel = model(
  'Employee',
  new Schema(agentLikeFields, baseOptions),
  'employees',
)

export const AgentModel = model(
  'Agent',
  new Schema(agentLikeFields, baseOptions),
  'agents',
)

export const AttendanceModel = model(
  'Attendance',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      employee_id: { type: Number, required: true },
      employee_name: { type: String, default: '' },
      date: { type: String, required: true },
      status: { type: String, enum: ['Present', 'Absent'], required: true },
    },
    baseOptions,
  ),
  'attendance',
)

export const TaskModel = model(
  'Task',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      employee_id: { type: Number, required: true },
      employee_name: { type: String, default: '' },
      task: { type: String, required: true },
      status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    },
    baseOptions,
  ),
  'tasks',
)

export const CustomerModel = model(
  'Customer',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phoneNumber: { type: String, required: true, trim: true },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Active' },
      registrationDate: { type: String, required: true },
    },
    baseOptions,
  ),
  'customers',
)

export const CallModel = model(
  'Call',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      customerName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      agentName: { type: String, default: 'Unassigned' },
      callType: { type: String, required: true },
      status: { type: String, required: true },
      duration: { type: String, default: '0m' },
      time: { type: String, required: true },
      notes: { type: String, default: '' },
    },
    baseOptions,
  ),
  'calls',
)

export const ClientModel = model(
  'Client',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      clientCompany: { type: String, required: true },
      serviceType: { type: String, required: true },
      contactPerson: { type: String, required: true },
      contractStatus: { type: String, required: true },
      monthlyBilling: { type: Number, default: 0 },
      assignedTeam: { type: String, default: '' },
    },
    baseOptions,
  ),
  'clients',
)

export const TicketModel = model(
  'Ticket',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      ticketId: { type: String, required: true },
      customerName: { type: String, required: true },
      issueType: { type: String, required: true },
      priority: { type: String, required: true },
      assignedAgent: { type: String, default: 'Unassigned' },
      status: { type: String, required: true },
      createdDate: { type: String, required: true },
      resolutionNotes: { type: String, default: '' },
    },
    baseOptions,
  ),
  'tickets',
)

export const ShiftModel = model(
  'Shift',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      shiftName: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      assignedEmployees: { type: [String], default: [] },
      shiftSupervisor: { type: String, default: 'Unassigned' },
      status: { type: String, required: true },
    },
    baseOptions,
  ),
  'shifts',
)

export const PerformanceModel = model(
  'Performance',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      agentName: { type: String, required: true },
      callsHandled: { type: Number, default: 0 },
      ticketsResolved: { type: Number, default: 0 },
      averageCallTime: { type: String, default: '0m' },
      customerRating: { type: Number, default: 0 },
      productivityScore: { type: Number, default: 0 },
    },
    baseOptions,
  ),
  'performance',
)

export const SlaModel = model(
  'Sla',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      slaId: { type: String, required: true },
      clientName: { type: String, required: true },
      serviceType: { type: String, required: true },
      targetTime: { type: String, required: true },
      actualTime: { type: String, required: true },
      status: { type: String, required: true },
      penaltyRisk: { type: String, required: true },
    },
    baseOptions,
  ),
  'sla',
)

export const ComplaintModel = model(
  'Complaint',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      complaintId: { type: String, required: true },
      customerName: { type: String, required: true },
      complaintType: { type: String, required: true },
      assignedAgent: { type: String, default: 'Unassigned' },
      priority: { type: String, required: true },
      status: { type: String, required: true },
      createdDate: { type: String, required: true },
      resolution: { type: String, default: '' },
    },
    baseOptions,
  ),
  'complaints',
)

export const BillingModel = model(
  'Billing',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      invoiceId: { type: String, required: true },
      clientCompany: { type: String, required: true },
      serviceType: { type: String, required: true },
      billingMonth: { type: String, required: true },
      amount: { type: Number, default: 0 },
      paymentStatus: { type: String, required: true },
      dueDate: { type: String, required: true },
    },
    baseOptions,
  ),
  'billing',
)

export const RecruitmentModel = model(
  'Recruitment',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      candidateName: { type: String, required: true },
      positionApplied: { type: String, required: true },
      interviewDate: { type: String, required: true },
      hrName: { type: String, required: true },
      status: { type: String, required: true },
      remarks: { type: String, default: '' },
    },
    baseOptions,
  ),
  'recruitment',
)

export const UserModel = model(
  'User',
  new Schema(
    {
      id: { type: Number, required: true, unique: true },
      fullname: { type: String, required: true },
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
      password: { type: String, required: true },
    },
    baseOptions,
  ),
  'users',
)

export const collectionModels: Record<string, Model<AnyRecord>> = {
  agents: AgentModel,
  attendance: AttendanceModel,
  billing: BillingModel,
  calls: CallModel,
  clients: ClientModel,
  complaints: ComplaintModel,
  customers: CustomerModel,
  employees: EmployeeModel,
  performance: PerformanceModel,
  recruitment: RecruitmentModel,
  shifts: ShiftModel,
  sla: SlaModel,
  tasks: TaskModel,
  tickets: TicketModel,
  users: UserModel,
}

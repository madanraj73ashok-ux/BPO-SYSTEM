import { NextResponse, type NextRequest } from 'next/server'
import type { Model } from 'mongoose'
import { connectMongoDB } from '@/lib/mongodb'
import {
  collectionModels,
  EmployeeModel,
  type AnyRecord,
} from '@/lib/models'

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function serializeDocument(document: Record<string, unknown> | null) {
  if (!document) return null

  const { _id, __v, createdAt, updatedAt, ...data } = document
  void _id
  void __v
  void createdAt
  void updatedAt
  return data
}

export function getCollectionModel(collection: string) {
  return collectionModels[collection]
}

export async function getNextId(model: Model<AnyRecord>) {
  const latest = await model.findOne({}, { id: 1 }).sort({ id: -1 }).lean()
  const latestId = Number(latest?.id)

  return Number.isFinite(latestId) ? latestId + 1 : 1
}

export async function listRecords(model: Model<AnyRecord>) {
  await connectMongoDB()
  const records = await model.find({}).sort({ id: 1 }).lean()

  return records.map(serializeDocument)
}

export async function createRecord(
  model: Model<AnyRecord>,
  data: Record<string, unknown>,
) {
  await connectMongoDB()
  const id = typeof data.id === 'number' ? data.id : await getNextId(model)
  const record = await model.create({
    ...data,
    id,
  })

  return serializeDocument(record.toObject())
}

export async function findRecord(model: Model<AnyRecord>, id: string) {
  await connectMongoDB()
  const record = await model.findOne({ id: Number(id) }).lean()

  return serializeDocument(record)
}

export async function updateRecord(
  model: Model<AnyRecord>,
  id: string,
  data: Record<string, unknown>,
) {
  await connectMongoDB()
  const record = await model
    .findOneAndUpdate(
      { id: Number(id) },
      { $set: data },
      { new: true, runValidators: true },
    )
    .lean()

  return serializeDocument(record)
}

export async function deleteRecord(model: Model<AnyRecord>, id: string) {
  await connectMongoDB()
  const result = await model.deleteOne({ id: Number(id) })

  return result.deletedCount > 0
}

async function cleanupDeletedRecord(collection: string, record: Record<string, unknown>) {
  if (collection !== 'employees' && collection !== 'agents') return

  const employeeId = Number(record.id)
  const employeeName = typeof record.name === 'string' ? record.name : ''

  await Promise.all([
    collectionModels.attendance.deleteMany({ employee_id: employeeId }),
    collectionModels.tasks.deleteMany({ employee_id: employeeId }),
    collectionModels.performance.deleteMany({ agentName: employeeName }),
    collectionModels.calls.updateMany(
      { agentName: employeeName },
      { $set: { agentName: 'Unassigned' } },
    ),
  ])

  const shifts = await collectionModels.shifts.find({
    $or: [
      { assignedEmployees: employeeName },
      { shiftSupervisor: employeeName },
    ],
  }).lean()

  await Promise.all(
    shifts.map((shift) => {
      const assignedEmployees = Array.isArray(shift.assignedEmployees)
        ? shift.assignedEmployees.filter((employee) => employee !== employeeName)
        : []

      return collectionModels.shifts.updateOne(
        { id: shift.id },
        {
          $set: {
            assignedEmployees,
            shiftSupervisor:
              shift.shiftSupervisor === employeeName
                ? assignedEmployees[0] ?? 'Unassigned'
                : shift.shiftSupervisor,
          },
        },
      )
    }),
  )
}

export async function collectionGET(
  _request: NextRequest,
  context: { params: Promise<{ collection: string }> },
) {
  try {
    const { collection } = await context.params
    const model = getCollectionModel(collection)
    if (!model) return apiError('Collection not found', 404)

    return NextResponse.json(await listRecords(model))
  } catch (cause) {
    return apiError(cause instanceof Error ? cause.message : 'Failed to fetch records')
  }
}

export async function collectionPOST(
  request: NextRequest,
  context: { params: Promise<{ collection: string }> },
) {
  try {
    const { collection } = await context.params
    const model = getCollectionModel(collection)
    if (!model) return apiError('Collection not found', 404)

    const data = await request.json()
    return NextResponse.json(await createRecord(model, data), { status: 201 })
  } catch (cause) {
    return apiError(cause instanceof Error ? cause.message : 'Failed to create record', 400)
  }
}

export async function collectionItemGET(
  _request: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> },
) {
  try {
    const { collection, id } = await context.params
    const model = getCollectionModel(collection)
    if (!model) return apiError('Collection not found', 404)

    const record = await findRecord(model, id)
    return record ? NextResponse.json(record) : apiError('Record not found', 404)
  } catch (cause) {
    return apiError(cause instanceof Error ? cause.message : 'Failed to fetch record')
  }
}

export async function collectionItemPATCH(
  request: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> },
) {
  try {
    const { collection, id } = await context.params
    const model = getCollectionModel(collection)
    if (!model) return apiError('Collection not found', 404)

    const data = await request.json()
    const record = await updateRecord(model, id, data)

    return record ? NextResponse.json(record) : apiError('Record not found', 404)
  } catch (cause) {
    return apiError(cause instanceof Error ? cause.message : 'Failed to update record', 400)
  }
}

export async function collectionItemDELETE(
  _request: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> },
) {
  try {
    const { collection, id } = await context.params
    const model = getCollectionModel(collection)
    if (!model) return apiError('Collection not found', 404)

    const record = await findRecord(model, id)
    if (!record) return apiError('Record not found', 404)

    const deleted = await deleteRecord(model, id)
    if (!deleted) return apiError('Record not found', 404)

    await cleanupDeletedRecord(collection, record)
    return NextResponse.json({ success: true })
  } catch (cause) {
    return apiError(cause instanceof Error ? cause.message : 'Failed to delete record', 400)
  }
}

export async function buildDashboardData() {
  await connectMongoDB()

  const [employees, attendance, tasks] = await Promise.all([
    EmployeeModel.find({}).sort({ id: 1 }).lean(),
    collectionModels.attendance.find({}).lean(),
    collectionModels.tasks.find({}).lean(),
  ])

  const totalSalary = employees.reduce(
    (sum, employee) => sum + Number(employee.salary || 0),
    0,
  )
  const present = attendance.filter((record) => record.status === 'Present').length
  const absent = attendance.filter((record) => record.status === 'Absent').length

  return {
    totalEmployees: employees.length,
    totalAttendance: attendance.length,
    pendingTasks: tasks.filter((task) => task.status === 'Pending').length,
    totalSalary,
    salaryByEmployee: employees.map((employee) => ({
      name: employee.name,
      salary: Number(employee.salary || 0),
    })),
    attendanceStats: { present, absent },
    employeeGrowth: [
      { month: 'Jan', count: Math.max(1, employees.length - 5) },
      { month: 'Feb', count: Math.max(1, employees.length - 4) },
      { month: 'Mar', count: Math.max(1, employees.length - 3) },
      { month: 'Apr', count: Math.max(1, employees.length - 2) },
      { month: 'May', count: employees.length },
    ],
  }
}

import { NextResponse, type NextRequest } from 'next/server'
import { apiError, getNextId, serializeDocument } from '@/lib/api-handlers'
import { connectMongoDB } from '@/lib/mongodb'
import { AttendanceModel, EmployeeModel } from '@/lib/models'

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB()

    const data = await request.json()
    const employeeId = Number(data.employee_id)
    const status = data.status

    if (!employeeId || !['Present', 'Absent'].includes(status)) {
      return apiError('Employee and attendance status are required', 400)
    }

    const employee = await EmployeeModel.findOne({ id: employeeId }).lean()
    if (!employee) return apiError('Employee not found', 404)

    const date = new Date().toISOString().slice(0, 10)
    const existing = await AttendanceModel.findOne({ employee_id: employeeId, date }).lean()
    const record = {
      id: existing?.id ?? await getNextId(AttendanceModel),
      employee_id: employeeId,
      employee_name: employee.name,
      date,
      status,
    }

    const saved = await AttendanceModel.findOneAndUpdate(
      { employee_id: employeeId, date },
      { $set: record },
      { new: true, runValidators: true, upsert: true },
    ).lean()

    return NextResponse.json(serializeDocument(saved))
  } catch (cause) {
    return apiError(cause instanceof Error ? cause.message : 'Failed to mark attendance', 400)
  }
}

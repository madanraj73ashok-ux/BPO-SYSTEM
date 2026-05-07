import { NextResponse, type NextRequest } from 'next/server'
import { apiError, createRecord } from '@/lib/api-handlers'
import { connectMongoDB } from '@/lib/mongodb'
import { UserModel } from '@/lib/models'

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB()

    const data = await request.json()
    const existingUser = await UserModel.findOne({ username: data.username }).lean()

    if (existingUser) return apiError('Username already exists', 409)

    const user = await createRecord(UserModel, data)
    return NextResponse.json({ user }, { status: 201 })
  } catch (cause) {
    return apiError(cause instanceof Error ? cause.message : 'Registration failed', 400)
  }
}

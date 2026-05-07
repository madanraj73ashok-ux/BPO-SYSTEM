import { NextResponse, type NextRequest } from 'next/server'
import { apiError, serializeDocument } from '@/lib/api-handlers'
import { connectMongoDB } from '@/lib/mongodb'
import { UserModel } from '@/lib/models'

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB()

    const { username, password } = await request.json()
    const user = await UserModel.findOne({ username, password }).lean()

    if (!user) return apiError('Invalid username or password', 401)

    return NextResponse.json({ user: serializeDocument(user) })
  } catch (cause) {
    return apiError(cause instanceof Error ? cause.message : 'Login failed', 400)
  }
}

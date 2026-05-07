import { NextResponse } from 'next/server'
import { apiError, buildDashboardData } from '@/lib/api-handlers'

export async function GET() {
  try {
    return NextResponse.json(await buildDashboardData())
  } catch (cause) {
    return apiError(cause instanceof Error ? cause.message : 'Failed to fetch dashboard data')
  }
}

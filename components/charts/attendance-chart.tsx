'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface AttendanceChartProps {
  data: { present: number; absent: number }
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [
          {
            data: [data.present, data.absent],
            backgroundColor: [
              'rgba(80, 200, 120, 0.8)',
              'rgba(255, 99, 99, 0.8)',
            ],
            borderColor: [
              'rgba(80, 200, 120, 1)',
              'rgba(255, 99, 99, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="flex h-[300px] w-full flex-col items-center justify-center">
      <canvas ref={chartRef} />
      <div className="mt-4 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Present: {data.present}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Absent: {data.absent}</span>
        </div>
      </div>
    </div>
  )
}

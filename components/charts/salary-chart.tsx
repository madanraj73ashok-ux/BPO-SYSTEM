'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { formatCurrency } from '@/lib/utils'

Chart.register(...registerables)

interface SalaryChartProps {
  data: { name: string; salary: number }[]
}

export function SalaryChart({ data }: SalaryChartProps) {
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
      type: 'bar',
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            label: 'Salary (Rs.)',
            data: data.map((d) => d.salary),
            backgroundColor: 'rgba(99, 131, 255, 0.8)',
            borderColor: 'rgba(99, 131, 255, 1)',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.6)',
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.6)',
              callback: (value) => formatCurrency(Number(value)),
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
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

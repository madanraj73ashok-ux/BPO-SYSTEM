'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface GrowthChartProps {
  data: { month: string; count: number }[]
}

export function GrowthChart({ data }: GrowthChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    const gradient = ctx.createLinearGradient(0, 0, 0, 300)
    gradient.addColorStop(0, 'rgba(99, 131, 255, 0.4)')
    gradient.addColorStop(1, 'rgba(99, 131, 255, 0)')

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: 'Employees',
            data: data.map((d) => d.count),
            fill: true,
            backgroundColor: gradient,
            borderColor: 'rgba(99, 131, 255, 1)',
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: 'rgba(99, 131, 255, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
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

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LineChart, AreaChart, BarChart, PieChart, RadarChart, Gauge, Sparkline } from '@paper-ui/components/charts'
import { Paper } from '@paper-ui/components/paper'
import { Tape, PushPin } from '@paper-ui/components/decorations'

const meta: Meta = {
  title: 'Components/Composed/ChartGallery',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj

const lineData = [
  { x: 'Jan', y: 30 }, { x: 'Feb', y: 45 }, { x: 'Mar', y: 38 },
  { x: 'Apr', y: 60 }, { x: 'May', y: 55 }, { x: 'Jun', y: 78 },
]

const barData = [
  { label: 'A', value: 40 }, { label: 'B', value: 70 }, { label: 'C', value: 55 },
  { label: 'D', value: 80 }, { label: 'E', value: 35 },
]

const pieData = [
  { label: 'Read', value: 35, color: '#7fa37b' },
  { label: 'Write', value: 25, color: '#d4a76a' },
  { label: 'Study', value: 20, color: '#a87da3' },
  { label: 'Review', value: 20, color: '#6b8fba' },
]

const radarData = [
  { axis: 'Speed', value: 80 }, { axis: 'Power', value: 60 },
  { axis: 'Accuracy', value: 90 }, { axis: 'Endurance', value: 70 },
]

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
      <Paper className="p-4" shadow="lg">
        <h3 className="font-architect text-sm mb-3 text-center">Line</h3>
        <LineChart data={lineData} height={100} showDots showGrid />
      </Paper>
      <Paper className="p-4" shadow="lg">
        <h3 className="font-architect text-sm mb-3 text-center">Area</h3>
        <AreaChart data={lineData} height={100} showGrid />
      </Paper>
      <Paper className="p-4" shadow="lg">
        <h3 className="font-architect text-sm mb-3 text-center">Bar</h3>
        <BarChart data={barData} height={100} />
      </Paper>
      <Paper className="p-4" shadow="lg">
        <h3 className="font-architect text-sm mb-3 text-center">Pie</h3>
        <PieChart data={pieData} size={100} />
      </Paper>
      <Paper className="p-4" shadow="lg">
        <h3 className="font-architect text-sm mb-3 text-center">Radar</h3>
        <RadarChart data={radarData} size={100} />
      </Paper>
      <Paper className="p-4" shadow="lg">
        <h3 className="font-architect text-sm mb-3 text-center">Gauge</h3>
        <Gauge value={72} size={80} />
      </Paper>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6 max-w-2xl">
      <Paper className="p-4 relative" shadow="lg">
        <PushPin className="absolute -top-2 left-8" color="#d4a76a" />
        <h3 className="font-architect text-sm mb-3">Line Chart with Grid</h3>
        <LineChart data={lineData} height={140} showDots showGrid color="#6b8fba" />
      </Paper>
      <Paper className="p-4 relative" shadow="md">
        <Tape className="absolute -top-3 right-10 rotate-[8deg]" color="#f0d3a8" />
        <h3 className="font-architect text-sm mb-3">Sparklines</h3>
        <div className="flex gap-6 justify-center">
          <Sparkline data={[12, 28, 18, 42, 30, 55, 40, 65]} width={100} height={40} showDot />
          <Sparkline data={[30, 25, 40, 35, 50, 45, 60, 55]} color="#d4a76a" width={100} height={40} showDot />
        </div>
      </Paper>
    </div>
  ),
}
import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { LineChart, AreaChart, BarChart, PieChart, RadarChart, Gauge, Sparkline } from '@paper-ui/components/charts';
import { Paper } from '@paper-ui/components/paper';
import { PaperCard, SketchBorder } from '@paper-ui/core';
import { Tape, PushPin, CoffeeRing, NotebookSpiral, NotebookEdge, PaperStamp, Scribble } from '@paper-ui/components/decorations';

const meta = {
  title: 'Components/Charts',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;

const lineData = [
  { x: 'Jan', y: 30 }, { x: 'Feb', y: 45 }, { x: 'Mar', y: 38 },
  { x: 'Apr', y: 60 }, { x: 'May', y: 55 }, { x: 'Jun', y: 78 },
];

const lineData2 = [
  { x: 'Jan', y: 20 }, { x: 'Feb', y: 35 }, { x: 'Mar', y: 48 },
  { x: 'Apr', y: 40 }, { x: 'May', y: 65 }, { x: 'Jun', y: 58 },
];

const barData = [
  { label: 'A', value: 40 }, { label: 'B', value: 70 }, { label: 'C', value: 55 },
  { label: 'D', value: 80 }, { label: 'E', value: 35 },
];

const pieData = [
  { label: 'Read', value: 35, color: '#7fa37b' },
  { label: 'Write', value: 25, color: '#d4a76a' },
  { label: 'Study', value: 20, color: '#a87da3' },
  { label: 'Review', value: 20, color: '#6b8fba' },
];

const radarData = [
  { axis: 'Speed', value: 80 }, { axis: 'Power', value: 60 },
  { axis: 'Accuracy', value: 90 }, { axis: 'Endurance', value: 70 },
  { axis: 'Agility', value: 50 },
];

const radarData2 = [
  { axis: 'Speed', value: 45 }, { axis: 'Power', value: 75 },
  { axis: 'Accuracy', value: 60 }, { axis: 'Endurance', value: 55 },
  { axis: 'Agility', value: 80 },
];

const sparklineData = [12, 28, 18, 42, 30, 55, 40, 65, 50, 70, 58];
const sparklineData2 = [30, 25, 40, 35, 50, 45, 60, 55, 70, 65, 80];
const sparklineData3 = [65, 60, 55, 62, 48, 55, 42, 50, 38, 52, 40];

export const ChartOverview = () => (
  <div className="min-h-screen p-10 space-y-8 bg-[#f4f1ea]">
    <h1 className="font-architect text-3xl text-center mb-8">Sketchy Charts Overview</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Paper className="p-4 rotate-[-0.5deg]" shadowVariant="hard">
        <Tape className="absolute -top-3 left-8 rotate-[-6deg]" color="#f0d3a8" />
        <h3 className="font-architect text-sm mb-2 text-center">Line Chart</h3>
        <LineChart data={lineData} height={140} showDots showGrid />
      </Paper>

      <Paper className="p-4 rotate-[0.3deg]" shadowVariant="hard">
        <Tape className="absolute -top-3 right-10 rotate-[8deg]" color="#f0d3a8" />
        <h3 className="font-architect text-sm mb-2 text-center">Area Chart</h3>
        <AreaChart data={lineData} height={140} showGrid />
      </Paper>

      <Paper className="p-4 rotate-[-0.2deg]" shadowVariant="hard">
        <PushPin className="absolute -top-2 left-1/2 -translate-x-1/2" color="#d4a76a" />
        <h3 className="font-architect text-sm mb-2 text-center">Bar Chart</h3>
        <BarChart data={barData} height={140} />
      </Paper>

      <Paper className="p-4 rotate-[0.5deg]" shadowVariant="hard">
        <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" color="#f0d3a8" />
        <h3 className="font-architect text-sm mb-2 text-center">Pie Chart</h3>
        <PieChart data={pieData} size={140} />
      </Paper>

      <Paper className="p-4 rotate-[-0.4deg]" shadowVariant="hard">
        <PushPin className="absolute -top-2 right-8 rotate-[12deg]" color="#a87da3" />
        <h3 className="font-architect text-sm mb-2 text-center">Radar Chart</h3>
        <RadarChart data={radarData} size={140} />
      </Paper>

      <Paper className="p-4 rotate-[0.2deg]" shadowVariant="hard">
        <Tape className="absolute -top-3 left-10 rotate-[5deg]" color="#f0d3a8" />
        <h3 className="font-architect text-sm mb-2 text-center">Gauge</h3>
        <Gauge value={72} size={120} />
      </Paper>
    </div>

    <div className="mt-8">
      <Paper className="p-4 rotate-[0.3deg]" shadowVariant="hard">
        <Tape className="absolute -top-3 right-12 rotate-[-5deg]" color="#f0d3a8" />
        <h3 className="font-architect text-sm mb-4 text-center">Sparklines</h3>
        <div className="flex flex-wrap gap-8 justify-center items-center">
          <Sparkline data={sparklineData} width={120} height={40} showDot />
          <Sparkline data={sparklineData2} color="#d4a76a" width={120} height={40} showDot />
          <Sparkline data={sparklineData3} color="#c95f5f" width={120} height={40} showDot />
        </div>
      </Paper>
    </div>
  </div>
);

export const LineChartStories = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <div>
      <h2 className="font-serif text-xl font-bold mb-6">Line Charts</h2>

      <Paper shadowVariant="sketch" className="p-6 rotate-[-0.3deg] max-w-lg">
        <PushPin className="absolute -top-2 left-8 rotate-[-8deg]" color="#d4a76a" />
        <h3 className="font-architect text-base mb-4">Simple Line</h3>
        <LineChart data={lineData} height={180} />
      </Paper>
    </div>

    <Paper shadowVariant="sketch" className="p-6 rotate-[0.2deg] max-w-lg">
      <PushPin className="absolute -top-2 right-12 rotate-[10deg]" color="#7fa37b" />
      <h3 className="font-architect text-base mb-4">Line with Dots & Grid</h3>
      <LineChart data={lineData} height={180} showDots showGrid color="#6b8fba" />
    </Paper>

    <Paper shadowVariant="sketch" className="p-6 rotate-[-0.4deg] max-w-lg">
      <PushPin className="absolute -top-2 left-1/2 -translate-x-1/2 rotate-[-5deg]" color="#a87da3" />
      <h3 className="font-architect text-base mb-4">Thick Warm Line</h3>
      <LineChart data={lineData2} height={180} strokeWidth={2.5} showDots color="#d4a76a" showGrid />
    </Paper>

    <PaperCard className="p-6 max-w-lg" shadow="md">
      <h3 className="font-architect text-base mb-4">Multi-color Overlay</h3>
      <div className="relative">
        <LineChart data={lineData} height={200} color="#7fa37b" />
        <div className="absolute top-0 left-0 right-0">
          <LineChart data={lineData2} height={200} color="#c95f5f" />
        </div>
      </div>
      <div className="flex gap-4 justify-center mt-2 font-kalam text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#7fa37b]" /> Study</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#c95f5f]" /> Review</span>
      </div>
    </PaperCard>
  </div>
);

export const BarChartStories = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-6">Bar Charts</h2>

    <div className="flex flex-wrap gap-8">
      <PaperCard className="p-6 w-72" shadow="md">
        <h3 className="font-architect text-base mb-4 text-center">Vertical Bars</h3>
        <BarChart data={barData} height={180} color="#7fa37b" />
      </PaperCard>

      <PaperCard className="p-6 w-72" shadow="md">
        <h3 className="font-architect text-base mb-4 text-center">Horizontal Bars</h3>
        <BarChart data={barData} height={200} horizontal color="#6b8fba" />
      </PaperCard>

      <PaperCard className="p-6 w-72" shadow="md">
        <h3 className="font-architect text-base mb-4 text-center">Warm Palette</h3>
        <BarChart data={[
          { label: 'Mon', value: 45 }, { label: 'Tue', value: 62 },
          { label: 'Wed', value: 28 }, { label: 'Thu', value: 75 },
          { label: 'Fri', value: 50 },
        ]} height={180} color="#d4a76a" />
      </PaperCard>
    </div>
  </div>
);

export const AreaChartStories = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea] relative">
    <h2 className="font-serif text-xl font-bold mb-6">Area Charts</h2>

    <Paper className="p-6 max-w-lg rotate-[-0.2deg]" shadowVariant="sketch">
      <CoffeeRing className="absolute top-8 right-8" />
      <h3 className="font-architect text-base mb-4">Study Hours (Weekly)</h3>
      <AreaChart data={lineData} height={200} showGrid />
    </Paper>

    <Paper className="p-6 max-w-lg rotate-[0.3deg]" shadowVariant="sketch">
      <Tape className="absolute -top-3 right-10 rotate-[8deg]" color="#f0d3a8" />
      <h3 className="font-architect text-base mb-4">Quiz Scores</h3>
      <AreaChart data={lineData2} height={200} color="#d4a76a" fillColor="#e8cfa0" showGrid />
    </Paper>

    <Paper className="p-6 max-w-lg rotate-[-0.4deg]" shadowVariant="sketch">
      <CoffeeRing className="absolute top-4 left-8" />
      <h3 className="font-architect text-base mb-4">Focus Hours</h3>
      <AreaChart data={[
        { x: 'Mon', y: 2 }, { x: 'Tue', y: 4.5 }, { x: 'Wed', y: 3 },
        { x: 'Thu', y: 5 }, { x: 'Fri', y: 4 }, { x: 'Sat', y: 6.5 },
      ]} height={200} color="#a87da3" fillColor="#c9a5d0" showGrid />
    </Paper>
  </div>
);

export const PieChartStories = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-6">Pie & Donut Charts</h2>

    <div className="flex flex-wrap gap-8 items-start">
      <Paper className="p-6 rotate-[-0.5deg]" shadowVariant="hard">
        <Tape className="absolute -top-3 left-4 rotate-[-4deg]" color="#f0d3a8" />
        <Tape className="absolute -top-3 right-10 rotate-[6deg]" color="#f0d3a8" />
        <PaperStamp className="absolute -top-4 right-0" label="Data" />
        <h3 className="font-architect text-base mb-4 text-center">Study Activities</h3>
        <PieChart data={pieData} size={200} />
        <div className="flex flex-wrap gap-3 justify-center mt-4 font-kalam text-xs">
          {pieData.map((d) => (
            <span key={d.label} className="flex items-center gap-1">
              <span className="w-3 h-3" style={{ backgroundColor: d.color }} /> {d.label}
            </span>
          ))}
        </div>
      </Paper>

      <Paper className="p-6 rotate-[0.4deg]" shadowVariant="hard">
        <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-6deg]" color="#f0d3a8" />
        <PaperStamp className="absolute -top-4 right-4" label="Stats" color="#d4a76a" />
        <h3 className="font-architect text-base mb-4 text-center">Donut: Focus Areas</h3>
        <PieChart data={pieData} size={200} donutHoleSize={0.4} />
        <p className="font-architect text-xs text-center text-muted-foreground mt-2 font-bold">100% Total</p>
      </Paper>

      <Paper className="p-6 rotate-[-0.3deg]" shadowVariant="hard">
        <Tape className="absolute -top-3 right-8 rotate-[5deg]" color="#f0d3a8" />
        <h3 className="font-architect text-base mb-4 text-center">Half-Donut</h3>
        <PieChart data={pieData} size={200} donutHoleSize={0.55} />
      </Paper>
    </div>
  </div>
);

export const RadarChartStories = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-6">Radar Charts</h2>

    <div className="flex flex-wrap gap-8">
      <Paper className="p-6 rotate-[-0.3deg]" shadowVariant="sketch">
        <NotebookEdge position="left" holes={10} />
        <h3 className="font-architect text-base mb-4 text-center">Skill Profile</h3>
        <RadarChart data={radarData} size={220} color="#7fa37b" fillColor="#d0e8c0" />
      </Paper>

      <Paper className="p-6 rotate-[0.4deg]" shadowVariant="sketch">
        <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-5deg]" color="#f0d3a8" />
        <h3 className="font-architect text-base mb-4 text-center">Two Profiles</h3>
        <div className="relative">
          <RadarChart data={radarData} size={220} color="#7fa37b" fillColor="#d0e8c066" />
          <div className="absolute top-0 left-0 right-0">
            <RadarChart data={radarData2} size={220} color="#c95f5f" fillColor="#e8b0b066" />
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-2 font-kalam text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#7fa37b]" /> Current</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#c95f5f]" /> Target</span>
        </div>
      </Paper>
    </div>
  </div>
);

export const GaugeStories = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-6">Gauges</h2>

    <div className="flex flex-wrap gap-8 items-start">
      <PaperCard className="p-4" shadow="md">
        <h3 className="font-architect text-xs text-center mb-2">Progress</h3>
        <Gauge value={72} size={140} color="#7fa37b" />
      </PaperCard>

      <PaperCard className="p-4 rotate-[0.3deg]" shadow="md">
        <h3 className="font-architect text-xs text-center mb-2">Completion</h3>
        <Gauge value={95} size={140} color="#d4a76a" />
      </PaperCard>

      <PaperCard className="p-4 rotate-[-0.4deg]" shadow="md">
        <h3 className="font-architect text-xs text-center mb-2">Score</h3>
        <Gauge value={45} size={140} color="#c95f5f" />
      </PaperCard>

      <PaperCard className="p-4 rotate-[0.2deg]" shadow="md">
        <h3 className="font-architect text-xs text-center mb-2">Mastery</h3>
        <Gauge value={28} size={140} color="#a87da3" />
      </PaperCard>
    </div>
  </div>
);

export const SparklineStories = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-6">Sparklines</h2>

    <PaperCard className="p-6 max-w-lg" shadow="md">
      <h3 className="font-architect text-sm mb-4">Study Stats Table</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-2 border-b border-black/10">
          <span className="font-kalam text-sm w-20">Concepts</span>
          <span className="font-kalam text-lg font-bold w-12 text-right">138</span>
          <div className="flex-1">
            <Sparkline data={sparklineData} width={100} height={32} showDot color="#7fa37b" />
          </div>
        </div>
        <div className="flex items-center gap-4 p-2 border-b border-black/10">
          <span className="font-kalam text-sm w-20">Flashcards</span>
          <span className="font-kalam text-lg font-bold w-12 text-right">256</span>
          <div className="flex-1">
            <Sparkline data={sparklineData2} width={100} height={32} showDot color="#d4a76a" />
          </div>
        </div>
        <div className="flex items-center gap-4 p-2 border-b border-black/10">
          <span className="font-kalam text-sm w-20">Quizzes</span>
          <span className="font-kalam text-lg font-bold w-12 text-right">87%</span>
          <div className="flex-1">
            <Sparkline data={sparklineData3} width={100} height={32} showDot color="#c95f5f" />
          </div>
        </div>
        <div className="flex items-center gap-4 p-2">
          <span className="font-kalam text-sm w-20">Focus</span>
          <span className="font-kalam text-lg font-bold w-12 text-right">42h</span>
          <div className="flex-1">
            <Sparkline data={[20, 25, 18, 35, 30, 45, 38, 50, 42, 55, 48]} width={100} height={32} showDot color="#a87da3" />
          </div>
        </div>
      </div>
    </PaperCard>
  </div>
);

export const DashboardMockup = () => (
  <div className="min-h-screen p-6 bg-[#f4f1ea]">
    <h1 className="font-architect text-3xl text-center mb-2">Study Analytics Dashboard</h1>
    <p className="font-kalam text-sm text-center text-muted-foreground mb-6">Last updated: today, 3:42 PM</p>

    <Paper className="p-8 max-w-4xl mx-auto rotate-[0.1deg]" shadowVariant="hard">
      <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-[-4deg]" color="#f0d3a8" />
      <PushPin className="absolute -top-2 right-12 rotate-[8deg]" color="#d4a76a" />
      <CoffeeRing className="absolute bottom-16 right-16" />

      <Scribble className="absolute -right-4 -bottom-4 w-20 h-20" color="#7fa37b" opacity={0.3} />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border-2 border-dashed border-[#c4b99a] rounded-lg p-3 rotate-[-0.5deg]">
          <h3 className="font-architect text-xs mb-1">Study Hours</h3>
          <p className="font-kalam text-2xl font-bold">42.5</p>
          <p className="font-caveat text-xs text-muted-foreground">+12% this week</p>
          <div className="mt-2">
            <Sparkline data={sparklineData} height={28} color="#7fa37b" />
          </div>
        </div>

        <div className="border-2 border-dashed border-[#c4b99a] rounded-lg p-3 rotate-[0.3deg]">
          <h3 className="font-architect text-xs mb-1">Concepts Mastered</h3>
          <p className="font-kalam text-2xl font-bold">138</p>
          <p className="font-caveat text-xs text-muted-foreground">+8 this month</p>
          <div className="mt-2">
            <Sparkline data={sparklineData2} height={28} color="#d4a76a" />
          </div>
        </div>

        <div className="border-2 border-dashed border-[#c4b99a] rounded-lg p-3 rotate-[-0.2deg]">
          <h3 className="font-architect text-xs mb-1">Quiz Avg</h3>
          <p className="font-kalam text-2xl font-bold">87%</p>
          <p className="font-caveat text-xs text-muted-foreground">-3% vs last month</p>
          <div className="mt-2">
            <Sparkline data={sparklineData3} height={28} color="#c95f5f" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <PaperCard className="p-4 rotate-[-0.3deg]" shadow="md">
          <h3 className="font-architect text-sm mb-3">Weekly Activity</h3>
          <BarChart data={[
            { label: 'M', value: 45 }, { label: 'T', value: 62 },
            { label: 'W', value: 38 }, { label: 'T', value: 75 },
            { label: 'F', value: 52 }, { label: 'S', value: 80 },
            { label: 'S', value: 35 },
          ]} height={160} color="#7fa37b" />
        </PaperCard>

        <PaperCard className="p-4 rotate-[0.2deg]" shadow="md">
          <h3 className="font-architect text-sm mb-3">Focus Distribution</h3>
          <PieChart data={pieData} size={160} />
        </PaperCard>
      </div>

      <PaperCard className="p-4 mb-4" shadow="md">
        <h3 className="font-architect text-sm mb-3">Score Trend (6 Months)</h3>
        <AreaChart
          data={lineData}
          height={180}
          color="#6b8fba"
          fillColor="#a8c8e8"
          showGrid
        />
      </PaperCard>

      <div className="grid grid-cols-2 gap-6">
        <PaperCard className="p-4 rotate-[-0.2deg]" shadow="md">
          <h3 className="font-architect text-sm mb-3">Mastery Gauge</h3>
          <div className="flex justify-center">
            <Gauge value={72} size={140} color="#7fa37b" />
          </div>
        </PaperCard>

        <PaperCard className="p-4 rotate-[0.3deg]" shadow="md">
          <h3 className="font-architect text-sm mb-3">Skill Radar</h3>
          <RadarChart data={radarData} size={160} color="#a87da3" fillColor="#d0c0e0" />
        </PaperCard>
      </div>
    </Paper>
  </div>
);

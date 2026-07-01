import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  StatNumber,
  StatsGrid,
  MiniChart,
  Heatmap,
  ProgressSummary,
  InsightBox,
} from '@paper-ui/components/stats';
import { DifficultyBadge } from '@paper-ui/components/badges';

const meta = {
  title: 'Components/Stats',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const StatNumberExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StatNumber — tones & trends</h2>
    <div className="flex flex-wrap gap-8">
      <StatNumber value="138" label="Concepts" tone="sage" trend="up" trendLabel="+12 this week" />
      <StatNumber value="24" label="Documents" tone="sky" trend="flat" trendLabel="No change" />
      <StatNumber value="42" label="Due today" tone="brick" trend="down" trendLabel="-5 vs last week" />
      <StatNumber value="87%" label="Quiz Score" tone="lavender" sublabel="Last attempt" />
      <StatNumber value="12h" label="Study Time" tone="ochre" trend="up" trendLabel="+3h this week" />
    </div>
  </div>
);

export const StatsGridExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StatsGrid — 2, 3, 4 columns</h2>

    <div>
      <h3 className="font-serif text-base font-bold mb-3">3 columns (default)</h3>
      <div className="max-w-2xl">
        <StatsGrid
          stats={[
            { value: '138', label: 'Concepts', tone: 'sage', trend: 'up', trendLabel: '+12 this week' },
            { value: '24', label: 'Documents', tone: 'sky', trend: 'flat' },
            { value: '12h', label: 'Study Time', tone: 'ochre', trend: 'up', trendLabel: '+3h' },
          ]}
          columns={3}
        />
      </div>
    </div>

    <div>
      <h3 className="font-serif text-base font-bold mb-3">4 columns</h3>
      <div className="max-w-3xl">
        <StatsGrid
          columns={4}
          stats={[
            { value: '138', label: 'Concepts', tone: 'sage' },
            { value: '24', label: 'Documents', tone: 'sky' },
            { value: '42', label: 'Flashcards Due', tone: 'brick', trend: 'down' },
            { value: '87%', label: 'Avg Score', tone: 'lavender', trend: 'up' },
          ]}
        />
      </div>
    </div>

    <div>
      <h3 className="font-serif text-base font-bold mb-3">2 columns</h3>
      <div className="max-w-sm">
        <StatsGrid
          columns={2}
          stats={[
            { value: '56', label: 'Sessions', tone: 'ink', sublabel: 'All time' },
            { value: '7', label: 'Day Streak', tone: 'ochre', trend: 'up' },
          ]}
        />
      </div>
    </div>
  </div>
);

export const MiniChartExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">MiniChart — bar & line</h2>

    <div className="flex flex-wrap gap-8">
      <div className="bg-white/70 rounded-xl p-4 w-48 space-y-2">
        <p className="font-architect text-sm text-ink-muted">Weekly study time (bar)</p>
        <MiniChart
          data={[20, 45, 30, 60, 38, 72, 55]}
          variant="bar"
          color="#7fa37b"
          height={56}
          label="Minutes per day"
        />
      </div>

      <div className="bg-white/70 rounded-xl p-4 w-48 space-y-2">
        <p className="font-architect text-sm text-ink-muted">Score trend (line)</p>
        <MiniChart
          data={[55, 62, 58, 71, 78, 82, 87]}
          variant="line"
          color="#4a6f91"
          height={56}
          label="Quiz score %"
        />
      </div>

      <div className="bg-white/70 rounded-xl p-4 w-48 space-y-2">
        <p className="font-architect text-sm text-ink-muted">Flashcards reviewed (bar)</p>
        <MiniChart
          data={[12, 0, 5, 30, 22, 18, 40]}
          variant="bar"
          color="#b07a2e"
          height={56}
        />
      </div>
    </div>
  </div>
);

export const HeatmapExample = () => {
  // Generate realistic study heatmap data for past year
  const data: Record<string, number> = {};
  const today = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (Math.random() > 0.45) {
      data[key] = Math.floor(Math.random() * 5) + 1;
    }
  }

  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">Heatmap — GitHub-style activity</h2>
      <div className="bg-white/60 rounded-xl p-4 overflow-x-auto">
        <Heatmap data={data} color="#7fa37b" />
      </div>
      <div className="bg-white/60 rounded-xl p-4 overflow-x-auto">
        <p className="font-architect text-xs text-ink-muted mb-2">Blue variant</p>
        <Heatmap data={data} color="#4a6f91" cellSize={14} />
      </div>
    </div>
  );
};

export const ProgressSummaryExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">ProgressSummary</h2>
    <div className="flex flex-wrap gap-6">
      <ProgressSummary
        title="Machine Learning"
        value={68}
        leftStat={{ label: 'Mastered', value: '17' }}
        rightStat={{ label: 'Remaining', value: '8' }}
        badge={<DifficultyBadge difficulty="Medium" />}
        className="w-72"
      />
      <ProgressSummary
        title="Linear Algebra"
        value={100}
        color="#7fa37b"
        leftStat={{ label: 'Mastered', value: '32' }}
        rightStat={{ label: 'Remaining', value: '0' }}
        badge={<DifficultyBadge difficulty="Easy" />}
        className="w-72"
      />
      <ProgressSummary
        title="Neural Networks"
        value={15}
        color="#a3544a"
        leftStat={{ label: 'Mastered', value: '3' }}
        rightStat={{ label: 'Remaining', value: '17' }}
        badge={<DifficultyBadge difficulty="Hard" />}
        className="w-72"
      />
    </div>
  </div>
);

export const InsightBoxExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">InsightBox — all variants</h2>
    <div className="max-w-sm space-y-4">
      <InsightBox variant="tip" title="Pro Tip">
        Use spaced repetition to reduce forgetting — review concepts at increasing intervals.
      </InsightBox>
      <InsightBox variant="warning" title="Attention">
        You haven't reviewed Backpropagation in 14 days. It may be drifting.
      </InsightBox>
      <InsightBox variant="success" title="Achievement Unlocked">
        You've mastered all concepts in the Linear Algebra module. Great work!
      </InsightBox>
      <InsightBox variant="info" title="Did you know?">
        You learn best between 9–11am based on your session history.
      </InsightBox>
      <InsightBox variant="tip">
        No title variant — just body text with the default icon.
      </InsightBox>
    </div>
  </div>
);

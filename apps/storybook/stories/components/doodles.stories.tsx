import React from 'react';
import type { Meta } from '@storybook/react';
import { Paper } from '@paper-ui/components/paper';
import { 
  SunDoodle, ArrowDoodle, SignpostDoodle, StarDoodle, StarDoodleFilled, CheckmarkDoodle, 
  SparkleDoodle, BookmarkDoodle, PaperPlaneDoodle, PencilDoodle, TapeDoodle, PushPinDoodle, 
  CloudDoodle, BrainDoodle, LightbulbDoodle, CompassDoodle 
} from '@paper-ui/components/doodles';
import { PaperBadge } from '@paper-ui/components/badges';

const meta = {
  title: 'Components/Decorations/Doodles',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const DoodleCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Paper className="w-32 h-32 flex flex-col items-center justify-center gap-2" shadowVariant="soft">
    {children}
    <span className="font-mono text-xs text-gray-500">{title}</span>
  </Paper>
);

export const AllDoodles = () => {
  return (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-6 justify-center max-w-4xl mx-auto">
        <DoodleCard title="Sun"><SunDoodle size={40} /></DoodleCard>
        <DoodleCard title="Arrow"><ArrowDoodle size={40} /></DoodleCard>
        <DoodleCard title="Signpost"><SignpostDoodle size={40} /></DoodleCard>
        <DoodleCard title="Star"><StarDoodle size={40} /></DoodleCard>
        <DoodleCard title="Star Filled"><StarDoodleFilled size={40} /></DoodleCard>
        <DoodleCard title="Checkmark"><CheckmarkDoodle size={40} /></DoodleCard>
        <DoodleCard title="Sparkle"><SparkleDoodle size={40} /></DoodleCard>
        <DoodleCard title="Bookmark"><BookmarkDoodle size={40} /></DoodleCard>
        <DoodleCard title="Paper Plane"><PaperPlaneDoodle size={40} /></DoodleCard>
        <DoodleCard title="Pencil"><PencilDoodle size={40} /></DoodleCard>
        <DoodleCard title="Tape"><TapeDoodle size={40} /></DoodleCard>
        <DoodleCard title="Push Pin"><PushPinDoodle size={40} /></DoodleCard>
        <DoodleCard title="Cloud"><CloudDoodle size={40} /></DoodleCard>
        <DoodleCard title="Brain"><BrainDoodle size={40} /></DoodleCard>
        <DoodleCard title="Lightbulb"><LightbulbDoodle size={40} /></DoodleCard>
        <DoodleCard title="Compass"><CompassDoodle size={40} /></DoodleCard>
      </div>
    </div>
  );
};

export const DoodleUseCases = () => {
  return (
    <div className="p-12 flex gap-8 flex-wrap justify-center bg-[#f4f1ea]">
      <Paper shadowVariant="sketch" className="w-64 p-6 relative">
        <div className="absolute -top-6 -right-6 text-yellow-500 rotate-12">
          <SunDoodle size={60} color="currentColor" />
        </div>
        <h3 className="font-serif text-xl font-bold mb-2 mt-4">Morning Notes</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckmarkDoodle size={20} color="#3f7a4e" />
            <span className="font-mono text-sm">Review PRs</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckmarkDoodle size={20} color="#3f7a4e" />
            <span className="font-mono text-sm">Update docs</span>
          </li>
        </ul>
      </Paper>

      <Paper className="w-64 p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-xl font-bold">Great Idea!</h3>
          <LightbulbDoodle size={32} color="#fbbf24" className="rotate-12" />
        </div>
        <p className="font-mono text-sm text-gray-700">
          Use doodles to add personality and draw attention to important areas of the UI.
        </p>
        <div className="absolute -bottom-4 -right-4 flex items-center text-blue-500">
          <span className="font-handwriting text-lg mr-2">Click here!</span>
          <ArrowDoodle size={24} color="currentColor" className="rotate-12" />
        </div>
      </Paper>
      
      <Paper className="w-64 p-6 bg-[#fdfaf5]">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
          <h3 className="font-serif text-xl font-bold">Favorites</h3>
          <StarDoodleFilled size={24} color="#c9954f" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white p-2 border border-gray-200">
            <span className="font-mono text-sm">Component A</span>
            <StarDoodleFilled size={16} color="#c9954f" />
          </div>
          <div className="flex justify-between items-center bg-white p-2 border border-gray-200">
            <span className="font-mono text-sm">Component B</span>
            <StarDoodle size={16} color="#aaa" />
          </div>
        </div>
      </Paper>
    </div>
  );
};

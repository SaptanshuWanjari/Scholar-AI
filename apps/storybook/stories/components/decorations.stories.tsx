import React from 'react';
import type { Meta } from '@storybook/react';
import { Paper } from '../../../../paper-ui/src/components/paper';
import { Tape, PushPin, PaperClip, FoldedCorner, CoffeeRing, NotebookSpiral, PaperStamp, MarkerHighlight, NotebookEdge, Scribble } from '../../../../paper-ui/src/components/decorations';
import { SketchButton } from '../../../../paper-ui/src/components/buttons';

const meta = {
  title: 'Components/Decorations/Decorations',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const TapeExamples = () => {
  return (
    <div className="p-12 space-y-12 bg-[#f4f1ea]">
      <Paper shadowVariant="sketch" className="w-80 p-6 mx-auto mt-6 rotate-2">
        <Tape corner="top-center" rotate={-3} color="#e0cfa4" />
        <h3 className="font-serif text-xl font-bold mb-2">Taped Note</h3>
        <p className="font-mono text-sm text-gray-700">
          This paper is held up by some translucent tape. Notice how it overlays the border.
        </p>
      </Paper>
      
      <div className="flex gap-8 justify-center">
        <Paper className="w-48 p-4 rotate-[-4deg] bg-[#fff9c4]">
          <Tape corner="top-left" rotate={-45} color="#f0d3a8" />
          <Tape corner="bottom-right" rotate={-45} color="#f0d3a8" />
          <p className="font-handwriting text-lg text-center mt-2">Corner Tapes</p>
        </Paper>
      </div>
    </div>
  );
};

export const PinsAndClips = () => {
  return (
    <div className="p-12 flex gap-12 justify-center bg-[#f4f1ea]">
      <Paper shadowVariant="hard" className="w-64 p-6 pt-10 rotate-1">
        <PushPin color="#c95f5f" position="top-center" />
        <h3 className="font-serif text-xl font-bold mb-2">Pinned Notice</h3>
        <p className="font-mono text-sm text-gray-700">
          A classic push pin keeps this important notice on the board.
        </p>
      </Paper>

      <Paper className="w-64 p-6 pt-8 rotate-[-2deg]">
        <PaperClip color="#7a7a7a" position="top-left" />
        <h3 className="font-serif text-xl font-bold mb-2">Clipped Document</h3>
        <p className="font-mono text-sm text-gray-700">
          Attached with a metallic paper clip for a professional yet crafted look.
        </p>
      </Paper>
    </div>
  );
};

export const NotebookStyles = () => {
  return (
    <div className="p-12 flex gap-12 justify-center bg-[#f4f1ea]">
      <Paper className="w-72 h-80 pt-6">
        <NotebookSpiral count={12} />
        <div className="px-8 mt-4 space-y-4">
          <h3 className="font-handwriting text-2xl font-bold text-[#2c2c2c]">Spiral Pad</h3>
          <div className="border-b border-black/10 pb-1 font-mono text-sm">To-do list</div>
          <div className="border-b border-black/10 pb-1 font-mono text-sm">Groceries</div>
        </div>
      </Paper>

      <Paper className="w-72 h-80 pl-10 pt-6">
        <NotebookEdge position="left" holes={12} />
        <div className="px-6 space-y-4">
          <h3 className="font-handwriting text-2xl font-bold text-[#2c2c2c]">Torn Page</h3>
          <div className="border-b border-blue-200 pb-1 font-mono text-sm">Meeting notes</div>
          <Scribble className="h-4 w-32 mt-4 opacity-50" color="#3b82f6" />
        </div>
      </Paper>
    </div>
  );
};

export const MarksAndStamps = () => {
  return (
    <div className="p-12 flex gap-12 justify-center flex-wrap bg-[#f4f1ea]">
      <Paper className="w-72 p-8 pt-10">
        <FoldedCorner position="bottom-right" size={40} />
        <CoffeeRing size={120} position="bottom-right" rotate={12} opacity={0.4} color="#5c4033" />
        <h3 className="font-serif text-xl font-bold mb-4">Well-Loved</h3>
        <p className="font-mono text-sm text-gray-700 relative z-10">
          Folded corners and coffee rings give your UI a lived-in, physical presence.
        </p>
      </Paper>

      <Paper className="w-72 p-8">
        <PaperStamp 
          label="APPROVED" 
          color="#c95f5f"
          rotate={-15}
          position="top-right"
        />
        <h3 className="font-serif text-xl font-bold mb-4">Official</h3>
        <p className="font-mono text-sm text-gray-700 mt-8">
          Stamps can be used for status badges or emphatic feedback.
        </p>
        <div className="mt-4">
          <MarkerHighlight color="#fde047" className="font-bold p-1">
            Highlighted text
          </MarkerHighlight>
        </div>
      </Paper>
    </div>
  );
};

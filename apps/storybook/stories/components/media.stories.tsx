import React, { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Image,
  ImageViewer,
  Gallery,
  Lightbox,
  Thumbnail,
  VirtualList,
  VirtualGrid,
  AvatarGroup,
  VideoPlayer,
  AudioPlayer,
  SortableList,
  TransferList,
  Carousel,
  InfiniteScroll,
  MasonryGrid,
} from '@paper-ui/components/media';
import { Text, Caption } from '@paper-ui/components/typography';
import { PaperButton } from '@paper-ui/components/buttons';

const meta = {
  title: 'Components/Media',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

// ---- Image ----------------------------------------------------------------

export const ImageExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <section className="space-y-3">
      <Caption>rounded=md, aspectRatio=4/3</Caption>
      <Image
        src="https://picsum.photos/seed/notes1/400/300"
        alt="Study notes spread on a desk"
        caption="Fig 1. Annotated lecture notes from Week 3"
        width={300}
        aspectRatio="4/3"
      />
    </section>

    <section className="space-y-3">
      <Caption>rounded=full, width=160</Caption>
      <Image
        src="https://picsum.photos/seed/profile1/200/200"
        alt="Author portrait"
        rounded="full"
        width={160}
        aspectRatio="1/1"
        objectFit="cover"
      />
    </section>

    <section className="space-y-3">
      <Caption>rounded=sm, aspectRatio=16/9</Caption>
      <Image
        src="https://picsum.photos/seed/diagram1/640/360"
        alt="Neural network architecture diagram"
        width={400}
        aspectRatio="16/9"
        rounded="sm"
      />
    </section>

    <section className="flex gap-4 flex-wrap">
      {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
        <div key={r} className="text-center space-y-1">
          <Image
            src={`https://picsum.photos/seed/round_${r}/120/120`}
            alt={`rounded ${r}`}
            width={100}
            aspectRatio="1/1"
            rounded={r}
          />
          <Small>{r}</Small>
        </div>
      ))}
    </section>
  </div>
);

// ---- ImageViewer ----------------------------------------------------------

export const ImageViewerExample = () => (
  <div className="p-10 bg-[#f4f1ea] max-w-2xl">
    <ImageViewer
      src="https://picsum.photos/seed/mindmap/800/500"
      alt="Mind map of biochemistry pathways"
      caption="Use scroll wheel or buttons to zoom. Drag to pan when zoomed."
    />
  </div>
);

// ---- Gallery --------------------------------------------------------------

export const GalleryExample = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <section className="space-y-3">
      <Caption>columns=3, gap=md</Caption>
      <Gallery
        images={[
          { src: 'https://picsum.photos/seed/g1/400/300', alt: 'Flashcard deck' },
          { src: 'https://picsum.photos/seed/g2/400/300', alt: 'Textbook page' },
          { src: 'https://picsum.photos/seed/g3/400/300', alt: 'Study notes' },
          { src: 'https://picsum.photos/seed/g4/400/300', alt: 'Whiteboard diagram', caption: 'Whiteboard' },
          { src: 'https://picsum.photos/seed/g5/400/300', alt: 'Reference sheet' },
          { src: 'https://picsum.photos/seed/g6/400/300', alt: 'Summary mind map', caption: 'Mind map' },
        ]}
        columns={3}
      />
    </section>

    <section className="space-y-3">
      <Caption>columns=2, gap=lg</Caption>
      <Gallery
        images={[
          { src: 'https://picsum.photos/seed/g7/500/375', alt: 'Lecture slide 1', caption: 'Slide 1' },
          { src: 'https://picsum.photos/seed/g8/500/375', alt: 'Lecture slide 2', caption: 'Slide 2' },
          { src: 'https://picsum.photos/seed/g9/500/375', alt: 'Lecture slide 3', caption: 'Slide 3' },
          { src: 'https://picsum.photos/seed/g10/500/375', alt: 'Lecture slide 4', caption: 'Slide 4' },
        ]}
        columns={2}
        gap="lg"
      />
    </section>
  </div>
);

// ---- Lightbox -------------------------------------------------------------

export const LightboxExample = () => {
  const [open, setOpen] = useState(false);
  const images = [
    { src: 'https://picsum.photos/seed/lb1/800/600', alt: 'Diagram 1', caption: 'Neural network architecture' },
    { src: 'https://picsum.photos/seed/lb2/800/600', alt: 'Diagram 2', caption: 'Backpropagation visualized' },
    { src: 'https://picsum.photos/seed/lb3/800/600', alt: 'Diagram 3', caption: 'Gradient descent surface' },
    { src: 'https://picsum.photos/seed/lb4/800/600', alt: 'Diagram 4', caption: 'Activation functions' },
  ];
  return (
    <div className="p-10 bg-[#f4f1ea]">
      <PaperButton size="sm" onClick={() => setOpen(true)}>
        View 4 diagrams
      </PaperButton>
      <Lightbox images={images} initialIndex={0} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

// ---- Thumbnail ------------------------------------------------------------

export const ThumbnailExample = () => {
  const [sel, setSel] = useState(0);
  return (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>Click a thumbnail to select</Caption>
      <div className="flex gap-3 flex-wrap mt-3">
        {['Notes', 'Diagrams', 'Slides', 'References'].map((label, i) => (
          <Thumbnail
            key={label}
            src={`https://picsum.photos/seed/thumb_${i}/160/160`}
            alt={label}
            size={100}
            selected={sel === i}
            onClick={() => setSel(i)}
            label={label}
          />
        ))}
      </div>
    </div>
  );
};

// ---- VirtualList ----------------------------------------------------------

const VListExample = () => {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    label: `Row ${i + 1}`,
  }));
  return (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>1000 items, 36px height, 400px container</Caption>
      <div className="mt-3 border border-[#d4cfc2] rounded-lg">
        <VirtualList
          items={items}
          itemHeight={36}
          height={400}
          renderItem={(item) => (
            <div className="flex items-center h-full px-4 font-kalam text-sm text-[#3a3733] border-b border-[#f0efed]">
              {item.label}
            </div>
          )}
        />
      </div>
    </div>
  );
};

// ---- VirtualGrid ----------------------------------------------------------

const VGridExample = () => {
  const items = Array.from({ length: 500 }, (_, i) => ({
    id: i,
    color: `hsl(${(i * 37) % 360}, 60%, 75%)`,
  }));
  return (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>500 items, 120x120 cells, 400px container</Caption>
      <div className="mt-3 border border-[#d4cfc2] rounded-lg">
        <VirtualGrid
          items={items}
          itemWidth={120}
          itemHeight={120}
          height={400}
          gap={8}
          renderItem={(item) => (
            <div
              className="rounded-md flex items-center justify-center font-architect text-xs text-[#3a3733] border border-[#d4cfc2] h-full"
              style={{ background: item.color }}
            >
              Card {item.id}
            </div>
          )}
        />
      </div>
    </div>
  );
};

// ---- AvatarGroup ----------------------------------------------------------

export const AvatarGroupExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <section className="space-y-2">
      <Caption>With images</Caption>
      <AvatarGroup
        avatars={[
          { src: 'https://picsum.photos/seed/ava1/80/80', name: 'Alice Chen' },
          { src: 'https://picsum.photos/seed/ava2/80/80', name: 'Bob Miller' },
          { src: 'https://picsum.photos/seed/ava3/80/80', name: 'Carol Wu' },
        ]}
      />
    </section>

    <section className="space-y-2">
      <Caption>Initials fallback + overflow</Caption>
      <AvatarGroup
        avatars={[
          { name: 'Alice Chen' },
          { name: 'Bob Miller' },
          { name: 'Carol Wu' },
          { name: 'David Park' },
          { name: 'Eva Torres' },
          { name: 'Frank Li' },
        ]}
        max={4}
        size={40}
      />
    </section>

    <section className="space-y-2">
      <Caption>Mixed images + initials, size=48</Caption>
      <AvatarGroup
        avatars={[
          { src: 'https://picsum.photos/seed/ava4/100/100', name: 'Grace Kim' },
          { name: 'Henry Jones' },
          { src: 'https://picsum.photos/seed/ava5/100/100', name: 'Iris Vega' },
        ]}
        size={48}
      />
    </section>
  </div>
);

// ---- VideoPlayer ----------------------------------------------------------

export const VideoPlayerExample = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <Caption>MP4 video with custom paper controls</Caption>
    <div className="mt-3 max-w-2xl w-full">
      <VideoPlayer
        src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
        poster="https://picsum.photos/seed/video/720/405"
        width="100%"
        height={360}
      />
    </div>
  </div>
);

// ---- AudioPlayer ----------------------------------------------------------

export const AudioPlayerExample = () => (
  <div className="p-10 bg-[#f4f1ea] max-w-md">
    <Caption>Audio player with paper styling</Caption>
    <AudioPlayer
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      title="Lecture Recording — Week 4"
    />
  </div>
);

// ---- SortableList ---------------------------------------------------------

export const SortableListExample = () => {
  const [items, setItems] = useState([
    { id: '1', content: 'Introduction to Machine Learning' },
    { id: '2', content: 'Supervised Learning Algorithms' },
    { id: '3', content: 'Unsupervised Learning' },
    { id: '4', content: 'Neural Networks & Deep Learning' },
    { id: '5', content: 'Reinforcement Learning' },
  ]);
  return (
    <div className="p-10 bg-[#f4f1ea] max-w-md">
      <Caption>Drag items to reorder</Caption>
      <SortableList items={items} onReorder={setItems} className="mt-3" />
    </div>
  );
};

// ---- TransferList ---------------------------------------------------------

export const TransferListExample = () => {
  const all = [
    { id: '1', label: 'Linear Algebra' },
    { id: '2', label: 'Calculus' },
    { id: '3', label: 'Probability Theory' },
    { id: '4', label: 'Statistics' },
    { id: '5', label: 'Optimization' },
    { id: '6', label: 'Graph Theory' },
  ];
  const [left, setLeft] = useState(all);
  const [right, setRight] = useState<typeof all>([]);

  return (
    <div className="p-10 bg-[#f4f1ea] max-w-3xl">
      <Caption>Move items between lists</Caption>
      <TransferList left={left} right={right} onChange={(l, r) => { setLeft(l); setRight(r); }} className="mt-3" />
    </div>
  );
};

// ---- Carousel -------------------------------------------------------------

export const CarouselExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-lg">
    <section className="space-y-2">
      <Caption>Manual navigation</Caption>
      <Carousel>
        <div className="h-56 bg-[#e8e4dc] flex items-center justify-center font-kalam text-xl text-[#3a3733]">Study tip 1: Active recall beats re-reading</div>
        <div className="h-56 bg-[#dfebd6] flex items-center justify-center font-kalam text-xl text-[#3a3733]">Study tip 2: Space out your repetition</div>
        <div className="h-56 bg-[#dde4f0] flex items-center justify-center font-kalam text-xl text-[#3a3733]">Study tip 3: Teach what you learn</div>
      </Carousel>
    </section>

    <section className="space-y-2">
      <Caption>Auto-play every 3s</Caption>
      <Carousel autoPlay={3000}>
        <div className="h-48 bg-[#f0ebe2] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 1 — Introduction</div>
        <div className="h-48 bg-[#ebe0d4] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 2 — Methods</div>
        <div className="h-48 bg-[#e2dbe6] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 3 — Results</div>
        <div className="h-48 bg-[#dce4d8] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 4 — Discussion</div>
      </Carousel>
    </section>
  </div>
);

// ---- InfiniteScroll -------------------------------------------------------

export const InfiniteScrollExample = () => {
  const [count, setCount] = useState(20);
  const loadMore = useCallback(() => {
    setTimeout(() => setCount((c) => Math.min(c + 10, 60)), 500);
  }, []);

  return (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>Scroll down to load more (max 60 items).</Caption>
      <div className="mt-3 border border-[#d4cfc2] rounded-lg" style={{ height: 300, overflowY: 'auto' }}>
        <InfiniteScroll onLoadMore={loadMore} hasMore={count < 60}>
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="px-4 py-2 font-kalam text-sm text-[#3a3733] border-b border-[#f0efed]">
              Item {i + 1}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

// ---- MasonryGrid ----------------------------------------------------------

export const MasonryGridExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <section className="space-y-2">
      <Caption>columns=3, gap=16</Caption>
      <MasonryGrid columns={3} gap={16} className="mt-2">
        {[
          { h: 160, c: '#e8e4dc', t: 'Linear Algebra' },
          { h: 200, c: '#dfebd6', t: 'Calculus III' },
          { h: 120, c: '#dde4f0', t: 'Probability' },
          { h: 180, c: '#f0ebe2', t: 'Statistics' },
          { h: 140, c: '#ebe0d4', t: 'Optimization' },
          { h: 220, c: '#e2dbe6', t: 'Graph Theory' },
          { h: 160, c: '#dce4d8', t: 'Number Theory' },
          { h: 100, c: '#f0efed', t: 'Topology' },
        ].map((card) => (
          <div
            key={card.t}
            className="rounded-lg p-4 border border-[#d4cfc2] font-kalam text-[#3a3733]"
            style={{ height: card.h, background: card.c, marginBottom: 16 }}
          >
            <strong>{card.t}</strong>
            <p className="text-xs text-[#9c9484] mt-1">Sample note content for {card.t.toLowerCase()}.</p>
          </div>
        ))}
      </MasonryGrid>
    </section>

    <section className="space-y-2">
      <Caption>columns=4, gap=12</Caption>
      <MasonryGrid columns={4} gap={12}>
        {Array.from({ length: 12 }, (_, i) => {
          const h = 80 + Math.random() * 120;
          return (
            <div
              key={i}
              className="rounded-lg border border-[#d4cfc2] flex items-center justify-center font-architect text-xs text-[#9c9484]"
              style={{ height: h, background: '#faf8f5', marginBottom: 12 }}
            >
              Tile {i + 1}
            </div>
          );
        })}
      </MasonryGrid>
    </section>
  </div>
);

// ---- Combine virt list + virt grid examples -------------------------------

export const VirtualListStory: StoryObj = {
  render: VListExample,
  name: 'VirtualList',
};

export const VirtualGridStory: StoryObj = {
  render: VGridExample,
  name: 'VirtualGrid',
};

function Small({ children }: { children: React.ReactNode }) {
  return <span className="font-architect text-xs text-[#9c9484]">{children}</span>;
}

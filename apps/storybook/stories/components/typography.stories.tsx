import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Text,
  Paragraph,
  Link,
  Blockquote,
  InlineCode,
  CodeBlock,
  Caption,
  Kbd,
  Mark,
  Small,
  Muted,
} from '@paper-ui/components/typography';

const meta = {
  title: 'Components/Typography',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

// ─── Text ────────────────────────────────────────────────────────────────────

export const TextExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <section className="space-y-3">
      <h2 className="font-architect text-xs uppercase tracking-widest text-[#9c9484] mb-4">
        Font Families
      </h2>
      <div className="space-y-2">
        <Text font="kalam" size="lg">Kalam — handwritten, warm, personal</Text>
        <Text font="architect" size="lg">Architect — geometric, structured, clean</Text>
        <Text font="caveat" size="lg">Caveat — sketchy, expressive, casual</Text>
        <Text font="mono" size="lg">Mono — precise, technical, code-like</Text>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="font-architect text-xs uppercase tracking-widest text-[#9c9484] mb-4">
        Sizes
      </h2>
      <div className="space-y-1">
        <Text size="xs" font="kalam">xs — Extra small text for fine print</Text>
        <Text size="sm" font="kalam">sm — Small text for secondary info</Text>
        <Text size="base" font="kalam">base — Default body text size</Text>
        <Text size="lg" font="kalam">lg — Large for emphasis</Text>
        <Text size="xl" font="kalam">xl — Extra large for display</Text>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="font-architect text-xs uppercase tracking-widest text-[#9c9484] mb-4">
        Tones
      </h2>
      <div className="space-y-2">
        <Text tone="ink" font="kalam" size="base" as="p">ink — The default deep warm dark</Text>
        <Text tone="muted" font="kalam" size="base" as="p">muted — Secondary, subdued information</Text>
        <Text tone="sage" font="kalam" size="base" as="p">sage — Forest green, nature, growth</Text>
        <Text tone="ochre" font="kalam" size="base" as="p">ochre — Warm amber, highlight, attention</Text>
        <Text tone="sky" font="kalam" size="base" as="p">sky — Calm blue, links, navigation</Text>
        <Text tone="lavender" font="kalam" size="base" as="p">lavender — Soft purple, creativity, notes</Text>
        <Text tone="brick" font="kalam" size="base" as="p">brick — Terracotta, warmth, alerts</Text>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="font-architect text-xs uppercase tracking-widest text-[#9c9484] mb-4">
        Weights
      </h2>
      <div className="space-y-2">
        <Text weight="normal" font="architect" size="base" as="p">normal — Regular weight text</Text>
        <Text weight="medium" font="architect" size="base" as="p">medium — Slightly heavier for contrast</Text>
        <Text weight="semibold" font="architect" size="base" as="p">semibold — Labels and subheadings</Text>
        <Text weight="bold" font="architect" size="base" as="p">bold — Strong emphasis</Text>
      </div>
    </section>
  </div>
);

// ─── Paragraph ───────────────────────────────────────────────────────────────

export const ParagraphExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-2xl">
    <section className="space-y-4">
      <Caption>size=sm, leading=relaxed</Caption>
      <Paragraph size="sm" leading="relaxed">
        Active recall is one of the most powerful study techniques. Instead of passively
        re-reading your notes, test yourself by closing the book and writing down everything
        you remember. The struggle of retrieval strengthens long-term memory.
      </Paragraph>

      <Caption>size=base, leading=relaxed</Caption>
      <Paragraph size="base" leading="relaxed">
        Spaced repetition works by reviewing material at increasing intervals just before you
        forget it. This exploits the spacing effect — a phenomenon where our brains encode
        information more deeply when we encounter it across multiple sessions over time.
      </Paragraph>

      <Caption>size=lg, leading=loose</Caption>
      <Paragraph size="lg" leading="loose">
        The Feynman Technique asks you to explain a concept in the simplest terms possible,
        as though teaching it to a child. Wherever you stumble is exactly where your
        understanding has gaps — and that's where your study energy should go.
      </Paragraph>
    </section>
  </div>
);

// ─── Link ────────────────────────────────────────────────────────────────────

export const LinkExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <Paragraph>
      Read the{' '}
      <Link href="#" underline="always" tone="sky">
        complete study guide
      </Link>{' '}
      for a structured overview of spaced repetition methods.
    </Paragraph>

    <Paragraph>
      Hover to reveal the link:{' '}
      <Link href="#" underline="hover" tone="sage">
        Anki flashcard templates
      </Link>{' '}
      are free and customisable.
    </Paragraph>

    <Paragraph>
      This{' '}
      <Link href="#" underline="none" tone="ochre">
        no-underline link
      </Link>{' '}
      is identified by colour alone.
    </Paragraph>

    <Paragraph>
      Download the PDF from the{' '}
      <Link href="https://example.com" underline="always" tone="sky" external>
        official research paper
      </Link>{' '}
      published last year.
    </Paragraph>

    <Paragraph>
      Visit{' '}
      <Link href="https://example.com" underline="hover" tone="ink" external>
        the author's blog
      </Link>{' '}
      for more insights on learning science.
    </Paragraph>
  </div>
);

// ─── Blockquote ──────────────────────────────────────────────────────────────

export const BlockquoteExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-2xl">
    <Blockquote tone="ochre" attribution="Richard Feynman">
      The first principle is that you must not fool yourself — and you are the easiest
      person to fool.
    </Blockquote>

    <Blockquote tone="sage" attribution="Cal Newport, Deep Work">
      If you don't produce, you won't thrive — no matter how skilled or talented you are.
      Clarity about what matters most provides clarity about what does not.
    </Blockquote>

    <Blockquote tone="lavender" attribution="Hermann Ebbinghaus">
      With any considerable series of syllables, the number of repetitions necessary
      to commit them to memory rises sharply as the number of syllables increases.
    </Blockquote>

    <Blockquote tone="sky">
      Retrieval practice is more effective than elaborative studying with repeated reading.
    </Blockquote>

    <Blockquote tone="brick" attribution="Seneca">
      While we are postponing, life speeds by.
    </Blockquote>
  </div>
);

// ─── InlineCode + Kbd ────────────────────────────────────────────────────────

export const InlineCodeAndKbd = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] max-w-2xl">
    <Paragraph>
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette and search for any
      note or flashcard deck instantly.
    </Paragraph>

    <Paragraph>
      Use <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to submit your answer and reveal
      the back of the card.
    </Paragraph>

    <Paragraph>
      The <InlineCode>softmax</InlineCode> function normalizes a vector of raw scores
      into a probability distribution that sums to 1.
    </Paragraph>

    <Paragraph>
      When implementing backprop, remember to call <InlineCode>loss.backward()</InlineCode>{' '}
      before <InlineCode>optimizer.step()</InlineCode> — order matters.
    </Paragraph>

    <Paragraph>
      Set <InlineCode>STUDY_MODE=focused</InlineCode> in your environment to enable
      distraction-blocking and auto-save every 60 seconds.
    </Paragraph>
  </div>
);

// ─── CodeBlock ───────────────────────────────────────────────────────────────

export const CodeBlockExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-2xl">
    <CodeBlock language="python" filename="flashcard_scheduler.py" showLineNumbers>
{`import datetime

def next_review(interval: int, ease: float) -> datetime.date:
    """Calculate next review date using SM-2 algorithm."""
    today = datetime.date.today()
    days = round(interval * ease)
    return today + datetime.timedelta(days=days)

# Initial review schedule
schedule = [1, 6, 14, 30, 90]
ease_factor = 2.5

for i, interval in enumerate(schedule):
    date = next_review(interval, ease_factor)
    print(f"Review {i + 1}: {date}")`}
    </CodeBlock>

    <CodeBlock language="typescript" filename="useStudySession.ts" showLineNumbers>
{`import { useState, useCallback } from 'react';

interface Card {
  id: string;
  front: string;
  back: string;
  ease: number;
  interval: number;
}

export function useStudySession(cards: Card[]) {
  const [index, setIndex] = useState(0);
  const [revealed, setReveal] = useState(false);

  const next = useCallback(() => {
    setReveal(false);
    setIndex(i => Math.min(i + 1, cards.length - 1));
  }, [cards.length]);

  return { card: cards[index], revealed, setReveal, next };
}`}
    </CodeBlock>

    <CodeBlock language="bash">
{`# Install paper-ui typography components
pnpm add @paper-ui/components

# Run storybook to preview all stories
pnpm storybook`}
    </CodeBlock>
  </div>
);

// ─── Mark ────────────────────────────────────────────────────────────────────

export const MarkExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] max-w-2xl">
    <Paragraph leading="loose">
      Transformer models use <Mark>self-attention mechanisms</Mark> to weigh the
      importance of different tokens in a sequence relative to each other, enabling
      the model to capture long-range dependencies that RNNs struggle with.
    </Paragraph>

    <Paragraph leading="loose">
      The key insight behind <Mark color="#bfdbfe">gradient descent</Mark> is that
      by iteratively moving in the direction of steepest descent of the loss surface,
      we can find parameters that minimise prediction error.
    </Paragraph>

    <Paragraph leading="loose">
      During fine-tuning, we typically freeze the <Mark color="#bbf7d0">early layers</Mark>{' '}
      of a pretrained model and only train the <Mark color="#fca5a5">later layers</Mark>,
      since early layers capture universal low-level features while later layers are
      more task-specific.
    </Paragraph>
  </div>
);

// ─── Small + Muted + Caption ─────────────────────────────────────────────────

export const SmallAndMuted = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    {/* Form field with helper */}
    <section className="space-y-1 max-w-sm">
      <label className="font-architect text-sm text-[#3a3733]">Deck name</label>
      <input
        className="w-full border border-[#d4cfc2] bg-[#faf8f5] rounded px-3 py-1.5 font-kalam text-sm text-[#3a3733] outline-none focus:border-[#9c9484]"
        placeholder="e.g. Biochemistry Chapter 4"
      />
      <Small>Must be unique within your library. Max 60 characters.</Small>
    </section>

    {/* Image with caption */}
    <section className="space-y-2 max-w-xs">
      <div className="w-full h-28 bg-[#ebe7df] rounded-lg flex items-center justify-center text-[#9c9484] font-architect text-xs">
        [study diagram placeholder]
      </div>
      <Caption align="center">Fig 1. The Ebbinghaus forgetting curve over 7 days.</Caption>
    </section>

    {/* Muted helper text in a card */}
    <section className="space-y-2 max-w-md p-4 bg-[#faf8f5] border border-[#d4cfc2] rounded-lg">
      <p className="font-kalam text-base text-[#3a3733]">No cards due today</p>
      <Muted>You're all caught up! Come back tomorrow to continue your streak.</Muted>
    </section>

    {/* Mixed row */}
    <section className="flex items-center gap-3">
      <span className="font-architect text-sm text-[#3a3733]">Last reviewed</span>
      <Small>3 days ago</Small>
      <Muted>·</Muted>
      <Small>Next due in 11 days</Small>
    </section>
  </div>
);

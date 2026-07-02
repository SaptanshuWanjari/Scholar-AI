import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Text as TypographyText,
  Paragraph as TypographyParagraph,
  Link as TypographyLink,
  Blockquote as TypographyBlockquote,
  InlineCode as TypographyInlineCode,
  CodeBlock as TypographyCodeBlock,
  Caption as TypographyCaption,
  Kbd as TypographyKbd,
  Mark as TypographyMark,
  Small as TypographySmall,
  Muted as TypographyMuted,
} from '@paper-ui/components/typography';

const meta = {
  title: 'Components/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `## Typography

A complete set of typographic primitives for paper-like UI. Each component supports configurable font families (kalam, architect, caveat, mono), sizes, tones, and weights. Designed for study-app contexts where handwritten and typewriter aesthetics coexist.

### Components
- **Text** — inline text with font/size/tone/weight props
- **Paragraph** — body text with configurable leading
- **Link** — anchor with underline variants and external support
- **Blockquote** — styled quotation with attribution
- **InlineCode** — inline code snippets
- **CodeBlock** — fenced code blocks with language, filename, and line numbers
- **Caption** — small descriptive text (figures, image captions)
- **Kbd** — keyboard key visual
- **Mark** — highlighted text overlay
- **Small** — de-emphasized helper text
- **Muted** — lowest-emphasis text`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

// ─── Text ────────────────────────────────────────────────────────────────────

export const Text = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <section className="space-y-3">
      <h2 className="font-architect text-xs uppercase tracking-widest text-[#9c9484] mb-4">
        Font Families
      </h2>
      <div className="space-y-2">
        <TypographyText font="kalam" size="lg">Kalam — handwritten, warm, personal</TypographyText>
        <TypographyText font="architect" size="lg">Architect — geometric, structured, clean</TypographyText>
        <TypographyText font="caveat" size="lg">Caveat — sketchy, expressive, casual</TypographyText>
        <TypographyText font="mono" size="lg">Mono — precise, technical, code-like</TypographyText>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="font-architect text-xs uppercase tracking-widest text-[#9c9484] mb-4">
        Sizes
      </h2>
      <div className="space-y-1">
        <TypographyText size="xs" font="kalam">xs — Extra small text for fine print</TypographyText>
        <TypographyText size="sm" font="kalam">sm — Small text for secondary info</TypographyText>
        <TypographyText size="base" font="kalam">base — Default body text size</TypographyText>
        <TypographyText size="lg" font="kalam">lg — Large for emphasis</TypographyText>
        <TypographyText size="xl" font="kalam">xl — Extra large for display</TypographyText>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="font-architect text-xs uppercase tracking-widest text-[#9c9484] mb-4">
        Tones
      </h2>
      <div className="space-y-2">
        <TypographyText tone="ink" font="kalam" size="base" as="p">ink — The default deep warm dark</TypographyText>
        <TypographyText tone="muted" font="kalam" size="base" as="p">muted — Secondary, subdued information</TypographyText>
        <TypographyText tone="sage" font="kalam" size="base" as="p">sage — Forest green, nature, growth</TypographyText>
        <TypographyText tone="ochre" font="kalam" size="base" as="p">ochre — Warm amber, highlight, attention</TypographyText>
        <TypographyText tone="sky" font="kalam" size="base" as="p">sky — Calm blue, links, navigation</TypographyText>
        <TypographyText tone="lavender" font="kalam" size="base" as="p">lavender — Soft purple, creativity, notes</TypographyText>
        <TypographyText tone="brick" font="kalam" size="base" as="p">brick — Terracotta, warmth, alerts</TypographyText>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="font-architect text-xs uppercase tracking-widest text-[#9c9484] mb-4">
        Weights
      </h2>
      <div className="space-y-2">
        <TypographyText weight="normal" font="architect" size="base" as="p">normal — Regular weight text</TypographyText>
        <TypographyText weight="medium" font="architect" size="base" as="p">medium — Slightly heavier for contrast</TypographyText>
        <TypographyText weight="semibold" font="architect" size="base" as="p">semibold — Labels and subheadings</TypographyText>
        <TypographyText weight="bold" font="architect" size="base" as="p">bold — Strong emphasis</TypographyText>
      </div>
    </section>
  </div>
);

// ─── Paragraph ───────────────────────────────────────────────────────────────

export const Paragraph = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-2xl">
    <section className="space-y-4">
      <TypographyCaption>size=sm, leading=relaxed</TypographyCaption>
      <TypographyParagraph size="sm" leading="relaxed">
        Active recall is one of the most powerful study techniques. Instead of passively
        re-reading your notes, test yourself by closing the book and writing down everything
        you remember. The struggle of retrieval strengthens long-term memory.
      </TypographyParagraph>

      <TypographyCaption>size=base, leading=relaxed</TypographyCaption>
      <TypographyParagraph size="base" leading="relaxed">
        Spaced repetition works by reviewing material at increasing intervals just before you
        forget it. This exploits the spacing effect — a phenomenon where our brains encode
        information more deeply when we encounter it across multiple sessions over time.
      </TypographyParagraph>

      <TypographyCaption>size=lg, leading=loose</TypographyCaption>
      <TypographyParagraph size="lg" leading="loose">
        The Feynman Technique asks you to explain a concept in the simplest terms possible,
        as though teaching it to a child. Wherever you stumble is exactly where your
        understanding has gaps — and that's where your study energy should go.
      </TypographyParagraph>
    </section>
  </div>
);

// ─── Link ────────────────────────────────────────────────────────────────────

export const Link = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <TypographyParagraph>
      Read the{' '}
      <TypographyLink href="#" underline="always" tone="sky">
        complete study guide
      </TypographyLink>{' '}
      for a structured overview of spaced repetition methods.
    </TypographyParagraph>

    <TypographyParagraph>
      Hover to reveal the link:{' '}
      <TypographyLink href="#" underline="hover" tone="sage">
        Anki flashcard templates
      </TypographyLink>{' '}
      are free and customisable.
    </TypographyParagraph>

    <TypographyParagraph>
      This{' '}
      <TypographyLink href="#" underline="none" tone="ochre">
        no-underline link
      </TypographyLink>{' '}
      is identified by colour alone.
    </TypographyParagraph>

    <TypographyParagraph>
      Download the PDF from the{' '}
      <TypographyLink href="https://example.com" underline="always" tone="sky" external>
        official research paper
      </TypographyLink>{' '}
      published last year.
    </TypographyParagraph>

    <TypographyParagraph>
      Visit{' '}
      <TypographyLink href="https://example.com" underline="hover" tone="ink" external>
        the author's blog
      </TypographyLink>{' '}
      for more insights on learning science.
    </TypographyParagraph>
  </div>
);

// ─── Blockquote ──────────────────────────────────────────────────────────────

export const Blockquote = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-2xl">
    <TypographyBlockquote tone="ochre" attribution="Richard Feynman">
      The first principle is that you must not fool yourself — and you are the easiest
      person to fool.
    </TypographyBlockquote>

    <TypographyBlockquote tone="sage" attribution="Cal Newport, Deep Work">
      If you don't produce, you won't thrive — no matter how skilled or talented you are.
      Clarity about what matters most provides clarity about what does not.
    </TypographyBlockquote>

    <TypographyBlockquote tone="lavender" attribution="Hermann Ebbinghaus">
      With any considerable series of syllables, the number of repetitions necessary
      to commit them to memory rises sharply as the number of syllables increases.
    </TypographyBlockquote>

    <TypographyBlockquote tone="sky">
      Retrieval practice is more effective than elaborative studying with repeated reading.
    </TypographyBlockquote>

    <TypographyBlockquote tone="brick" attribution="Seneca">
      While we are postponing, life speeds by.
    </TypographyBlockquote>
  </div>
);

// ─── InlineCode + Kbd ────────────────────────────────────────────────────────

export const InlineCodeAndKbd = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] max-w-2xl">
    <TypographyParagraph>
      Press <TypographyKbd>⌘</TypographyKbd> <TypographyKbd>K</TypographyKbd> to open the command palette and search for any
      note or flashcard deck instantly.
    </TypographyParagraph>

    <TypographyParagraph>
      Use <TypographyKbd>Ctrl</TypographyKbd> + <TypographyKbd>Enter</TypographyKbd> to submit your answer and reveal
      the back of the card.
    </TypographyParagraph>

    <TypographyParagraph>
      The <TypographyInlineCode>softmax</TypographyInlineCode> function normalizes a vector of raw scores
      into a probability distribution that sums to 1.
    </TypographyParagraph>

    <TypographyParagraph>
      When implementing backprop, remember to call <TypographyInlineCode>loss.backward()</TypographyInlineCode>{' '}
      before <TypographyInlineCode>optimizer.step()</TypographyInlineCode> — order matters.
    </TypographyParagraph>

    <TypographyParagraph>
      Set <TypographyInlineCode>STUDY_MODE=focused</TypographyInlineCode> in your environment to enable
      distraction-blocking and auto-save every 60 seconds.
    </TypographyParagraph>
  </div>
);

// ─── CodeBlock ───────────────────────────────────────────────────────────────

export const CodeBlock = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-2xl">
    <TypographyCodeBlock language="python" filename="flashcard_scheduler.py" showLineNumbers>
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
    </TypographyCodeBlock>

    <TypographyCodeBlock language="typescript" filename="useStudySession.ts" showLineNumbers>
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
    </TypographyCodeBlock>

    <TypographyCodeBlock language="bash">
{`# Install paper-ui typography components
pnpm add @paper-ui/components

# Run storybook to preview all stories
pnpm storybook`}
    </TypographyCodeBlock>
  </div>
);

// ─── Mark ────────────────────────────────────────────────────────────────────

export const Mark = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea] max-w-2xl">
    <TypographyParagraph leading="loose">
      Transformer models use <TypographyMark>self-attention mechanisms</TypographyMark> to weigh the
      importance of different tokens in a sequence relative to each other, enabling
      the model to capture long-range dependencies that RNNs struggle with.
    </TypographyParagraph>

    <TypographyParagraph leading="loose">
      The key insight behind <TypographyMark color="#bfdbfe">gradient descent</TypographyMark> is that
      by iteratively moving in the direction of steepest descent of the loss surface,
      we can find parameters that minimise prediction error.
    </TypographyParagraph>

    <TypographyParagraph leading="loose">
      During fine-tuning, we typically freeze the <TypographyMark color="#bbf7d0">early layers</TypographyMark>{' '}
      of a pretrained model and only train the <TypographyMark color="#fca5a5">later layers</TypographyMark>,
      since early layers capture universal low-level features while later layers are
      more task-specific.
    </TypographyParagraph>
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
      <TypographySmall>Must be unique within your library. Max 60 characters.</TypographySmall>
    </section>

    {/* Image with caption */}
    <section className="space-y-2 max-w-xs">
      <div className="w-full h-28 bg-[#ebe7df] rounded-lg flex items-center justify-center text-[#9c9484] font-architect text-xs">
        [study diagram placeholder]
      </div>
      <TypographyCaption align="center">Fig 1. The Ebbinghaus forgetting curve over 7 days.</TypographyCaption>
    </section>

    {/* Muted helper text in a card */}
    <section className="space-y-2 max-w-md p-4 bg-[#faf8f5] border border-[#d4cfc2] rounded-lg">
      <p className="font-kalam text-base text-[#3a3733]">No cards due today</p>
      <TypographyMuted>You're all caught up! Come back tomorrow to continue your streak.</TypographyMuted>
    </section>

    {/* Mixed row */}
    <section className="flex items-center gap-3">
      <span className="font-architect text-sm text-[#3a3733]">Last reviewed</span>
      <TypographySmall>3 days ago</TypographySmall>
      <TypographyMuted>·</TypographyMuted>
      <TypographySmall>Next due in 11 days</TypographySmall>
    </section>
  </div>
);

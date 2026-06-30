export const PAPER_TOKENS = {
  bg:        'var(--paper-bg)',
  surface:   'var(--paper-surface)',
  panel:     'var(--paper-panel)',
  ink:       'var(--paper-ink)',
  inkMuted:  'var(--paper-ink-muted)',
  inkFaint:  'var(--paper-ink-faint)',
  stroke:    'var(--paper-stroke)',
  strokeSm:  'var(--paper-stroke-sm)',
  success:   'var(--paper-success)',
  warning:   'var(--paper-warning)',
  danger:    'var(--paper-danger)',
  accent:    'var(--paper-accent)',
  border:    'var(--paper-border)',
} as const

export type PaperToken = keyof typeof PAPER_TOKENS

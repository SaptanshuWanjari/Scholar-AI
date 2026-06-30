import type * as React from 'react'

export const Keys = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  Tab: 'Tab',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Backspace: 'Backspace',
} as const

type Modifiers = {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
}

export function isShortcut(
  event: KeyboardEvent | React.KeyboardEvent,
  key: string,
  modifiers: Modifiers = {}
) {
  if (event.key.toLowerCase() !== key.toLowerCase()) return false
  if (modifiers.ctrl !== undefined && event.ctrlKey !== modifiers.ctrl) return false
  if (modifiers.shift !== undefined && event.shiftKey !== modifiers.shift) return false
  if (modifiers.alt !== undefined && event.altKey !== modifiers.alt) return false
  if (modifiers.meta !== undefined && event.metaKey !== modifiers.meta) return false
  return true
}

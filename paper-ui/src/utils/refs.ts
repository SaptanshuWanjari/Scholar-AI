import * as React from 'react'

/**
 * Assigns a value to a ref
 */
export function assignRef<T = any>(
  ref: React.Ref<T> | undefined,
  value: T | null
) {
  if (ref == null) return
  if (typeof ref === 'function') {
    ref(value)
  } else {
    try {
      ;(ref as React.MutableRefObject<T | null>).current = value
    } catch (error) {
      throw new Error(`Cannot assign value '${value}' to ref '${ref}'`, { cause: error })
    }
  }
}

/**
 * Merges multiple refs into one
 */
export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      assignRef(ref, node)
    })
  }
}

/**
 * Alias for mergeRefs
 */
export const composeRefs = mergeRefs

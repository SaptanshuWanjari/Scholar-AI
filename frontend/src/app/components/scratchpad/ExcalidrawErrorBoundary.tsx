import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches errors thrown by Excalidraw subtree (e.g. DOMException from
 * bootstrapCanvas if dimensions are unexpectedly zero). Shows a retry button
 * instead of a blank screen. The primary fix is in ScratchpadExcalidraw —
 * explicit pixel dimensions on the container so getBoundingClientRect()
 * always returns non-zero values. This boundary is a safety net only.
 */
export class ExcalidrawErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  retry = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col h-full w-full items-center justify-center gap-3 text-ink-muted text-sm">
          <span>Canvas failed to initialise.</span>
          <button
            onClick={this.retry}
            className="px-3 py-1.5 rounded border border-[#c0b9ae] hover:bg-[#f0ece4] transition-colors text-ink text-xs"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

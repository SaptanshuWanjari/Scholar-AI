import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
  autoRetries: number
}

/**
 * Catches errors thrown by the Excalidraw subtree (e.g. "Canvas exceeds max
 * size" from bootstrapCanvas when appState dimensions are wrong on first mount).
 *
 * Auto-retries once silently (after 150 ms) to handle transient race conditions
 * where Excalidraw's initial window.innerWidth×window.innerHeight state hasn't
 * been corrected by updateDOMRect yet. If the auto-retry also fails, shows a
 * manual retry button instead.
 */
export class ExcalidrawErrorBoundary extends Component<Props, State> {
  state: State = { error: null, autoRetries: 0 }

  private retryTimer: ReturnType<typeof setTimeout> | null = null

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidUpdate(_: Props, prev: State) {
    if (this.state.error && !prev.error && this.state.autoRetries === 0) {
      // First failure — attempt a silent auto-retry after a short delay to let
      // the DOM settle (updateDOMRect needs one paint cycle to correct dims).
      this.retryTimer = setTimeout(() => {
        this.setState({ error: null, autoRetries: 1 })
      }, 150)
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) clearTimeout(this.retryTimer)
  }

  retry = () => this.setState({ error: null })

  render() {
    if (this.state.error && this.state.autoRetries > 0) {
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

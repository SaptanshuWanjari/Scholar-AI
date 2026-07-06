import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { toast } from "@/app/lib/toast";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
    toast.error(`Something went wrong: ${error.message}`);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="text-ink text-lg font-semibold">
            Something went wrong
          </div>
          <p className="text-ink-muted text-sm max-w-md">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={this.reset}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { toast } from "@/app/lib/toast";
import { PaperSheetCard, PaperH3, PaperButton } from "@/app/components/paper";
import { AlertCircle } from "lucide-react";

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
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
          <PaperSheetCard className="max-w-md w-full text-center flex flex-col items-center gap-4 py-8">
            <div className="text-red-500 mb-2">
              <AlertCircle size={48} />
            </div>
            <PaperH3>Something went wrong</PaperH3>
            <p className="text-ink-muted text-sm font-architect max-w-md">
              An unexpected error occurred. Please try again.
            </p>
            <PaperButton
              onClick={this.reset}
              className="mt-4 font-architect px-4 py-2 font-bold "
            >
              Try Again
            </PaperButton>
          </PaperSheetCard>
        </div>
      );
    }
    return this.props.children;
  }
}

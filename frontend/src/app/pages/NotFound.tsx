import { PaperSheetCard, PaperH2, PaperButton } from "@/app/components/paper";
import { Link } from "react-router";
import { FileQuestion } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <PaperSheetCard className="max-w-md w-full text-center flex flex-col items-center gap-6 py-10">
        <div className="text-ink mb-2">
          <FileQuestion size={64} />
        </div>
        <PaperH2>404 - Not Found</PaperH2>
        <p className="text-ink-muted text-base font-architect">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <PaperButton>

        <Link
          to="/"
          className="font-architect inline-flex px-6 py-2 font-bold"
        >
          Go Home
        </Link>
        </PaperButton>
      </PaperSheetCard>
    </div>
  );
}

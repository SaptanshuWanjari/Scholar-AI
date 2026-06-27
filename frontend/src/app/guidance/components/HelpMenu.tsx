import { useLocation, useNavigate } from "react-router";
import { HelpCircle, Play, BookOpen, Compass } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "../../components/ui/dropdown-menu";
import { getTourForPath } from "../tourRegistry";
import { useTour } from "../useTour";
import { useGuidanceStore } from "../useGuidanceStore";

/** Help affordance in the Topbar: replay this page's tour, open the Guide,
 *  toggle guidance, all from one keyboard-accessible menu. */
export function HelpMenu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { startTour } = useTour();
  const tour = getTourForPath(pathname);

  const toursEnabled = useGuidanceStore((s) => s.prefs.toursEnabled);
  const tipsEnabled = useGuidanceStore((s) => s.prefs.tipsEnabled);
  const setPref = useGuidanceStore((s) => s.setPref);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Help and guidance"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-ring/50 hover:text-foreground"
        >
          <HelpCircle className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Help &amp; guidance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!tour}
          onSelect={() => tour && startTour(tour.id)}
        >
          <Play className="size-4" />
          {tour ? "Replay this page's tour" : "No tour on this page"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("/guide")}>
          <BookOpen className="size-4" />
          Open the Guide
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("/onboarding")}>
          <Compass className="size-4" />
          Replay onboarding
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={toursEnabled}
          onCheckedChange={(v) => setPref("toursEnabled", Boolean(v))}
        >
          Interactive tours
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tipsEnabled}
          onCheckedChange={(v) => setPref("tipsEnabled", Boolean(v))}
        >
          Contextual tips
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

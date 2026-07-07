import { useLocation, useNavigate } from "react-router";
import { HelpCircle, Play, BookOpen, Compass } from "lucide-react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarLabel,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem,
} from "@paper-ui/components/navigation";
import { IconButton } from "@paper-ui/components/buttons";
import { getTourForPath } from "../tourRegistry";
import { useTour } from "../useTour";
import { useGuidanceStore } from "../useGuidanceStore";

export function HelpMenu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { startTour } = useTour();
  const tour = getTourForPath(pathname);

  const toursEnabled = useGuidanceStore((s) => s.prefs.toursEnabled);
  const tipsEnabled = useGuidanceStore((s) => s.prefs.tipsEnabled);
  const setPref = useGuidanceStore((s) => s.setPref);

  return (
    <Menubar className="h-auto border-0 bg-transparent p-0 [&>div]:hidden">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <IconButton label="Help and guidance" className="size-10 overflow-hidden">
            <HelpCircle className="size-5" />
          </IconButton>
        </MenubarTrigger>
        <MenubarContent align="end" className="w-56">
          <MenubarLabel className='font-architect text-sm'>Help &amp; guidance</MenubarLabel>
          <MenubarSeparator />
          <MenubarItem
            disabled={!tour}
            className='gap-2'
            onSelect={() => tour && startTour(tour.id)}
          >
            <Play className="size-4" />
            {tour ? "Replay this page's tour" : "No tour on this page"}
          </MenubarItem>
          <MenubarItem onSelect={() => navigate("/guide")} className='gap-2'>
            <BookOpen className="size-4" />
            Open the Guide
          </MenubarItem>
          <MenubarItem onSelect={() => navigate("/onboarding")} className='gap-2'>
            <Compass className="size-4" />
            Replay onboarding
          </MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem
            checked={toursEnabled}
            className='gap-2'
            onCheckedChange={(v) => setPref("toursEnabled", Boolean(v))}
          >
            Interactive tours
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={tipsEnabled}
            onCheckedChange={(v) => setPref("tipsEnabled", Boolean(v))}
            className='gap-2'
          >
            Contextual tips
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

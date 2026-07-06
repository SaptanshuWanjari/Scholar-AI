import { useState } from "react";
import {
  Book,
  BookMarked,
  BrainCircuit,
  FileText,
  Search,
  Bell,
  Plus,
  Sparkles,
  Star,
  Clock,
  Trophy,
  Zap,
  X,
  Tag,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { AppShell } from "@paper-ui/components/layout";
import { ContentGrid, ContentColumn } from "@paper-ui/components/layout";
import { PaperGrid, NotebookGrid } from "@paper-ui/components/layout";
import { PinnedSection } from "@paper-ui/components/layout";

import { PaperCard, PaperPanel } from "@paper-ui/core";
import { SectionHeader, SectionLabel } from "@paper-ui/core";
import { PaperIconCircle } from "@paper-ui/core";
import {
  PaperH1,
  PaperH2,
  PaperH3,
  PaperH4,
  PaperH5,
  PaperH6,
} from "@paper-ui/core";

import {
  PaperBadge,
  DifficultyBadge,
  StatusBadge,
  PriorityBadge,
  CourseTag,
  TypeTag,
  CategoryTag,
  Pill,
} from "@paper-ui/components/badges";

import {
  PaperButton,
  SketchButton,
  StickyButton,
  IconButton,
  FloatingActionButton,
  ChipButton,
  ToggleButton,
  GhostButton,
} from "@paper-ui/components/buttons";
import { PaperSheetButton } from "@paper-ui/components/buttons";

import { PaperInput, PaperTextarea } from "@paper-ui/components/inputs";
import { PaperSelect } from "@paper-ui/components/inputs";
import { PaperCheckbox, PaperCheckboxGroup } from "@paper-ui/components/inputs";
import { PaperSwitch } from "@paper-ui/components/inputs";
import { PaperRadio, PaperRadioGroup } from "@paper-ui/components/inputs";
import { PaperSlider } from "@paper-ui/components/inputs";
import { SketchSearch } from "@paper-ui/components/inputs";

import { Tape } from "@paper-ui/components/decorations";
import { PushPin } from "@paper-ui/components/decorations";
import { StickyNote } from "@paper-ui/components/decorations";
import { NotebookSpiral } from "@paper-ui/components/decorations";
import { MarkerHighlight } from "@paper-ui/components/decorations";
import { SketchDivider } from "@paper-ui/components/decorations";

import {
  SunDoodle,
  ArrowDoodle,
  SignpostDoodle,
  StarDoodle,
  StarDoodleFilled,
  CheckmarkDoodle,
  SparkleDoodle,
  BookmarkDoodle,
  PaperPlaneDoodle,
  PencilDoodle,
  TapeDoodle,
  PushPinDoodle,
  CloudDoodle,
  BrainDoodle,
  LightbulbDoodle,
  CompassDoodle,
} from "@paper-ui/components/doodles";

import { TopBar } from "@paper-ui/components/navigation";
import { Breadcrumbs } from "@paper-ui/components/navigation";
import { Tabs } from "@paper-ui/components/navigation";
import {
  PaperSidebar,
  PaperSidebarCollapseButton,
  type PaperNavGroup,
} from "@paper-ui/components/navigation";

import { Avatar, AvatarGroup } from "@paper-ui/components/utility";
import { IconWrapper } from "@paper-ui/components/utility";
import { KeyboardHint } from "@paper-ui/components/utility";
import { PageTitle } from "@paper-ui/components/utility";
import { Divider } from "@paper-ui/components/utility";
import { Separator } from "@paper-ui/components/utility";

import {
  StatRow,
  DocumentRow,
  CourseRow,
  FlashcardRow,
  SearchResultRow,
  QuizRow,
  TimelineRow,
  ConceptRow,
  PluginRow,
} from "@paper-ui/components/rows";
import {
  SketchProgress,
  CircularProgress,
  StepProgress,
  LearningProgress,
  StageProgress,
  TimelineProgress,
} from "@paper-ui/components/progress";

import {
  MetricCard,
  ActionCard,
  SummaryCard,
  ConceptCard,
  RecommendationCard,
  NotebookCard,
  StatsCard,
  StickyNoteCard,
  NotebookSpiralCard,
  PaperSheetCard,
} from "@paper-ui/components/cards";

import {
  PaperTable,
  TableHeader,
  TableRow,
  TableCell,
  PaperTh,
  PaperTd,
  EmptyTable,
  Pagination,
} from "@paper-ui/components/tables";

import {
  InsightBox,
  ProgressSummary,
  Heatmap,
  MiniChart,
  StatsGrid,
  StatNumber,
} from "@paper-ui/components/stats";

import {
  StudyRecommendation,
  QuizRecommendation,
  LearningStepCard,
  PrerequisiteCard,
  KnowledgeNode,
  ConceptNode,
  KnowledgeGraphNode,
  ConceptEdgeLabel,
  MasteryFilterGroup,
  type MasteryFilterItem,
} from "@paper-ui/components/teaching";

import {
  PaperModal,
  PaperDrawer,
  PaperPopover,
  PaperTooltip,
  PaperDropdown,
  ContextMenu,
  ConfirmationDialog,
} from "@paper-ui/components/dialogs";

import {
  LoadingPaper,
  ErrorCard,
  EmptyState,
  IllustratedEmptyState,
  SuccessBanner,
  SketchSkeleton,
  PaperToast,
} from "@paper-ui/components/feedback";
import {
  TapeCrease,
  TapeGraph,
  TapeLabel,
  TapePin,
  TapeRibbon,
  TapeScribble,
  TapeStarry,
  TapeStitch,
  TapeWorn,
  TapeZag,
} from "@/app/components/paper";
import { ScratchpadExcalidraw } from '@/app/components/scratchpad/ScratchpadExcalidraw';

const AVATARS = [
  { name: "Alice Chen", tone: "sky" as const },
  { name: "Bob Patel", tone: "sage" as const },
  { name: "Carol Smith", tone: "lavender" as const },
  { name: "David Kim", tone: "ochre" as const },
  { name: "Eve Johnson", tone: "brick" as const },
];

export default function ComponentsShowcase() {
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [switch1, setSwitch1] = useState(false);
  const [radioVal, setRadioVal] = useState("option-a");
  const [sliderVal, setSliderVal] = useState(42);
  const [selectVal, setSelectVal] = useState("");
  const [tabActive, setTabActive] = useState("all");
  const [toggleVal, setToggleVal] = useState(false);
  const [chipVal, setChipVal] = useState("all");
  const [starred, setStarred] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarActive, setSidebarActive] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const DEMO_SIDEBAR_GROUPS: PaperNavGroup[] = [
    {
      id: "main",
      items: [
        {
          id: "home",
          label: "Home",
          icon: <BookOpen size={18} strokeWidth={1.8} />,
        },
        {
          id: "courses",
          label: "Courses",
          icon: <BookMarked size={18} strokeWidth={1.8} />,
        },
        {
          id: "docs",
          label: "Documents",
          icon: <FileText size={18} strokeWidth={1.8} />,
        },
        {
          id: "flash",
          label: "Flashcards",
          icon: <Star size={18} strokeWidth={1.8} />,
        },
        {
          id: "quizzes",
          label: "Quizzes",
          icon: <CheckCircle2 size={18} strokeWidth={1.8} />,
        },
      ],
    },
    {
      id: "tools",
      label: "Workspace",
      items: [
        { id: "notebook", label: "Notebook", icon: <PencilDoodle size={18} /> },
        { id: "mindmaps", label: "Mindmaps", icon: <BrainDoodle size={18} /> },
        { id: "ai", label: "Teach Me", icon: <LightbulbDoodle size={18} /> },
      ],
    },
  ];
  const [masteryFilters, setMasteryFilters] = useState<MasteryFilterItem[]>([
    { level: "all", label: "All", count: 42, active: true },
    { level: "mastered", label: "Mastered", count: 18, active: true },
    { level: "learning", label: "Learning", count: 14, active: true },
    { level: "weak", label: "Needs Review", count: 6, active: false },
    { level: "unknown", label: "Unknown", count: 4, active: false },
  ]);

  return (
    <AppShell className="flex flex-col">
      <div className="paper-scrollbar flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
          <PageTitle
            title="Paper Components"
            subtitle="Every component from the paper design system, demonstrated in context."
            marker
          />

          <div
            style={{
              position: "fixed",
              left: 20,
              top: 20,
              width: 800,
              height: 600,
              background: "white",
              zIndex: 99999,
            }}
          >
            <ScratchpadExcalidraw />
          </div>
          {/* ── Foundation ── */}
          <div className="mt-12">
            <SectionHeader title="Foundation" marker markerColor="#d4cfc2" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Core surface primitives — every card, panel, and section header.
            </p>
            <Divider variant="dashed" label="PaperCard" />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <PaperCard className="px-5 py-5">
                <p className="font-kalam text-ink">
                  Default card — warm fill, medium shadow, paper texture.
                </p>
              </PaperCard>
              <PaperCard texture={false} shadow="lg" className="px-5 py-5">
                <p className="font-kalam text-ink">No texture, large shadow.</p>
              </PaperCard>
              <PaperCard lift rotate={0.5} className="px-5 py-5">
                <p className="font-kalam text-ink">
                  Lift on hover, micro-rotated.
                </p>
              </PaperCard>
            </div>
            <Divider variant="dashed" label="PaperPanel" className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-4">
              <PaperPanel className="px-4 py-3">
                <span className="font-architect text-sm text-ink-muted">
                  Inner panel
                </span>
              </PaperPanel>
              <PaperPanel
                border={null}
                className="px-4 py-3"
                style={{ background: "#f0efed" }}
              >
                <span className="font-architect text-sm text-ink-muted">
                  No border panel
                </span>
              </PaperPanel>
            </div>
            <Divider
              variant="dashed"
              label="SectionHeader / SectionLabel / PaperIconCircle"
              className="mt-8"
            />
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <SectionLabel>Eyebrow Label</SectionLabel>
              <SectionHeader
                title="Section Title"
                action={
                  <span className="font-architect text-[13px] text-ink-muted">
                    View all →
                  </span>
                }
              />
              <PaperIconCircle tone="sage" size={40}>
                <Book size={18} />
              </PaperIconCircle>
              <PaperIconCircle tone="ochre" size={40}>
                <Star size={18} />
              </PaperIconCircle>
              <PaperIconCircle tone="sky" size={40}>
                <Search size={18} />
              </PaperIconCircle>
              <PaperIconCircle tone="lavender" size={40}>
                <Sparkles size={18} />
              </PaperIconCircle>
              <PaperIconCircle tone="brick" size={40}>
                <Bell size={18} />
              </PaperIconCircle>
              <PaperIconCircle tone="ink" size={40}>
                <FileText size={18} />
              </PaperIconCircle>
            </div>
          </div>

          {/* ── Headings ── */}
          <div className="mt-16">
            <SectionHeader title="Headings" marker markerColor="#4a6f91" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Six heading levels in three hand-drawn fonts, scaling from
              notebook title to fine label.
            </p>
            <Divider variant="dashed" label="H1 – H6" />
            <div className="mt-6 flex flex-col gap-4">
              <PaperH1>Travelling Salesman Problem</PaperH1>
              <PaperH2>Search Algorithms & Complexity</PaperH2>
              <PaperH3>Graph Traversal Techniques</PaperH3>
              <PaperH4>Depth-First vs Breadth-First</PaperH4>
              <PaperH5>Key Concepts</PaperH5>
              <PaperH6>See also</PaperH6>
            </div>
            <Divider
              variant="dashed"
              label="With marker highlight"
              className="mt-8"
            />
            <div className="mt-6 flex flex-col gap-4">
              <PaperH1 marker>Knowledge Explorer</PaperH1>
              <PaperH2 marker markerColor="#c8e6c9">
                Classical Probability
              </PaperH2>
              <PaperH3 marker markerColor="#ffe0b2">
                Bayesian Inference
              </PaperH3>
              <PaperH4 marker markerColor="#e1bee7">
                Prior & Posterior
              </PaperH4>
            </div>
          </div>

          {/* ── Decorations ── */}
          <div className="mt-16">
            <SectionHeader title="Decorations" marker markerColor="#a3544a" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Stationery details that give the UI a tactile, pinned-to-paper
              feel.
            </p>
            <Divider variant="dashed" label="Tape" />
            <div className="relative mt-6 flex h-28 items-center justify-center gap-16 rounded-lg border border-dashed border-[#d4cfc2]">
              <Tape corner="top-left" />
              <Tape corner="top-right" />
              <Tape corner="bottom-left" />
              <Tape corner="bottom-right" />
              <Tape corner="top-center" />
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6">
              <TapeStarry width={300} color="#f4a0c0" />
              <TapeDoodle size={300} color="#f4a0c0" />
              <TapeCrease width={300} color="#f4a0c0" />
              <TapeGraph width={300} color="#f4a0c0" />
              <TapePin width={300} color="#f4a0c0" />
              <TapeZag width={300} color="#f4a0c0" />
              <TapeStitch width={300} color="#f4a0c0" />
              <TapeScribble width={300} color="#f4a0c0" />
              <TapeRibbon width={300} color="#f4a0c0" />
              <TapeWorn width={300} color="#f4a0c0" />
            </div>
            <Divider variant="dashed" label="TapeLabel" className="mt-8" />
            <div className="grid grid-cols-3 gap-6 pt-6">
              <TapeLabel color="cream" />
              <TapeLabel color="yellow" fastener="bow" />
              <TapeLabel color="sky" pattern="grid" />
              <TapeLabel color="cream" fastener="push-pin" />
              <TapeLabel color="yellow" fastener="clip" />
              <TapeLabel color="tan" />
              <TapeLabel color="sky" pattern="sparkle" fastener="clip" />
              <TapeLabel
                color="white"
                pattern="scribble"
                fastener="push-pin-green"
                fastenerSide="right"
              />{" "}
            </div>
            <Divider variant="dashed" label="PushPin" className="mt-8" />
            <div className="mt-6 flex gap-8">
              <PushPin size={20} />
              <PushPin size={26} />
              <PushPin size={32} color="#4a6f91" />
            </div>
            <Divider variant="dashed" label="StickyNote" className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-10">
              <StickyNote size={90} color="#fef3a3" pin="push-pin">
                <Book size={28} />
              </StickyNote>
              <StickyNote size={90} color="#fce4e4" pin="tape">
                <Star size={28} />
              </StickyNote>
              <StickyNote size={90} color="#ddeeff" pin="none" rotate={1}>
                <Bell size={28} />
              </StickyNote>
            </div>
            <Divider
              variant="dashed"
              label="MarkerHighlight"
              className="mt-8"
            />
            <div className="mt-6 space-y-2">
              <p className="font-kalam text-[18px] text-ink">
                <MarkerHighlight>
                  This text is highlighted in yellow
                </MarkerHighlight>
              </p>
              <p className="font-kalam text-[18px] text-ink">
                <MarkerHighlight color="#aee3d5">
                  Green highlighter variant
                </MarkerHighlight>
              </p>
              <p className="font-kalam text-[18px] text-ink">
                <MarkerHighlight color="#f7c8c8">
                  Red highlighter variant
                </MarkerHighlight>
              </p>
            </div>
            <Divider variant="dashed" label="SketchDivider" className="mt-8" />
            <div className="mt-6 space-y-4">
              <div>
                <span className="font-architect text-xs text-ink-muted">
                  WAVY
                </span>
                <SketchDivider variant="wavy" />
              </div>
              <div>
                <span className="font-architect text-xs text-ink-muted">
                  STRAIGHT
                </span>
                <SketchDivider variant="straight" />
              </div>
              <div>
                <span className="font-architect text-xs text-ink-muted">
                  DASHED
                </span>
                <SketchDivider variant="dashed" />
              </div>
            </div>
            <Divider variant="dashed" label="PaperSheetCard" className="mt-8" />
            <div className="mt-6  grid  gap-5">
              <PaperSheetCard title="Hand-Drawn Folded Corner">
                This paper card has a dog-ear fold built into its SVG body. The
                card is fully self-sizing — it measures its container and
                redraws the paper shape via useLayoutEffect + ResizeObserver.
                This paper card has a dog-ear fold built into its SVG body. The
                card is fully self-sizing — it measures its container and
                redraws hihihihoihihthe paper shape via useLayoutEffect +
                ResizeObserver. This paper card has a dog-ear fold built into
                its SVG body. The card is fully self-sizing — it measures its
                container and redraws the paper shape via useLayoutEffect +
                ResizeObserver. This paper card has a dog-ear fold built into
                its SVG body. The card is fully self-sizing — it measures its
                container and redraws hihihihoihihthe paper shape via
                useLayoutEffect + ResizeObserver.
              </PaperSheetCard>
              <PaperSheetCard title="Hand-Drawn Folded Corner">
                This paper card has a dog-ear fold built into its SVG body. The
                card is fully self-sizing — it measures its container and
                redraws the paper shape via useLayoutEffect + ResizeObserver.
              </PaperSheetCard>
            </div>
          </div>

          {/* ── Doodles ── */}
          <div className="mt-16">
            <SectionHeader title="Doodles" marker markerColor="#b07a2e" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Hand-drawn SVG icons used throughout the interface.
            </p>
            <PaperGrid minCardWidth={100} gap={4}>
              {[
                { name: "SunDoodle", el: <SunDoodle size={36} /> },
                { name: "ArrowDoodle", el: <ArrowDoodle size={28} /> },
                { name: "SignpostDoodle", el: <SignpostDoodle size={28} /> },
                { name: "StarDoodle", el: <StarDoodle size={28} /> },
                {
                  name: "StarDoodleFilled",
                  el: <StarDoodleFilled size={28} />,
                },
                { name: "CheckmarkDoodle", el: <CheckmarkDoodle size={28} /> },
                { name: "SparkleDoodle", el: <SparkleDoodle size={28} /> },
                { name: "BookmarkDoodle", el: <BookmarkDoodle size={28} /> },
                {
                  name: "PaperPlaneDoodle",
                  el: <PaperPlaneDoodle size={28} />,
                },
                { name: "PencilDoodle", el: <PencilDoodle size={28} /> },
                { name: "TapeDoodle", el: <TapeDoodle size={28} /> },
                { name: "PushPinDoodle", el: <PushPinDoodle size={28} /> },
                { name: "CloudDoodle", el: <CloudDoodle size={28} /> },
                { name: "BrainDoodle", el: <BrainDoodle size={28} /> },
                { name: "LightbulbDoodle", el: <LightbulbDoodle size={28} /> },
                { name: "CompassDoodle", el: <CompassDoodle size={28} /> },
              ].map((d) => (
                <PaperCard
                  key={d.name}
                  className="flex flex-col items-center gap-2 px-4 py-4"
                >
                  <div className="text-ink">{d.el}</div>
                  <span className="font-architect text-[11px] text-ink-muted">
                    {d.name}
                  </span>
                </PaperCard>
              ))}
            </PaperGrid>
          </div>

          {/* ── Buttons ── */}
          <div className="mt-16">
            <SectionHeader title="Buttons" marker markerColor="#3f7a4e" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Hand-drawn action triggers — from primary CTAs to ghost dismiss.
            </p>
            <Divider variant="dashed" label="PaperButton" />
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <PaperButton tone="dark">Dark</PaperButton>
              <PaperButton tone="paper">Paper</PaperButton>
              <PaperButton tone="green">Green</PaperButton>
              <PaperButton tone="red">Red</PaperButton>
              <PaperButton tone="dark" size="sm">
                Small
              </PaperButton>
              <PaperButton tone="dark" size="lg">
                Large
              </PaperButton>
            </div>
            <Divider variant="dashed" label="SketchButton" className="mt-8" />
            <div className="mt-6">
              <SketchButton>Sketch Button</SketchButton>
            </div>
            <Divider variant="dashed" label="StickyButton" className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-6">
              <StickyButton tone="dark">Ask AI</StickyButton>
              <StickyButton tone="paper" taped={false}>
                No Tape
              </StickyButton>
            </div>
            <Divider variant="dashed" label="IconButton" className="mt-8" />
            <div className="mt-6 flex gap-3">
              <IconButton label="Notifications">
                <Bell size={18} />
              </IconButton>
              <IconButton label="Settings">
                <Star size={18} />
              </IconButton>
              <IconButton label="Help">
                <Book size={18} />
              </IconButton>
            </div>
            <Divider
              variant="dashed"
              label="FloatingActionButton"
              className="mt-8"
            />
            <div className="relative mt-6 flex items-center gap-4 rounded-lg bg-[#f5f3ef] p-6">
              <FloatingActionButton label="Add" size="sm">
                <Plus size={18} />
              </FloatingActionButton>
              <FloatingActionButton label="Add" size="md">
                <Plus size={22} />
              </FloatingActionButton>
              <FloatingActionButton label="Add" tone="paper" size="lg">
                <Plus size={26} />
              </FloatingActionButton>
            </div>
            <Divider variant="dashed" label="ChipButton" className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-3">
              {["all", "recent", "saved", "archived"].map((c) => (
                <ChipButton
                  key={c}
                  selected={chipVal === c}
                  onClick={() => setChipVal(c)}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </ChipButton>
              ))}
            </div>
            <Divider variant="dashed" label="ToggleButton" className="mt-8" />
            <div className="mt-6">
              <ToggleButton pressed={toggleVal} onPressedChange={setToggleVal}>
                {toggleVal ? "ON" : "OFF"}
              </ToggleButton>
            </div>
            <Divider variant="dashed" label="GhostButton" className="mt-8" />
            <div className="mt-6">
              <GhostButton>Cancel</GhostButton>
            </div>
            <Divider
              variant="dashed"
              label="PaperSheetButton"
              className="mt-8"
            />
            <div className="mt-6 max-w-xs">
              <PaperSheetButton onClick={() => alert("Clicked!")}>
                Hand-drawn SVG button
              </PaperSheetButton>
            </div>
          </div>

          {/* ── Inputs ── */}
          <div className="mt-16">
            <SectionHeader title="Inputs" marker markerColor="#4a6f91" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Rough-bordered form controls with focus-state darkening.
            </p>
            <Divider variant="dashed" label="PaperInput" />
            <div className="mt-6 grid max-w-md grid-cols-1 gap-6">
              <PaperInput label="Name" placeholder="Enter your name..." />
              <PaperInput
                label="Email"
                icon={<FileText size={16} />}
                placeholder="you@example.com"
              />
              <PaperInput
                label="Password"
                trailingIcon={<X size={16} />}
                placeholder="Enter password..."
              />
              <PaperInput
                label="With Error"
                defaultValue="bad"
                error="This field is required"
              />
              <PaperInput
                label="With Hint"
                hint="We'll never share your email"
              />
            </div>
            <Divider variant="dashed" label="PaperTextarea" className="mt-8" />
            <div className="mt-6 max-w-md">
              <PaperTextarea
                label="Notes"
                placeholder="Write something..."
                rows={3}
              />
            </div>
            <Divider variant="dashed" label="PaperSelect" className="mt-8" />
            <div className="mt-6 max-w-xs">
              <PaperSelect
                label="Category"
                value={selectVal}
                onChange={setSelectVal}
                options={[
                  { value: "lecture", label: "Lecture Notes" },
                  { value: "textbook", label: "Textbook" },
                  { value: "paper", label: "Research Paper" },
                  { value: "video", label: "Video" },
                ]}
                placeholder="Choose a category..."
              />
            </div>
            <Divider variant="dashed" label="PaperCheckbox" className="mt-8" />
            <div className="mt-6 space-y-3">
              <PaperCheckbox
                checked={checked1}
                onChange={setChecked1}
                label="Remember me"
                description="Stay signed in on this device"
              />
              <PaperCheckbox
                checked={checked2}
                onChange={setChecked2}
                label="Send notifications"
                description="Get alerted about new content"
              />
              <PaperCheckboxGroup
                label="Topics (checkbox group)"
                value={["math"]}
                options={[
                  { value: "math", label: "Mathematics" },
                  { value: "cs", label: "Computer Science" },
                  { value: "physics", label: "Physics" },
                ]}
              />
            </div>
            <Divider variant="dashed" label="PaperSwitch" className="mt-8" />
            <div className="mt-6 space-y-4">
              <PaperSwitch
                checked={switch1}
                onChange={setSwitch1}
                label="Dark Mode"
                description="Reduces eye strain in low light"
              />
              <PaperSwitch
                checked
                onChange={() => { }}
                label="Auto-save"
                description="Automatically save progress"
                labelPosition="left"
              />
            </div>
            <Divider variant="dashed" label="PaperRadio" className="mt-8" />
            <div className="mt-6">
              <PaperRadioGroup
                label="Difficulty"
                value={radioVal}
                onChange={setRadioVal}
                options={[
                  {
                    value: "option-a",
                    label: "Easy",
                    description: "Quick review",
                  },
                  {
                    value: "option-b",
                    label: "Medium",
                    description: "Standard depth",
                  },
                  {
                    value: "option-c",
                    label: "Hard",
                    description: "Deep dive",
                  },
                ]}
              />
            </div>
            <Divider variant="dashed" label="PaperSlider" className="mt-8" />
            <div className="mt-6 max-w-sm">
              <PaperSlider
                label="Confidence"
                value={sliderVal}
                onChange={setSliderVal}
                min={0}
                max={100}
                showValue
                formatValue={(v) => `${v}%`}
              />
            </div>
            <Divider variant="dashed" label="SketchSearch" className="mt-8" />
            <div className="mt-6">
              <SketchSearch placeholder="Search components..." />
            </div>
          </div>

          {/* ── Progress ── */}
          <div className="mt-16">
            <SectionHeader title="Progress" marker markerColor="#6f63a3" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Hand-shaded progress indicators with pencil-hatch texture.
            </p>
            <Divider variant="dashed" label="SketchProgress" />
            <div className="mt-6 space-y-4">
              <SketchProgress value={25} />
              <SketchProgress value={50} color="#c9954f" />
              <SketchProgress value={75} color="#4a6f91" />
            </div>
            <Divider
              variant="dashed"
              label="CircularProgress"
              className="mt-8"
            />
            <div className="mt-6 flex flex-wrap items-center gap-8">
              <CircularProgress value={33} label="Reading" />
              <CircularProgress value={67} color="#c9954f" label="Quizzes" />
              <CircularProgress value={100} color="#4a6f91" label="Done" />
              <CircularProgress
                value={48}
                size={100}
                strokeWidth={10}
                label="Study time"
              />
            </div>
            <Divider variant="dashed" label="StepProgress" className="mt-8" />
            <div className="mt-6 max-w-lg">
              <StepProgress
                steps={["Read", "Summarize", "Quiz", "Review"]}
                current={2}
              />
            </div>
            <Divider
              variant="dashed"
              label="LearningProgress"
              className="mt-8"
            />
            <div className="mt-6 max-w-md space-y-6">
              <LearningProgress
                value={65}
                done="13 concepts"
                total="20 concepts"
                label="Flashcards"
                sublabel="CS 229 · Week 4"
              />
              <LearningProgress value={40} color="#4a6f91" done="8 / 20" />
            </div>
            <Divider variant="dashed" label="StageProgress" className="mt-8" />
            <div className="mt-6 max-w-sm space-y-6">
              <StageProgress
                title="Introduction"
                value={100}
                sublabel="5 / 5 concepts"
              />
              <StageProgress
                title="Core Concepts"
                value={60}
                color="#c9954f"
                sublabel="3 / 5 concepts"
              />
              <StageProgress
                title="Advanced Topics"
                value={20}
                color="#4a6f91"
                sublabel="1 / 5 concepts"
              />
            </div>
            <Divider
              variant="dashed"
              label="TimelineProgress"
              className="mt-8"
            />
            <div className="mt-6 max-w-xs">
              <TimelineProgress
                stages={[
                  {
                    label: "Introduction",
                    sublabel: "20 min",
                    status: "done",
                    percent: 100,
                  },
                  {
                    label: "Core Concepts",
                    sublabel: "35 min",
                    status: "active",
                    percent: 60,
                  },
                  {
                    label: "Advanced Topics",
                    sublabel: "40 min",
                    status: "pending",
                  },
                  {
                    label: "Practice Quiz",
                    sublabel: "15 min",
                    status: "pending",
                  },
                ]}
              />
            </div>
          </div>

          {/* ── Badges ── */}
          <div className="mt-16">
            <SectionHeader title="Badges" marker markerColor="#79736a" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Tone-coded tags for status, category, and metadata.
            </p>
            <Divider variant="dashed" label="PaperBadge" />
            <div className="mt-6 flex flex-wrap gap-3">
              <PaperBadge tone="sage">Completed</PaperBadge>
              <PaperBadge tone="ochre">In Progress</PaperBadge>
              <PaperBadge tone="sky">New</PaperBadge>
              <PaperBadge tone="lavender">Premium</PaperBadge>
              <PaperBadge tone="brick">Urgent</PaperBadge>
              <PaperBadge tone="ink">Draft</PaperBadge>
            </div>
            <Divider
              variant="dashed"
              label="DifficultyBadge"
              className="mt-8"
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <DifficultyBadge difficulty="Easy" showIcon />
              <DifficultyBadge difficulty="Medium" showIcon />
              <DifficultyBadge difficulty="Hard" showIcon />
            </div>
            <Divider variant="dashed" label="StatusBadge" className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-3">
              <StatusBadge status="indexed" />
              <StatusBadge status="processing" />
              <StatusBadge status="failed" />
            </div>
            <Divider variant="dashed" label="PriorityBadge" className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-3">
              <PriorityBadge priority="low" />
              <PriorityBadge priority="medium" />
              <PriorityBadge priority="high" />
              <PriorityBadge priority="critical" />
            </div>
            <Divider
              variant="dashed"
              label="CourseTag / TypeTag / CategoryTag"
              className="mt-8"
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <CourseTag course="CS 229" />
              <TypeTag type="pdf" />
              <TypeTag type="md" />
              <CategoryTag category="Lecture" />
            </div>
            <Divider
              variant="dashed"
              label="Pill (removable)"
              className="mt-8"
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Pill tone="sage" icon={<CheckCircle2 size={10} />}>
                verified
              </Pill>
              <Pill tone="sky" dot="#4a6f91">
                filter
              </Pill>
              <Pill tone="brick" onRemove={() => { }}>
                dismissible
              </Pill>
            </div>
          </div>

          {/* ── Navigation ── */}
          <div className="mt-16">
            <SectionHeader title="Navigation" marker markerColor="#3a3733" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Breadcrumbs, tabs, and top bar for moving through the app.
            </p>
            <Divider variant="dashed" label="Breadcrumbs" />
            <div className="mt-6">
              <Breadcrumbs
                items={[
                  { label: "Home", onClick: () => { } },
                  { label: "Courses", onClick: () => { } },
                  { label: "Components" },
                ]}
              />
            </div>
            <Divider variant="dashed" label="Tabs" className="mt-8" />
            <div className="mt-6">
              <Tabs
                items={[
                  { key: "all", label: "All", count: 24 },
                  { key: "recent", label: "Recent", count: 5 },
                  { key: "saved", label: "Saved", count: 3 },
                  { key: "archived", label: "Archived" },
                ]}
                active={tabActive}
                onChange={setTabActive}
              />
              <div className="mt-6 rounded-lg bg-[#f5f3ef] p-6">
                <p className="font-kalam text-[15px] text-ink-muted/80">
                  Content for the "<b>{tabActive}</b>" tab panel.
                </p>
              </div>
            </div>
            <Divider variant="dashed" label="TopBar" className="mt-8" />
            <PaperPanel className="mt-6">
              <TopBar
                start={
                  <Breadcrumbs
                    items={[{ label: "Home" }, { label: "Documents" }]}
                  />
                }
              >
                <IconButton label="Search">
                  <Search size={18} />
                </IconButton>
                <IconButton label="Notifications">
                  <Bell size={18} />
                </IconButton>
              </TopBar>
            </PaperPanel>
            <Divider variant="dashed" label="PaperSidebar" className="mt-8" />
            <p className="mt-3 mb-4 font-kalam text-[13px] text-ink-muted/70">
              Configurable nav sidebar with a hand-drawn sticker on the active
              item. Collapsible — the button below and the one built into the
              footer both work.
            </p>
            <div className="mt-4 mb-2 flex items-center gap-3">
              <PaperSidebarCollapseButton
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed((v) => !v)}
              />
              <span className="font-architect text-[12px] text-ink-muted">
                PaperSidebarCollapseButton — usable anywhere outside the sidebar
              </span>
            </div>
            <div className="mt-2 flex h-[420px] overflow-hidden rounded-lg border border-[rgba(0,0,0,0.07)] bg-sidebar">
              <PaperSidebar
                groups={DEMO_SIDEBAR_GROUPS}
                activeId={sidebarActive}
                onNavigate={setSidebarActive}
                collapsed={sidebarCollapsed}
                onCollapse={setSidebarCollapsed}
                header={
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ink text-[#fbf8f2]">
                      <BookOpen size={16} />
                    </div>
                    <div className="leading-tight">
                      <div className="font-caveat text-[18px] font-bold text-ink">
                        ScholarAI
                      </div>
                      <div className="font-architect text-[10px] uppercase tracking-wider text-ink-muted">
                        Study Library
                      </div>
                    </div>
                  </div>
                }
              />
              <div className="flex flex-1 items-center justify-center bg-paper/60">
                <p className="font-kalam text-[14px] text-ink-muted">
                  Active: <b className="text-ink">{sidebarActive}</b>
                </p>
              </div>
            </div>
          </div>

          {/* ── Layout ── */}
          <div className="mt-16">
            <SectionHeader title="Layout" marker markerColor="#b07a2e" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Page-level shells and arrangement primitives.
            </p>
            <Divider variant="dashed" label="PaperGrid" />
            <div className="mt-6">
              <PaperGrid minCardWidth={180} gap={4}>
                {["Card A", "Card B", "Card C", "Card D", "Card E"].map((c) => (
                  <PaperCard key={c} className="px-4 py-4">
                    <p className="font-architect text-center text-ink">{c}</p>
                  </PaperCard>
                ))}
              </PaperGrid>
            </div>
            <Divider
              variant="dashed"
              label="NotebookGrid (staggered)"
              className="mt-8"
            />
            <div className="mt-6">
              <NotebookGrid minCardWidth={200} gap={4}>
                {["Note 1", "Note 2", "Note 3", "Note 4"].map((c) => (
                  <PaperCard key={c} className="px-4 py-4">
                    <p className="font-architect text-center text-ink">{c}</p>
                  </PaperCard>
                ))}
              </NotebookGrid>
            </div>
            <Divider variant="dashed" label="PinnedSection" className="mt-8" />
            <div className="mt-6">
              <PinnedSection
                title="Study Goals"
                pin="push-pin"
                action={
                  <span className="font-architect text-[13px] text-ink-muted">
                    Edit
                  </span>
                }
              >
                <PaperCard className="px-5 py-4">
                  <p className="font-kalam text-[14px] text-ink-muted/80">
                    A section with its heading pinned to the page using a
                    push-pin.
                  </p>
                </PaperCard>
              </PinnedSection>
            </div>
            <Divider
              variant="dashed"
              label="ContentGrid (12-column)"
              className="mt-8"
            />
            <div className="mt-6 rounded-lg bg-[#f5f3ef] p-4">
              <ContentGrid>
                <ContentColumn span="main">
                  <PaperCard className="px-5 py-6">
                    <p className="font-kalam text-[15px] text-ink">
                      Main content area (8 cols).
                    </p>
                  </PaperCard>
                </ContentColumn>
                <ContentColumn span="side">
                  <PaperCard className="px-5 py-6">
                    <p className="font-kalam text-[13px] text-ink-muted">
                      Side panel (4 cols).
                    </p>
                  </PaperCard>
                </ContentColumn>
              </ContentGrid>
            </div>
          </div>

          {/* ── Rows ── */}
          <div className="mt-16">
            <SectionHeader title="Rows" marker markerColor="#3f7a4e" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              List-row components for stat panels and document lists.
            </p>
            <Divider variant="dashed" label="StatRow" />
            <div className="mt-6 max-w-md">
              <PaperCard className="px-5 py-4">
                <StatRow
                  icon={<Book size={18} />}
                  tone="sage"
                  label="Pages Read"
                  value="247"
                  sublabel="out of 340"
                />
                <StatRow
                  icon={<Clock size={18} />}
                  tone="sky"
                  label="Hours Studied"
                  value="42"
                  sublabel="this week"
                />
                <StatRow
                  icon={<Trophy size={18} />}
                  tone="ochre"
                  label="Quizzes Passed"
                  value="12"
                  sublabel="83% accuracy"
                />
              </PaperCard>
            </div>
            <Divider variant="dashed" label="DocumentRow" className="mt-8" />
            <PaperPanel className="mt-6 max-w-lg">
              <DocumentRow
                title="Operating Systems Ch.5"
                meta="PDF · 12 pages"
                date="Today"
                starred={starred}
                onToggleStar={() => setStarred(!starred)}
              />
              <Divider variant="line" />
              <DocumentRow
                title="Linear Algebra Notes"
                meta="Markdown · 3 pages"
                date="Yesterday"
                iconClass="text-sage"
              />
              <Divider variant="line" />
              <DocumentRow
                title="Database Design Revision"
                meta="PDF · 8 pages"
                date="3 days ago"
                starred
                iconClass="text-ochre"
              />
            </PaperPanel>
            <Divider variant="dashed" label="CourseRow" className="mt-8" />
            <PaperPanel className="mt-6 max-w-md">
              <CourseRow
                color="#7fa37b"
                initials="OS"
                title="Operating Systems"
                meta="12 docs · 48 cards"
              />
              <Divider variant="line" />
              <CourseRow
                color="#b07a2e"
                initials="ML"
                title="Machine Learning"
                meta="8 docs · 32 cards"
                isSelected
              />
              <Divider variant="line" />
              <CourseRow
                color="#4a6f91"
                initials="DB"
                title="Database Systems"
                meta="5 docs"
              />
            </PaperPanel>
            <Divider variant="dashed" label="FlashcardRow" className="mt-8" />
            <PaperPanel className="mt-6 max-w-xl">
              <FlashcardRow
                front="What is a closure?"
                back="Function + lexical scope"
                badge={<TypeTag type="md" />}
                meta="Ch.3"
              />
              <Divider variant="line" />
              <FlashcardRow
                front="Big-O of merge sort"
                back="O(n log n)"
                badge={<DifficultyBadge difficulty="Easy" />}
                meta="Algorithms"
              />
            </PaperPanel>
            <Divider variant="dashed" label="QuizRow" className="mt-8" />
            <PaperPanel className="mt-6 max-w-xl">
              <QuizRow
                title="Data Structures Midterm"
                count="20 questions"
                badge={<DifficultyBadge difficulty="Medium" />}
                score="87%"
              />
              <Divider variant="line" />
              <QuizRow
                title="Algorithm Complexity"
                count="15 questions"
                badge={<DifficultyBadge difficulty="Hard" />}
                score="72%"
              />
            </PaperPanel>
            <Divider variant="dashed" label="ConceptRow" className="mt-8" />
            <PaperPanel className="mt-6 max-w-xl">
              <ConceptRow
                title="Binary Search Tree"
                description="A tree where each node's key is greater than its left subtree and less than its right."
                indicator={
                  <span className="block h-3 w-3 rounded-full bg-[#7fa37b]" />
                }
                badge={<DifficultyBadge difficulty="Easy" />}
                meta="Ch.3"
              />
              <Divider variant="line" />
              <ConceptRow
                title="AVL Tree Rotations"
                description="Self-balancing BST using single and double rotation operations."
                indicator={
                  <span className="block h-3 w-3 rounded-full bg-[#c9954f]" />
                }
                badge={<DifficultyBadge difficulty="Medium" />}
                meta="Ch.4"
              />
            </PaperPanel>
            <Divider variant="dashed" label="TimelineRow" className="mt-8" />
            <PaperPanel className="mt-6 max-w-sm px-5 py-4">
              <TimelineRow
                label="Introduction"
                sublabel="20 min"
                status="done"
              />
              <TimelineRow
                label="Core Concepts"
                sublabel="35 min"
                status="active"
              />
              <TimelineRow
                label="Advanced Topics"
                sublabel="40 min"
                status="pending"
              />
              <TimelineRow
                label="Practice Quiz"
                sublabel="15 min"
                status="pending"
                isLast
              />
            </PaperPanel>
            <Divider
              variant="dashed"
              label="SearchResultRow"
              className="mt-8"
            />
            <PaperPanel className="mt-6 max-w-xl">
              <SearchResultRow
                title="Binary Search Trees"
                badge={<CourseTag course="CS 106" />}
                snippet="A binary search tree is a rooted tree where each node..."
                onClick={() => { }}
              />
              <Divider variant="line" />
              <SearchResultRow
                title="Database Normalization"
                badge={<TypeTag type="pdf" />}
                snippet="Normalization organizes relational database tables to reduce..."
              />
            </PaperPanel>
            <Divider variant="dashed" label="PluginRow" className="mt-8" />
            <PaperPanel className="mt-6 max-w-xl px-4">
              <PluginRow
                icon={<Sparkles size={20} />}
                title="AI Summarizer"
                description="Generates smart summaries for ingested documents."
                meta={<PaperBadge tone="sage">Active</PaperBadge>}
                control={
                  <PaperSwitch
                    checked={switch1}
                    onChange={setSwitch1}
                    label=""
                  />
                }
              />
              <SketchDivider variant="dashed" className="opacity-50" />
              <PluginRow
                icon={<BrainCircuit size={20} />}
                title="Flashcard Generator"
                description="Auto-generates spaced-repetition cards from notes."
                meta={<PaperBadge tone="ink">Built-in</PaperBadge>}
                control={<PaperSwitch checked onChange={() => { }} label="" />}
              />
            </PaperPanel>
          </div>

          {/* ── Cards ── */}
          <div className="mt-16">
            <SectionHeader title="Cards" marker markerColor="#6f63a3" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Rich content tiles for every use case.
            </p>
            <Divider variant="dashed" label="MetricCard" />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <MetricCard
                label="Documents"
                value="24"
                icon={<FileText size={20} />}
                tone="sage"
                trend={12}
                trendLabel="vs last week"
              />
              <MetricCard
                label="Flashcards"
                value="156"
                icon={<BrainCircuit size={20} />}
                tone="ochre"
                trend={-3}
                description="since yesterday"
              />
              <MetricCard
                label="Study Time"
                value="42"
                unit="hrs"
                icon={<Clock size={20} />}
                tone="sky"
              />
            </div>
            <Divider variant="dashed" label="ActionCard" className="mt-8" />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <ActionCard
                title="Generate Flashcards"
                description="Turn your notes into interactive flashcards."
                icon={<BrainCircuit size={22} />}
                tone="sage"
                badge="AI"
                onClick={() => { }}
              />
              <ActionCard
                title="Start Quiz"
                description="Test your knowledge with a timed quiz."
                icon={<Zap size={22} />}
                tone="ochre"
                badge="New"
                badgeTone="ochre"
                onClick={() => { }}
              />
              <ActionCard
                title="Coming Soon"
                description="This feature is not ready yet."
                icon={<Clock size={22} />}
                tone="ink"
                disabled
              />
            </div>
            <Divider variant="dashed" label="SummaryCard" className="mt-8" />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <SummaryCard
                title="Binary Search Trees"
                summary="A binary search tree is a rooted binary tree where each node has a key greater than all keys in its left subtree and smaller than all keys in its right subtree..."
                source="Chapter 12, CLRS"
                sourceType="document"
                tags={["BST", "trees", "algorithms"]}
                highlightTitle
                onExpand={() => { }}
              />
              <SummaryCard
                title="Database Normalization"
                summary="Normalization organizes relational database columns and tables to reduce data redundancy and improve data integrity..."
                sourceType="notebook"
                tags={["SQL", "design"]}
              />
            </div>
            <Divider
              variant="dashed"
              label="ConceptCard (flashcard style)"
              className="mt-8"
            />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <ConceptCard
                front="What is a closure in JavaScript?"
                back="A closure is a function that retains access to its lexical scope even after the outer function has returned."
                type="DEFINITION"
                status="due"
                course="Web Development"
              />
              <ConceptCard
                front="Time complexity of quicksort (average case)"
                back="O(n log n)"
                type="BASIC"
                status="mastered"
                course="Algorithms"
              />
            </div>
            <Divider
              variant="dashed"
              label="RecommendationCard"
              className="mt-8"
            />
            <div className="mt-6 max-w-lg">
              <RecommendationCard
                title="Review Dynamic Programming"
                description="You've studied DP before but haven't reviewed the topic in 2 weeks. A quick refresher can help retention."
                reason="Based on your study history, spaced repetition suggests reviewing DP topics now."
                actionLabel="Start Review"
                tone="lavender"
                icon={<Sparkles size={18} />}
                onAction={() => { }}
                onDismiss={() => { }}
              />
            </div>
            <Divider variant="dashed" label="NotebookCard" className="mt-8" />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <NotebookCard
                title="Machine Learning Fundamentals"
                course="CS 229"
                blockCount={12}
                lastEdited="2 days ago"
                preview="Supervised learning, linear regression, gradient descent, overfitting, regularization..."
                tags={["ML", "supervised"]}
                onClick={() => { }}
              />
              <NotebookCard
                title="Calculus Review"
                blockCount={8}
                lastEdited="Yesterday"
                preview="Derivatives, integrals, chain rule, partial derivatives, gradients..."
              />
            </div>
            <Divider variant="dashed" label="StickyNoteCard" className="mt-8" />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <StickyNoteCard
                title="Reminder"
                color="yellow"
                pin="push-pin"
                tags={["todo"]}
                footer="Created Today"
              >
                Review the chapter on recursion before tomorrow's class.
              </StickyNoteCard>
              <StickyNoteCard
                title="Key Insight"
                color="pink"
                pin="tape"
                rotate={-0.5}
              >
                The pumping lemma is easier to understand with examples!
              </StickyNoteCard>
            </div>
            <Divider
              variant="dashed"
              label="NotebookSpiralCard"
              className="mt-8"
            />
            <div className="mt-6 max-w-md">
              <NotebookSpiralCard title="Lecture Notes" spiralCount={12}>
                This notebook-style card has spiral wire binding along the top,
                a wobbly hand-drawn border, and a folded dog-ear corner at
                bottom-right.
              </NotebookSpiralCard>
            </div>
            <Divider
              variant="dashed"
              label="StatsCard (full SVG)"
              className="mt-8"
            />
            <div className="mt-6 max-w-md">
              <StatsCard
                title="Weekly Stats"
                stats={[
                  {
                    icon: <Book size={18} />,
                    tone: "sage",
                    label: "Pages Read",
                    value: 247,
                  },
                  {
                    icon: <Clock size={18} />,
                    tone: "sky",
                    label: "Hours",
                    value: "14h",
                    sublabel: "this week",
                  },
                  {
                    icon: <Trophy size={18} />,
                    tone: "ochre",
                    label: "Quizzes",
                    value: 12,
                    sublabel: "passed",
                  },
                ]}
              />
            </div>
          </div>

          {/* ── Utility ── */}
          <div className="mt-16">
            <SectionHeader title="Utility" marker markerColor="#79736a" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Small helpers — avatars, icons, dividers, keyboard hints.
            </p>
            <Divider variant="dashed" label="Avatar" />
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <Avatar name="Alice Chen" tone="sky" size="md" />
              <Avatar name="Bob Patel" tone="sage" size="lg" />
              <Avatar
                src="https://i.pravatar.cc/80?img=3"
                name="Carol Smith"
                tone="lavender"
                size="xl"
              />
              <Avatar name="" size="sm" />
            </div>
            <Divider variant="dashed" label="AvatarGroup" className="mt-8" />
            <div className="mt-6">
              <AvatarGroup avatars={AVATARS} max={4} size="sm" />
            </div>
            <Divider variant="dashed" label="IconWrapper" className="mt-8" />
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <IconWrapper tone="sage" size={44}>
                <Book size={22} />
              </IconWrapper>
              <IconWrapper tone="ochre" size={44}>
                <Star size={22} />
              </IconWrapper>
              <IconWrapper tone="sky" shape="square" size={44}>
                <Search size={22} />
              </IconWrapper>
              <IconWrapper shape="none" size={44}>
                <Bell size={22} />
              </IconWrapper>
            </div>
            <Divider variant="dashed" label="KeyboardHint" className="mt-8" />
            <div className="mt-6 space-y-3">
              <KeyboardHint keys={["⌘", "K"]} label="to search" />
              <KeyboardHint
                keys={["⌘", "Shift", "P"]}
                label="command palette"
              />
              <KeyboardHint keys={["Ctrl", "S"]} label="save" />
            </div>
            <Divider variant="dashed" label="Divider" className="mt-8" />
            <div className="mt-6 space-y-4">
              <p className="font-architect text-xs text-ink-muted">LINE</p>
              <Divider variant="line" />
              <p className="font-architect text-xs text-ink-muted">WAVY</p>
              <Divider variant="wavy" />
              <p className="font-architect text-xs text-ink-muted">DASHED</p>
              <Divider variant="dashed" />
              <p className="font-architect text-xs text-ink-muted">
                WITH LABEL
              </p>
              <Divider variant="wavy" label="SECTION BREAK" />
              <p className="font-architect text-xs text-ink-muted">VERTICAL</p>
              <div className="flex h-8 items-center gap-3">
                <span className="font-kalam text-sm text-ink">Left</span>
                <Divider orientation="vertical" />
                <span className="font-kalam text-sm text-ink">Center</span>
                <Divider orientation="vertical" />
                <span className="font-kalam text-sm text-ink">Right</span>
              </div>
            </div>
            <Divider variant="dashed" label="Separator" className="mt-8" />
            <div className="mt-6 flex items-center gap-2">
              <span className="font-kalam text-sm text-ink">A</span>
              <Separator orientation="vertical" />
              <span className="font-kalam text-sm text-ink">B</span>
              <Separator orientation="vertical" />
              <span className="font-kalam text-sm text-ink">C</span>
            </div>
            <Separator className="mt-4" />
          </div>

          {/* ── Tables ── */}
          <div className="mt-16">
            <SectionHeader title="Tables" marker markerColor="#3a3733" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Rough-bordered data tables with hand-drawn cells.
            </p>
            <PaperTable striped className="max-w-2xl">
              <TableHeader>
                <tr>
                  <PaperTh>Name</PaperTh>
                  <PaperTh>Course</PaperTh>
                  <PaperTh align="right">Pages</PaperTh>
                  <PaperTh align="right">Status</PaperTh>
                </tr>
              </TableHeader>
              <tbody>
                <TableRow index={0}>
                  <TableCell>Binary Search Trees</TableCell>
                  <TableCell muted>CS 106</TableCell>
                  <TableCell align="right">24</TableCell>
                  <TableCell align="right">
                    <StatusBadge status="indexed" />
                  </TableCell>
                </TableRow>
                <TableRow index={1}>
                  <TableCell>Database Normalization</TableCell>
                  <TableCell muted>CS 145</TableCell>
                  <TableCell align="right">12</TableCell>
                  <TableCell align="right">
                    <StatusBadge status="processing" />
                  </TableCell>
                </TableRow>
                <TableRow index={2} selected>
                  <TableCell>Dynamic Programming</TableCell>
                  <TableCell muted>CS 161</TableCell>
                  <TableCell align="right">36</TableCell>
                  <TableCell align="right">
                    <StatusBadge status="failed" />
                  </TableCell>
                </TableRow>
              </tbody>
            </PaperTable>
            <div className="mt-4">
              <Pagination
                page={3}
                totalPages={10}
                onPageChange={() => { }}
                showEdges
              />
            </div>
            <Divider variant="dashed" label="EmptyTable" className="mt-8" />
            <div className="mt-6 max-w-lg">
              <PaperTable>
                <TableHeader>
                  <tr>
                    <PaperTh>Column</PaperTh>
                  </tr>
                </TableHeader>
                <EmptyTable
                  message="No documents yet"
                  hint="Import a PDF or markdown file to get started."
                />
              </PaperTable>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="mt-16">
            <SectionHeader title="Stats" marker markerColor="#3f7a4e" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Statistical displays — numbers, grids, charts, and heatmaps.
            </p>
            <Divider variant="dashed" label="StatNumber" />
            <div className="mt-6 grid grid-cols-3 max-w-lg gap-6">
              <StatNumber value="247" label="Pages Read" tone="sage" />
              <StatNumber value="14h" label="Study Time" tone="sky" />
              <StatNumber
                value="89%"
                label="Accuracy"
                tone="ochre"
                trend="up"
                trendLabel="+5%"
              />
            </div>
            <Divider variant="dashed" label="StatsGrid" className="mt-8" />
            <StatsGrid
              className="mt-6 max-w-2xl"
              columns={3}
              stats={[
                {
                  value: 247,
                  label: "Pages Read",
                  tone: "sage",
                  sublabel: "out of 340",
                },
                {
                  value: "14",
                  label: "Hours",
                  tone: "sky",
                  trend: "up",
                  sublabel: "this week",
                },
                {
                  value: 12,
                  label: "Quizzes",
                  tone: "ochre",
                  sublabel: "passed",
                },
                { value: "A-", label: "Avg Grade", tone: "lavender" },
                {
                  value: 89,
                  label: "Accuracy",
                  tone: "sage",
                  trend: "up",
                  trendLabel: "+5%",
                },
                {
                  value: 3,
                  label: "Streak",
                  tone: "brick",
                  trend: "down",
                  trendLabel: "-1 day",
                },
              ]}
            />
            <Divider
              variant="dashed"
              label="ProgressSummary"
              className="mt-8"
            />
            <div className="mt-6 max-w-md">
              <ProgressSummary
                title="Course Progress"
                value={73}
                leftStat={{ label: "completed", value: "22/30" }}
                rightStat={{ label: "remaining", value: "8" }}
                badge={<PaperBadge tone="sage">on track</PaperBadge>}
              />
            </div>
            <Divider variant="dashed" label="InsightBox" className="mt-8" />
            <div className="mt-6 max-w-lg space-y-4">
              <InsightBox variant="tip" title="Study Tip">
                Review within 24 hours for better retention.
              </InsightBox>
              <InsightBox variant="warning">
                You haven't studied this topic in 2 weeks.
              </InsightBox>
              <InsightBox variant="success" title="Great Job!">
                You've completed all your goals for today.
              </InsightBox>
              <InsightBox variant="info">
                This concept is a prerequisite for the next module.
              </InsightBox>
            </div>
            <Divider variant="dashed" label="MiniChart" className="mt-8" />
            <div className="mt-6 flex gap-8 max-w-lg">
              <div className="flex-1">
                <p className="font-architect text-xs text-ink-muted mb-2">
                  Bar
                </p>
                <MiniChart
                  data={[4, 7, 2, 9, 5, 8, 3]}
                  variant="bar"
                  height={48}
                />
              </div>
              <div className="flex-1">
                <p className="font-architect text-xs text-ink-muted mb-2">
                  Line
                </p>
                <MiniChart
                  data={[30, 45, 28, 60, 55, 72, 48]}
                  variant="line"
                  height={48}
                  color="#b07a2e"
                />
              </div>
            </div>
            <Divider variant="dashed" label="Heatmap" className="mt-8" />
            <div className="mt-6">
              <Heatmap
                data={{
                  "2026-06-01": 5,
                  "2026-06-02": 3,
                  "2026-06-03": 8,
                  "2026-06-04": 2,
                  "2026-06-08": 6,
                  "2026-06-09": 4,
                  "2026-06-10": 7,
                }}
                maxValue={8}
              />
            </div>
          </div>

          {/* ── Teaching ── */}
          <div className="mt-16">
            <SectionHeader
              title="Teaching & Learning"
              marker
              markerColor="#6f63a3"
            />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Components for study recommendations, learning paths, and
              knowledge tracking.
            </p>
            <Divider variant="dashed" label="ConceptNode" />
            <div className="mt-6 max-w-xl">
              <ConceptNode
                title="Binary Search Trees"
                description="A tree data structure where each node has at most two children"
                mastery="mastered"
                badge={<DifficultyBadge difficulty="Easy" />}
                meta="Ch.3"
              />
              <ConceptNode
                title="AVL Trees"
                description="Self-balancing BST with rotation operations"
                mastery="learning"
                badge={<DifficultyBadge difficulty="Medium" />}
                meta="Ch.4"
              />
              <ConceptNode
                title="Red-Black Trees"
                mastery="weak"
                badge={<DifficultyBadge difficulty="Hard" />}
              />
            </div>
            <Divider variant="dashed" label="KnowledgeNode" className="mt-8" />
            <div className="mt-6 max-w-md">
              <KnowledgeNode
                title="Sorting Algorithms"
                summary="Comparison-based and linear-time sorting, lower bounds, and stability."
                mastery="learning"
                tags={[
                  <TypeTag key="1" type="md" />,
                  <CourseTag key="2" course="CS 161" />,
                ]}
                stats={[
                  { label: "cards", value: "24" },
                  { label: "quizzes", value: "3" },
                ]}
              />
            </div>
            <Divider
              variant="dashed"
              label="LearningStepCard"
              className="mt-8"
            />
            <div className="mt-6 max-w-lg space-y-4">
              <LearningStepCard
                step={1}
                title="Introduction to Recursion"
                description="Learn the basic concept of recursive functions."
                status="done"
                estimatedTime="20 min"
              />
              <LearningStepCard
                step={2}
                title="Recursion Tree Method"
                description="Visualize recurrence relations using tree diagrams."
                status="active"
                estimatedTime="30 min"
              />
              <LearningStepCard
                step={3}
                title="Master Theorem"
                description="Solve recurrences using the master theorem."
                estimatedTime="25 min"
              />
            </div>
            <Divider
              variant="dashed"
              label="PrerequisiteCard"
              className="mt-8"
            />
            <div className="mt-6 max-w-md">
              <PrerequisiteCard
                title="Before you start"
                items={[
                  {
                    title: "Basic Data Structures",
                    mastery: "mastered",
                    done: true,
                  },
                  { title: "Big-O Notation", mastery: "mastered", done: true },
                  {
                    title: "Divide and Conquer",
                    mastery: "learning",
                    done: false,
                  },
                  {
                    title: "Dynamic Programming",
                    mastery: "unknown",
                    done: false,
                  },
                ]}
              />
            </div>
            <Divider
              variant="dashed"
              label="StudyRecommendation"
              className="mt-8"
            />
            <div className="mt-6 max-w-lg">
              <StudyRecommendation
                type="read"
                title="Read Chapter 4: Trees"
                source="CLRS"
                estimatedTime="25 min"
                reason="This topic is recommended based on your recent quiz results."
                onAction={() => { }}
              />
            </div>
            <Divider
              variant="dashed"
              label="QuizRecommendation"
              className="mt-8"
            />
            <div className="mt-6 max-w-lg">
              <QuizRecommendation
                title="Binary Trees"
                questionCount={10}
                difficulty="Medium"
                reason="You haven't practiced trees in 3 days."
                onStart={() => { }}
              />
            </div>
          </div>

          {/* ── Feedback ── */}
          <div className="mt-16">
            <SectionHeader title="Feedback" marker markerColor="#9f3a36" />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Loading states, errors, empty states, skeletons, toasts, and
              success banners.
            </p>
            <Divider variant="dashed" label="LoadingPaper" />
            <div className="mt-6 flex flex-wrap items-end gap-10">
              <LoadingPaper variant="dots" size="sm" label="Loading..." />
              <LoadingPaper variant="dots" size="md" />
              <LoadingPaper variant="lines" size="md" label="Loading" />
              <LoadingPaper variant="spinner" size="md" />
            </div>
            <Divider variant="dashed" label="SketchSkeleton" className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-6">
              <SketchSkeleton variant="rect" width={120} height={80} />
              <SketchSkeleton variant="circle" width={48} height={48} />
              <SketchSkeleton variant="text" lines={3} width={200} />
              <SketchSkeleton variant="card" width={180} height={200} />
            </div>
            <Divider variant="dashed" label="EmptyState" className="mt-8" />
            <div className="mt-6 max-w-sm">
              <EmptyState
                icon={<Book size={28} />}
                title="No documents yet"
                description="Import a PDF or markdown file to get started."
                action={
                  <PaperButton size="sm" tone="dark">
                    Import
                  </PaperButton>
                }
              />
            </div>
            <Divider
              variant="dashed"
              label="IllustratedEmptyState"
              className="mt-8"
            />
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-xl">
              <IllustratedEmptyState
                illustration="notebook"
                title="No notes"
                description="Create your first notebook page."
              />
              <IllustratedEmptyState
                illustration="search"
                title="No results"
                description="Try different keywords."
              />
            </div>
            <Divider variant="dashed" label="ErrorCard" className="mt-8" />
            <div className="mt-6 max-w-md">
              <ErrorCard
                title="Failed to load"
                message="Could not fetch course data."
                details="TypeError: Cannot read property 'map' of undefined"
                onRetry={() => { }}
              />
            </div>
            <Divider variant="dashed" label="SuccessBanner" className="mt-8" />
            <div className="mt-6 max-w-lg">
              <SuccessBanner
                title="Document imported"
                message="Operating Systems Ch.5 was added to your library."
                onDismiss={() => { }}
              />
            </div>
            <Divider variant="dashed" label="PaperToast" className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-4">
              <PaperButton
                size="sm"
                tone="dark"
                onClick={() => {
                  setToastVisible(true);
                  setTimeout(() => setToastVisible(false), 3000);
                }}
              >
                Show success toast
              </PaperButton>
              <PaperToast
                visible={toastVisible}
                variant="success"
                message="Changes saved"
                description="Your document was updated."
                onDismiss={() => setToastVisible(false)}
                timeout={3000}
              />
            </div>
          </div>

          {/* ── Dialogs ── */}
          <div className="mt-16">
            <SectionHeader
              title="Dialogs & Overlays"
              marker
              markerColor="#a3544a"
            />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Modals, drawers, popovers, tooltips, dropdowns, context menus, and
              confirmations.
            </p>
            <Divider variant="dashed" label="PaperModal" />
            <div className="mt-6 flex gap-4">
              <PaperButton
                size="sm"
                tone="dark"
                onClick={() => setModalOpen(true)}
              >
                Open modal
              </PaperButton>
              <PaperModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Paper Modal"
                footer={
                  <PaperButton
                    size="sm"
                    tone="dark"
                    onClick={() => setModalOpen(false)}
                  >
                    Close
                  </PaperButton>
                }
              >
                A hand-drawn modal with sketch border, title bar, content area,
                and footer. Closes on Escape or backdrop click.
              </PaperModal>
            </div>
            <Divider variant="dashed" label="PaperDrawer" className="mt-8" />
            <div className="mt-6 flex gap-4">
              <PaperButton
                size="sm"
                tone="dark"
                onClick={() => setDrawerOpen(true)}
              >
                Open drawer
              </PaperButton>
              <PaperDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Paper Drawer"
                side="right"
                footer={
                  <PaperButton
                    size="sm"
                    tone="dark"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Close
                  </PaperButton>
                }
              >
                A side drawer with sketch border, title bar, scrollable content,
                and optional footer. Closes on Escape or backdrop click.
              </PaperDrawer>
            </div>
            <Divider variant="dashed" label="PaperPopover" />
            <div className="mt-6">
              <PaperPopover
                trigger={<PaperButton size="sm">Open popover</PaperButton>}
              >
                Popover content with rough border and arrow.
              </PaperPopover>
            </div>
            <Divider variant="dashed" label="PaperTooltip" className="mt-8" />
            <div className="mt-6">
              <PaperTooltip content="I'm a tooltip" placement="bottom">
                <span className="font-kalam text-[14px] text-ink underline decoration-dashed">
                  Hover me
                </span>
              </PaperTooltip>
            </div>
            <Divider variant="dashed" label="PaperDropdown" className="mt-8" />
            <div className="mt-6">
              <PaperDropdown
                trigger={<PaperButton size="sm">Open dropdown ▾</PaperButton>}
                items={[
                  {
                    key: "edit",
                    label: "Edit",
                    icon: <PencilDoodle size={16} />,
                    onClick: () => { },
                  },
                  {
                    key: "rename",
                    label: "Rename",
                    icon: <BookmarkDoodle size={16} />,
                    onClick: () => { },
                  },
                  { key: "sep", separator: true },
                  {
                    key: "delete",
                    label: "Delete",
                    icon: <X size={14} />,
                    danger: true,
                    onClick: () => { },
                  },
                ]}
              />
            </div>
            <Divider variant="dashed" label="ContextMenu" className="mt-8" />
            <div className="mt-6">
              <ContextMenu
                items={[
                  { key: "open", label: "Open", onClick: () => { } },
                  { key: "copy", label: "Copy link", onClick: () => { } },
                  { key: "sep", separator: true },
                  {
                    key: "delete",
                    label: "Delete",
                    danger: true,
                    onClick: () => { },
                  },
                ]}
              >
                <span className="font-kalam text-[14px] text-ink underline decoration-dashed">
                  Right-click me
                </span>
              </ContextMenu>
            </div>
            <Divider
              variant="dashed"
              label="ConfirmationDialog"
              className="mt-8"
            />
            <div className="mt-6 flex gap-4">
              <PaperButton
                size="sm"
                tone="dark"
                onClick={() => setConfirmOpen(true)}
              >
                Open confirm dialog
              </PaperButton>
              <ConfirmationDialog
                open={confirmOpen}
                onConfirm={() => setConfirmOpen(false)}
                onCancel={() => setConfirmOpen(false)}
                title="Delete document?"
                message="This action cannot be undone."
                confirmLabel="Delete"
                destructive
              />
            </div>
          </div>

          {/* ── Knowledge Graph ── */}
          <div className="mt-12">
            <SectionHeader
              title="Knowledge Graph"
              marker
              markerColor="#3b7c6e"
            />
            <p className="mb-6 font-kalam text-[16px] text-ink-muted/70">
              Components for the knowledge explorer graph — concept nodes, edge
              labels, and mastery filter toggles.
            </p>

            <Divider variant="dashed" label="KnowledgeGraphNode" />
            <div className="mt-6 flex flex-wrap gap-4">
              <KnowledgeGraphNode
                title="Travelling Salesman Problem"
                timeEstimate="5 min"
                sourceCount={2}
                mastery="unknown"
              />
              <KnowledgeGraphNode
                title="Search Algorithms"
                timeEstimate="8 min"
                sourceCount={5}
                mastery="learning"
              />
              <KnowledgeGraphNode
                title="Classical Probability"
                timeEstimate="3 min"
                sourceCount={3}
                mastery="mastered"
              />
              <KnowledgeGraphNode
                title="AI System Architecture"
                timeEstimate="12 min"
                sourceCount={7}
                mastery="weak"
              />
              <KnowledgeGraphNode
                title="Weighted Graph"
                timeEstimate="6 min"
                sourceCount={4}
                mastery="learning"
                selected
              />
              <KnowledgeGraphNode
                title="N-Puzzle Problem"
                timeEstimate="4 min"
                sourceCount={2}
                mastery="unknown"
                dimmed
              />
            </div>

            <Divider
              variant="dashed"
              label="ConceptEdgeLabel"
              className="mt-8"
            />
            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <ConceptEdgeLabel label="covers" relation="covers" />
              <ConceptEdgeLabel label="requires" relation="requires" />
              <ConceptEdgeLabel label="uses" relation="uses" />
              <ConceptEdgeLabel label="related" relation="related" />
              <ConceptEdgeLabel label="introduces" relation="introduces" />
              <ConceptEdgeLabel label="prerequisite" relation="prerequisite" />
            </div>

            <Divider
              variant="dashed"
              label="MasteryFilterGroup"
              className="mt-8"
            />
            <div className="mt-6 max-w-xs">
              <PaperPanel className="px-3 py-3">
                <p className="font-architect text-[11px] uppercase tracking-widest text-ink-muted mb-2 px-2">
                  Mastery
                </p>
                <MasteryFilterGroup
                  items={masteryFilters}
                  onChange={(level, active) =>
                    setMasteryFilters((prev) =>
                      prev.map((f) =>
                        f.level === level ? { ...f, active } : f,
                      ),
                    )
                  }
                />
              </PaperPanel>
            </div>
          </div>

          {/* ── Bottom spacer ── */}
          <div className="mt-20" />
        </div>
      </div>
    </AppShell>
  );
}

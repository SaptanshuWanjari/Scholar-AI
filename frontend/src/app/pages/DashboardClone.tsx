import { useState, useEffect, useCallback } from "react";
import {
  Bell, HelpCircle, MoreHorizontal, Sparkles, Lightbulb, Settings,
} from "lucide-react";
import {
  DashboardLayout, ContentGrid, ContentColumn,
  Sidebar, SidebarHeader, SidebarGroup, SidebarItem, SidebarDivider, TopBar,
  Breadcrumbs, Tabs, CommandBar,
  SketchSearch, IconButton, StickyButton,
  PaperCard, SectionHeader,
  ContinueLearningCard, StatsCard, SessionCard,
  DocumentRow, SketchDivider,
  MarkerHighlight,
} from "../components/paper";
import { SunDoodle, ArrowDoodle } from "@paper-ui/components/doodles";
import {
  SIDEBAR_GROUPS, GREETING, LEARNING_PATH, STATS,
  RECENT_DOCUMENTS, RECENT_SESSIONS, COMMAND_SEEDS,
} from "./dashboard-clone.mock";

const DOC_TABS = [
  { key: "all",     label: "All" },
  { key: "starred", label: "Starred" },
  { key: "recent",  label: "Recent" },
];

export function DashboardClone() {
  const [activeNav, setActiveNav]       = useState("Home");
  const [activeDocTab, setActiveDocTab] = useState("all");
  const [starred, setStarred]           = useState<Record<string, boolean>>({});
  const [commandOpen, setCommandOpen]   = useState(false);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  // Build commands from seeds — attach real action handlers
  const commands = COMMAND_SEEDS.map((seed) => ({
    key: seed.key,
    label: seed.label,
    description: seed.description,
    icon: <seed.icon size={15} />,
    shortcut: seed.key === "ask-ai" ? undefined : undefined,
    action: seed.navTarget
      ? () => setActiveNav(seed.navTarget!)
      : () => {},
  }));

  // Filter recent documents by active tab
  const visibleDocs = RECENT_DOCUMENTS.filter((doc) => {
    if (activeDocTab === "starred") return starred[doc.title] ?? doc.starred;
    return true; // "all" and "recent" both show all for now (no timestamp sorting in mock)
  });

  const sidebar = (
    <Sidebar>
      <SidebarHeader title="Dashboard" subtitle="Your learning at a glance" />
      <nav className="flex-1 px-3">
        {SIDEBAR_GROUPS.map((group) => (
          <SidebarGroup key={group.label} label={group.label}>
            {group.items.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeNav === item.label}
                onClick={() => setActiveNav(item.label)}
              />
            ))}
          </SidebarGroup>
        ))}
        <SidebarDivider />
        <SidebarItem
          icon={Settings}
          label="Settings"
          active={activeNav === "Settings"}
          onClick={() => setActiveNav("Settings")}
        />
        <SidebarItem icon={MoreHorizontal} label="More" />
      </nav>
    </Sidebar>
  );

  const topbar = (
    <TopBar
      start={
        <Breadcrumbs
          items={[
            { label: "Dashboard", onClick: () => setActiveNav("Home") },
            { label: activeNav },
          ]}
        />
      }
    >
      <SketchSearch width={300} onClick={openCommand} readOnly />
      <IconButton label="Notifications">
        <Bell size={20} />
      </IconButton>
      <IconButton label="Help">
        <HelpCircle size={20} />
      </IconButton>
    </TopBar>
  );

  return (
    <>
      <DashboardLayout sidebar={sidebar} topbar={topbar}>
        {/* Greeting row */}
        <div className="mb-9 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <MarkerHighlight thickness={10}>
              <h1 className="font-caveat text-[44px] font-bold leading-none text-ink">
                {GREETING}
              </h1>
            </MarkerHighlight>
            <SunDoodle size={46} className="-mt-1" />
          </div>
          <div className="flex items-center gap-4">
            <StickyButton tone="dark">
              <Sparkles size={18} /> Ask AI
            </StickyButton>
            <StickyButton tone="paper">
              <Lightbulb size={18} /> Teach Me
            </StickyButton>
          </div>
        </div>

        <ContentGrid>
          {/* Left column */}
          <ContentColumn span="main" className="lg:col-span-7">
            <ContinueLearningCard
              course={LEARNING_PATH.course}
              percent={LEARNING_PATH.percent}
              nextTitle={LEARNING_PATH.nextTitle}
              nextNote={LEARNING_PATH.nextNote}
            />

            <section>
              <SectionHeader
                title="Recent Documents"
                marker
                markerColor="#a9a3e0"
                action={
                  <button className="inline-flex items-center gap-1.5 font-architect text-sm text-ink transition-colors hover:text-ink-muted">
                    View all <ArrowDoodle size={15} />
                  </button>
                }
              />

              <Tabs
                items={DOC_TABS}
                active={activeDocTab}
                onChange={setActiveDocTab}
                className="mb-4"
              />

              <PaperCard shadow="sm" className="px-2 py-1.5">
                {visibleDocs.length === 0 ? (
                  <p className="px-4 py-6 text-center font-kalam text-sm text-ink-muted/70">
                    No documents here yet
                  </p>
                ) : (
                  visibleDocs.map((doc, i) => (
                    <div key={doc.title}>
                      <DocumentRow
                        title={doc.title}
                        meta={doc.meta}
                        date={doc.date}
                        iconClass={doc.iconClass}
                        starred={starred[doc.title] ?? doc.starred}
                        onToggleStar={() =>
                          setStarred((s) => ({
                            ...s,
                            [doc.title]: !(s[doc.title] ?? doc.starred),
                          }))
                        }
                      />
                      {i !== visibleDocs.length - 1 && (
                        <SketchDivider variant="straight" className="mx-4 opacity-50" />
                      )}
                    </div>
                  ))
                )}
              </PaperCard>
            </section>
          </ContentColumn>

          {/* Right column */}
          <ContentColumn span="side" className="lg:col-span-5">
            <StatsCard
              title="Your Stats"
              stats={STATS.map((s) => ({
                icon: <s.icon size={20} />,
                tone: s.tone,
                label: s.label,
                sublabel: s.sublabel,
                value: s.value,
              }))}
            />
            <SessionCard title="Recent Sessions" sessions={RECENT_SESSIONS} />
          </ContentColumn>
        </ContentGrid>
      </DashboardLayout>

      <CommandBar
        open={commandOpen}
        onClose={closeCommand}
        commands={commands}
      />
    </>
  );
}

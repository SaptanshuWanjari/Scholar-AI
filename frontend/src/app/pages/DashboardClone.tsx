import React from 'react';
import {
  Home, BookOpen, FileText, Layers, CheckSquare,
  Map, Lightbulb, Notebook, Network, PenTool,
  Repeat, FileQuestion, Settings, MoreHorizontal,
  Search, Command, Bell, HelpCircle, Sun,
  Star, Clock, ChevronRight, CheckCircle2,
  FileCheck2, Check, ArrowRight, LibrarySquare,
  GraduationCap
} from 'lucide-react';
import { SketchyCard } from '../components/sketchy/SketchyCard';
import { SketchyButton } from '../components/sketchy/SketchyButton';
import { SketchyProgressBar } from '../components/sketchy/SketchyProgressBar';
import { cn } from '../components/ui/utils';

// Mock Data
const RECENT_DOCUMENTS = [
  { id: 1, title: 'UNIT - IV.pptx', subtitle: 'AI • 27 pages', date: '2026-06-28', color: 'text-orange-400' },
  { id: 2, title: 'Unit III.pptx', subtitle: 'AI • 10 pages', date: '2026-06-28', color: 'text-green-500' },
  { id: 3, title: 'UNIT - II.pptx', subtitle: 'AI • 32 pages', date: '2026-06-28', color: 'text-blue-400' },
  { id: 4, title: 'UNIT - I.pptx', subtitle: 'AI • 43 pages', date: '2026-06-28', color: 'text-purple-500' },
];

const RECENT_SESSIONS = [
  { id: 1, text: 'Asked: Explain the concept: Mini...', time: '3m', ago: '16h ago' },
  { id: 2, text: 'Asked: Explain the concept: Term...', time: '3m', ago: '16h ago' },
  { id: 3, text: 'Asked: Explain the concept: Maxi...', time: '3m', ago: '16h ago' },
  { id: 4, text: 'Asked: Explain the concept: Gam...', time: '3m', ago: '16h ago' },
];

const SIDEBAR_ITEMS = [
  { icon: Home, label: 'Home', active: true },
  { icon: BookOpen, label: 'Courses' },
  { icon: FileText, label: 'Documents' },
  { icon: Layers, label: 'Flashcards' },
  { icon: CheckSquare, label: 'Quizzes' },
  { icon: Map, label: 'Learning Paths' },
  { icon: Lightbulb, label: 'Teach Me' },
  { icon: Notebook, label: 'Notebook' },
  { icon: Network, label: 'Mindmaps' },
  { icon: PenTool, label: 'Diagrams' },
  { icon: Repeat, label: 'Revision' },
  { icon: FileQuestion, label: 'PYQ' },
  { icon: Settings, label: 'Settings' },
];

export function DashboardClone() {
  return (
    <div className="flex h-screen bg-[#f7f5ef] font-kalam text-slate-800 overflow-hidden selection:bg-yellow-200">

      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-slate-300/50 flex flex-col pt-6 pb-4 overflow-y-auto custom-scrollbar">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center transform -rotate-3 text-white" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
              <BookOpen size={20} className="absolute bottom-1.5" />
              <GraduationCap size={24} className="absolute top-1" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Dashboard</h1>
            <p className="text-xs text-slate-500 font-sans">Your learning at a glance</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {SIDEBAR_ITEMS.map((item, i) => (
            <button
              key={i}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors relative",
                item.active ? "font-semibold" : "hover:bg-slate-200/50 rounded-md"
              )}
            >
              {item.active && (
                <div className="absolute inset-0 bg-yellow-100/80 border border-yellow-200/50 -rotate-1 shadow-sm" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px", left: "2px", right: "2px" }} />
              )}
              <div className="relative z-10 flex items-center gap-3">
                <item.icon size={18} className={cn("shrink-0", item.active ? "text-slate-800" : "text-slate-600")} strokeWidth={item.active ? 2.5 : 2} />
                <span className="text-[15px]">{item.label}</span>
              </div>
            </button>
          ))}

          <div className="my-4 border-t border-slate-200" />

          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-100 rounded-md transition-colors">
            <MoreHorizontal size={18} className="text-slate-600 shrink-0" />
            <span className="text-[15px]">More</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <header className="h-20 border-b-2 border-slate-300/50 flex items-center justify-between px-10 shrink-0">
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <div className="relative flex items-center bg-[#fdfaf6] border-2 border-slate-800 px-3 py-1.5 shadow-sm" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
              <Search className="text-slate-400 shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search or jump to..."
                className="w-64 bg-transparent border-none px-2 text-sm focus:outline-none font-sans"
              />
              <div className="flex items-center gap-1 text-slate-500 border-2 border-slate-300 bg-slate-50 px-1.5 py-0.5 text-xs font-sans" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
                <Command size={12} /> K
              </div>
            </div>
            <button className="text-slate-600 hover:text-slate-800 transition-colors">
              <Bell size={22} />
            </button>
            <button className="text-slate-600 hover:text-slate-800 transition-colors">
              <HelpCircle size={22} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">

          {/* Welcome Area */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="relative inline-block">
                <h2 className="text-[2.75rem] font-bold tracking-tight z-10 relative leading-none">Good afternoon, Saptanshu.</h2>
                <svg className="absolute -bottom-3 left-0 w-full h-4 z-0 text-yellow-300" viewBox="0 0 400 20" preserveAspectRatio="none">
                  <path d="M5,15 Q100,5 200,10 T395,15" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </div>

              <svg width="40" height="40" viewBox="0 0 100 100" className="text-slate-700 -mt-2">
                <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M40 45 Q45 40 50 45 M60 45 Q65 40 70 45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M45 55 Q50 65 60 55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="50" y1="10" x2="50" y2="20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="80" x2="50" y2="90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="10" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="80" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="22" y1="22" x2="29" y2="29" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="71" y1="71" x2="78" y2="78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="22" y1="78" x2="29" y2="71" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="71" y1="29" x2="78" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex gap-4">
              <SketchyButton variant="primary" className="text-lg px-6 py-2 shadow-[2px_4px_10px_rgba(0,0,0,0.2)]">
                <Star size={18} /> Ask AI
              </SketchyButton>
              <SketchyButton variant="outline" className="text-lg px-6 py-2 bg-white shadow-sm">
                <Lightbulb size={18} /> Teach Me
              </SketchyButton>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">

              {/* Continue Learning */}
              <SketchyCard className="bg-[#fdfaf6]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest font-sans">Continue Learning</span>
                  <div className="bg-yellow-100/90 p-2 border border-yellow-200 transform rotate-6 shadow-sm absolute -top-4 -right-4 w-16 h-16 flex items-center justify-center">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-slate-400 z-10 text-xl rotate-45">📌</div>
                    <Map className="text-slate-700" size={28} strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-3xl font-bold mb-1">Artificial Intelligence</h3>
                <p className="text-slate-600 mb-4 font-sans text-sm">33% completed</p>

                <div className="w-1/2 mb-8">
                  <SketchyProgressBar progress={33} />
                </div>

                <div className="border-2 border-slate-200 rounded-xl p-5" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
                  <p className="text-sm text-slate-500 mb-3 font-sans">Next up:</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-slate-800 rounded-lg">
                      <Network size={24} className="text-slate-700" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Game Trees</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-sans mt-1">
                        All prerequisites complete <CheckCircle2 size={16} className="text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <SketchyButton variant="outline">View All Paths</SketchyButton>
                  <SketchyButton variant="secondary" className="bg-green-100 border-green-800 text-green-900">
                    Continue <ArrowRight size={16} />
                  </SketchyButton>
                </div>
              </SketchyCard>

              {/* Recent Documents */}
              <div>
                <div className="flex items-center justify-between mb-3 px-2 relative">
                  <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-widest font-sans inline-block relative">
                    Recent Documents
                    <svg className="absolute -bottom-1.5 left-0 w-full h-2 z-0 text-indigo-500/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0,5 Q25,2 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </h3>
                  <button className="text-slate-700 hover:text-slate-900 flex items-center gap-1 font-semibold text-sm relative">
                    View all <ArrowRight size={14} />
                    <svg className="absolute -bottom-1.5 left-0 w-full h-2 z-0 text-indigo-500/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0,5 Q25,2 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                
                <SketchyCard className="p-1.5 bg-[#fbfaf6] border border-slate-400 shadow-none">
                  <div className="flex flex-col">
                    {RECENT_DOCUMENTS.map((doc, idx) => (
                      <div key={doc.id} className="relative">
                        <div className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-5">
                            <FileText size={24} className={doc.color} strokeWidth={1.5} />
                            <div>
                              <p className="font-semibold text-base leading-tight tracking-wide">{doc.title}</p>
                              <p className="text-[13px] text-slate-500 font-sans mt-0.5">{doc.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <span className="text-slate-600 text-sm font-sans tracking-wide">{doc.date}</span>
                            <button className="text-slate-400 hover:text-slate-700 transition-colors">
                              <Star size={20} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                        {idx !== RECENT_DOCUMENTS.length - 1 && (
                          <div className="mx-4 border-b border-slate-200/80 border-dashed" />
                        )}
                      </div>
                    ))}
                  </div>
                </SketchyCard>
              </div>

            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">

              {/* Your Stats */}
              <SketchyCard spiral folded className="pt-10 pb-6 bg-[#fdfaf6]">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-sans mb-6">Your Stats</h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200" style={{ borderBottomStyle: 'dashed' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center text-purple-600 bg-purple-100 border border-purple-200 shadow-sm" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg leading-tight">Documents</p>
                        <p className="text-xs text-slate-500 font-sans">1 courses</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold">4</span>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200" style={{ borderBottomStyle: 'dashed' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center text-orange-600 bg-orange-100 border border-orange-200 shadow-sm" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
                        <Layers size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg leading-tight">Cards due today</p>
                        <p className="text-xs text-slate-500 font-sans">Review today</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold">8</span>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200" style={{ borderBottomStyle: 'dashed' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-100 border border-blue-200 shadow-sm" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
                        <LibrarySquare size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg leading-tight">Total Flashcards</p>
                        <p className="text-xs text-slate-500 font-sans">Across all decks</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold">8</span>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200" style={{ borderBottomStyle: 'dashed' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center text-green-600 bg-green-100 border border-green-200 shadow-sm" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
                        <FileCheck2 size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg leading-tight">Quizzes taken</p>
                        <p className="text-xs text-slate-500 font-sans">Total attempts</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold">2</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center text-red-600 bg-red-100 border border-red-200 shadow-sm" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-lg leading-tight">Study sessions</p>
                        <p className="text-xs text-slate-500 font-sans">Recorded sessions</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold">7</span>
                  </div>
                </div>
              </SketchyCard>

              {/* Recent Sessions */}
              <SketchyCard tape="top-left" className="pb-4 bg-white shadow-sm mt-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-sans mb-4">Recent Sessions</h3>

                <div className="space-y-4 mb-6">
                  {RECENT_SESSIONS.map((session) => (
                    <div key={session.id} className="flex gap-3">
                      <Clock size={16} className="text-slate-400 shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold truncate" title={session.text}>{session.text}</p>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">—</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold">{session.time}</p>
                        <p className="text-[10px] text-slate-500 font-sans mt-1">{session.ago}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold text-sm">
                  View all sessions <ArrowRight size={14} />
                </button>
              </SketchyCard>

            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

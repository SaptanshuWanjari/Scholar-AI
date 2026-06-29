import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Toaster } from "./components/ui/sonner";
import { PromptCoachModal } from "./components/PromptCoachModal";
import OnboardingWidget from "./components/OnboardingWidget";
import PageLoading from "./components/ui/PageLoading";
import { OnboardingProvider } from "./context/OnboardingContext";
import { api } from "./lib/api";
import { KNOWN_PLUGINS } from "./plugins/registry";
import { usePluginStore } from "./plugins/usePluginStore";

const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase").then((m) => ({ default: m.KnowledgeBase })));
const Documents = lazy(() => import("./pages/Documents").then((m) => ({ default: m.Documents })));
const AskAI = lazy(() => import("./pages/AskAI").then((m) => ({ default: m.AskAI })));
const Notebooks = lazy(() => import("./pages/Notebooks").then((m) => ({ default: m.Notebooks })));
const Reading = lazy(() => import("./pages/Reading").then((m) => ({ default: m.Reading })));
const Exam = lazy(() => import("./pages/Exam").then((m) => ({ default: m.Exam })));
const PyqAnalysis = lazy(() => import("./pages/PyqAnalysis").then((m) => ({ default: m.PyqAnalysis })));
const Revision = lazy(() => import("./pages/Revision").then((m) => ({ default: m.Revision })));
const Flashcards = lazy(() => import("./pages/Flashcards").then((m) => ({ default: m.Flashcards })));
const QuizPage = lazy(() => import("./pages/Quiz").then((m) => ({ default: m.QuizPage })));
const Diagrams = lazy(() => import("./pages/Diagrams").then((m) => ({ default: m.Diagrams })));
const MindMaps = lazy(() => import("./pages/MindMaps").then((m) => ({ default: m.MindMaps })));
const Teach = lazy(() => import("./pages/Teach").then((m) => ({ default: m.Teach })));
const LearningPath = lazy(() => import("./pages/LearningPath").then((m) => ({ default: m.LearningPath })));
const SearchPage = lazy(() => import("./pages/Search").then((m) => ({ default: m.SearchPage })));
const SettingsPage = lazy(() => import("./pages/Settings").then((m) => ({ default: m.SettingsPage })));
const Trace = lazy(() => import("./pages/Trace").then((m) => ({ default: m.Trace })));
const Courses = lazy(() => import("./pages/Courses").then((m) => ({ default: m.Courses })));
const Differences = lazy(() => import("./pages/Differences").then((m) => ({ default: m.Differences })));
const Consistency = lazy(() => import("./pages/Consistency").then((m) => ({ default: m.Consistency })));
const PromptLibrary = lazy(() => import("./pages/PromptLibrary").then((m) => ({ default: m.PromptLibrary })));
const Guide = lazy(() => import("./pages/Guide").then((m) => ({ default: m.Guide })));

const OnboardingHero = lazy(() => import("./pages/onboarding/OnboardingHero").then((m) => ({ default: m.OnboardingHero })));
const OnboardingSetup = lazy(() => import("./pages/onboarding/OnboardingSetup").then((m) => ({ default: m.OnboardingSetup })));
const OnboardingImport = lazy(() => import("./pages/onboarding/OnboardingImport").then((m) => ({ default: m.OnboardingImport })));
const OnboardingAnalyzing = lazy(() => import("./pages/onboarding/OnboardingAnalyzing").then((m) => ({ default: m.OnboardingAnalyzing })));
const OnboardingReady = lazy(() => import("./pages/onboarding/OnboardingReady").then((m) => ({ default: m.OnboardingReady })));
const DashboardClone = lazy(() => import("./pages/DashboardClone").then((m) => ({ default: m.DashboardClone })));
const ComponentsShowcase = lazy(() => import("./pages/ComponentsShowcase"));

function FirstLaunchGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("scholar_onboarding_done")) return;
    api.listDocuments().then((docs) => {
      if (docs.length === 0) navigate("/onboarding", { replace: true });
    }).catch(() => {});
  }, [navigate]);

  return <>{children}</>;
}

import { AppearanceSync } from "./components/layout/AppearanceSync";

export default function App() {
  const isEnabled = usePluginStore((s) => s.isEnabled);

  return (
    <BrowserRouter>
      <AppearanceSync />
      <OnboardingProvider>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Onboarding flow — full-page, no sidebar */}
            <Route path="/onboarding" element={<OnboardingHero />} />
            <Route path="/onboarding/setup" element={<OnboardingSetup />} />
            <Route path="/onboarding/import" element={<OnboardingImport />} />
            <Route path="/onboarding/analyzing" element={<OnboardingAnalyzing />} />
            <Route path="/onboarding/ready" element={<OnboardingReady />} />

            {/* Main workspace — guarded by first-launch check */}
            <Route element={<FirstLaunchGuard><AppLayout /></FirstLaunchGuard>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/teach" element={<Teach />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="/learning-path/:id" element={<LearningPath />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/ask" element={<AskAI />} />
              <Route path="/notebooks" element={<Notebooks />} />
              <Route path="/reading" element={<Reading />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/exam-analysis" element={<PyqAnalysis />} />
              <Route path="/revision" element={<Revision />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/diagrams" element={<Diagrams />} />
              <Route path="/mindmaps" element={<MindMaps />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/trace" element={<Trace />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/differences" element={<Differences />} />
              <Route path="/consistency" element={<Consistency />} />
              <Route path="/prompts" element={<PromptLibrary />} />

              <Route path="/guide" element={<Guide />} />
              {KNOWN_PLUGINS.flatMap((plugin) =>
                (plugin.routes ?? []).map((r) =>
                  isEnabled(plugin.id) ? (
                    <Route key={r.path} path={r.path} element={r.element} />
                  ) : (
                    <Route key={r.path} path={r.path} element={<Navigate to="/" replace />} />
                  ),
                ),
              )}
            </Route>

            {/* Dashboard Clone - No Layout for exact match with design */}
            <Route path="/dashboard-clone" element={<DashboardClone />} />
            <Route path="/components" element={<ComponentsShowcase />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-right" theme="light" />
        <PromptCoachModal />
        <OnboardingWidget />
      </OnboardingProvider>
    </BrowserRouter>
  );
}

import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Toaster } from "./components/ui/sonner";
import { PromptCoachModal } from "./components/PromptCoachModal";
import OnboardingWidget from "./components/OnboardingWidget";
import { Dashboard } from "./pages/Dashboard";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { Documents } from "./pages/Documents";
import { AskAI } from "./pages/AskAI";
import { Notebooks } from "./pages/Notebooks";
import { Reading } from "./pages/Reading";
import { Exam } from "./pages/Exam";
import { PyqAnalysis } from "./pages/PyqAnalysis";
import { Revision } from "./pages/Revision";
import { Flashcards } from "./pages/Flashcards";
import { QuizPage } from "./pages/Quiz";
import { Diagrams } from "./pages/Diagrams";
import { MindMaps } from "./pages/MindMaps";
import { Teach } from "./pages/Teach";
import { LearningPath } from "./pages/LearningPath";
import { SearchPage } from "./pages/Search";
import { SettingsPage } from "./pages/Settings";
import { Trace } from "./pages/Trace";
import { Courses } from "./pages/Courses";
import { Differences } from "./pages/Differences";
import { Consistency } from "./pages/Consistency";
import { PromptLibrary } from "./pages/PromptLibrary";
import { CodeLibrary } from "./pages/CodeLibrary";
import { Guide } from "./pages/Guide";
import { OnboardingHero } from "./pages/onboarding/OnboardingHero";
import { OnboardingImport } from "./pages/onboarding/OnboardingImport";
import { OnboardingAnalyzing } from "./pages/onboarding/OnboardingAnalyzing";
import { OnboardingReady } from "./pages/onboarding/OnboardingReady";
import { OnboardingProvider } from "./context/OnboardingContext";
import { api } from "./lib/api";
import { KNOWN_PLUGINS } from "./plugins/registry";
import { usePluginStore } from "./plugins/usePluginStore";

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

export default function App() {
  const isEnabled = usePluginStore((s) => s.isEnabled);

  return (
    <BrowserRouter>
      <OnboardingProvider>
        <Routes>
          {/* Onboarding flow — full-page, no sidebar */}
          <Route path="/onboarding" element={<OnboardingHero />} />
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
            <Route path="/code-library" element={<CodeLibrary />} />
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" theme="light" />
        <PromptCoachModal />
        <OnboardingWidget />
      </OnboardingProvider>
    </BrowserRouter>
  );
}

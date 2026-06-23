import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Toaster } from "./components/ui/sonner";
import { Dashboard } from "./pages/Dashboard";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { Documents } from "./pages/Documents";
import { AskAI } from "./pages/AskAI";
import { Notebooks } from "./pages/Notebooks";
import { Reading } from "./pages/Reading";
import { Exam } from "./pages/Exam";
import { Revision } from "./pages/Revision";
import { Flashcards } from "./pages/Flashcards";
import { QuizPage } from "./pages/Quiz";
import { Diagrams } from "./pages/Diagrams";
import { MindMaps } from "./pages/MindMaps";
import { SearchPage } from "./pages/Search";
import { SettingsPage } from "./pages/Settings";
import { Trace } from "./pages/Trace";
import { OnboardingHero } from "./pages/onboarding/OnboardingHero";
import { OnboardingImport } from "./pages/onboarding/OnboardingImport";
import { OnboardingAnalyzing } from "./pages/onboarding/OnboardingAnalyzing";
import { OnboardingReady } from "./pages/onboarding/OnboardingReady";
import { OnboardingProvider } from "./context/OnboardingContext";
import { api } from "./lib/api";

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
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/ask" element={<AskAI />} />
            <Route path="/notebooks" element={<Notebooks />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/diagrams" element={<Diagrams />} />
            <Route path="/mindmaps" element={<MindMaps />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/trace" element={<Trace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" theme="light" />
      </OnboardingProvider>
    </BrowserRouter>
  );
}

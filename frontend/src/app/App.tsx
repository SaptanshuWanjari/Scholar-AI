import { BrowserRouter, Routes, Route } from "react-router";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
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
        </Route>
      </Routes>
      <Toaster position="bottom-right" theme="light" />
    </BrowserRouter>
  );
}

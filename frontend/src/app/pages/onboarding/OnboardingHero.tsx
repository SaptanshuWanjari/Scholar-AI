import { useNavigate } from "react-router";
import { GraduationCap, Cpu, Lock, WifiOff, BookMarked } from "lucide-react";
import { motion } from "motion/react";
import { PaperButton, StickyButton } from "@paper-ui/components/buttons";
import { PaperBadge } from "@paper-ui/components/badges";
import { PaperH1, PaperH2, PaperIconCircle } from "@paper-ui/core";
import { ArrowDoodle } from "@paper-ui/components/doodles";

const formats = ["PDF", "DOCX", "PPTX", "Markdown", "Text"];

const traits = [
  { icon: Cpu, label: "Powered by local AI" },
  { icon: Lock, label: "Private by design" },
  { icon: WifiOff, label: "Offline-first" },
  { icon: BookMarked, label: "Source-grounded" },
];

export function OnboardingHero() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-[#f5f0e8] px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-4xl flex-col items-center text-center mt-8"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <PaperIconCircle tone="lavender" size={80}>
            <GraduationCap size={40} />
          </PaperIconCircle>
        </motion.div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-6"
        >
          <PaperH1 marker markerColor="rgba(111,99,163,0.25)">ScholarAI</PaperH1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4"
        >
          <PaperH2 className="text-[22px] text-ink/90 max-w-2xl">
            Turn your study materials into a personalized AI learning workspace.
          </PaperH2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-4 max-w-2xl leading-relaxed font-kalam text-[15px] text-ink-muted text-balance"
        >
          Import textbooks, lecture notes, research papers and documentation.
          ScholarAI organizes everything using local AI and helps you study
          through learning paths, flashcards, AI tutoring, revision tools and
          semantic search.
          <br />
          <br />
          Everything stays on your machine.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 flex flex-col items-center w-full"
        >
          <StickyButton
            tone="dark"
            onClick={() => navigate("/onboarding/setup")}
          >
            Get Started
            <ArrowDoodle size={18} color="#fbf8f2" />
          </StickyButton>
        </motion.div>

        {/* Supported formats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {formats.map((fmt) => (
            <PaperBadge key={fmt} tone="ink">
              {fmt}
            </PaperBadge>
          ))}
        </motion.div>

        {/* Traits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 flex flex-wrap justify-center gap-6"
        >
          {traits.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 font-architect text-[13px] text-ink-muted"
            >
              <Icon size={14} />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

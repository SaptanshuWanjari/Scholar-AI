import { useNavigate } from "react-router";
import { GraduationCap, Cpu, Lock, WifiOff, BookMarked } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

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
    <div className="flex h-screen items-center justify-center bg-background px-6">
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
          className="flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
        >
          <GraduationCap className="size-12" />
        </motion.div>

        {/* Brand */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-6 font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl"
        >
          ScholarAI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 max-w-2xl text-xl text-foreground font-medium text-balance"
        >
          Turn your study materials into a personalized AI learning workspace.
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-4 max-w-2xl leading-relaxed text-muted-foreground text-balance"
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
          <Button
            size="lg"
            className="w-full max-w-sm gap-2 bg-primary px-8 text-lg font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/onboarding/import")}
          >
            Get Started
          </Button>
        </motion.div>

        {/* Supported formats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {formats.map((fmt) => (
            <Badge
              key={fmt}
              variant="secondary"
              className="px-3 py-1 text-xs font-medium"
            >
              {fmt}
            </Badge>
          ))}
        </motion.div>

        {/* Traits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 flex flex-wrap justify-center gap-5"
        >
          {traits.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

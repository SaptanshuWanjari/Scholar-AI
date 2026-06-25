import { useNavigate } from "react-router";
import { GraduationCap, Upload, Cpu, Lock, WifiOff, BookMarked } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const formats = ["PDF", "DOCX", "Markdown", "Text"];

const traits = [
  { icon: Cpu, label: "Powered by local AI" },
  { icon: Lock, label: "Private" },
  { icon: WifiOff, label: "Offline-first" },
  { icon: BookMarked, label: "Source-grounded" },
];

export function OnboardingHero() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-lg flex-col items-center text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
        >
          <GraduationCap className="size-9" />
        </motion.div>

        {/* Brand */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-6 font-display text-4xl font-semibold tracking-tight text-foreground"
        >
          ScholarAI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 text-lg text-muted-foreground"
        >
          Your personal knowledge workspace.
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-5 max-w-sm leading-relaxed text-muted-foreground"
        >
          Import documents, notes, textbooks, research papers and study materials to begin
          building your library. Everything stays on your machine.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center w-full max-w-xs sm:max-w-none"
        >
          <Button
            size="lg"
            className="w-full gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90 sm:w-auto"
            onClick={() => navigate("/onboarding/import")}
          >
            <Upload className="size-4" />
            Import Documents
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full gap-2 px-8 text-muted-foreground hover:text-foreground sm:w-auto"
            onClick={() => {
              localStorage.setItem("scholar_onboarding_done", "1");
              navigate("/");
            }}
          >
            Explore on my own
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
            <Badge key={fmt} variant="secondary" className="px-3 py-1 text-xs font-medium">
              {fmt}
            </Badge>
          ))}
        </motion.div>

        {/* Traits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
        >
          {traits.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon className="size-3.5" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

import { useNavigate } from "react-router";
import {
  Cpu,
  Lock,
  WifiOff,
  BookMarked,
  FolderPlus,
  Lightbulb,
  ClipboardList,
  ShieldCheck,
  FileText,
  FileType,
  File,
  FileCode,
  AlignLeft,
} from "lucide-react";
import { motion } from "motion/react";
import { StickyButton } from "@paper-ui/components/buttons";
import { PaperBadge } from "@paper-ui/components/badges";
import { PaperH1, PaperIconCircle } from "@paper-ui/core";
import {
  ArrowDoodle,
  StarDoodle,
  PaperPlaneDoodle,
} from "@paper-ui/components/doodles";

const formats = [
  { label: "PDF", icon: FileText, color: "#e05a4b" },
  { label: "Markdown", icon: FileCode, color: "#3a3733" },
  { label: "Text", icon: AlignLeft, color: "#3a3733" },
];

const features = [
  {
    icon: FolderPlus,
    label: "Import",
    sublabel: "anything",
    tone: "lavender" as const,
  },
  {
    icon: Lightbulb,
    label: "Learn",
    sublabel: "smarter",
    tone: "ochre" as const,
  },
  {
    icon: ClipboardList,
    label: "Stay",
    sublabel: "organized",
    tone: "sage" as const,
  },
  {
    icon: ShieldCheck,
    label: "100% private",
    sublabel: "& local",
    tone: "ink" as const,
  },
];

const traits = [
  { icon: Cpu, label: "Powered by local AI" },
  { icon: Lock, label: "Private by design" },
  { icon: WifiOff, label: "Offline-first" },
  { icon: BookMarked, label: "Source-grounded" },
];

export function OnboardingHero() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f0e8] px-6 py-10">
      {/* Left doodle — star with dashed curved trail */}
      <div className="pointer-events-none absolute left-[5%] top-[22%]">
        <svg width="130" height="130" fill="none" aria-hidden>
          <path
            d="M110 15 Q70 40 45 80 Q30 98 18 115"
            stroke="#3a3733"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="4 5.5"
          />
        </svg>
        <div className="absolute left-[68%] top-[2%]">
          <StarDoodle size={26} color="#d4a843" />
        </div>
      </div>

      {/* Right doodle — paper plane with dashed curved trail + plus sign */}
      <div className="pointer-events-none absolute right-[5%] top-[20%]">
        <svg width="130" height="130" fill="none" aria-hidden>
          <path
            d="M20 15 Q60 40 85 80 Q100 98 112 115"
            stroke="#3a3733"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="4 5.5"
          />
        </svg>
        <div className="absolute left-[5%] top-[1%] rotate-[25deg]">
          <PaperPlaneDoodle size={28} color="#3a3733" />
        </div>
        <div className="absolute bottom-[10%] right-[8%] font-architect text-[22px] font-light leading-none text-[#9b95e5]">
          +
        </div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-3xl flex-col items-center text-center"
      >
        {/* Logo icon */}
        <motion.img
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          src="/icon-name.png"
          alt="ScholarAI logo"
          className="h-[340px] -pb-4"
        />


        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className=" font-architect text-[1.32rem] text-ink/90 tracking-wide"
        >
          Your AI-powered study workspace.
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
          className="mt-3 max-w-xl font-kalam leading-relaxed text-ink/65 text-balance"
        >
          Import your study materials, organize everything in one place, and
          learn smarter with AI — all{" "}
          <span className="underline underline-offset-2 decoration-[#c9a96e]">
            private
          </span>
          ,{" "}
          <span className="underline underline-offset-2 decoration-[#c9a96e]">
            local
          </span>
          , and{" "}
          <span className="underline underline-offset-2 decoration-[#c9a96e]">
            offline-first
          </span>
          .
        </motion.p>

        {/* Feature row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46, duration: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center"
        >
          {features.map(({ icon: Icon, label, sublabel, tone }, i) => (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-3 px-5 py-1">
                <PaperIconCircle tone={tone} size={40}>
                  <Icon size={22} />
                </PaperIconCircle>
                <div className="text-left">
                  <p className="font-kalam text-[15px] leading-tight text-ink">
                    {label}
                  </p>
                  <p className="font-kalam text-[15px] leading-tight text-ink">
                    {sublabel}
                  </p>
                </div>
              </div>
              {i < features.length - 1 && (
                <div className="h-10 w-px shrink-0 border-l border-dashed border-[#c5bfb0]" />
              )}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54, duration: 0.4 }}
          className="mt-10"
        >
          <StickyButton
            tone="dark"
            onClick={() => navigate("/onboarding/setup")}
          >
            Get Started
            <ArrowDoodle size={18} color="#fbf8f2" />
          </StickyButton>
        </motion.div>

        {/* Format badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62, duration: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {formats.map(({ label, icon: Icon, color }) => (
            <PaperBadge key={label} tone="ink">
              <Icon size={11} style={{ color }} className="shrink-0" />
              {label}
            </PaperBadge>
          ))}
        </motion.div>

        {/* Traits footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-y-2"
        >
          {traits.flatMap(({ icon: Icon, label }, i) => [
            ...(i > 0
              ? [
                <span
                  key={`sep-${i}`}
                  className="mx-3 select-none text-[#c5bfb0]"
                >
                  |
                </span>,
              ]
              : []),
            <div
              key={label}
              className="flex items-center gap-1.5 font-architect text-[15px] text-ink-muted"
            >
              <Icon size={15} />
              <span>{label}</span>
            </div>,
          ])}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Server component — no "use client"
import Link from "next/link";
import { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { challenges, executiveSummary } from "@/data/challenges";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { HL7FlowViz } from "@/components/challenges/hl7-flow-viz";
import { HipaaBeforeAfter } from "@/components/challenges/hipaa-before-after";
import { EMRArchitectureViz } from "@/components/challenges/emr-architecture-viz";

export const metadata: Metadata = {
  title: "My Approach | Clinical Data Integration",
};

function OutcomeStatement({ outcome }: { outcome: string }) {
  return (
    <div
      className="flex items-start gap-2 rounded-sm px-3 py-2"
      style={{
        backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
        borderColor: "color-mix(in oklch, var(--success) 15%, transparent)",
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <TrendingUp className="h-4 w-4 mt-0.5 shrink-0 text-[color:var(--success)]" />
      <p className="text-sm font-medium text-[color:var(--success)]">{outcome}</p>
    </div>
  );
}

function renderDifferentApproach(text: string, accentWord?: string) {
  if (!accentWord) return <span>{text}</span>;
  const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "i"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === accentWord.toLowerCase() ? (
          <span key={i} className="text-primary font-semibold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Map challenge IDs to their visualization components.
// HipaaBeforeAfter is a client component (uses useState) — the server page
// can include it because Next.js handles the boundary automatically.
const vizTypeLabel: Record<string, string> = {
  "challenge-1": "Pipeline Design",
  "challenge-2": "Compliance Architecture",
  "challenge-3": "Integration Architecture",
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-8">

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold">My Engineering Approach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            How I would architect the HL7/Mirth integration and HIPAA compliance layer for this project
          </p>
        </div>

        {/* Executive summary — dark banner */}
        <div
          className="relative overflow-hidden rounded-sm p-6 md:p-8"
          style={{
            background: "oklch(0.10 0.02 180)",
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.03), transparent 70%)",
          }}
        >
          <p className="text-sm md:text-base leading-relaxed text-white/50">
            {executiveSummary.commonApproach}
          </p>
          <hr className="my-4 border-white/10" />
          <p className="text-base md:text-lg leading-relaxed font-medium text-white/90">
            {renderDifferentApproach(
              executiveSummary.differentApproach,
              executiveSummary.accentWord
            )}
          </p>
          <p className="text-xs text-white/40 mt-3">
            {"← "}
            <Link
              href="/"
              className="hover:text-white/60 transition-colors duration-100 underline underline-offset-2"
            >
              See the integration hub
            </Link>
          </p>
        </div>

        {/* Challenge cards */}
        <div className="flex flex-col gap-4">
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className="animate-fade-up-in"
              style={{ animationDelay: `${index * 80}ms`, animationDuration: "200ms" }}
            >
              <ChallengeCard
                title={challenge.title}
                description={challenge.description}
                outcome={undefined}
              >
                {/* Step number + section label */}
                <div className="flex items-center gap-2 mb-3 -mt-1">
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {vizTypeLabel[challenge.id]}
                  </span>
                </div>

                {/* Domain-specific visualization */}
                {challenge.id === "challenge-1" && <HL7FlowViz />}
                {challenge.id === "challenge-2" && <HipaaBeforeAfter />}
                {challenge.id === "challenge-3" && <EMRArchitectureViz />}

                {/* Outcome statement */}
                {challenge.outcome && (
                  <OutcomeStatement outcome={challenge.outcome} />
                )}
              </ChallengeCard>
            </div>
          ))}
        </div>

        {/* CTA Closer */}
        <section
          className="rounded-sm border p-6"
          style={{
            borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)",
            backgroundColor: "color-mix(in oklch, var(--primary) 3%, transparent)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold mb-1">
                Ready to discuss the integration architecture?
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                I&apos;ve thought through the Mirth channel design, FHIR mapping layer, and HIPAA controls in detail. Happy to walk through any of this on a call.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/proposal"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-100"
              >
                See the proposal →
              </Link>
              <span
                className="text-xs font-medium px-3 py-1.5 rounded-sm border"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--primary) 8%, transparent)",
                  borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)",
                  color: "var(--primary)",
                }}
              >
                Reply on Upwork to start
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

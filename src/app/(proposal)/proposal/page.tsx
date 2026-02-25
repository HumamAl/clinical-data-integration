import { APP_CONFIG } from "@/lib/config";
import { profile, portfolioProjects } from "@/data/proposal";
import { ExternalLink, TrendingUp } from "lucide-react";

// Corporate Enterprise aesthetic: dense, structured, authoritative.
// Sharp radius (0.25rem), full borders, no shadows, motion < 100ms.
// Dark panels bookend the page (hero + CTA). Light structured sections between.

export default function ProposalPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">

      {/* ── Section 1: Hero — dark panel ─────────────────────────── */}
      <section
        className="overflow-hidden"
        style={{
          background: `oklch(0.10 0.02 var(--primary-h, 180))`,
          borderRadius: "var(--radius)",
        }}
      >
        {/* Header row */}
        <div className="px-8 pt-8 pb-6">
          {/* "Built this demo for your project" badge — mandatory */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="text-xs font-mono tracking-widest uppercase text-white/50">
              Built this demo for your project
            </span>
          </div>

          {/* Role prefix */}
          <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-3">
            Full-Stack Developer · Healthcare SaaS · HL7 / EMR Integration
          </p>

          {/* Weight-contrast headline */}
          <h1 className="text-4xl md:text-5xl tracking-tight leading-none mb-4">
            <span className="font-light text-white/70">Hi, I&apos;m</span>{" "}
            <span className="font-black text-white">{profile.name}</span>
          </h1>

          {/* Tailored value prop — one sentence specific to this job */}
          <p className="text-base md:text-lg text-white/65 max-w-2xl leading-relaxed">
            I build clinical data integration MVPs — HL7 pipelines, HIPAA-compliant data flows,
            and the operational dashboards that make them usable — and I&apos;ve already built one
            for your review in Tab 1.
          </p>
        </div>

        {/* Stats shelf — Corporate Enterprise: dense, structured, 4 stats */}
        <div
          className="border-t px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x"
          style={{ borderColor: "oklch(1 0 0 / 0.10)", background: "oklch(1 0 0 / 0.04)" }}
        >
          {[
            { value: "24+", label: "Projects Shipped" },
            { value: "15+", label: "Industries Served" },
            { value: "< 48hr", label: "Demo Turnaround" },
            { value: "3×", label: "Healthcare SaaS Built" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-4 first:pl-0 last:pr-0"
              style={{ borderColor: "oklch(1 0 0 / 0.10)" }}
            >
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: Proof of Work ──────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Proof of Work
          </p>
          <h2 className="text-xl font-bold tracking-tight">Relevant Projects</h2>
        </div>

        {/* Corporate Enterprise: dense list layout — structured rows */}
        <div className="border border-border divide-y divide-border" style={{ borderRadius: "var(--radius)" }}>
          {portfolioProjects.map((project) => (
            <div key={project.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold">{project.title}</h3>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors duration-100 shrink-0"
                        aria-label={`View ${project.title} live`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  {/* Outcome — always present */}
                  <div className="flex items-start gap-2">
                    <TrendingUp
                      className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      style={{ color: "var(--success)" }}
                    />
                    <span className="text-sm" style={{ color: "var(--success)" }}>
                      {project.outcome}
                    </span>
                  </div>

                  {/* Relevance note */}
                  {project.relevance && (
                    <p className="text-xs text-primary/70 italic">{project.relevance}</p>
                  )}
                </div>
              </div>

              {/* Tech tags — Corporate Enterprise: plain monospace, no pill */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-xs font-mono border border-border/60 bg-muted/40 text-muted-foreground"
                    style={{ borderRadius: "calc(var(--radius) - 2px)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: How I Work ────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Process
          </p>
          <h2 className="text-xl font-bold tracking-tight">How I Work</h2>
        </div>

        {/* Corporate Enterprise: numbered list, structured deliverable descriptions */}
        <div className="space-y-0 border border-border divide-y divide-border" style={{ borderRadius: "var(--radius)" }}>
          {profile.approach.map((step, i) => (
            <div key={step.title} className="flex gap-5 p-5">
              {/* Step number — accent, tabular */}
              <div className="shrink-0">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold font-mono border text-primary"
                  style={{
                    borderRadius: "var(--radius)",
                    borderColor: "var(--primary)",
                    background: "color-mix(in oklch, var(--primary) 10%, transparent)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  {/* Timeline estimates */}
                  <span className="font-mono text-xs text-muted-foreground/60">
                    {i === 0 ? "Day 1–2" : i === 1 ? "Day 2–5" : i === 2 ? "Week 2" : "Ongoing"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Skills Grid ───────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Tech Stack
          </p>
          <h2 className="text-xl font-bold tracking-tight">What I Build With</h2>
        </div>

        {/* Corporate Enterprise: structured grid with category headers */}
        <div
          className="border border-border divide-y divide-border"
          style={{ borderRadius: "var(--radius)" }}
        >
          {profile.skillCategories.map((category) => (
            <div key={category.name} className="flex flex-col sm:flex-row sm:items-start gap-3 p-4">
              <div className="sm:w-48 shrink-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category.name}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-0.5 text-xs font-mono border border-border/60 text-foreground/80 bg-muted/30"
                    style={{ borderRadius: "calc(var(--radius) - 2px)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA — dark panel ─────────────────────────── */}
      <section
        className="overflow-hidden"
        style={{
          background: `oklch(0.10 0.02 var(--primary-h, 180))`,
          borderRadius: "var(--radius)",
        }}
      >
        <div className="px-8 py-8 space-y-4">
          {/* Pulsing availability indicator — mandatory */}
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "var(--success)" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "var(--success)" }}
              />
            </span>
            <span
              className="text-sm"
              style={{ color: "color-mix(in oklch, var(--success) 80%, white)" }}
            >
              Currently available for new projects
            </span>
          </div>

          {/* Headline — tailored to this project */}
          <h2 className="text-xl font-bold text-white leading-snug">
            Ready to move your {APP_CONFIG.projectName} from spreadsheets
            to a production pipeline.
          </h2>

          {/* Body — specific to this demo and job */}
          <p className="text-sm text-white/65 max-w-lg leading-relaxed">
            The demo in Tab 1 shows the message flow, compliance structure, and clinical
            dashboard I&apos;d build for this integration. The real product starts with a
            scoping call — then I map your HL7 message types and we go from there.
          </p>

          {/* Primary action — text, not a dead-end button */}
          <p className="text-base font-semibold text-white pt-1">
            Reply on Upwork to start
          </p>

          {/* Back to demo */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-white/50 hover:text-white/70 transition-colors duration-100"
            >
              ← Back to the demo
            </a>
            <span className="text-white/20">·</span>
            <a
              href="/challenges"
              className="text-sm text-white/50 hover:text-white/70 transition-colors duration-100"
            >
              View my approach
            </a>
          </div>

          {/* Signature */}
          <p className="text-sm text-white/30 border-t border-white/10 pt-4 mt-2">
            — Humam
          </p>
        </div>
      </section>

    </div>
  );
}

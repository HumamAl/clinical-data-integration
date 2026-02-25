// No "use client" — pure JSX, no hooks
import type { CSSProperties } from "react";

interface ArchNode {
  id: string;
  label: string;
  sublabel?: string;
  type: "source" | "adapter" | "canonical" | "validator" | "target";
}

const emrSources: ArchNode[] = [
  { id: "epic", label: "Epic MyChart", sublabel: "HL7v2 + Z-segs", type: "source" },
  { id: "cerner", label: "Cerner PowerChart", sublabel: "HL7v2 dialect", type: "source" },
  { id: "allscripts", label: "Allscripts", sublabel: "Custom segments", type: "source" },
  { id: "athena", label: "athenahealth", sublabel: "HL7v2 / API", type: "source" },
];

const layerStyles: Record<ArchNode["type"], CSSProperties> = {
  source: {
    borderColor: "color-mix(in oklch, var(--primary) 30%, transparent)",
    backgroundColor: "color-mix(in oklch, var(--primary) 5%, transparent)",
    color: "var(--foreground)",
  },
  adapter: {
    borderColor: "color-mix(in oklch, var(--warning) 40%, transparent)",
    backgroundColor: "color-mix(in oklch, var(--warning) 6%, transparent)",
    color: "var(--foreground)",
  },
  canonical: {
    borderColor: "color-mix(in oklch, var(--primary) 50%, transparent)",
    backgroundColor: "color-mix(in oklch, var(--primary) 10%, transparent)",
    color: "var(--primary)",
    fontWeight: "600",
  },
  validator: {
    borderColor: "color-mix(in oklch, var(--warning) 35%, transparent)",
    backgroundColor: "color-mix(in oklch, var(--warning) 5%, transparent)",
    color: "var(--foreground)",
  },
  target: {
    borderColor: "color-mix(in oklch, var(--success) 40%, transparent)",
    backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
    color: "var(--success)",
  },
};

export function EMRArchitectureViz() {
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Normalization Architecture
      </div>

      {/* Grid: sources → adapter layer → canonical → validator → target */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-2 items-start">

        {/* Column 1: EMR Sources */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            EMR Sources
          </div>
          {emrSources.map((src) => (
            <div
              key={src.id}
              className="rounded-sm border px-2.5 py-1.5"
              style={layerStyles.source}
            >
              <div className="text-xs font-medium">{src.label}</div>
              {src.sublabel && (
                <div className="text-[10px] text-muted-foreground font-mono">{src.sublabel}</div>
              )}
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex flex-col items-center justify-center pt-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-px" style={{ backgroundColor: "var(--border)" }} />
            <div
              className="text-[10px] font-mono text-muted-foreground"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "9px" }}
            >
              per-source adapters
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-1">
            <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
          </svg>
        </div>

        {/* Column 2: Canonical Data Model */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Canonical Model
          </div>
          <div
            className="rounded-sm border px-3 py-3 text-center"
            style={layerStyles.canonical}
          >
            <div className="text-xs font-semibold">Canonical Patient</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              FHIR R4 schema
            </div>
          </div>
          <div
            className="rounded-sm border px-2.5 py-1.5"
            style={layerStyles.adapter}
          >
            <div className="text-xs font-medium">Field Mapping Engine</div>
            <div className="text-[10px] text-muted-foreground font-mono">Z-seg resolution</div>
          </div>
          <div
            className="rounded-sm border px-2.5 py-1.5"
            style={layerStyles.adapter}
          >
            <div className="text-xs font-medium">Dialect Normalizer</div>
            <div className="text-[10px] text-muted-foreground font-mono">Vendor extensions</div>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex flex-col items-center justify-center pt-6">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-1">
            <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
          </svg>
        </div>

        {/* Column 3: Target Systems */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Target Systems
          </div>
          {[
            { label: "Clinical Dashboard", sub: "Real-time UI" },
            { label: "FHIR API", sub: "External consumers" },
            { label: "Audit Log Store", sub: "HIPAA compliance" },
            { label: "Analytics Pipeline", sub: "Reporting / BI" },
          ].map((t) => (
            <div
              key={t.label}
              className="rounded-sm border px-2.5 py-1.5"
              style={layerStyles.target}
            >
              <div className="text-xs font-medium">{t.label}</div>
              <div className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                {t.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer stat */}
      <div
        className="flex items-center gap-2 text-[11px] text-muted-foreground pt-2 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <span
          className="font-mono font-semibold"
          style={{ color: "var(--primary)" }}
        >
          8+ EMR systems
        </span>
        <span>via one normalized adapter layer — new EMR onboarding in</span>
        <span className="font-mono font-semibold" style={{ color: "var(--primary)" }}>
          3-5 days
        </span>
        <span>vs. 3-6 weeks per-system</span>
      </div>
    </div>
  );
}

// No "use client" — pure JSX, no hooks
import type { ComponentType, CSSProperties } from "react";
import { Database, ArrowRight, Cpu, RefreshCw, LayoutDashboard, ShieldCheck } from "lucide-react";

interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  highlight?: boolean;
  tag?: string;
}

const nodes: FlowNode[] = [
  {
    id: "emr",
    label: "EMR Systems",
    sublabel: "Epic · Cerner · Allscripts",
    icon: Database,
    tag: "Source",
  },
  {
    id: "mirth",
    label: "Mirth Connect",
    sublabel: "Channel routing + ACK",
    icon: Cpu,
    highlight: true,
    tag: "Engine",
  },
  {
    id: "parser",
    label: "HL7 Parser",
    sublabel: "ADT · ORM · ORU · SIU",
    icon: RefreshCw,
    highlight: true,
    tag: "Transform",
  },
  {
    id: "fhir",
    label: "FHIR R4 Store",
    sublabel: "Canonical patient data",
    icon: ShieldCheck,
    tag: "Output",
  },
  {
    id: "dashboard",
    label: "Clinical Dashboard",
    sublabel: "Real-time, <500ms",
    icon: LayoutDashboard,
    tag: "Consumer",
  },
];

export function HL7FlowViz() {
  return (
    <div className="w-full">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Integration Pipeline
      </div>

      {/* Desktop: horizontal row */}
      <div className="hidden sm:flex items-center gap-1 flex-wrap">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-1">
            <div
              className="flex flex-col items-start gap-0.5 px-3 py-2 rounded-sm border"
              style={
                node.highlight
                  ? {
                      borderColor: "color-mix(in oklch, var(--primary) 40%, transparent)",
                      backgroundColor: "color-mix(in oklch, var(--primary) 6%, transparent)",
                    }
                  : {
                      borderColor: "var(--border)",
                      backgroundColor: "var(--card)",
                    }
              }
            >
              <div className="flex items-center gap-1.5">
                <node.icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={
                    node.highlight
                      ? { color: "var(--primary)" }
                      : { color: "var(--muted-foreground)" }
                  }
                />
                <span
                  className="text-xs font-semibold"
                  style={node.highlight ? { color: "var(--primary)" } : {}}
                >
                  {node.label}
                </span>
                <span
                  className="text-[9px] font-medium px-1 py-0.5 rounded-sm"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--muted) 80%, transparent)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {node.tag}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground pl-5">{node.sublabel}</span>
            </div>
            {i < nodes.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical stack */}
      <div className="sm:hidden flex flex-col gap-2">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex flex-col gap-1">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-sm border"
              style={
                node.highlight
                  ? {
                      borderColor: "color-mix(in oklch, var(--primary) 40%, transparent)",
                      backgroundColor: "color-mix(in oklch, var(--primary) 6%, transparent)",
                    }
                  : {
                      borderColor: "var(--border)",
                      backgroundColor: "var(--card)",
                    }
              }
            >
              <node.icon
                className="w-3.5 h-3.5 shrink-0"
                style={
                  node.highlight
                    ? { color: "var(--primary)" }
                    : { color: "var(--muted-foreground)" }
                }
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-semibold"
                    style={node.highlight ? { color: "var(--primary)" } : {}}
                  >
                    {node.label}
                  </span>
                  <span
                    className="text-[9px] font-medium px-1 py-0.5 rounded-sm"
                    style={{
                      backgroundColor: "color-mix(in oklch, var(--muted) 80%, transparent)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {node.tag}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">{node.sublabel}</p>
              </div>
            </div>
            {i < nodes.length - 1 && (
              <div className="flex justify-center">
                <div className="w-px h-3" style={{ backgroundColor: "var(--border)" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Latency indicator */}
      <div
        className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground border-t pt-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: "var(--success)" }}
        />
        <span>
          Target end-to-end latency:{" "}
          <span className="font-mono font-semibold text-foreground">&lt;500ms</span> from HL7
          receipt to dashboard update
        </span>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Check, ShieldAlert, ShieldCheck } from "lucide-react";

const beforeItems = [
  "PHI transmitted over unencrypted internal HTTP channels",
  "Manual access logs updated sporadically by developers",
  "No role-based access control — all staff see all records",
  "Business Associate Agreements (BAAs) drafted ad-hoc, not tracked",
  "No automated breach detection or alerting",
  "Audit evidence assembled manually during each compliance review",
];

const afterItems = [
  "TLS 1.3 in transit + AES-256 at rest on all PHI stores",
  "Automated audit trail per 45 CFR §164.312(b) from day one",
  "RBAC enforced at API layer — clinicians see only their patients",
  "BAA registry with renewal tracking and counterparty status",
  "Anomaly detection alerts on unusual PHI access patterns",
  "Audit package auto-generated from structured log records",
];

export function HipaaBeforeAfter() {
  const [view, setView] = useState<"before" | "after">("before");

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div
        className="inline-flex rounded-sm border p-0.5 gap-0"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() => setView("before")}
          className="px-3 py-1.5 text-xs font-medium rounded-sm transition-colors duration-100 flex items-center gap-1.5"
          style={
            view === "before"
              ? {
                  backgroundColor: "color-mix(in oklch, var(--destructive) 10%, transparent)",
                  color: "var(--destructive)",
                }
              : {
                  color: "var(--muted-foreground)",
                }
          }
        >
          <ShieldAlert className="w-3 h-3" />
          Current State
        </button>
        <button
          onClick={() => setView("after")}
          className="px-3 py-1.5 text-xs font-medium rounded-sm transition-colors duration-100 flex items-center gap-1.5"
          style={
            view === "after"
              ? {
                  backgroundColor: "color-mix(in oklch, var(--success) 10%, transparent)",
                  color: "var(--success)",
                }
              : {
                  color: "var(--muted-foreground)",
                }
          }
        >
          <ShieldCheck className="w-3 h-3" />
          After Build
        </button>
      </div>

      {/* Content panel */}
      {view === "before" ? (
        <div
          className="rounded-sm border p-4"
          style={{
            borderColor: "color-mix(in oklch, var(--destructive) 25%, transparent)",
            backgroundColor: "color-mix(in oklch, var(--destructive) 5%, transparent)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--destructive)" }}
          >
            Common ad-hoc approach — compliance gaps
          </p>
          <ul className="space-y-2">
            {beforeItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <X
                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                  style={{ color: "var(--destructive)" }}
                />
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          className="rounded-sm border p-4"
          style={{
            borderColor: "color-mix(in oklch, var(--success) 25%, transparent)",
            backgroundColor: "color-mix(in oklch, var(--success) 5%, transparent)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--success)" }}
          >
            Structured from day one — audit-ready
          </p>
          <ul className="space-y-2">
            {afterItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check
                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                  style={{ color: "var(--success)" }}
                />
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

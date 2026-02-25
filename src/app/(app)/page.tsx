"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  Circle,
} from "lucide-react";
import {
  systemMetrics,
  emrFeeds,
  hl7Messages,
  throughputData,
  getIntegrationStatusColor,
  getMessageStatusColor,
} from "@/data/mock-data";
import { APP_CONFIG } from "@/lib/config";
import type { SystemMetric, EMRFeed, HL7Message, HL7MessageType } from "@/lib/types";

// ── SSR-safe chart import ────────────────────────────────────────
const ThroughputChart = dynamic(
  () =>
    import("@/components/dashboard/throughput-chart").then(
      (m) => m.ThroughputChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[260px] bg-muted/30 rounded animate-pulse" />
    ),
  }
);

// ── useCountUp hook ──────────────────────────────────────────────
function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ── Stat card sub-component ──────────────────────────────────────
function StatCard({
  metric,
  index,
  numericTarget,
  prefix,
  suffix,
}: {
  metric: SystemMetric;
  index: number;
  numericTarget: number;
  prefix: string;
  suffix: string;
}) {
  const { count, ref } = useCountUp(numericTarget, 900 + index * 80);

  const displayValue =
    numericTarget > 0
      ? `${prefix}${count.toLocaleString()}${suffix}`
      : metric.value;

  const TrendIcon =
    metric.status === "up"
      ? TrendingUp
      : metric.status === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    // For error rate and latency, "up" in status means improvement (value went down)
    metric.label === "Error Rate" || metric.label === "Avg Latency"
      ? metric.status === "up"
        ? "text-success"
        : "text-destructive"
      : metric.label === "Active EMR Feeds"
      ? metric.status === "down"
        ? "text-warning"
        : "text-success"
      : metric.status === "up"
      ? "text-success"
      : metric.status === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <div
      ref={ref}
      className="aesthetic-card animate-fade-up-in"
      style={{
        padding: "var(--card-padding-sm)",
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
      }}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {metric.label}
      </p>
      <p className="text-2xl font-bold font-mono tabular-nums mt-1 text-foreground">
        {displayValue}
      </p>
      <div className={`flex items-center gap-1 mt-1.5 text-xs ${trendColor}`}>
        <TrendIcon className="h-3 w-3 shrink-0" />
        <span className="font-medium">
          {metric.change > 0 && metric.status === "up" ? "+" : ""}
          {metric.change}
        </span>
        <span className="text-muted-foreground">{metric.changeLabel}</span>
      </div>
    </div>
  );
}

// ── Message type badge ───────────────────────────────────────────
const messageTypeBadgeClass: Record<HL7MessageType, string> = {
  ADT: "bg-primary/10 text-primary border-primary/20",
  ORM: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  ORU: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  SIU: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  MDM: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  DFT: "bg-warning/10 text-warning border-warning/20",
  RDE: "bg-accent/10 text-accent border-accent/20",
};

// ── Time range options ───────────────────────────────────────────
type TimeRange = "7d" | "30d" | "90d" | "12mo";
const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "12mo": "Last 12 months",
};

const TIME_RANGE_SLICE: Record<TimeRange, number> = {
  "7d": 1,   // throughputData is monthly; 7d = 1 month slice
  "30d": 2,
  "90d": 4,
  "12mo": 12,
};

// ── Message type filter options ──────────────────────────────────
const ALL_MSG_TYPES: Array<HL7MessageType | "ALL"> = [
  "ALL",
  "ADT",
  "ORM",
  "ORU",
  "SIU",
  "MDM",
  "DFT",
  "RDE",
];

// ── Helper: parse numeric value from metric strings ──────────────
function parseMetricNumeric(
  value: string | number
): { target: number; prefix: string; suffix: string } {
  if (typeof value === "number") {
    return { target: value, prefix: "", suffix: "" };
  }
  // e.g. "12,847" → 12847
  const stripped = value.replace(/,/g, "");
  const match = stripped.match(/^([^0-9]*)([0-9.]+)([^0-9.]*)$/);
  if (!match) return { target: 0, prefix: "", suffix: "" };
  return {
    target: parseFloat(match[2]),
    prefix: match[1],
    suffix: match[3],
  };
}

// ── Feed status dot ──────────────────────────────────────────────
function StatusDot({ status }: { status: EMRFeed["status"] }) {
  const color =
    status === "active"
      ? "bg-success"
      : status === "degraded"
      ? "bg-warning"
      : status === "error"
      ? "bg-destructive"
      : "bg-muted-foreground";
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${color}`} />;
}

// ── Main dashboard ───────────────────────────────────────────────
export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("12mo");
  const [msgTypeFilter, setMsgTypeFilter] = useState<HL7MessageType | "ALL">("ALL");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Chart data filtered by time range
  const chartData = useMemo(() => {
    const sliceCount = TIME_RANGE_SLICE[timeRange];
    return throughputData.slice(-sliceCount);
  }, [timeRange]);

  // Messages filtered by type
  const filteredMessages = useMemo(() => {
    if (msgTypeFilter === "ALL") return hl7Messages;
    return hl7Messages.filter((m) => m.messageType === msgTypeFilter);
  }, [msgTypeFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--section-gap)" }}>

      {/* ── Page header ─────────────────────────────────────────── */}
      <div>
        <h1
          className="text-xl font-semibold tracking-tight text-foreground"
          style={{ fontWeight: "var(--heading-weight)" }}
        >
          Integration Command Center
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time HL7 message pipeline · 8 EMR feeds · HIPAA-compliant
        </p>
      </div>

      {/* ── 6 KPI Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6" style={{ gap: "var(--grid-gap)" }}>
        {systemMetrics.map((metric, index) => {
          const { target, prefix, suffix } = parseMetricNumeric(metric.value);
          return (
            <StatCard
              key={metric.label}
              metric={metric}
              index={index}
              numericTarget={target}
              prefix={prefix}
              suffix={suffix}
            />
          );
        })}
      </div>

      {/* ── Time range filter + Throughput chart ────────────────── */}
      <div className="aesthetic-card" style={{ padding: 0 }}>
        {/* Card header with filter */}
        <div
          className="flex items-center justify-between border-b border-border"
          style={{ padding: "var(--card-padding-sm)" }}
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              HL7 Message Throughput
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Messages processed vs. parse errors · monthly
            </p>
          </div>
          {/* Time range dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown((v) => !v)}
              className="flex items-center gap-1.5 text-xs border border-border rounded px-2.5 py-1.5 hover:bg-surface-hover transition-colors aesthetic-transition text-foreground"
            >
              {TIME_RANGE_LABELS[timeRange]}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {showTimeDropdown && (
              <div className="absolute right-0 top-full mt-1 z-10 border border-border bg-background rounded shadow-sm min-w-[130px]">
                {(Object.keys(TIME_RANGE_LABELS) as TimeRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setTimeRange(r);
                      setShowTimeDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface-hover transition-colors aesthetic-transition ${
                      r === timeRange
                        ? "text-primary font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {TIME_RANGE_LABELS[r]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Chart */}
        <div style={{ padding: "var(--card-padding-sm)", paddingTop: "1rem" }}>
          <ThroughputChart data={chartData} />
        </div>
      </div>

      {/* ── Two-panel row: EMR Feeds + Recent HL7 Messages ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "var(--grid-gap)" }}>

        {/* Active EMR Feed Status */}
        <div className="aesthetic-card" style={{ padding: 0 }}>
          <div
            className="border-b border-border"
            style={{ padding: "var(--card-padding-sm)" }}
          >
            <p className="text-sm font-semibold text-foreground">
              Active EMR Feed Status
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              8 integration channels · messages/hr · uptime
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground py-1.5 px-3">
                    EMR System
                  </th>
                  <th className="text-left font-medium text-muted-foreground py-1.5 px-2 hidden sm:table-cell">
                    Facility
                  </th>
                  <th className="text-right font-medium text-muted-foreground py-1.5 px-2">
                    Msg/hr
                  </th>
                  <th className="text-right font-medium text-muted-foreground py-1.5 px-2 hidden md:table-cell">
                    Uptime
                  </th>
                  <th className="text-center font-medium text-muted-foreground py-1.5 px-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {emrFeeds.map((feed) => (
                  <tr
                    key={feed.id}
                    className="border-b border-border/60 last:border-0 aesthetic-hover"
                  >
                    <td className="py-1.5 px-3 font-medium text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <StatusDot status={feed.status} />
                        {feed.emrSystem}
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-muted-foreground hidden sm:table-cell max-w-[120px] truncate">
                      {feed.facilityName}
                    </td>
                    <td className="py-1.5 px-2 text-right font-mono tabular-nums text-foreground">
                      {feed.messagesPerHour.toLocaleString()}
                    </td>
                    <td className="py-1.5 px-2 text-right font-mono tabular-nums hidden md:table-cell">
                      <span
                        className={
                          feed.uptime >= 99
                            ? "text-success"
                            : feed.uptime >= 97
                            ? "text-warning"
                            : "text-destructive"
                        }
                      >
                        {feed.uptime.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${getIntegrationStatusColor(
                          feed.status
                        )}`}
                      >
                        {feed.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent HL7 Messages */}
        <div className="aesthetic-card" style={{ padding: 0 }}>
          <div
            className="flex items-center justify-between border-b border-border"
            style={{ padding: "var(--card-padding-sm)" }}
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                Recent HL7 Messages
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live message log · MRN · processing time
              </p>
            </div>
            {/* Message type filter pills */}
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {ALL_MSG_TYPES.slice(0, 5).map((t) => (
                <button
                  key={t}
                  onClick={() => setMsgTypeFilter(t)}
                  className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors aesthetic-transition ${
                    msgTypeFilter === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:bg-surface-hover"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-background z-10">
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground py-1.5 px-3">
                    Type
                  </th>
                  <th className="text-left font-medium text-muted-foreground py-1.5 px-2">
                    MRN
                  </th>
                  <th className="text-left font-medium text-muted-foreground py-1.5 px-2 hidden sm:table-cell">
                    From
                  </th>
                  <th className="text-right font-medium text-muted-foreground py-1.5 px-2">
                    ms
                  </th>
                  <th className="text-center font-medium text-muted-foreground py-1.5 px-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="border-b border-border/60 last:border-0 aesthetic-hover"
                    title={msg.errorDetail ?? undefined}
                  >
                    <td className="py-1.5 px-3">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                          messageTypeBadgeClass[msg.messageType]
                        }`}
                      >
                        {msg.messageType}
                        <span className="ml-0.5 text-[9px] opacity-70">
                          ^{msg.triggerEvent}
                        </span>
                      </span>
                    </td>
                    <td className="py-1.5 px-2 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      {msg.patientMRN}
                    </td>
                    <td className="py-1.5 px-2 text-muted-foreground hidden sm:table-cell max-w-[110px] truncate">
                      {msg.sendingFacility.split(" ").slice(0, 2).join(" ")}
                    </td>
                    <td className="py-1.5 px-2 text-right font-mono tabular-nums">
                      <span
                        className={
                          msg.processingTime === 0
                            ? "text-muted-foreground"
                            : msg.processingTime > 1000
                            ? "text-destructive"
                            : msg.processingTime > 200
                            ? "text-warning"
                            : "text-foreground"
                        }
                      >
                        {msg.processingTime === 0 ? "—" : msg.processingTime}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${getMessageStatusColor(
                          msg.status
                        )}`}
                      >
                        {msg.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredMessages.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No messages of type {msgTypeFilter}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Proposal banner ──────────────────────────────────────── */}
      <div
        className="aesthetic-card border-primary/15 flex flex-col md:flex-row items-start md:items-center justify-between"
        style={{
          padding: "var(--card-padding-sm)",
          gap: "0.75rem",
          background:
            "linear-gradient(to right, color-mix(in oklch, var(--primary), transparent 92%), transparent)",
        }}
      >
        <div>
          <p className="text-sm font-medium text-foreground">
            This is a live demo built for{" "}
            <span className="text-primary font-semibold">
              {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors aesthetic-transition"
          >
            My Approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90 transition-colors aesthetic-transition"
          >
            <Circle className="h-1.5 w-1.5 fill-current animate-pulse" />
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}

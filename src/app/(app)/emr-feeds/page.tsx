"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  emrFeeds,
  getIntegrationStatusColor,
} from "@/data/mock-data";
import type { EMRFeed, IntegrationStatus } from "@/lib/types";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Server,
  Wifi,
  WifiOff,
} from "lucide-react";

// ── Status helpers ──────────────────────────────────────────────

const STATUS_LABELS: Record<IntegrationStatus, string> = {
  active: "Active",
  degraded: "Degraded",
  error: "Error",
  maintenance: "Maintenance",
};

const STATUS_ICONS: Record<IntegrationStatus, React.ReactNode> = {
  active: <CheckCircle2 className="w-3.5 h-3.5" />,
  degraded: <AlertTriangle className="w-3.5 h-3.5" />,
  error: <WifiOff className="w-3.5 h-3.5" />,
  maintenance: <Clock className="w-3.5 h-3.5" />,
};

function StatusBadge({ status }: { status: IntegrationStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium border px-2 py-0.5 rounded-sm",
        getIntegrationStatusColor(status)
      )}
    >
      {STATUS_ICONS[status]}
      {STATUS_LABELS[status]}
    </Badge>
  );
}

// ── Connection type badge ───────────────────────────────────────

function ConnectionTypeBadge({ type }: { type: EMRFeed["connectionType"] }) {
  return (
    <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm border border-border">
      {type}
    </span>
  );
}

// ── Live ping dot ────────────────────────────────────────────────

function LiveDot({ active }: { active: boolean }) {
  if (!active) {
    return (
      <span className="inline-flex h-2 w-2 rounded-full bg-muted-foreground/30" />
    );
  }
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/60 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
    </span>
  );
}

// ── Test Connection button with local toggle state ──────────────

function TestConnectionButton({ feedId, status }: { feedId: string; status: IntegrationStatus }) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<"success" | "failure" | null>(null);

  function handleTest() {
    setTesting(true);
    setResult(null);
    setTimeout(() => {
      setTesting(false);
      setResult(status === "active" || status === "maintenance" ? "success" : "failure");
      setTimeout(() => setResult(null), 3000);
    }, 1200);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleTest}
      disabled={testing}
      className={cn(
        "h-7 text-xs px-2.5 rounded-sm transition-colors duration-75",
        result === "success" && "border-success/40 text-success bg-success/5",
        result === "failure" && "border-destructive/40 text-destructive bg-destructive/5"
      )}
      key={feedId}
    >
      {testing ? (
        <RefreshCw className="w-3 h-3 animate-spin mr-1" />
      ) : result === "success" ? (
        <CheckCircle2 className="w-3 h-3 mr-1" />
      ) : result === "failure" ? (
        <WifiOff className="w-3 h-3 mr-1" />
      ) : (
        <Wifi className="w-3 h-3 mr-1" />
      )}
      {testing ? "Testing…" : result === "success" ? "Connected" : result === "failure" ? "Failed" : "Test"}
    </Button>
  );
}

// ── Page ─────────────────────────────────────────────────────────

export default function EMRFeedsPage() {
  const [statusFilter, setStatusFilter] = useState<IntegrationStatus | "all">("all");

  const displayed = useMemo(() => {
    if (statusFilter === "all") return emrFeeds;
    return emrFeeds.filter((f) => f.status === statusFilter);
  }, [statusFilter]);

  const summary = useMemo(() => {
    const active = emrFeeds.filter((f) => f.status === "active").length;
    const degraded = emrFeeds.filter((f) => f.status === "degraded").length;
    const error = emrFeeds.filter((f) => f.status === "error").length;
    const maintenance = emrFeeds.filter((f) => f.status === "maintenance").length;
    const totalMsgs = emrFeeds.reduce((acc, f) => acc + f.messagesPerHour, 0);
    return { active, degraded, error, maintenance, totalMsgs };
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">EMR Integration Feeds</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time connection status across all integrated EMR systems
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs rounded-sm shrink-0">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh All
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Active Feeds",
            value: summary.active,
            total: emrFeeds.length,
            color: "text-success",
          },
          {
            label: "Degraded",
            value: summary.degraded,
            total: emrFeeds.length,
            color: "text-warning",
          },
          {
            label: "In Maintenance",
            value: summary.maintenance,
            total: emrFeeds.length,
            color: "text-muted-foreground",
          },
          {
            label: "Messages / hr",
            value: summary.totalMsgs.toLocaleString(),
            color: "text-primary",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="linear-card rounded-sm py-0"
          >
            <CardContent className="p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1">
                {stat.label}
              </p>
              <p className={cn("text-xl font-semibold font-mono tabular-nums", stat.color)}>
                {stat.value}
                {stat.total !== undefined && (
                  <span className="text-sm text-muted-foreground font-normal ml-0.5">
                    /{stat.total}
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as IntegrationStatus | "all")}
        >
          <SelectTrigger className="w-36 h-8 text-xs rounded-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {displayed.length} of {emrFeeds.length} feeds
        </span>
      </div>

      {/* Feed cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
        {displayed.length === 0 ? (
          <div className="col-span-2 linear-card rounded-sm p-8 text-center">
            <p className="text-sm text-muted-foreground">No EMR feeds match this filter.</p>
          </div>
        ) : (
          displayed.map((feed) => (
            <EMRFeedCard key={feed.id} feed={feed} />
          ))
        )}
      </div>
    </div>
  );
}

function EMRFeedCard({ feed }: { feed: EMRFeed }) {
  const isLive = feed.status === "active";

  return (
    <Card className="linear-card rounded-sm">
      <CardHeader className="pb-2 px-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <LiveDot active={isLive} />
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold truncate">
                {feed.emrSystem}
              </CardTitle>
              <p className="text-xs text-muted-foreground truncate">{feed.facilityName}</p>
            </div>
          </div>
          <StatusBadge status={feed.status} />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-3">
        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-sm p-2 border border-border/60">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
              Msg/hr
            </p>
            <p className="text-sm font-mono font-semibold tabular-nums">
              {feed.status === "maintenance"
                ? "—"
                : feed.messagesPerHour.toLocaleString()}
            </p>
          </div>
          <div className="bg-muted/50 rounded-sm p-2 border border-border/60">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
              Error Rate
            </p>
            <p
              className={cn(
                "text-sm font-mono font-semibold tabular-nums",
                feed.errorRate > 1
                  ? "text-destructive"
                  : feed.errorRate > 0.2
                  ? "text-warning"
                  : "text-success"
              )}
            >
              {feed.status === "maintenance" ? "—" : `${feed.errorRate}%`}
            </p>
          </div>
          <div className="bg-muted/50 rounded-sm p-2 border border-border/60">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
              Uptime
            </p>
            <p
              className={cn(
                "text-sm font-mono font-semibold tabular-nums",
                feed.uptime < 98 ? "text-warning" : "text-success"
              )}
            >
              {feed.uptime}%
            </p>
          </div>
        </div>

        {/* Message types */}
        <div className="flex flex-wrap gap-1">
          {feed.messageTypes.map((type) => (
            <span
              key={type}
              className="text-[10px] font-mono bg-primary/8 text-primary px-1.5 py-0.5 rounded-sm border border-primary/15"
            >
              {type}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-1 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Server className="w-3 h-3 shrink-0" />
            <ConnectionTypeBadge type={feed.connectionType} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Activity className="w-3 h-3" />
              <span className="font-mono">
                {new Date(feed.lastSync).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <TestConnectionButton feedId={feed.id} status={feed.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

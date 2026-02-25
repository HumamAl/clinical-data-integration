"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { patientRecords } from "@/data/mock-data";
import type { PatientFeedStatus } from "@/lib/types";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Search,
  Users,
} from "lucide-react";

// ── Feed status dot ───────────────────────────────────────────

const FEED_DOT_COLORS: Record<PatientFeedStatus, string> = {
  streaming: "bg-success",
  paused: "bg-muted-foreground",
  error: "bg-destructive",
  queued: "bg-warning",
};

const FEED_LABEL: Record<PatientFeedStatus, string> = {
  streaming: "Streaming",
  paused: "Paused",
  error: "Feed Error",
  queued: "Queued",
};

function FeedStatusDot({ status }: { status: PatientFeedStatus }) {
  const isLive = status === "streaming";
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative inline-flex h-2 w-2 shrink-0">
        {isLive && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-70",
              FEED_DOT_COLORS[status]
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            FEED_DOT_COLORS[status]
          )}
        />
      </span>
      <span className="text-xs text-muted-foreground">{FEED_LABEL[status]}</span>
    </div>
  );
}

// ── Data completeness bar ─────────────────────────────────────

function CompletenessBar({ value }: { value: number }) {
  const color =
    value >= 90
      ? "bg-success"
      : value >= 75
      ? "bg-warning"
      : "bg-destructive";

  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-75", color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground w-8 text-right shrink-0">
        {value}%
      </span>
    </div>
  );
}

// ── Gender label ──────────────────────────────────────────────

function genderLabel(g: "M" | "F" | "O") {
  return g === "M" ? "Male" : g === "F" ? "Female" : "Other";
}

// ── Age helper ────────────────────────────────────────────────

function calcAge(dob: string) {
  const birth = new Date(dob);
  const today = new Date("2026-02-24");
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ── Sort helpers ─────────────────────────────────────────────

type SortKey = "lastName" | "lastEncounter" | "dataCompleteness";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return null;
  return dir === "asc" ? (
    <ChevronUp className="w-3 h-3 inline ml-0.5" />
  ) : (
    <ChevronDown className="w-3 h-3 inline ml-0.5" />
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function PatientRecordsPage() {
  const [search, setSearch] = useState("");
  const [feedFilter, setFeedFilter] = useState<PatientFeedStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("lastEncounter");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayed = useMemo(() => {
    return patientRecords
      .filter((p) => {
        const matchesFeed = feedFilter === "all" || p.feedStatus === feedFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          p.mrn.toLowerCase().includes(q) ||
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.primaryProvider.toLowerCase().includes(q) ||
          p.facility.toLowerCase().includes(q);
        return matchesFeed && matchesSearch;
      })
      .sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;
        if (sortKey === "lastName") {
          aVal = a.lastName.toLowerCase();
          bVal = b.lastName.toLowerCase();
        } else if (sortKey === "dataCompleteness") {
          aVal = a.dataCompleteness;
          bVal = b.dataCompleteness;
        } else {
          aVal = a.lastEncounter;
          bVal = b.lastEncounter;
        }
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, feedFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  // Summary
  const streamingCount = patientRecords.filter((p) => p.feedStatus === "streaming").length;
  const errorCount = patientRecords.filter((p) => p.feedStatus === "error").length;
  const avgCompleteness = Math.round(
    patientRecords.reduce((acc, p) => acc + p.dataCompleteness, 0) / patientRecords.length
  );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Patient Records</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Integrated patient data across all EMR source systems with feed status
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs rounded-sm shrink-0">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export Records
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Streaming Feeds",
            value: streamingCount,
            total: patientRecords.length,
            color: "text-success",
            icon: <Users className="w-3.5 h-3.5 text-success" />,
          },
          {
            label: "Feed Errors",
            value: errorCount,
            color: errorCount > 0 ? "text-destructive" : "text-success",
            icon: null,
          },
          {
            label: "Avg Data Completeness",
            value: `${avgCompleteness}%`,
            color: avgCompleteness >= 85 ? "text-success" : "text-warning",
            icon: null,
          },
        ].map((stat) => (
          <Card key={stat.label} className="linear-card rounded-sm py-0">
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                  {stat.label}
                </p>
                {stat.icon}
              </div>
              <p className={cn("text-xl font-semibold font-mono tabular-nums", stat.color)}>
                {stat.value}
                {stat.total !== undefined && (
                  <span className="text-sm text-muted-foreground font-normal ml-0.5">
                    /{stat.total}
                  </span>
                )}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by MRN, patient name, provider, facility…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs rounded-sm"
          />
        </div>
        <Select
          value={feedFilter}
          onValueChange={(v) => setFeedFilter(v as PatientFeedStatus | "all")}
        >
          <SelectTrigger className="w-36 h-8 text-xs rounded-sm">
            <SelectValue placeholder="Feed Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Feed Statuses</SelectItem>
            <SelectItem value="streaming">Streaming</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="error">Feed Error</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground shrink-0">
          {displayed.length} of {patientRecords.length} patients
        </span>
      </div>

      {/* Table */}
      <Card className="linear-card rounded-sm p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 w-6" />
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  MRN
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("lastName")}
                >
                  Patient Name <SortIcon active={sortKey === "lastName"} dir={sortDir} />
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  DOB / Age
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Insurance
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Primary Provider
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Facility
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("lastEncounter")}
                >
                  Last Encounter <SortIcon active={sortKey === "lastEncounter"} dir={sortDir} />
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Feed Status
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75 min-w-[120px]"
                  onClick={() => handleSort("dataCompleteness")}
                >
                  Completeness <SortIcon active={sortKey === "dataCompleteness"} dir={sortDir} />
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  EMR Source
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No patient records match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((patient) => (
                  <>
                    <TableRow
                      key={patient.id}
                      className={cn(
                        "cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-75",
                        patient.feedStatus === "error" && "bg-destructive/3"
                      )}
                      onClick={() =>
                        setExpandedId(expandedId === patient.id ? null : patient.id)
                      }
                    >
                      <TableCell className="px-3 py-2">
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 text-muted-foreground transition-transform duration-75",
                            expandedId === patient.id && "rotate-90"
                          )}
                        />
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs font-medium">
                        {patient.mrn}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs font-medium">
                        {patient.lastName}, {patient.firstName}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {patient.dob}{" "}
                        <span className="text-[10px]">({calcAge(patient.dob)}y)</span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs text-muted-foreground max-w-[120px] truncate">
                        {patient.insuranceProvider}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs text-muted-foreground max-w-[130px] truncate">
                        {patient.primaryProvider}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs text-muted-foreground max-w-[130px] truncate">
                        {patient.facility}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {patient.lastEncounter}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <FeedStatusDot status={patient.feedStatus} />
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <CompletenessBar value={patient.dataCompleteness} />
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs text-muted-foreground max-w-[100px] truncate">
                        {patient.emrSource}
                      </TableCell>
                    </TableRow>
                    {expandedId === patient.id && (
                      <TableRow key={`${patient.id}-expanded`}>
                        <TableCell
                          colSpan={11}
                          className="bg-muted/30 px-4 py-3 border-t border-border/60"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                Full Name
                              </p>
                              <p className="font-semibold">
                                {patient.firstName} {patient.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                Gender
                              </p>
                              <p>{genderLabel(patient.gender)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                EMR Source
                              </p>
                              <p className="font-medium">{patient.emrSource}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                Data Completeness
                              </p>
                              <p className="font-mono font-semibold">{patient.dataCompleteness}%</p>
                            </div>
                            <div className="col-span-2 md:col-span-4">
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                                Active Diagnosis Codes (ICD-10)
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {patient.diagnosisCodes.map((code) => (
                                  <Badge
                                    key={code}
                                    variant="outline"
                                    className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm border border-border text-muted-foreground"
                                  >
                                    {code}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

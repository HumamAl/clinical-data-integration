"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { hl7Messages, getMessageStatusColor } from "@/data/mock-data";
import type { HL7MessageType, MessageStatus } from "@/lib/types";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  ChevronRight,
} from "lucide-react";

// ── Badge helpers ───────────────────────────────────────────────

const MSG_TYPE_COLORS: Record<HL7MessageType, string> = {
  ADT: "bg-primary/8 text-primary border-primary/20",
  ORM: "bg-[color:var(--warning)]/10 text-[color:var(--warning)] border-[color:var(--warning)]/20",
  ORU: "bg-success/8 text-success border-success/20",
  SIU: "bg-accent/10 text-accent-foreground border-accent/20",
  MDM: "bg-muted text-muted-foreground border-border",
  DFT: "bg-destructive/8 text-destructive border-destructive/20",
  RDE: "bg-primary/5 text-primary/70 border-primary/15",
};

function MessageTypeBadge({ type }: { type: HL7MessageType }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono text-[10px] px-1.5 py-0.5 rounded-sm border font-semibold tracking-wide",
        MSG_TYPE_COLORS[type]
      )}
    >
      {type}
    </Badge>
  );
}

function StatusBadge({ status }: { status: MessageStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs px-2 py-0.5 rounded-sm border capitalize",
        getMessageStatusColor(status)
      )}
    >
      {status}
    </Badge>
  );
}

// ── Sort helpers ─────────────────────────────────────────────────

type SortKey = "timestamp" | "processingTime" | "segmentCount";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return null;
  return dir === "asc" ? (
    <ChevronUp className="w-3 h-3 inline ml-0.5" />
  ) : (
    <ChevronDown className="w-3 h-3 inline ml-0.5" />
  );
}

// ── Page ─────────────────────────────────────────────────────────

export default function HL7MessagesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<HL7MessageType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayed = useMemo(() => {
    return hl7Messages
      .filter((m) => {
        const matchesType = typeFilter === "all" || m.messageType === typeFilter;
        const matchesStatus = statusFilter === "all" || m.status === statusFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          m.messageControlId.toLowerCase().includes(q) ||
          m.patientMRN.toLowerCase().includes(q) ||
          m.patientName.toLowerCase().includes(q) ||
          m.sendingFacility.toLowerCase().includes(q) ||
          m.triggerEvent.toLowerCase().includes(q);
        return matchesType && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const aVal =
          sortKey === "timestamp"
            ? new Date(a.timestamp).getTime()
            : sortKey === "processingTime"
            ? a.processingTime
            : a.segmentCount;
        const bVal =
          sortKey === "timestamp"
            ? new Date(b.timestamp).getTime()
            : sortKey === "processingTime"
            ? b.processingTime
            : b.segmentCount;
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      });
  }, [search, typeFilter, statusFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">HL7 Message Log</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time message transaction log across all EMR integration channels
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs rounded-sm shrink-0">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export Log
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by MRN, Control ID, facility…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs rounded-sm"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as HL7MessageType | "all")}
        >
          <SelectTrigger className="w-32 h-8 text-xs rounded-sm">
            <SelectValue placeholder="Message Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(["ADT", "ORM", "ORU", "SIU", "MDM", "DFT", "RDE"] as HL7MessageType[]).map(
              (t) => (
                <SelectItem key={t} value={t} className="font-mono text-xs">
                  {t}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as MessageStatus | "all")}
        >
          <SelectTrigger className="w-32 h-8 text-xs rounded-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="retrying">Retrying</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground shrink-0">
          {displayed.length} of {hl7Messages.length} messages
        </span>
      </div>

      {/* Table */}
      <Card className="linear-card rounded-sm p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 w-4">
                  {/* expand col */}
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Control ID
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Type
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Event
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Sending Facility
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Patient MRN
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("timestamp")}
                >
                  Timestamp <SortIcon active={sortKey === "timestamp"} dir={sortDir} />
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Status
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75 text-right"
                  onClick={() => handleSort("processingTime")}
                >
                  Proc. Time <SortIcon active={sortKey === "processingTime"} dir={sortDir} />
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75 text-right"
                  onClick={() => handleSort("segmentCount")}
                >
                  Segs <SortIcon active={sortKey === "segmentCount"} dir={sortDir} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No HL7 messages match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((msg) => (
                  <>
                    <TableRow
                      key={msg.id}
                      className="cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-75"
                      onClick={() =>
                        setExpandedId(expandedId === msg.id ? null : msg.id)
                      }
                    >
                      <TableCell className="px-3 py-2 w-4">
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 text-muted-foreground transition-transform duration-75",
                            expandedId === msg.id && "rotate-90"
                          )}
                        />
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {msg.messageControlId.slice(-8)}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <MessageTypeBadge type={msg.messageType} />
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs font-semibold">
                        {msg.triggerEvent}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs text-muted-foreground max-w-[140px] truncate">
                        {msg.sendingFacility}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs">
                        {msg.patientMRN}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <StatusBadge status={msg.status} />
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs tabular-nums text-right">
                        {msg.processingTime === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span
                            className={cn(
                              msg.processingTime > 1000
                                ? "text-destructive"
                                : msg.processingTime > 200
                                ? "text-warning"
                                : ""
                            )}
                          >
                            {msg.processingTime}ms
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs tabular-nums text-right">
                        {msg.segmentCount}
                      </TableCell>
                    </TableRow>
                    {expandedId === msg.id && (
                      <TableRow key={`${msg.id}-expanded`}>
                        <TableCell
                          colSpan={10}
                          className="bg-muted/30 px-4 py-3 border-t border-border/60"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                Full Control ID
                              </p>
                              <p className="font-mono text-foreground break-all">
                                {msg.messageControlId}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                Patient Name
                              </p>
                              <p className="font-semibold">{msg.patientName}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                Receiving Facility
                              </p>
                              <p>{msg.receivingFacility}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                Segment Count
                              </p>
                              <p className="font-mono">{msg.segmentCount} segments</p>
                            </div>
                          </div>
                          {msg.errorDetail && (
                            <div className="mt-2 p-2 bg-destructive/5 border border-destructive/20 rounded-sm">
                              <p className="text-[10px] uppercase tracking-wide text-destructive mb-0.5 font-semibold">
                                Error Detail
                              </p>
                              <p className="text-xs font-mono text-destructive">
                                {msg.errorDetail}
                              </p>
                            </div>
                          )}
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

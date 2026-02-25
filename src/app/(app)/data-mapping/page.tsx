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
import { dataMappings } from "@/data/mock-data";
import type { MappingStatus } from "@/lib/types";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Search,
} from "lucide-react";

// ── Status badge ─────────────────────────────────────────────────

const STATUS_STYLE: Record<MappingStatus, string> = {
  active: "bg-success/8 text-success border-success/20",
  draft: "bg-muted text-muted-foreground border-border",
  deprecated: "bg-[color:var(--warning)]/10 text-[color:var(--warning)] border-[color:var(--warning)]/20",
  error: "bg-destructive/8 text-destructive border-destructive/20",
};

const STATUS_LABEL: Record<MappingStatus, string> = {
  active: "Active",
  draft: "Draft",
  deprecated: "Deprecated",
  error: "Error",
};

function StatusBadge({ status }: { status: MappingStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs px-2 py-0.5 rounded-sm border",
        STATUS_STYLE[status]
      )}
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}

// ── Sort helpers ─────────────────────────────────────────────────

type SortKey = "name" | "mappedRecords" | "errorCount" | "lastModified";
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

export default function DataMappingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MappingStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayed = useMemo(() => {
    return dataMappings
      .filter((m) => {
        const matchesStatus = statusFilter === "all" || m.status === statusFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          m.name.toLowerCase().includes(q) ||
          m.sourceSystem.toLowerCase().includes(q) ||
          m.sourceField.toLowerCase().includes(q) ||
          m.targetField.toLowerCase().includes(q) ||
          m.transformRule.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;
        switch (sortKey) {
          case "mappedRecords":
            aVal = a.mappedRecords;
            bVal = b.mappedRecords;
            break;
          case "errorCount":
            aVal = a.errorCount;
            bVal = b.errorCount;
            break;
          case "lastModified":
            aVal = a.lastModified;
            bVal = b.lastModified;
            break;
          default:
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
        }
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, statusFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const totalMapped = dataMappings.reduce((acc, m) => acc + m.mappedRecords, 0);
  const totalErrors = dataMappings.reduce((acc, m) => acc + m.errorCount, 0);
  const activeCount = dataMappings.filter((m) => m.status === "active").length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Data Mapping Configuration</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            HL7-to-FHIR field transformation rules across all EMR source systems
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs rounded-sm shrink-0">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export Config
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Active Mappings",
            value: activeCount,
            total: dataMappings.length,
            color: "text-success",
          },
          {
            label: "Records Mapped",
            value: totalMapped.toLocaleString(),
            color: "text-primary",
          },
          {
            label: "Mapping Errors",
            value: totalErrors.toLocaleString(),
            color: totalErrors > 100 ? "text-destructive" : "text-warning",
          },
        ].map((stat) => (
          <Card key={stat.label} className="linear-card rounded-sm py-0">
            <div className="p-3">
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
            </div>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search mappings, source fields, transform rules…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs rounded-sm"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as MappingStatus | "all")}
        >
          <SelectTrigger className="w-32 h-8 text-xs rounded-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="deprecated">Deprecated</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground shrink-0">
          {displayed.length} of {dataMappings.length} mappings
        </span>
      </div>

      {/* Table */}
      <Card className="linear-card rounded-sm p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 w-6" />
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("name")}
                >
                  Mapping Name <SortIcon active={sortKey === "name"} dir={sortDir} />
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Source System
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Field Transform
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Data Type
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Status
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 text-right cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("mappedRecords")}
                >
                  Mapped Records <SortIcon active={sortKey === "mappedRecords"} dir={sortDir} />
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 text-right cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("errorCount")}
                >
                  Errors <SortIcon active={sortKey === "errorCount"} dir={sortDir} />
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("lastModified")}
                >
                  Last Modified <SortIcon active={sortKey === "lastModified"} dir={sortDir} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No data mappings match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((mapping) => (
                  <>
                    <TableRow
                      key={mapping.id}
                      className="cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-75"
                      onClick={() =>
                        setExpandedId(expandedId === mapping.id ? null : mapping.id)
                      }
                    >
                      <TableCell className="px-3 py-2">
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 text-muted-foreground transition-transform duration-75",
                            expandedId === mapping.id && "rotate-90"
                          )}
                        />
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs font-medium">
                        {mapping.name}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-xs text-muted-foreground">
                        {mapping.sourceSystem}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <span className="text-primary bg-primary/8 px-1 py-0.5 rounded-sm border border-primary/15">
                            {mapping.sourceField}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground bg-muted px-1 py-0.5 rounded-sm border border-border">
                            {mapping.targetField}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {mapping.dataType}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <StatusBadge status={mapping.status} />
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs tabular-nums text-right">
                        {mapping.mappedRecords === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          mapping.mappedRecords.toLocaleString()
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs tabular-nums text-right">
                        {mapping.errorCount === 0 ? (
                          <span className="text-muted-foreground">0</span>
                        ) : (
                          <span
                            className={
                              mapping.errorCount > 100
                                ? "text-destructive font-semibold"
                                : "text-warning"
                            }
                          >
                            {mapping.errorCount.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {mapping.lastModified}
                      </TableCell>
                    </TableRow>
                    {expandedId === mapping.id && (
                      <TableRow key={`${mapping.id}-detail`}>
                        <TableCell
                          colSpan={9}
                          className="bg-muted/30 px-4 py-3 border-t border-border/60"
                        >
                          <div className="space-y-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                Transform Rule
                              </p>
                              <p className="text-xs font-mono bg-card border border-border px-2 py-1.5 rounded-sm text-foreground">
                                {mapping.transformRule}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div>
                                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                  Source Field (HL7)
                                </p>
                                <p className="font-mono text-primary">{mapping.sourceField}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                  Target Field (FHIR)
                                </p>
                                <p className="font-mono">{mapping.targetField}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                  HL7 Data Type
                                </p>
                                <p className="font-mono">{mapping.dataType}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                  Error Rate
                                </p>
                                <p className="font-mono">
                                  {mapping.mappedRecords > 0
                                    ? `${((mapping.errorCount / mapping.mappedRecords) * 100).toFixed(2)}%`
                                    : "N/A"}
                                </p>
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

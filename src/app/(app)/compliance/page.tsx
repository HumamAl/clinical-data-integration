"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import {
  complianceAudits,
  getComplianceStatusColor,
  getRiskLevelColor,
} from "@/data/mock-data";
import type { ComplianceAudit, ComplianceStatus } from "@/lib/types";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Download,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

// ── Status helpers ──────────────────────────────────────────────

const COMPLIANCE_STATUS_LABEL: Record<ComplianceStatus, string> = {
  compliant: "Compliant",
  "review-needed": "Review Needed",
  "non-compliant": "Non-Compliant",
  "pending-audit": "Pending Audit",
};

const COMPLIANCE_STATUS_ICONS: Record<ComplianceStatus, React.ReactNode> = {
  compliant: <ShieldCheck className="w-3.5 h-3.5" />,
  "review-needed": <AlertTriangle className="w-3.5 h-3.5" />,
  "non-compliant": <ShieldAlert className="w-3.5 h-3.5" />,
  "pending-audit": <Clock className="w-3.5 h-3.5" />,
};

function ComplianceStatusBadge({ status }: { status: ComplianceStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm border",
        getComplianceStatusColor(status)
      )}
    >
      {COMPLIANCE_STATUS_ICONS[status]}
      {COMPLIANCE_STATUS_LABEL[status]}
    </Badge>
  );
}

function RiskBadge({ risk }: { risk: ComplianceAudit["riskLevel"] }) {
  const labels: Record<ComplianceAudit["riskLevel"], string> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs px-2 py-0.5 rounded-sm border capitalize",
        getRiskLevelColor(risk)
      )}
    >
      {labels[risk]}
    </Badge>
  );
}

// ── Sort helpers ─────────────────────────────────────────────────

type SortKey = "auditDate" | "dueDate" | "findings";
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

export default function HIPAACompliancePage() {
  const [riskFilter, setRiskFilter] = useState<ComplianceAudit["riskLevel"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("auditDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayed = useMemo(() => {
    return complianceAudits
      .filter((a) => {
        const matchesRisk = riskFilter === "all" || a.riskLevel === riskFilter;
        const matchesStatus = statusFilter === "all" || a.status === statusFilter;
        return matchesRisk && matchesStatus;
      })
      .sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;
        if (sortKey === "findings") {
          aVal = a.findings;
          bVal = b.findings;
        } else if (sortKey === "dueDate") {
          aVal = a.dueDate;
          bVal = b.dueDate;
        } else {
          aVal = a.auditDate;
          bVal = b.auditDate;
        }
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [riskFilter, statusFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  // Summary stats
  const compliantCount = complianceAudits.filter((a) => a.status === "compliant").length;
  const openFindings = complianceAudits.reduce(
    (acc, a) => acc + (a.findings - a.resolvedFindings),
    0
  );
  const pendingCount = complianceAudits.filter((a) => a.status === "pending-audit").length;
  const criticalCount = complianceAudits.filter((a) => a.riskLevel === "critical").length;
  const complianceScore = Math.round((compliantCount / complianceAudits.length) * 100);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">HIPAA Compliance Audit Trail</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            PHI access controls, BAA compliance, and risk assessments per §164.306
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs rounded-sm shrink-0">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export Audit Report
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="linear-card rounded-sm py-0">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Compliance Score
              </p>
              <Shield className="w-3.5 h-3.5 text-primary" />
            </div>
            <p
              className={cn(
                "text-xl font-semibold font-mono tabular-nums",
                complianceScore >= 90 ? "text-success" : complianceScore >= 70 ? "text-warning" : "text-destructive"
              )}
            >
              {complianceScore}%
            </p>
          </CardContent>
        </Card>
        <Card className="linear-card rounded-sm py-0">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Open Findings
              </p>
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            </div>
            <p
              className={cn(
                "text-xl font-semibold font-mono tabular-nums",
                openFindings > 0 ? "text-warning" : "text-success"
              )}
            >
              {openFindings}
            </p>
          </CardContent>
        </Card>
        <Card className="linear-card rounded-sm py-0">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Pending Audits
              </p>
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <p className="text-xl font-semibold font-mono tabular-nums text-muted-foreground">
              {pendingCount}
            </p>
          </CardContent>
        </Card>
        <Card className="linear-card rounded-sm py-0">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Critical Items
              </p>
              <ShieldAlert className="w-3.5 h-3.5 text-destructive" />
            </div>
            <p
              className={cn(
                "text-xl font-semibold font-mono tabular-nums",
                criticalCount > 0 ? "text-destructive" : "text-success"
              )}
            >
              {criticalCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={riskFilter}
          onValueChange={(v) =>
            setRiskFilter(v as ComplianceAudit["riskLevel"] | "all")
          }
        >
          <SelectTrigger className="w-32 h-8 text-xs rounded-sm">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as ComplianceStatus | "all")}
        >
          <SelectTrigger className="w-36 h-8 text-xs rounded-sm">
            <SelectValue placeholder="Compliance Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="review-needed">Review Needed</SelectItem>
            <SelectItem value="non-compliant">Non-Compliant</SelectItem>
            <SelectItem value="pending-audit">Pending Audit</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground shrink-0">
          {displayed.length} of {complianceAudits.length} audits
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
                  Audit Type
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Category
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Status
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Risk Level
                </TableHead>
                <TableHead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3">
                  Auditor
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("auditDate")}
                >
                  Audit Date <SortIcon active={sortKey === "auditDate"} dir={sortDir} />
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date <SortIcon active={sortKey === "dueDate"} dir={sortDir} />
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground h-8 px-3 text-right cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("findings")}
                >
                  Findings <SortIcon active={sortKey === "findings"} dir={sortDir} />
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
                    No compliance audits match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((audit) => {
                  const openCount = audit.findings - audit.resolvedFindings;
                  return (
                    <>
                      <TableRow
                        key={audit.id}
                        className={cn(
                          "cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-75",
                          audit.status === "non-compliant" && "bg-destructive/3"
                        )}
                        onClick={() =>
                          setExpandedId(expandedId === audit.id ? null : audit.id)
                        }
                      >
                        <TableCell className="px-3 py-2">
                          <ChevronRight
                            className={cn(
                              "w-3.5 h-3.5 text-muted-foreground transition-transform duration-75",
                              expandedId === audit.id && "rotate-90"
                            )}
                          />
                        </TableCell>
                        <TableCell className="px-3 py-2 text-xs font-medium">
                          {audit.auditType}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-xs text-muted-foreground">
                          {audit.category}
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <ComplianceStatusBadge status={audit.status} />
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <RiskBadge risk={audit.riskLevel} />
                        </TableCell>
                        <TableCell className="px-3 py-2 text-xs text-muted-foreground max-w-[160px] truncate">
                          {audit.auditor}
                        </TableCell>
                        <TableCell className="px-3 py-2 font-mono text-xs text-muted-foreground">
                          {audit.auditDate}
                        </TableCell>
                        <TableCell className="px-3 py-2 font-mono text-xs text-muted-foreground">
                          {audit.dueDate}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {audit.findings === 0 ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                            ) : (
                              <>
                                <span className="font-mono text-xs text-muted-foreground">
                                  {audit.resolvedFindings}/{audit.findings}
                                </span>
                                {openCount > 0 && (
                                  <span className="font-mono text-xs text-destructive font-semibold">
                                    ({openCount} open)
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedId === audit.id && (
                        <TableRow key={`${audit.id}-expanded`}>
                          <TableCell
                            colSpan={9}
                            className="bg-muted/30 px-4 py-3 border-t border-border/60"
                          >
                            <div className="space-y-2">
                              <div>
                                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                  Audit Description
                                </p>
                                <p className="text-xs text-foreground">{audit.description}</p>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                    Total Findings
                                  </p>
                                  <p className="font-mono">{audit.findings}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                    Resolved Findings
                                  </p>
                                  <p className="font-mono text-success">{audit.resolvedFindings}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                                    Open Findings
                                  </p>
                                  <p
                                    className={cn(
                                      "font-mono",
                                      openCount > 0 ? "text-destructive font-semibold" : "text-success"
                                    )}
                                  >
                                    {openCount}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

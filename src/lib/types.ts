import type { LucideIcon } from "lucide-react";

// Sidebar navigation
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ── Healthcare Domain Types ─────────────────────────────────────

export type IntegrationStatus = "active" | "degraded" | "error" | "maintenance";
export type MessageStatus = "delivered" | "acknowledged" | "error" | "pending" | "retrying";
export type HL7MessageType = "ADT" | "ORM" | "ORU" | "SIU" | "MDM" | "DFT" | "RDE";
export type ComplianceStatus = "compliant" | "review-needed" | "non-compliant" | "pending-audit";
export type MappingStatus = "active" | "draft" | "deprecated" | "error";
export type PatientFeedStatus = "streaming" | "paused" | "error" | "queued";

export interface EMRFeed {
  id: string;
  emrSystem: string;
  facilityName: string;
  status: IntegrationStatus;
  messageTypes: HL7MessageType[];
  messagesPerHour: number;
  lastSync: string;
  errorRate: number;
  uptime: number;
  connectionType: "Mirth Connect" | "Direct API" | "SFTP" | "VPN Tunnel";
}

export interface HL7Message {
  id: string;
  messageControlId: string;
  messageType: HL7MessageType;
  triggerEvent: string;
  sendingFacility: string;
  receivingFacility: string;
  patientMRN: string;
  patientName: string;
  timestamp: string;
  status: MessageStatus;
  processingTime: number; // ms
  segmentCount: number;
  errorDetail?: string;
}

export interface DataMapping {
  id: string;
  name: string;
  sourceSystem: string;
  targetField: string;
  sourceField: string;
  dataType: string;
  transformRule: string;
  status: MappingStatus;
  lastModified: string;
  mappedRecords: number;
  errorCount: number;
}

export interface ComplianceAudit {
  id: string;
  auditType: "Access Log" | "PHI Disclosure" | "System Audit" | "BAA Review" | "Risk Assessment";
  category: string;
  description: string;
  status: ComplianceStatus;
  auditor: string;
  auditDate: string;
  dueDate: string;
  findings: number;
  resolvedFindings: number;
  riskLevel: "critical" | "high" | "medium" | "low";
}

export interface PatientRecord {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "M" | "F" | "O";
  insuranceProvider: string;
  primaryProvider: string;
  facility: string;
  lastEncounter: string;
  feedStatus: PatientFeedStatus;
  dataCompleteness: number; // 0-100
  emrSource: string;
  diagnosisCodes: string[];
}

export interface ThroughputDataPoint {
  month: string;
  messages: number;
  errors: number;
  avgLatency: number;
}

export interface SystemMetric {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  status: "up" | "down" | "neutral";
}

// ── Challenge & Proposal Types ──────────────────────────────────

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

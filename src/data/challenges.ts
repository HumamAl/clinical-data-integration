import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most developers approach healthcare integration as a pure API problem — they wire up endpoints, handle some JSON, and call it done. The result is brittle point-to-point connections that break on every EMR upgrade, PHI scattered across unencrypted channels, and zero audit trail when a compliance review hits.",
  differentApproach:
    "I build around Mirth Connect as the canonical integration engine: normalized HL7v2 inbound, FHIR R4 outbound, with a structured PHI boundary and automated audit logging from day one. The architecture handles multi-EMR dialect variance and HIPAA obligations as infrastructure concerns, not afterthoughts.",
  accentWord: "infrastructure concerns",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Real-Time HL7/FHIR Data Pipeline",
    description:
      "HL7v2 messages from multiple EMR sources arrive as raw byte streams with no guaranteed delivery order, no backpressure, and wildly inconsistent segment formats across facilities. Building a pipeline that handles ADT, ORM, and ORU message types reliably — and surfaces clinical data in under 500ms — requires careful channel design in Mirth Connect before writing a single line of application code.",
    visualizationType: "flow",
    outcome:
      "Could reduce clinical data availability from hours (batch-file overnight runs) to under 500ms, enabling real-time decision support at the point of care rather than next-morning reconciliation.",
  },
  {
    id: "challenge-2",
    title: "HIPAA-Compliant Data Architecture",
    description:
      "Healthcare integrations start accumulating PHI from the first test message. Without deliberate architecture choices — encryption at rest and in transit, role-based access controls, BAA alignment, and an automated audit trail — you reach launch with a compliance debt that can take months to untangle. HIPAA readiness built in from day one costs far less than remediation after the fact.",
    visualizationType: "before-after",
    outcome:
      "Could bring compliance posture from ad-hoc to audit-ready in the initial build sprint, reducing breach risk exposure and ensuring the audit trail required under 45 CFR §164.312(b) is complete before the first live patient record flows through.",
  },
  {
    id: "challenge-3",
    title: "Multi-EMR Interoperability Engine",
    description:
      "Epic, Cerner, Allscripts, and athenahealth each implement HL7v2 with vendor-specific extensions, non-standard Z-segments, and divergent field cardinality. Without a normalization layer, every new EMR connection requires a bespoke integration — typically 3-6 weeks of mapping work per system. A canonical data model with per-source adapters reduces that to days.",
    visualizationType: "architecture",
    outcome:
      "Could enable a single normalized integration point for 8+ EMR systems, eliminating custom point-to-point connections and reducing each new EMR onboarding from 3-6 weeks to approximately 3-5 days of adapter configuration.",
  },
];

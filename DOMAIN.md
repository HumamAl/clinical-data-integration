# Domain Knowledge Brief — Healthcare Clinical Data Integration (EMR/HL7/FHIR Middleware)

## Sub-Domain Classification

**Healthcare IT Integration Middleware** — specifically, an EMR/EHR integration platform that routes, transforms, and monitors real-time clinical messages across disparate hospital systems using HL7 v2, FHIR R4, and Mirth Connect as the integration engine. Target user is a healthcare IT integration engineer or clinical informatics director at a mid-size regional health system (3-12 facilities, 200-800 beds total). This is NOT a clinical app for providers — it is an **operations and observability tool** for the technical staff who keep the data pipelines running.

---

## Job Analyst Vocabulary — Confirmed and Extended

This is a specialized integration ops sub-domain. The client vocabulary centers on message brokering, data transformation, HIPAA compliance, and interface engine monitoring. "Patients" appear only as entities being referenced in messages — the user of this software is an integration engineer, not a clinician.

### Confirmed Primary Entity Names

These are the words that must appear in every UI label — sidebar nav, table headers, KPI card titles, status badges, search placeholders.

- **Primary record type**: "Message" (not "record", not "transaction") — specifically "HL7 Message" or "FHIR Resource"
- **Routing unit**: "Channel" (Mirth Connect terminology — a channel is a configured pipeline that ingests, transforms, and routes messages)
- **Processing unit**: "Interface" (as in "lab interface", "ADT interface") — the connection between two systems
- **Workflow event**: "Encounter" (not "visit", not "appointment") — the FHIR/clinical standard
- **Patient identifier**: "MRN" (Medical Record Number) — format: `MRN-XXXXXXXX` (8-digit numeric with prefix)
- **Error/failure**: "Exception" (not "error", not "failure") — this is what HL7 people call parse failures
- **Data source**: "Sending System" or "Source System" (the EMR or ancillary system originating messages)
- **Data destination**: "Receiving System" or "Target System"
- **Configuration unit**: "Channel Configuration" (Mirth) or "Interface Definition"
- **Compliance log**: "Audit Trail" (HIPAA term) — not "access log", not "activity log"
- **Provider title**: "Attending Physician", "Ordering Provider", "Referring Provider" (never just "doctor")
- **Organization unit**: "Facility" or "Site" (not "location", not "office") — specifically "sending facility" in HL7 MSH segment

### Expanded KPI Vocabulary

| KPI Name | What It Measures | Typical Format |
|---|---|---|
| Message Throughput | Total HL7 messages processed per hour/day | count (e.g., "14,382 msg/hr") |
| Channel Uptime | % of time each channel is active and processing | percentage (e.g., "99.94%") |
| Exception Rate | % of messages that failed to process | percentage (e.g., "0.37%") |
| Avg Processing Latency | End-to-end time from message received to delivered | milliseconds (e.g., "142 ms") |
| Queue Depth | Messages waiting in processing queue | count (e.g., "847 queued") |
| ADT Message Volume | Admission/Discharge/Transfer messages specifically | count per day |
| ORU Message Volume | Lab result messages specifically | count per day |
| ORM Message Volume | Order messages specifically | count per day |
| FHIR API Request Rate | FHIR R4 endpoint calls per minute | requests/min |
| PHI Access Events | Times protected health information was accessed | count (for HIPAA audit) |
| Duplicate MRN Rate | Patient records flagged as potential duplicates | percentage (target <1%) |
| Interface SLA Compliance | % of interfaces meeting agreed response time SLAs | percentage |
| Mean Time to Resolve (MTTR) | Avg time to resolve a channel exception | minutes/hours |
| Active Channel Count | Number of currently running integration channels | count |
| Data Completeness Score | % of required fields populated across ingested records | percentage (e.g., "94.2%") |

### Status Label Vocabulary

Exact status strings used in this sub-domain — these go directly into data tables, badges, and filter dropdowns.

- **Channel/Interface Active States**:
  - `Active` — channel is running and processing messages
  - `Processing` — actively transforming a batch
  - `Polling` — waiting for inbound messages (common for file-based channels)
  - `Idle` — running but no messages in queue
- **Message Processing States**:
  - `Received` — message ingested, awaiting transformation
  - `Transformed` — transformation applied, pending delivery
  - `Sent` — successfully delivered to target system
  - `Acknowledged` — target system returned ACK (HL7 acknowledgment)
  - `Queued` — waiting in processing queue
- **Exception/Error States**:
  - `Exception` — processing failed, needs review (primary error state)
  - `Parse Error` — HL7 message structure was malformed
  - `Validation Failed` — message failed business rules or schema validation
  - `Delivery Failed` — transformation succeeded but target system rejected
  - `Duplicate Detected` — message flagged as a potential duplicate
  - `Filtered` — message intentionally excluded by a channel filter rule
- **Compliance States**:
  - `Compliant` — PHI handling passed audit rules
  - `Under Review` — flagged for manual compliance review
  - `Violation` — confirmed HIPAA rule breach (critical — red badge)
- **Interface/Channel Management States**:
  - `Deployed` — channel configuration deployed and active
  - `Paused` — temporarily halted (maintenance)
  - `Stopped` — channel halted, not processing
  - `Draft` — channel configuration not yet deployed
  - `Deprecated` — channel scheduled for decommission

### Workflow and Action Vocabulary

Verbs used in this domain — these become button labels, action menu items, and empty state messages.

- **Primary actions**: `Deploy`, `Pause`, `Resume`, `Reprocess`, `Acknowledge`, `Escalate`
- **Secondary actions**: `Transform`, `Validate`, `Route`, `Filter`, `Map`, `Retry`, `Archive`
- **Message-level actions**: `View Raw`, `View Transformed`, `Replay`, `Quarantine`, `Mark Resolved`
- **Compliance actions**: `Export Audit Trail`, `Flag for Review`, `Purge PHI`, `Generate BAA Report`

### Sidebar Navigation Candidates

- **Integration Monitor** (main channel status overview — most important nav item)
- **Message Queue** (real-time message processing feed)
- **Channel Manager** (configure, deploy, and manage integration channels)
- **Interface Directory** (list of all system-to-system interfaces)
- **Exception Log** (all failed/errored messages with reprocess actions)
- **Audit Trail** (HIPAA access and PHI audit log)
- **FHIR Explorer** (browse FHIR resources — Patient, Encounter, Observation, etc.)
- **System Health** (uptime, latency charts, SLA scorecards)

---

## Design Context — Visual Language of This Industry

### What "Premium" Looks Like in This Domain

Healthcare IT integration tools are operated by people who live in dense operational interfaces all day. The professional aesthetic is what you'd see in Mirth Connect's administrator console, Rhapsody IDE, or enterprise monitoring dashboards like Datadog or PagerDuty — clinical-grade precision combined with the operational density of a DevOps tool. This is a power-user tool for technical professionals, NOT a patient-facing consumer app.

The key visual conventions this audience has internalized: status-first design (every row, every channel, every message needs a clear visual status indicator), dense data tables with monospace values for timestamps and identifiers, color-coded badge systems for message types (ADT = blue, ORU = green, ORM = amber, exception = red), and sidebar navigation that organizes by operational domain rather than by generic SaaS labels.

Trust is communicated through visual organization and precision. Every pixel should signal that the software understands the stakes — healthcare data pipelines handle PHI, and errors have patient safety implications. The visual system should convey stability, auditability, and clinical professionalism. NOT playfulness, NOT warmth, NOT consumer friendliness.

The closest non-healthcare analogs: a well-designed log management tool (like Datadog Logs or Splunk) combined with the tabular precision of a Bloomberg terminal. High information density, clear status hierarchy, minimal decorative elements, maximum data visibility.

### Real-World Apps Clients Would Recognize as "Premium"

1. **Mirth Connect (NextGen)** — The de facto standard integration engine for healthcare. Its administrator console is dense, tab-heavy, and Java-era but practitioners know it deeply. A modern web-based version of Mirth's monitoring view would immediately signal domain expertise. Key visual patterns: channel status table with colored state indicators, message log with raw/transformed toggle, filter/transformer flow diagrams.

2. **Rhapsody Integration Engine** — Commercial alternative to Mirth, used by larger health systems. Features a dashboard showing engine health, message throughput charts, error rate graphs, and a component-level status grid. Practitioners compare demos against this. Visual conventions: clean grid of component tiles with green/amber/red status dots, time-range message volume charts.

3. **Redox** — The modern cloud-native EHR integration API platform. Cleaner and more developer-friendly than Mirth. Dashboard shows transaction counts, error rates, connected EHRs by facility, and API health scores. Visual pattern: operational SaaS aesthetic with a healthcare-specific color palette (clinical blue with error red).

### Aesthetic Validation

- **Job Analyst chose**: Corporate Enterprise (based on Healthcare B2B ops routing)
- **Domain validation**: Confirmed with nuance — this is Healthcare IT ops, which sits at the intersection of Clinical and DevOps. Corporate Enterprise is correct for the clinical seriousness and trust signals. However, there is a secondary Data-Dense component that should inform density choices. The tool is closer to a monitoring dashboard (Datadog-like) than a traditional EHR admin console.
- **One adjustment**: Lean toward the dense/compact end of Corporate Enterprise. The primary users (integration engineers) expect information-packed screens, not generous whitespace. Increase density slightly above the Corporate Enterprise default. Color should stay in the cerulean/clinical blue range (`oklch(0.50-0.55 0.14 200-210)`) but can have slightly deeper saturation to differentiate from a generic clinical tool.

### Density and Layout Expectations

This domain is **dense-to-standard** — closer to DevOps monitoring than to clinical management. The practitioners work in operational consoles that show many data points simultaneously. They are accustomed to Mirth Connect's dense Java UI, Splunk dashboards with compact tables, and enterprise monitoring tools.

The primary view pattern is **list/queue-heavy** — message queues, exception logs, channel status grids, and interface directories are all tabular/list views. Card-based views appear for channel overview tiles (showing status, throughput, last activity per channel) and FHIR resource detail. The dashboard should lead with stat cards (KPIs), then transition to a status grid of channels, then a message throughput chart, then a live exception/recent message feed.

---

## Entity Names (10+ realistic names)

### Companies / Organizations (Health Systems and Integration Vendors)

Realistic health system and vendor names for this sub-domain:

- **Ridgeline Regional Health** (regional health system, 4 hospitals)
- **Cascade Health Partners** (ambulatory care network, Pacific Northwest)
- **Harborview Medical Center** (urban tertiary hospital)
- **Blueridge Community Health** (rural critical access hospital network)
- **Meridian Health Alliance** (multi-specialty physician group)
- **Summit Orthopaedics & Sports Medicine** (specialty practice)
- **Valley Diagnostics Laboratory** (reference lab — high ORU message volume)
- **Coastal Radiology Associates** (imaging center — DICOM/HL7 feeds)
- **NextGen Healthcare** (Mirth Connect vendor — may appear as "software vendor")
- **InterSystems HealthShare** (integration platform — Rhapsody alternative)
- **Redox, Inc.** (cloud-native EHR integration API)
- **eMedApps** (Mirth Connect managed service provider)

### People Names (Integration Engineers and Clinical Informatics Roles)

- **Marcus Chen** — Integration Engineer
- **Sarah Kowalski** — Clinical Informatics Director
- **James Okafor** — HL7 Interface Analyst
- **Priya Nair** — HIPAA Compliance Officer
- **Derek Williamson** — IT Systems Administrator
- **Elena Vasquez** — Health Informatics Specialist
- **Tom Brannigan** — EDI/Integration Consultant
- **Keisha Thompson** — Application Support Analyst
- **Andrew Park** — FHIR Developer
- **Natalie Sorenson** — EHR Project Manager

### HL7 Message Types / Channel Names (Products/Services Equivalent)

Realistic channel and interface names used in Mirth-based deployments:

- `ADT-A01_Admit_Inbound` (patient admission events from Epic)
- `ADT-A03_Discharge_to_Analytics` (discharge events routed to data warehouse)
- `ORU-R01_LabResults_Valley_Diag` (lab result feed from Valley Diagnostics Lab)
- `ORM-O01_Orders_to_Pharmacy` (order messages to pharmacy system)
- `SIU-S12_Scheduling_Sync` (scheduling events to/from scheduling system)
- `FHIR_Patient_Sync_Epic` (FHIR R4 Patient resource sync)
- `FHIR_Observation_Vitals_Feed` (FHIR Observation resources for vitals)
- `MDM-T02_Documents_to_HIE` (clinical document exchange to Health Information Exchange)
- `DFT-P03_Charges_to_Billing` (charge capture to billing system)
- `MFN-M01_MasterFile_Providers` (provider master file synchronization)

---

## Realistic Metric Ranges

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Messages per hour (mid-size health system) | 800 | 4,200 | 18,000 | Spikes during shift changes (7am, 3pm, 11pm) |
| Channel uptime (SLA target) | 97.5% | 99.5% | 99.97% | Critical interfaces SLA is often 99.9% |
| Exception rate (% of messages) | 0.02% | 0.3% | 2.1% | >1% is a problem worth escalating |
| Message processing latency | 45 ms | 180 ms | 850 ms | FHIR API calls typically slower than HL7 v2 |
| Queue depth (normal) | 0 | 12 | 200 | >500 in queue = backlog alert |
| Duplicate MRN rate | 0.1% | 0.4% | 1.8% | Industry benchmark target is <1% |
| Active channels (mid-size health system) | 8 | 24 | 85 | Each facility adds 6-15 channels |
| PHI access events per day (audit) | 120 | 1,400 | 8,500 | Varies heavily by system size |
| FHIR API response time | 95 ms | 320 ms | 1,200 ms | Bulk export operations are slower |
| ADT messages per day | 200 | 1,100 | 5,400 | Includes A01, A03, A08, A11 event types |
| ORU messages per day | 400 | 2,800 | 14,000 | Lab orgs generate highest ORU volumes |
| Interface SLA compliance | 91% | 97.3% | 99.8% | Non-critical interfaces drift below 95% |
| MTTR for channel exceptions | 12 min | 47 min | 4 hrs | Critical channels get immediate response |
| Data completeness score | 78% | 92.4% | 98.7% | Legacy systems drag completeness down |

---

## Industry Terminology Glossary (15+ terms)

| Term | Definition | Usage Context |
|------|-----------|---------------|
| HL7 v2 | Health Level Seven Version 2 — pipe-delimited messaging standard dominant in US hospitals since 1987 | Message format identifier; "HL7 v2 message" vs "FHIR resource" |
| FHIR (R4) | Fast Healthcare Interoperability Resources — modern REST API standard for clinical data exchange | FHIR R4 is current standard; FHIR R5 emerging |
| ADT | Admit, Discharge, Transfer — HL7 message category for patient movement events | "ADT feed", "ADT-A01 event" (admission), "ADT-A03" (discharge) |
| ORM | Order Message — HL7 message type for clinical orders (labs, radiology, pharmacy) | "ORM-O01 channel", "outbound ORM to pharmacy" |
| ORU | Observation Result (Unsolicited) — HL7 message type for lab results, vitals, observations | "ORU-R01 feed from lab", "ORU exception rate" |
| SIU | Scheduling Information Unsolicited — HL7 message for appointment scheduling events | "SIU-S12 scheduling sync channel" |
| MSH | Message Header Segment — first segment of every HL7 v2 message; contains sender, receiver, timestamp | "Check the MSH.3 sending application field" |
| PID | Patient Identification Segment — patient demographics in HL7 v2 messages | "PID segment", "PID.3 patient identifier list" |
| MRN | Medical Record Number — unique patient identifier within a health system | Format: MRN-12345678; "MRN mismatch exception" |
| Channel | In Mirth Connect, a configured pipeline that accepts, processes, and delivers messages | "24 active channels", "channel exception rate" |
| ACK | Acknowledgment — HL7 response confirming message receipt (AA = accepted, AE = error, AR = rejected) | "Waiting for ACK", "ACK-AE received — delivery failed" |
| PHI | Protected Health Information — any individually identifiable health information covered by HIPAA | "PHI access event", "PHI de-identification required" |
| ePHI | Electronic Protected Health Information — PHI stored or transmitted electronically | "ePHI in transit must be encrypted (TLS 1.2+)" |
| BAA | Business Associate Agreement — legal contract required by HIPAA when sharing PHI with vendors | "BAA on file with vendor", "BAA expiration date" |
| Transformer | In Mirth/integration engines, a script that maps and converts message fields during processing | "JavaScript transformer", "transformer error in step 3" |
| Filter | In Mirth, a rule that decides whether a message continues processing or is discarded | "Filter rule: discard if MSH.9 = ADT^A08 and PID.3 is null" |
| Interface | A configured connection between two named healthcare systems | "Epic-to-lab interface", "24 active interfaces" |
| HIE | Health Information Exchange — regional network for sharing patient data across organizations | "Route ADT events to state HIE" |
| ICD-10 | International Classification of Diseases, 10th Revision — diagnosis coding standard | "ICD-10 code Z00.00 — encounter for general exam" |
| CPT | Current Procedural Terminology — procedure coding standard for billing | "CPT 99213 — office visit, established patient" |
| NPI | National Provider Identifier — 10-digit unique ID for healthcare providers | "NPI lookup failed — provider not found in registry" |
| LOINC | Logical Observation Identifiers Names and Codes — standard for lab test names | "LOINC 2160-0 — serum creatinine" |
| SNOMED CT | Standardized clinical terminology for diagnoses and procedures in FHIR resources | "Map SNOMED code to ICD-10 for billing export" |

---

## Common Workflows

### Workflow 1: Patient Admission Message Flow (ADT-A01)

1. Patient is admitted at hospital front desk in Epic EHR
2. Epic generates an HL7 v2 ADT-A01 message (Admit a Patient event)
3. Mirth Connect channel `ADT-A01_Admit_Inbound` receives the message via MLLP (Minimal Lower Layer Protocol) on TCP port 6661
4. Channel Filter validates required segments (MSH, EVN, PID, PV1) — message rejected if PID.3 (MRN) is null
5. Channel Transformer maps HL7 fields to target schema (e.g., maps Epic-specific Z-segments to canonical fields)
6. Transformed message is routed to multiple destination channels: analytics data warehouse, care management platform, and HIE
7. ACK (AA) returned to Epic confirming receipt
8. Message logged to audit trail with sender, receiver, timestamp, and MRN (PHI-aware logging — MRN is masked in non-compliant log stores)
9. Integration Monitor shows ADT channel throughput increment; any exceptions surface immediately in Exception Log

### Workflow 2: Lab Result Delivery (ORU-R01)

1. Laboratory Information System (LIS) generates HL7 ORU-R01 message when lab results are finalized
2. Mirth Connect channel `ORU-R01_LabResults_Valley_Diag` receives message from Valley Diagnostics LIS
3. MRN in PID.3 is validated against master patient index — duplicate or unknown MRN triggers Exception
4. LOINC codes in OBX segment are mapped to internal result codes for EHR display
5. Critical values in OBX.5 (e.g., potassium > 6.5 mEq/L) trigger a separate "critical result" routing rule — message copied to nurse alert channel
6. Result delivered to Epic EHR via outbound HL7 channel
7. Epic acknowledges receipt (ACK-AA); failure to receive ACK within 30 seconds triggers retry (max 3 retries)
8. If all retries fail: message enters `Exception` state; alert sent to on-call integration engineer
9. Audit trail records: lab source, patient MRN (masked), result timestamp, delivery status

### Workflow 3: FHIR R4 Integration (Patient Sync)

1. External application (care coordination app) calls FHIR R4 API endpoint: `GET /Patient/{id}`
2. FHIR server validates OAuth 2.0 bearer token and SMART on FHIR scopes
3. Request logged to PHI access audit trail (required by HIPAA)
4. FHIR server queries internal master patient index, constructs FHIR Patient resource (JSON)
5. Related resources fetched: `Encounter`, `Condition`, `Observation` (if requested in `_include` params)
6. Response returned with appropriate rate limiting headers
7. If patient not found: `404 Not Found` with OperationOutcome resource
8. Bulk FHIR export (`$export` operation) for population health analytics — generates NDJSON files, async job tracked in Job Monitor

---

## Common Edge Cases

1. **Null PID.3 (Missing MRN)** — Message arrives without a patient identifier. Exception state. Integration engineer must manually match or reject. Common with legacy ancillary systems.
2. **Duplicate MRN / Overlapping Records** — Two patient records with same MRN (or same demographics, different MRNs). Requires manual reconciliation. Rate target <1% but frequently exceeds in merged health systems.
3. **Z-Segment Custom Fields** — Epic sends non-standard Z-segments (ZPD, ZDG) that other engines don't recognize. Transformer must handle gracefully — ignore unknown segments OR map them to custom fields.
4. **ACK Timeout / Delivery Failure** — Target system didn't respond within SLA window. Message enters retry queue. After max retries, `Delivery Failed` exception. Common when receiving system is under maintenance.
5. **LOINC/SNOMED Mapping Gap** — Lab result arrives with a local test code that has no LOINC mapping in the reference table. OBX segment value cannot be standardized. Message routes to `Validation Failed` state pending manual code mapping.
6. **HL7 Encoding Characters Corruption** — Pipe-delimited HL7 message arrives with garbled encoding (common when messages pass through non-HL7-aware middleware). `Parse Error` exception — raw message preserved for review.
7. **High Volume Spike (Shift Change)** — At 7:00am, 3:00pm, and 11:00pm shift changes, ADT message volume spikes 4-8x baseline. Queue depth increases. Processing latency degrades. Well-designed systems auto-scale; poorly configured ones generate cascading exceptions.
8. **BAA Expired for Vendor** — Integration channel sends PHI to a third-party vendor whose BAA has expired. HIPAA violation risk. Compliance officer must be alerted. Channel should be paused pending BAA renewal.
9. **FHIR Token Expiry During Bulk Export** — Long-running bulk `$export` job encounters OAuth token expiration mid-operation. Job fails silently if not handled. Results in incomplete export delivered to analytics platform.
10. **Overlapping Patient Demographic Updates (ADT-A08)** — Patient demographic change (ADT-A08 message) arrives at two channels simultaneously from two different source systems. Race condition creates conflicting updates in master patient index.

---

## What Would Impress a Domain Expert

1. **MLLP Protocol Awareness** — Showing that messages are received via MLLP (Minimal Lower Layer Protocol) on specific TCP ports, not generic HTTP. MLLP is the HL7 v2 transport protocol — most developers build "healthcare integrations" without knowing it exists. A dashboard showing "MLLP Listener: Port 6661 — Active" signals deep domain knowledge.

2. **Message Segment Drill-Down** — Ability to click on an exception and see the raw HL7 pipe-delimited message with each segment labeled (MSH, EVN, PID, PV1, OBX, etc.). The ability to see `PID|1||MRN-48291823^^^EPIC^MR|` is what integration engineers actually do all day.

3. **ACK Response Tracking** — Showing ACK status (AA/AE/AR) per message, not just "success/fail". Healthcare integration engineers think in terms of whether they got an ACK, what type, and how fast. A column showing `ACK: AA | 47ms` vs `ACK: AE — rejected` is immediately credible.

4. **Critical Value Routing Logic** — Demonstrating that ORU messages with critical lab values (OBX abnormal flags = "C" or "LL"/"HH") trigger a separate routing rule. This is a real patient safety feature that sophisticated integration engines implement — it shows you understand clinical significance, not just data flow.

5. **ONC/CMS Compliance Context** — References to 21st Century Cures Act (information blocking rules), CMS Interoperability Final Rule, or TEFCA (Trusted Exchange Framework and Common Agreement) signal that the developer understands the regulatory landscape driving why this integration work is happening. These are the compliance drivers the client's organization must satisfy.

---

## Common Systems & Tools Used

| System | Category | Notes |
|--------|----------|-------|
| Mirth Connect (NextGen) | Integration Engine | Open-source + commercial; most common HL7 v2 engine in US healthcare; channels, transformers, JavaScript |
| Rhapsody | Integration Engine | Enterprise commercial alternative; used by large health systems; drag-and-drop IDE |
| Epic EHR | EMR/EHR | ~33% US hospital market share; HL7 v2 + FHIR R4 APIs via open.epic |
| Oracle Cerner (Oracle Health) | EMR/EHR | Large health system EHR; HL7 v2 + FHIR via Millennium APIs |
| Athenahealth | EMR/EHR | Ambulatory/outpatient focus; REST API + HL7 v2 |
| Allscripts (Veradigm) | EMR/EHR | Enterprise hospitals; HL7 v2 primarily |
| InterSystems HealthShare | Integration Platform | Direct competitor to Mirth; enterprise-grade; HealthShare Health Connect |
| Redox | Cloud Integration API | Modern API layer on top of EHR integrations; REST API; used by digital health startups |
| Postman / HL7 Inspector | Developer Tool | Integration engineers test HL7 messages and FHIR API calls in these |
| Splunk / Elastic (ELK Stack) | Log Management | Healthcare IT teams use these for integration engine log analysis |
| AWS HealthLake | Cloud Data Store | FHIR-native data lake for healthcare analytics |
| Azure Health Data Services | Cloud Platform | Microsoft's FHIR server + DICOM service; used for cloud-native integration |
| HIE Platforms (CommonWell, Carequality) | Data Networks | National health information exchange networks |

---

## Geographic / Cultural Considerations

This is a US-centric domain. Key US-specific conventions:
- **Identifiers**: MRN (Medical Record Number), NPI (National Provider Identifier), DEA number (controlled substance prescribers)
- **Diagnosis coding**: ICD-10-CM (US clinical modification) — not ICD-10 generic
- **Procedure coding**: CPT codes (US-specific — AMA proprietary standard)
- **Drug coding**: NDC (National Drug Code) for medications; RxNorm for normalized drug names
- **Privacy law**: HIPAA (US federal) — not GDPR. Some states have additional requirements (CCPA for California PHI)
- **Regulatory**: ONC (Office of the National Coordinator for Health IT), CMS (Centers for Medicare & Medicaid Services) set interoperability mandates
- **Fiscal year**: Hospitals follow federal fiscal year (October 1 - September 30) for CMS reporting
- **Time zones**: Critical for HL7 message timestamps — MSH.7 uses `YYYYMMDDHHMMSS` format with UTC offset. Multi-facility health systems may span time zones.

---

## Data Architect Notes

### Entity and Type Names to Use
- Primary entity: `HL7Message` (not `Message`, `Record`, or `Event`)
- Integration unit: `Channel` (a Mirth Connect channel configuration)
- Connection record: `Interface` (a named system-to-system connection)
- Compliance record: `AuditEvent` (FHIR-compliant term for PHI access logs)
- Patient reference: `PatientRecord` (not `Patient` — patients are referenced, not the primary entity)
- Error record: `ChannelException` (not `Error` or `Failure`)

### Field Names and Values
- Patient identifier field: `mrn` (format: `MRN-XXXXXXXX`, 8-digit numeric, e.g., `MRN-48291823`)
- Message type field: use exact HL7 event codes: `ADT^A01`, `ADT^A03`, `ORU^R01`, `ORM^O01`, `SIU^S12`, `MDM^T02`, `DFT^P03`
- Status field for messages: `"Received" | "Transformed" | "Sent" | "Acknowledged" | "Exception" | "Parse Error" | "Validation Failed" | "Delivery Failed" | "Queued" | "Filtered"`
- Status field for channels: `"Active" | "Paused" | "Stopped" | "Error" | "Idle" | "Draft" | "Deprecated"`
- Acknowledgment field: `"AA"` (accepted), `"AE"` (application error), `"AR"` (rejected)
- Processing time: integer milliseconds (e.g., `142`, `89`, `1847`)
- Throughput: messages per hour, formatted with comma separators (e.g., `14382`, `8271`)

### Metric Ranges for Mock Data
- Message processing time: 45-850ms; typical 100-250ms; exceptions >500ms
- Channel uptime: 97.5%-99.97%; use `99.94%`, `98.7%`, `99.21%` (not round numbers)
- Exception rate: 0.02%-2.1%; typical 0.1%-0.5%
- Messages per day (ADT): 200-5,400 depending on channel; typical 800-1,400
- Messages per day (ORU): 400-14,000; typical 2,000-3,500
- Queue depth: normally 0-50; spike states 200-800; critical >1000
- Data completeness: 78%-98.7%; typical 90%-95%

### Edge Cases to Include as Records
1. One `HL7Message` with status `"Parse Error"` and null `transformedAt` field
2. One `Channel` with status `"Stopped"` and a `lastError` timestamp within past 24 hours
3. Two `PatientRecord` entries with identical demographics but different MRNs (duplicate detection scenario)
4. One `AuditEvent` with `accessType: "bulk_export"` and large PHI record count
5. One `HL7Message` with `ackStatus: "AE"` (application error acknowledgment)
6. One `Channel` with `exceptionRate > 1.5%` (above threshold — warning state)
7. One `Interface` where `baaExpiry` is within 30 days (compliance warning)

### Date Patterns
- HL7 message timestamps use `YYYYMMDDHHMMSS` format internally (store as ISO string, display in locale format)
- Spike patterns: ADT volume peaks at 7:00am, 3:00pm, 11:00pm (shift changes)
- Chart time-series: 30-day rolling window for operational dashboards; 12-month for compliance reports
- Message volume follows weekly pattern: weekdays 30-40% higher than weekends
- Fiscal year reporting: October 1 - September 30 (US hospital/CMS fiscal year)

---

## Layout Builder Notes

### Recommended Density
**Compact-to-Standard** — this is a DevOps-adjacent operational tool. Use `--content-padding: 1rem` (compact) for the main dashboard and message queue pages. `--card-padding: 1rem`. `--nav-item-py: 0.375rem`. Standard density is acceptable for detail pages (channel configuration, audit trail detail views).

### Domain-Specific Visual Patterns
- **Status badge system is mandatory**: Every table row must have a status badge. Colors: green=Active/Sent/Acknowledged, amber=Queued/Processing/Warning, red=Exception/Error/Violation, gray=Idle/Filtered/Deprecated, blue=Received/Transformed
- **Monospace for all technical identifiers**: MRN, message IDs, HL7 event codes, channel names, timestamps. `font-mono tabular-nums` on these columns.
- **HIPAA signal in sidebar/header**: A visible "HIPAA Compliant" badge or "PHI Protected" indicator. This is non-negotiable credibility signal for this audience.
- **Message type color coding**: ADT messages = blue badge, ORU messages = green badge, ORM messages = amber badge, Exception = red badge. Healthcare IT engineers learn to scan by color.
- **Throughput sparklines on channel cards**: Each channel tile should show a 24-hour mini-sparkline of message volume.

### Sidebar Width
Use `--sidebar-width: 16rem` (standard). Navigation labels in this domain tend to be 2-3 words (e.g., "Integration Monitor", "Message Queue") which fit comfortably at 16rem.

### Color Nuance
Use `oklch(0.50 0.15 205)` for primary — slightly deeper and more saturated than the generic cerulean `oklch(0.55 0.14 180)` from the reference file. This sub-domain is technical and serious; slightly deeper blue reads as more authoritative and less "generic healthcare."

---

## Dashboard Builder Notes

### Primary Metric (Largest Stat Card)
**Message Throughput** — "Messages Today" with a count like `47,382` — is the single most important operational metric. This is what integration engineers check first every morning. Lead with this.

### Recommended Stat Card Order
1. **Messages Today** (largest — total processed)
2. **Exception Rate** (% with trend arrow — critical for SLA)
3. **Active Channels** (count of running channels)
4. **Avg Latency** (milliseconds)
5. **Channel Uptime** (% — compliance signal)

### Chart Type Recommendations
- **Primary chart**: Area chart for message volume over time (24-hour or 7-day rolling). Shows the shift-change spikes visually — an integration engineer will immediately recognize the 7am/3pm/11pm pattern as authentic.
- **Secondary chart**: Bar chart grouped by message type (ADT / ORU / ORM / SIU / Other) for the same time period.
- **Tertiary**: Horizontal bar chart or radial gauge for channel SLA compliance per interface.

### One Domain-Specific Panel That Would Impress
**Live Message Feed** — a real-time scrolling log of recent messages with: message type badge (ADT/ORU/ORM), source system name, destination system name, processing latency in ms, ACK status (AA/AE/AR), and timestamp. This is what Mirth Connect's "Message Browser" looks like — integration engineers spend 40% of their day in this view. A polished, filterable version of this panel is the single highest-signal element you can build.

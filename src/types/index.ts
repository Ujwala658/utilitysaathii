/**
 * Utility Saathi - Domain Types & Data Contracts
 * Fulfills all Indian utility specifications (kWh, kL, INR ₹, D/M/Y dates)
 */

export type UserRole = 'tenant' | 'owner' | 'admin';

export type UtilityType = 'electricity' | 'water';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  propertyIds: string[];
  flatUnit?: string;
  isDemoUser: boolean;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  locality: string;
  electricityDiscom: string;
  waterBoard: string;
  ownerId: string;
  tenantIds: string[];
  electricityConsumerNo: string;
  waterConsumerNo: string;
  feederIdentifier: string;
  waterZoneIdentifier: string;
  sanctionedLoadKw: number;
}

export interface TariffSlab {
  minUnits: number;
  maxUnits: number | null; // null for above
  ratePerUnit: number;
  label: string;
}

export interface VersionedTariff {
  id: string;
  utility: UtilityType;
  jurisdiction: string; // e.g., 'Bengaluru (BESCOM)', 'Delhi (BSES)', 'Chennai (TANGEDCO)'
  version: string; // e.g., 'FY 2024-25 v1.2'
  effectiveFrom: string;
  effectiveTo: string | null;
  currency: 'INR';
  fixedChargePerKwPerMonth: number;
  slabs: TariffSlab[];
  fuelAdjustmentPerUnit: number; // FAC per kWh
  regulatorySurchargePct: number; // % on energy charges
  taxPct: number; // Electricity duty / VAT %
  sanitaryChargePct?: number; // for water boards (BWSSB 25%)
  subsidies: {
    name: string;
    description: string;
    eligibleMaxUnits?: number;
    discountType: 'percentage' | 'fixed_units_free' | 'flat_rebate';
    discountValue: number;
  }[];
  sourceDocName: string;
  sourceUrl: string;
  isOfficialPublished: boolean;
}

export interface BillCalculationStep {
  stepNumber: number;
  description: string;
  formula: string;
  units?: number;
  rate?: number;
  subtotal: number;
  tariffClauseRef?: string;
}

export type AnomalyType =
  | 'estimated_to_actual_catchup'
  | 'unusual_consumption_surge'
  | 'tariff_slab_boundary'
  | 'reading_decrease_rollover'
  | 'arithmetic_mismatch'
  | 'unusual_period_length'
  | 'negative_charge_detected'
  | 'missing_reading_interval';

export interface BillAnomaly {
  id: string;
  type: AnomalyType;
  title: string;
  severity: 'info' | 'advisory' | 'needs_review' | 'potential_error';
  observedEvidence: string;
  plausibleExplanations: string[];
  confidenceLimit: string;
  safeChecksToPerform: string[];
  status: 'flagged' | 'reviewed_by_user' | 'disputed' | 'verified_by_admin';
}

export type ReadingType = 'actual' | 'estimated';

export interface Bill {
  id: string;
  billNumber: string;
  utility: UtilityType;
  propertyId: string;
  propertyName: string;
  consumerNumber: string;
  maskedAccountRef: string;
  billingStartDate: string;
  billingEndDate: string;
  billingDays: number;
  dueDate: string;
  previousReading: number;
  currentReading: number;
  readingType: ReadingType;
  unitsConsumed: number;
  metricUnit: 'kWh' | 'kL';
  tariffVersionId: string;
  tariffName: string;
  calculationSteps: BillCalculationStep[];
  itemizedCharges: {
    fixedCharges: number;
    energyCharges: number;
    fuelAdjustmentCharges: number;
    regulatorySurcharges: number;
    taxesAndDuties: number;
    subsidiesDeductions: number;
    arrears: number;
    adjustments: number;
    roundingPaiseAdjustment: number;
  };
  totalPayableAmount: number;
  reportedProviderTotal: number;
  paymentStatus: 'unpaid' | 'payment_pending' | 'partially_paid' | 'paid' | 'overdue';
  anomalies: BillAnomaly[];
  dataProvenance: 'REAL/HISTORICAL' | 'SIMULATED' | 'UNVERIFIED';
}

export type PaymentState =
  | 'initiated'
  | 'pending'
  | 'debit_confirmed'
  | 'credit_reconciled'
  | 'failed'
  | 'reversed';

export interface PaymentEvent {
  id: string;
  timestamp: string;
  fromState: PaymentState | 'none';
  toState: PaymentState;
  trigger: 'user_action' | 'bank_webhook' | 'utility_gateway' | 'admin_override' | 'timeout';
  note: string;
  actor: string;
}

export interface PaymentTransaction {
  id: string;
  billId: string;
  consumerNumber: string;
  amount: number;
  idempotencyKey: string;
  transactionReference: string;
  bankReferenceNumber?: string;
  utilityReceiptNumber?: string;
  paymentMethod: 'UPI' | 'NetBanking' | 'DebitCard';
  state: PaymentState;
  initiatedAt: string;
  debitConfirmedAt?: string;
  creditReconciledAt?: string;
  failedAt?: string;
  failureReason?: string;
  eventHistory: PaymentEvent[];
  provenance: 'SIMULATED – NO MONEY MOVES';
}

export type OutageCategory =
  | 'power_outage'
  | 'low_voltage'
  | 'water_interruption'
  | 'low_pressure'
  | 'suspected_leak'
  | 'irregular_supply';

export interface ServiceReport {
  id: string;
  utility: UtilityType;
  category: OutageCategory;
  locality: string;
  city: string;
  feederOrZoneId: string;
  timestamp: string;
  description: string;
  reporterUserId: string;
  reporterMaskedName: string;
  status: 'reported_raw' | 'grouped_in_incident';
  incidentId?: string;
  provenance: 'SIMULATED' | 'REAL/HISTORICAL';
}

export type IncidentStatus =
  | 'reported_unverified'
  | 'under_investigation'
  | 'verified_fault'
  | 'planned_maintenance'
  | 'restoration_in_progress'
  | 'service_restored'
  | 'closed';

export interface Incident {
  id: string;
  incidentNumber: string;
  utility: UtilityType;
  title: string;
  locality: string;
  city: string;
  feederOrZone: string;
  status: IncidentStatus;
  verificationSource: 'none' | 'admin_manual' | 'discom_scada_verified' | 'municipal_bulletin';
  reportedCount: number;
  firstReportedAt: string;
  lastUpdatedAt: string;
  estimatedRestorationTime: string | null;
  etaSource: string | null;
  officialRestorationNotes: string | null;
  associatedReportIds: string[];
  provenance: 'SIMULATED' | 'REAL/HISTORICAL';
}

export type ComplaintCategory =
  | 'billing'
  | 'meter_reading'
  | 'payment_reconciliation'
  | 'power_quality'
  | 'water_contamination_or_pressure'
  | 'general_service';

export type ComplaintStatus =
  | 'submitted'
  | 'acknowledged'
  | 'under_review'
  | 'escalated'
  | 'resolved'
  | 'closed';

export interface ComplaintEvent {
  timestamp: string;
  action: string;
  actor: string;
  notes: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  userId: string;
  userRole: UserRole;
  propertyId: string;
  utility: UtilityType;
  category: ComplaintCategory;
  billReference?: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  assignedDesk: string;
  priority: 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  timeline: ComplaintEvent[];
  provenance: 'SIMULATED';
}

export interface PriorityAssistanceRegistration {
  id: string;
  userId: string;
  propertyId: string;
  residentCategory: 'life_support_equipment' | 'elderly_dependent' | 'infant_care' | 'critical_refrigeration';
  medicalEquipmentTypeMasked: string;
  consentGiven: boolean;
  consentTimestamp: string;
  consentVersion: string;
  withdrawalTimestamp?: string;
  maskedEmergencyContact: string;
  accessAuditedByRoleOnly: boolean;
}

export interface DatasetSourceRegistryItem {
  id: string;
  name: string;
  publisher: string;
  directUrl: string;
  license: string;
  geography: string;
  units: string;
  timePeriodCoverage: string;
  lastUpdateDate: string;
  lastRefreshStatus: 'active_verified' | 'cached_historical' | 'offline_fallback';
  sourceClassification: 'official_live' | 'official_historical' | 'public_third_party' | 'synthetic_demo' | 'manual';
  limitations: string;
  verifiedNotes: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
}

export interface TestResult {
  id: number;
  name: string;
  category: 'Billing' | 'Payment' | 'Incident' | 'Security' | 'Complaints' | 'Sustainability';
  passed: boolean;
  expected: string;
  actual: string;
  details: string;
}

/**
 * Utility Saathi - Realistic Seed Fixtures & Data Grounding
 * Grounded in Indian urban utility ecosystems (Bengaluru BESCOM & BWSSB, Delhi BSES)
 */

import {
  User,
  Property,
  Bill,
  PaymentTransaction,
  ServiceReport,
  Incident,
  Complaint,
  PriorityAssistanceRegistration,
  DatasetSourceRegistryItem
} from '../types';
import { reconstructBill, checkHistoricalConsumptionAnomaly } from '../services/tariffEngine';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-tenant-1',
    name: 'Rohan Verma',
    email: 'rohan.verma@example.in',
    phone: '+91 98765 43210',
    role: 'tenant',
    propertyIds: ['prop-indiranagar'],
    flatUnit: 'Flat 201',
    isDemoUser: true
  },
  {
    id: 'user-owner-1',
    name: 'Anita Desai',
    email: 'anita.desai@example.in',
    phone: '+91 98450 11223',
    role: 'owner',
    propertyIds: ['prop-indiranagar', 'prop-whitefield'],
    isDemoUser: true
  },
  {
    id: 'user-admin-1',
    name: 'Er. Vikram Singh',
    email: 'vikram.singh@bescom.gov.in',
    phone: '+91 94480 99887',
    role: 'admin',
    propertyIds: ['prop-indiranagar', 'prop-whitefield', 'prop-koramangala'],
    isDemoUser: true
  },
  {
    id: 'user-tenant-2',
    name: 'Priya Nair',
    email: 'priya.nair@example.in',
    phone: '+91 97401 55667',
    role: 'tenant',
    propertyIds: ['prop-koramangala'],
    flatUnit: 'Studio 4B',
    isDemoUser: true
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-indiranagar',
    name: 'Maple Heights, Flat 201',
    address: '14/2, 100 Feet Road, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    locality: 'Indiranagar',
    electricityDiscom: 'BESCOM (Bengaluru Electricity Supply Co.)',
    waterBoard: 'BWSSB (Bangalore Water Supply & Sewerage Board)',
    ownerId: 'user-owner-1',
    tenantIds: ['user-tenant-1'],
    electricityConsumerNo: '08234-EL-9901',
    waterConsumerNo: '08234-WT-7712',
    feederIdentifier: 'F-INDIRA-04-TR2',
    waterZoneIdentifier: 'WZ-EAST-INDIRA-02',
    sanctionedLoadKw: 3.0
  },
  {
    id: 'prop-whitefield',
    name: 'Palm Meadows Villa 14',
    address: 'Plot 14, Phase 2, Palm Meadows, Ramagondanahalli, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    locality: 'Whitefield',
    electricityDiscom: 'BESCOM (Whitefield Sub-division)',
    waterBoard: 'BWSSB (East Zone)',
    ownerId: 'user-owner-1',
    tenantIds: [],
    electricityConsumerNo: '08234-EL-4402',
    waterConsumerNo: '08234-WT-8890',
    feederIdentifier: 'F-WHITE-02-TR1',
    waterZoneIdentifier: 'WZ-WHITE-01',
    sanctionedLoadKw: 6.0
  },
  {
    id: 'prop-koramangala',
    name: 'Greenwoods Studio 4B',
    address: '77, 8th Main, 4th Block, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560095',
    locality: 'Koramangala',
    electricityDiscom: 'BESCOM (Koramangala Division)',
    waterBoard: 'BWSSB (South Zone)',
    ownerId: 'user-owner-1', // owned by anita, rented by priya
    tenantIds: ['user-tenant-2'],
    electricityConsumerNo: '08234-EL-5591',
    waterConsumerNo: '08234-WT-9921',
    feederIdentifier: 'F-KORA-01-TR3',
    waterZoneIdentifier: 'WZ-SOUTH-KORA-03',
    sanctionedLoadKw: 2.0
  }
];

// Helper to build a complete reconstructed bill
function createSyntheticBill(params: {
  id: string;
  billNumber: string;
  utility: 'electricity' | 'water';
  propertyId: string;
  propertyName: string;
  consumerNumber: string;
  startDate: string;
  endDate: string;
  dueDate: string;
  prevReading: number;
  currReading: number;
  readingType: 'actual' | 'estimated';
  sanctionedKw: number;
  tariffId: string;
  historicalUnits?: number[];
  reportedTotalOverride?: number;
  arrears?: number;
  adjustments?: number;
  applySubsidy?: boolean;
  paymentStatus?: Bill['paymentStatus'];
  provenance?: Bill['dataProvenance'];
}): Bill {
  const diffDays = Math.max(
    1,
    Math.round(
      (new Date(params.endDate).getTime() - new Date(params.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const recon = reconstructBill({
    utility: params.utility,
    tariffVersionId: params.tariffId,
    previousReading: params.prevReading,
    currentReading: params.currReading,
    readingType: params.readingType,
    billingDays: diffDays,
    sanctionedLoadKw: params.sanctionedKw,
    arrears: params.arrears || 0,
    adjustments: params.adjustments || 0,
    applySubsidy: params.applySubsidy,
    manualOverrideReportedTotal: params.reportedTotalOverride
  });

  // Check historical consumption surge
  let combinedAnomalies = [...recon.anomalies];
  if (params.historicalUnits && params.historicalUnits.length > 0) {
    const histAnoms = checkHistoricalConsumptionAnomaly(
      recon.unitsConsumed,
      params.historicalUnits,
      'actual',
      params.readingType
    );
    combinedAnomalies = [...combinedAnomalies, ...histAnoms];
  }

  const reportedTotal =
    params.reportedTotalOverride !== undefined ? params.reportedTotalOverride : recon.totalPayableAmount;

  return {
    id: params.id,
    billNumber: params.billNumber,
    utility: params.utility,
    propertyId: params.propertyId,
    propertyName: params.propertyName,
    consumerNumber: params.consumerNumber,
    maskedAccountRef: `•••${params.consumerNumber.slice(-4)}`,
    billingStartDate: params.startDate,
    billingEndDate: params.endDate,
    billingDays: diffDays,
    dueDate: params.dueDate,
    previousReading: params.prevReading,
    currentReading: params.currReading,
    readingType: params.readingType,
    unitsConsumed: recon.unitsConsumed,
    metricUnit: params.utility === 'electricity' ? 'kWh' : 'kL',
    tariffVersionId: params.tariffId,
    tariffName:
      params.tariffId === 'BESCOM_LT2A_FY2425'
        ? 'BESCOM LT-2(a) Domestic FY 2024-25'
        : params.tariffId === 'BWSSB_DOMESTIC_FY2425'
        ? 'BWSSB Domestic Water Tariff 2024'
        : 'BSES Rajdhani Domestic Tariff',
    calculationSteps: recon.calculationSteps,
    itemizedCharges: recon.itemizedCharges,
    totalPayableAmount: recon.totalPayableAmount,
    reportedProviderTotal: reportedTotal,
    paymentStatus: params.paymentStatus || 'unpaid',
    anomalies: combinedAnomalies,
    dataProvenance: params.provenance || 'SIMULATED'
  };
}

export const INITIAL_BILLS: Bill[] = [
  // 1. Normal Electricity Bill (Indiranagar, Oct 2024)
  createSyntheticBill({
    id: 'bill-ind-elec-oct24',
    billNumber: 'BL-KA-2024-88912',
    utility: 'electricity',
    propertyId: 'prop-indiranagar',
    propertyName: 'Maple Heights, Flat 201',
    consumerNumber: '08234-EL-9901',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    dueDate: '2024-11-15',
    prevReading: 4120,
    currReading: 4295, // 175 kWh
    readingType: 'actual',
    sanctionedKw: 3,
    tariffId: 'BESCOM_LT2A_FY2425',
    historicalUnits: [165, 170, 180],
    paymentStatus: 'paid',
    provenance: 'REAL/HISTORICAL'
  }),

  // 2. Normal Water Bill (Indiranagar, Oct 2024)
  createSyntheticBill({
    id: 'bill-ind-water-oct24',
    billNumber: 'WT-BW-2024-44102',
    utility: 'water',
    propertyId: 'prop-indiranagar',
    propertyName: 'Maple Heights, Flat 201',
    consumerNumber: '08234-WT-7712',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    dueDate: '2024-11-20',
    prevReading: 120,
    currReading: 136, // 16 kL
    readingType: 'actual',
    sanctionedKw: 1,
    tariffId: 'BWSSB_DOMESTIC_FY2425',
    historicalUnits: [15, 17, 16],
    paymentStatus: 'paid',
    provenance: 'REAL/HISTORICAL'
  }),

  // 3. Estimated-to-Actual Catch-up Bill (Indiranagar, Nov 2024)
  // Has pending payment state with debit confirmed but utility credit pending!
  createSyntheticBill({
    id: 'bill-ind-elec-nov24-catchup',
    billNumber: 'BL-KA-2024-91024',
    utility: 'electricity',
    propertyId: 'prop-indiranagar',
    propertyName: 'Maple Heights, Flat 201',
    consumerNumber: '08234-EL-9901',
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    dueDate: '2024-12-15',
    prevReading: 4295,
    currReading: 4585, // 290 kWh (Prior estimated was only 80, so accumulated surge)
    readingType: 'actual',
    sanctionedKw: 3,
    tariffId: 'BESCOM_LT2A_FY2425',
    historicalUnits: [170, 175],
    paymentStatus: 'payment_pending',
    provenance: 'SIMULATED'
  }),

  // 4. Consumption Surge without Unsupported Accusation (Whitefield, Oct 2024)
  createSyntheticBill({
    id: 'bill-white-elec-oct24-surge',
    billNumber: 'BL-KA-2024-77219',
    utility: 'electricity',
    propertyId: 'prop-whitefield',
    propertyName: 'Palm Meadows Villa 14',
    consumerNumber: '08234-EL-4402',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    dueDate: '2024-11-18',
    prevReading: 12400,
    currReading: 13080, // 680 kWh (+88% surge)
    readingType: 'actual',
    sanctionedKw: 6,
    tariffId: 'BESCOM_LT2A_FY2425',
    historicalUnits: [350, 360, 370],
    paymentStatus: 'unpaid',
    provenance: 'SIMULATED'
  }),

  // 5. Tariff Slab Boundary Crossing (Koramangala, Sep 2024 - 104 kWh)
  createSyntheticBill({
    id: 'bill-kora-elec-sep24-boundary',
    billNumber: 'BL-KA-2024-55104',
    utility: 'electricity',
    propertyId: 'prop-koramangala',
    propertyName: 'Greenwoods Studio 4B',
    consumerNumber: '08234-EL-5591',
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    dueDate: '2024-10-15',
    prevReading: 1820,
    currReading: 1924, // 104 kWh (just crossed 100 kWh slab boundary)
    readingType: 'actual',
    sanctionedKw: 2,
    tariffId: 'BESCOM_LT2A_FY2425',
    historicalUnits: [85, 90, 92],
    paymentStatus: 'paid',
    provenance: 'SIMULATED'
  }),

  // 6. Arithmetic Mismatch Bill (Discom software discrepancy)
  createSyntheticBill({
    id: 'bill-arith-error-seeded',
    billNumber: 'BL-KA-2024-ERR88',
    utility: 'electricity',
    propertyId: 'prop-whitefield',
    propertyName: 'Palm Meadows Villa 14',
    consumerNumber: '08234-EL-4402',
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    dueDate: '2024-10-20',
    prevReading: 12100,
    currReading: 12400, // 300 kWh
    readingType: 'actual',
    sanctionedKw: 6,
    tariffId: 'BESCOM_LT2A_FY2425',
    reportedTotalOverride: 3450, // Reconstructed is ~₹2,848, discrepancy of ₹602!
    paymentStatus: 'overdue',
    provenance: 'SIMULATED'
  }),

  // 7. Reading Decrease / Rollover Hypothesis Bill
  createSyntheticBill({
    id: 'bill-rollover-decrease',
    billNumber: 'BL-KA-2024-ROLL01',
    utility: 'electricity',
    propertyId: 'prop-indiranagar',
    propertyName: 'Maple Heights, Flat 201',
    consumerNumber: '08234-EL-9901',
    startDate: '2024-08-01',
    endDate: '2024-08-31',
    dueDate: '2024-09-15',
    prevReading: 99880,
    currReading: 45, // Dropped to 00045 -> Rollover hypothesis calculated as 165 kWh
    readingType: 'actual',
    sanctionedKw: 3,
    tariffId: 'BESCOM_LT2A_FY2425',
    paymentStatus: 'paid',
    provenance: 'SIMULATED'
  }),

  // 8. Unusual Billing Period Length (43 days)
  createSyntheticBill({
    id: 'bill-unusual-days',
    billNumber: 'BL-KA-2024-DAYS43',
    utility: 'water',
    propertyId: 'prop-whitefield',
    propertyName: 'Palm Meadows Villa 14',
    consumerNumber: '08234-WT-8890',
    startDate: '2024-08-15',
    endDate: '2024-09-27', // 43 days
    dueDate: '2024-10-15',
    prevReading: 410,
    currReading: 442,
    readingType: 'actual',
    sanctionedKw: 1,
    tariffId: 'BWSSB_DOMESTIC_FY2425',
    paymentStatus: 'paid',
    provenance: 'SIMULATED'
  }),

  // 9. Delhi Lifeline Subsidy Bill (100% free energy charges below 200 units)
  createSyntheticBill({
    id: 'bill-delhi-lifeline',
    billNumber: 'BL-DL-2024-33100',
    utility: 'electricity',
    propertyId: 'prop-koramangala', // demo cross-tariff
    propertyName: 'Greenwoods Studio 4B',
    consumerNumber: '08234-EL-5591',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    dueDate: '2024-11-15',
    prevReading: 1924,
    currReading: 2064, // 140 kWh
    readingType: 'actual',
    sanctionedKw: 2,
    tariffId: 'BSES_DOMESTIC_FY2425',
    applySubsidy: true,
    paymentStatus: 'paid',
    provenance: 'SIMULATED'
  }),

  // 10. Water Bill (Whitefield, Nov 2024)
  createSyntheticBill({
    id: 'bill-white-water-nov24',
    billNumber: 'WT-BW-2024-55190',
    utility: 'water',
    propertyId: 'prop-whitefield',
    propertyName: 'Palm Meadows Villa 14',
    consumerNumber: '08234-WT-8890',
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    dueDate: '2024-12-20',
    prevReading: 442,
    currReading: 474, // 32 kL
    readingType: 'actual',
    sanctionedKw: 1,
    tariffId: 'BWSSB_DOMESTIC_FY2425',
    paymentStatus: 'unpaid',
    provenance: 'SIMULATED'
  })
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  // Debit Confirmed but Utility Credit Pending -> Demonstrates DUPLICATE BLOCKING!
  {
    id: 'TXN-91024-001',
    billId: 'bill-ind-elec-nov24-catchup',
    consumerNumber: '08234-EL-9901',
    amount: 2270.0,
    idempotencyKey: 'idemp-catchup-user1-attempt1',
    transactionReference: 'REF-TXN-91024-001',
    bankReferenceNumber: 'HDFC-UPI-982310129381',
    paymentMethod: 'UPI',
    state: 'debit_confirmed',
    initiatedAt: '2024-11-28T10:14:00Z',
    debitConfirmedAt: '2024-11-28T10:14:22Z',
    eventHistory: [
      {
        id: 'evt-101',
        timestamp: '2024-11-28T10:14:00Z',
        fromState: 'none',
        toState: 'initiated',
        trigger: 'user_action',
        note: 'Payment session created via UPI (HDFC Bank)',
        actor: 'Rohan Verma (Tenant)'
      },
      {
        id: 'evt-102',
        timestamp: '2024-11-28T10:14:05Z',
        fromState: 'initiated',
        toState: 'pending',
        trigger: 'bank_webhook',
        note: 'UPI collect request accepted by user UPI app',
        actor: 'NPCI UPI Switch'
      },
      {
        id: 'evt-103',
        timestamp: '2024-11-28T10:14:22Z',
        fromState: 'pending',
        toState: 'debit_confirmed',
        trigger: 'bank_webhook',
        note: 'Bank debit confirmed. Utility settlement batch awaiting T+1 clearance.',
        actor: 'Bank Gateway'
      }
    ],
    provenance: 'SIMULATED – NO MONEY MOVES'
  },
  // Reconciled successful payment
  {
    id: 'TXN-88912-001',
    billId: 'bill-ind-elec-oct24',
    consumerNumber: '08234-EL-9901',
    amount: 1398.0,
    idempotencyKey: 'idemp-oct-user1',
    transactionReference: 'REF-TXN-88912-001',
    bankReferenceNumber: 'ICICI-NET-4491023812',
    utilityReceiptNumber: 'BESCOM-RCPT-2024-77192',
    paymentMethod: 'NetBanking',
    state: 'credit_reconciled',
    initiatedAt: '2024-11-04T14:20:00Z',
    debitConfirmedAt: '2024-11-04T14:21:05Z',
    creditReconciledAt: '2024-11-04T15:00:10Z',
    eventHistory: [
      {
        id: 'evt-201',
        timestamp: '2024-11-04T14:20:00Z',
        fromState: 'none',
        toState: 'initiated',
        trigger: 'user_action',
        note: 'Netbanking payment initiated',
        actor: 'Rohan Verma'
      },
      {
        id: 'evt-202',
        timestamp: '2024-11-04T14:21:05Z',
        fromState: 'initiated',
        toState: 'debit_confirmed',
        trigger: 'bank_webhook',
        note: 'Debit successful',
        actor: 'ICICI Payment Gateway'
      },
      {
        id: 'evt-203',
        timestamp: '2024-11-04T15:00:10Z',
        fromState: 'debit_confirmed',
        toState: 'credit_reconciled',
        trigger: 'utility_gateway',
        note: 'Utility credit acknowledged and receipt generated',
        actor: 'BESCOM Billing Server'
      }
    ],
    provenance: 'SIMULATED – NO MONEY MOVES'
  },
  // Failed transaction demonstrating safe retry eligibility
  {
    id: 'TXN-FAILED-001',
    billId: 'bill-white-water-nov24',
    consumerNumber: '08234-WT-8890',
    amount: 512.0,
    idempotencyKey: 'idemp-fail-white-water',
    transactionReference: 'REF-TXN-FAILED-001',
    paymentMethod: 'UPI',
    state: 'failed',
    initiatedAt: '2024-11-25T08:30:00Z',
    failedAt: '2024-11-25T08:35:12Z',
    failureReason: 'Bank timeout: User cancelled approval prompt on phone.',
    eventHistory: [
      {
        id: 'evt-301',
        timestamp: '2024-11-25T08:30:00Z',
        fromState: 'none',
        toState: 'initiated',
        trigger: 'user_action',
        note: 'UPI intent launched',
        actor: 'Anita Desai'
      },
      {
        id: 'evt-302',
        timestamp: '2024-11-25T08:35:12Z',
        fromState: 'initiated',
        toState: 'failed',
        trigger: 'timeout',
        note: 'Transaction timed out without bank debit. Bill released for safe retry.',
        actor: 'Gateway Sentinel'
      }
    ],
    provenance: 'SIMULATED – NO MONEY MOVES'
  }
];

export const INITIAL_SERVICE_REPORTS: ServiceReport[] = [
  {
    id: 'REP-101',
    utility: 'electricity',
    category: 'power_outage',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    feederOrZoneId: 'F-INDIRA-04-TR2',
    timestamp: '2024-11-29T14:10:00Z',
    description: 'Sudden total blackout in 100ft road sector 2. Streetlights also off.',
    reporterUserId: 'user-tenant-1',
    reporterMaskedName: 'Rohan V.',
    status: 'grouped_in_incident',
    incidentId: 'INC-ELE-1042',
    provenance: 'SIMULATED'
  },
  {
    id: 'REP-102',
    utility: 'electricity',
    category: 'power_outage',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    feederOrZoneId: 'F-INDIRA-04-TR2',
    timestamp: '2024-11-29T14:18:00Z',
    description: 'No power on 12th Main Road, entire apartment building on backup gen.',
    reporterUserId: 'user-owner-1',
    reporterMaskedName: 'Anita D.',
    status: 'grouped_in_incident',
    incidentId: 'INC-ELE-1042',
    provenance: 'SIMULATED'
  },
  {
    id: 'REP-103',
    utility: 'water',
    category: 'low_pressure',
    locality: 'Whitefield',
    city: 'Bengaluru',
    feederOrZoneId: 'WZ-WHITE-01',
    timestamp: '2024-11-29T07:30:00Z',
    description: 'Very weak water flow from municipal line during morning supply hour.',
    reporterUserId: 'user-owner-1',
    reporterMaskedName: 'Anita D.',
    status: 'grouped_in_incident',
    incidentId: 'INC-WAT-2019',
    provenance: 'SIMULATED'
  },
  // Unrelated report (Water leak in Indiranagar - does NOT group with power outage!)
  {
    id: 'REP-104',
    utility: 'water',
    category: 'suspected_leak',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    feederOrZoneId: 'WZ-EAST-INDIRA-02',
    timestamp: '2024-11-29T15:00:00Z',
    description: 'Clean water pooling near corner stormwater drain on 100ft road.',
    reporterUserId: 'user-tenant-1',
    reporterMaskedName: 'Rohan V.',
    status: 'grouped_in_incident',
    incidentId: 'INC-WAT-3055',
    provenance: 'SIMULATED'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-ELE-1042',
    incidentNumber: 'INC-ELE-1042',
    utility: 'electricity',
    title: 'Feeder Trip: Indiranagar 100ft Rd Sector 2',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    feederOrZone: 'F-INDIRA-04-TR2',
    status: 'under_investigation',
    verificationSource: 'admin_manual',
    reportedCount: 2,
    firstReportedAt: '2024-11-29T14:10:00Z',
    lastUpdatedAt: '2024-11-29T14:45:00Z',
    estimatedRestorationTime: '2024-11-29T17:30:00Z',
    etaSource: 'BESCOM Sub-division Field Line Team (Illustrative)',
    officialRestorationNotes: '11kV feeder breaker trip logged at Indiranagar sub-station. Line patrol dispatched to locate tree branch interference.',
    associatedReportIds: ['REP-101', 'REP-102'],
    provenance: 'SIMULATED'
  },
  {
    id: 'INC-WAT-2019',
    incidentNumber: 'INC-WAT-2019',
    utility: 'water',
    title: 'BWSSB Pumping Main Low Pressure - Whitefield Zone 1',
    locality: 'Whitefield',
    city: 'Bengaluru',
    feederOrZone: 'WZ-WHITE-01',
    status: 'verified_fault',
    verificationSource: 'municipal_bulletin',
    reportedCount: 5,
    firstReportedAt: '2024-11-29T06:00:00Z',
    lastUpdatedAt: '2024-11-29T09:15:00Z',
    estimatedRestorationTime: '2024-11-29T20:00:00Z',
    etaSource: 'BWSSB Official Control Room Bulletin',
    officialRestorationNotes: 'Valve maintenance underway on 600mm DI transmission line near ITPL main road. Pumping pressure will normalize by 8:00 PM.',
    associatedReportIds: ['REP-103'],
    provenance: 'SIMULATED'
  },
  {
    id: 'INC-WAT-3055',
    incidentNumber: 'INC-WAT-3055',
    utility: 'water',
    title: 'Suspected Distribution Pipe Leak in Indiranagar',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    feederOrZone: 'WZ-EAST-INDIRA-02',
    status: 'reported_unverified',
    verificationSource: 'none',
    reportedCount: 1,
    firstReportedAt: '2024-11-29T15:00:00Z',
    lastUpdatedAt: '2024-11-29T15:00:00Z',
    estimatedRestorationTime: null,
    etaSource: null,
    officialRestorationNotes: 'Citizen report registered; unverified pending sanitary inspector inspection.',
    associatedReportIds: ['REP-104'],
    provenance: 'SIMULATED'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-001',
    complaintNumber: 'CMP-2024-0981',
    userId: 'user-tenant-1',
    userRole: 'tenant',
    propertyId: 'prop-indiranagar',
    utility: 'electricity',
    category: 'billing',
    billReference: 'BL-KA-2024-91024',
    subject: 'Catch-up surge after consecutive estimated readings',
    description: 'Prior two bills were marked estimated, causing 290 units to be billed in single cycle which pushed into higher slab.',
    status: 'under_review',
    assignedDesk: 'BESCOM Sub-Divisional Revenue Officer',
    priority: 'normal',
    createdAt: '2024-11-28T11:00:00Z',
    updatedAt: '2024-11-28T16:30:00Z',
    timeline: [
      {
        timestamp: '2024-11-28T11:00:00Z',
        action: 'Complaint Registered',
        actor: 'Rohan Verma (Tenant)',
        notes: 'Submitted with attached bill reference BL-KA-2024-91024'
      },
      {
        timestamp: '2024-11-28T11:15:00Z',
        action: 'System Acknowledged',
        actor: 'Utility Saathi Gateway',
        notes: 'Ticket assigned to Indiranagar Sub-division billing desk'
      },
      {
        timestamp: '2024-11-28T16:30:00Z',
        action: 'Desk Review Initiated',
        actor: 'Revenue Officer Desk',
        notes: 'Requesting historical meter reading logs from field contractor.'
      }
    ],
    provenance: 'SIMULATED'
  },
  {
    id: 'cmp-002',
    complaintNumber: 'CMP-2024-0412',
    userId: 'user-owner-1',
    userRole: 'owner',
    propertyId: 'prop-whitefield',
    utility: 'electricity',
    category: 'power_quality',
    subject: 'Severe voltage fluctuation in evening (170V - 255V)',
    description: 'Inverter trips repeatedly between 7 PM and 10 PM. Refrigeration compressor stalling.',
    status: 'escalated',
    assignedDesk: 'Distribution Transformer Operations Desk',
    priority: 'high',
    createdAt: '2024-11-20T19:40:00Z',
    updatedAt: '2024-11-22T10:00:00Z',
    timeline: [
      {
        timestamp: '2024-11-20T19:40:00Z',
        action: 'Complaint Filed',
        actor: 'Anita Desai',
        notes: 'Recorded voltage readings via smart multimeter'
      },
      {
        timestamp: '2024-11-22T10:00:00Z',
        action: 'Escalated to Operations',
        actor: 'Vikram Singh (Admin)',
        notes: 'Phase unbalance detected on transformer TR1. Tap changer inspection scheduled.'
      }
    ],
    provenance: 'SIMULATED'
  }
];

export const INITIAL_PRIORITY_ASSISTANCE: PriorityAssistanceRegistration[] = [
  {
    id: 'pa-001',
    userId: 'user-tenant-1',
    propertyId: 'prop-indiranagar',
    residentCategory: 'life_support_equipment',
    medicalEquipmentTypeMasked: 'Continuous Home Oxygen Concentrator (Philips EverFlo 5LPM)',
    consentGiven: true,
    consentTimestamp: '2024-10-10T09:12:00Z',
    consentVersion: 'DPDP-2023-CONSENT-V1',
    maskedEmergencyContact: '+91 98450 ••••• (Dr. S. Kulkarni)',
    accessAuditedByRoleOnly: true
  }
];

export const DATASET_REGISTRY: DatasetSourceRegistryItem[] = [
  {
    id: 'ds-cea-co2',
    name: 'CO2 Baseline Database for Indian Power Sector (Ver 19.0)',
    publisher: 'Central Electricity Authority (CEA), Ministry of Power, Govt of India',
    directUrl: 'https://cea.nic.in/cdm-co2-baseline-database/?lang=en',
    license: 'National Open Government Data License (India)',
    geography: 'National Grid (India Weighted Average)',
    units: '0.716 tCO2/MWh (0.716 kg CO2/kWh)',
    timePeriodCoverage: 'Published Dec 2023 (FY 2022-23 Generation Mix)',
    lastUpdateDate: '2023-12-15',
    lastRefreshStatus: 'active_verified',
    sourceClassification: 'official_historical',
    limitations: 'Calculates national grid average; regional rooftop solar offsets vary by state solar feed-in tariff.',
    verifiedNotes: 'Authoritative factor used across Indian regulatory bodies for avoided carbon emissions calculations.'
  },
  {
    id: 'ds-kerc-tariff',
    name: 'KERC Retail Electricity Tariff Schedule FY 2024-25',
    publisher: 'Karnataka Electricity Regulatory Commission (KERC) & BESCOM',
    directUrl: 'https://kerc.karnataka.gov.in/tariff_orders',
    license: 'Statutory Gazette Publication',
    geography: 'BESCOM Jurisdiction (Bengaluru Urban & Rural, Tumkur, Kolar)',
    units: '₹ per kW fixed + ₹ per kWh energy',
    timePeriodCoverage: 'May 2024 - Present',
    lastUpdateDate: '2024-05-12',
    lastRefreshStatus: 'active_verified',
    sourceClassification: 'official_live',
    limitations: 'Applies to LT-2(a) domestic category only; commercial LT-3 and HT industrial have distinct schedules.',
    verifiedNotes: 'Slabs: 0-100 kWh @ ₹4.75, >100 kWh @ ₹7.00; Fixed charge ₹110/kW; Electricity Duty 9%.'
  },
  {
    id: 'ds-derc-tariff',
    name: 'DERC Domestic Tariff Order 2024',
    publisher: 'Delhi Electricity Regulatory Commission',
    directUrl: 'http://www.derc.gov.in/',
    license: 'Statutory Gazette Publication',
    geography: 'NCT of Delhi (BSES Rajdhani, BSES Yamuna, TPDDL)',
    units: '₹ per kWh + 8% Surcharge + 7% Pension + 5% Duty',
    timePeriodCoverage: 'FY 2024-25',
    lastUpdateDate: '2024-04-01',
    lastRefreshStatus: 'active_verified',
    sourceClassification: 'official_live',
    limitations: 'Delhi 100% subsidy applies only to domestic consumers with monthly consumption <= 200 units.',
    verifiedNotes: 'Provides comparative multi-jurisdiction benchmark demonstrating system adaptability.'
  },
  {
    id: 'ds-bwssb-water',
    name: 'BWSSB Water & Sewerage Tariff Regulations',
    publisher: 'Bangalore Water Supply and Sewerage Board',
    directUrl: 'https://bwssb.karnataka.gov.in/',
    license: 'Statutory Notification',
    geography: 'Bruhat Bengaluru Mahanagara Palike (BBMP) Limits',
    units: '₹ per kilo-litre (kL / 1,000 Litres)',
    timePeriodCoverage: '2024 Schedule',
    lastUpdateDate: '2024-01-15',
    lastRefreshStatus: 'active_verified',
    sourceClassification: 'official_live',
    limitations: 'Sanitary cess is 25% of water consumption charge; borehole usage has separate flat surcharge.',
    verifiedNotes: 'Slabs: 0-8 kL @ ₹7, 8-25 kL @ ₹11, 25-50 kL @ ₹26, >50 kL @ ₹45.'
  },
  {
    id: 'ds-datagov-power',
    name: 'Per-Capita Domestic Electricity Consumption Benchmarks',
    publisher: 'Ministry of Power via Open Government Data (data.gov.in)',
    directUrl: 'https://www.data.gov.in/resource/state-wise-per-capita-electricity-consumption',
    license: 'Government Open Data License - India (GODL)',
    geography: 'State-wise (Karnataka, Delhi, Tamil Nadu, Maharashtra)',
    units: 'kWh / person / year',
    timePeriodCoverage: 'Annual Series 2022-2024',
    lastUpdateDate: '2024-03-31',
    lastRefreshStatus: 'active_verified',
    sourceClassification: 'official_historical',
    limitations: 'Aggregate state averages do not represent individual apartment variation; used for baseline context only.',
    verifiedNotes: 'Integrated for baseline normalization and comparative household sizing.'
  }
];

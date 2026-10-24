/**
 * Utility Saathi - Transparent Tariff Calculation & Anomaly Detection Engine
 * Grounded in verified Indian DISCOM & Water Board Tariff Schedules
 */

import {
  VersionedTariff,
  BillCalculationStep,
  BillAnomaly,
  UtilityType,
  ReadingType
} from '../types';

export const PUBLISHED_TARIFFS: Record<string, VersionedTariff> = {
  'BESCOM_LT2A_FY2425': {
    id: 'BESCOM_LT2A_FY2425',
    utility: 'electricity',
    jurisdiction: 'Bengaluru (BESCOM)',
    version: 'FY 2024-25 (KERC Tariff Order May 2024)',
    effectiveFrom: '2024-05-01',
    effectiveTo: null,
    currency: 'INR',
    fixedChargePerKwPerMonth: 110.0, // ₹110/kW/month
    slabs: [
      { minUnits: 0, maxUnits: 100, ratePerUnit: 4.75, label: '0 to 100 kWh (Lifeline)' },
      { minUnits: 100, maxUnits: null, ratePerUnit: 7.00, label: 'Above 100 kWh (Standard)' }
    ],
    fuelAdjustmentPerUnit: 0.35, // FAC ₹0.35/kWh
    regulatorySurchargePct: 0.0,
    taxPct: 9.0, // Karnataka Electricity Tax 9% on energy charges
    subsidies: [
      {
        name: 'Gruha Jyothi Scheme (Karnataka Govt)',
        description: 'Zero electricity bill for eligible domestic consumers up to 200 kWh monthly average limit',
        eligibleMaxUnits: 200,
        discountType: 'percentage',
        discountValue: 0 // applied conditionally based on beneficiary enrollment
      }
    ],
    sourceDocName: 'Karnataka Electricity Regulatory Commission (KERC) Tariff Order FY 24-25',
    sourceUrl: 'https://kerc.karnataka.gov.in/tariff_orders',
    isOfficialPublished: true
  },
  'BESCOM_LT2A_FY2324_V1': {
    id: 'BESCOM_LT2A_FY2324_V1',
    utility: 'electricity',
    jurisdiction: 'Bengaluru (BESCOM)',
    version: 'FY 2023-24 Historical (KERC Order June 2023)',
    effectiveFrom: '2023-06-01',
    effectiveTo: '2024-04-30',
    currency: 'INR',
    fixedChargePerKwPerMonth: 100.0,
    slabs: [
      { minUnits: 0, maxUnits: 100, ratePerUnit: 4.50, label: '0 to 100 kWh' },
      { minUnits: 100, maxUnits: null, ratePerUnit: 6.50, label: 'Above 100 kWh' }
    ],
    fuelAdjustmentPerUnit: 0.28,
    regulatorySurchargePct: 0.0,
    taxPct: 9.0,
    subsidies: [],
    sourceDocName: 'KERC Tariff Schedule FY23-24',
    sourceUrl: 'https://kerc.karnataka.gov.in/tariff_orders',
    isOfficialPublished: true
  },
  'BSES_DOMESTIC_FY2425': {
    id: 'BSES_DOMESTIC_FY2425',
    utility: 'electricity',
    jurisdiction: 'Delhi (BSES Rajdhani)',
    version: 'DERC Tariff Order FY 2024-25',
    effectiveFrom: '2024-04-01',
    effectiveTo: null,
    currency: 'INR',
    fixedChargePerKwPerMonth: 40.0,
    slabs: [
      { minUnits: 0, maxUnits: 200, ratePerUnit: 3.00, label: '0 to 200 kWh' },
      { minUnits: 200, maxUnits: 400, ratePerUnit: 4.50, label: '201 to 400 kWh' },
      { minUnits: 400, maxUnits: null, ratePerUnit: 6.50, label: 'Above 400 kWh' }
    ],
    fuelAdjustmentPerUnit: 0.0,
    regulatorySurchargePct: 15.0, // 8% Reg Surcharge + 7% Pension Trust
    taxPct: 5.0, // Delhi Electricity Tax
    subsidies: [
      {
        name: 'Delhi Govt Lifeline Electricity Subsidy',
        description: '100% subsidy on energy charges for consumption <= 200 units',
        eligibleMaxUnits: 200,
        discountType: 'percentage',
        discountValue: 100
      }
    ],
    sourceDocName: 'Delhi Electricity Regulatory Commission (DERC) Domestic Tariff',
    sourceUrl: 'http://www.derc.gov.in/tariffs',
    isOfficialPublished: true
  },
  'BWSSB_DOMESTIC_FY2425': {
    id: 'BWSSB_DOMESTIC_FY2425',
    utility: 'water',
    jurisdiction: 'Bengaluru (BWSSB)',
    version: 'BWSSB Water & Sanitary Tariff Regulations 2024',
    effectiveFrom: '2024-01-01',
    effectiveTo: null,
    currency: 'INR',
    fixedChargePerKwPerMonth: 50.0, // Minimum meter service charge per month
    slabs: [
      { minUnits: 0, maxUnits: 8, ratePerUnit: 7.00, label: '0 to 8 kL (Basic)' },
      { minUnits: 8, maxUnits: 25, ratePerUnit: 11.00, label: '8 to 25 kL (Standard)' },
      { minUnits: 25, maxUnits: 50, ratePerUnit: 26.00, label: '25 to 50 kL (Higher Domestic)' },
      { minUnits: 50, maxUnits: null, ratePerUnit: 45.00, label: 'Above 50 kL (Commercial/Luxury)' }
    ],
    fuelAdjustmentPerUnit: 0.0,
    regulatorySurchargePct: 0.0,
    taxPct: 0.0,
    sanitaryChargePct: 25.0, // 25% of water consumption charge for sewerage network
    subsidies: [],
    sourceDocName: 'Bangalore Water Supply and Sewerage Board Gazette Notification',
    sourceUrl: 'https://bwssb.karnataka.gov.in/tariff',
    isOfficialPublished: true
  }
};

export interface BillReconstructionInput {
  utility: UtilityType;
  tariffVersionId: string;
  previousReading: number;
  currentReading: number;
  readingType: ReadingType;
  billingDays: number;
  sanctionedLoadKw: number;
  meterDialCapacity?: number; // default 100000 (5 dials)
  arrears?: number;
  adjustments?: number;
  applySubsidy?: boolean;
  manualOverrideReportedTotal?: number;
}

export interface BillReconstructionResult {
  unitsConsumed: number;
  isRolloverHypothesis: boolean;
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
  anomalies: BillAnomaly[];
}

export function reconstructBill(input: BillReconstructionInput): BillReconstructionResult {
  const tariff = PUBLISHED_TARIFFS[input.tariffVersionId] || PUBLISHED_TARIFFS['BESCOM_LT2A_FY2425'];
  const steps: BillCalculationStep[] = [];
  const anomalies: BillAnomaly[] = [];

  let unitsConsumed = 0;
  let isRolloverHypothesis = false;
  const dialCap = input.meterDialCapacity || 100000;

  // 1. Reading Continuity Check
  if (input.currentReading < input.previousReading) {
    const rawDiff = input.currentReading - input.previousReading;
    // Test if plausibly rolled over near top dial
    if (input.previousReading >= dialCap * 0.90) {
      const rolloverUnits = (dialCap - input.previousReading) + input.currentReading;
      unitsConsumed = rolloverUnits;
      isRolloverHypothesis = true;

      anomalies.push({
        id: `anom-rollover-${Date.now()}`,
        type: 'reading_decrease_rollover',
        title: 'Meter Dial Rollover Hypothesis Detected',
        severity: 'needs_review',
        observedEvidence: `Current reading (${input.currentReading}) is lower than previous reading (${input.previousReading}), but previous reading is close to 5-dial limit (${dialCap}). Potential continuous rollover usage = ${rolloverUnits} units.`,
        plausibleExplanations: [
          'Meter reached mechanical dial limit (99,999) and cycled back through 00,000.',
          'Physical meter was replaced during the billing period with a fresh zero-meter.',
          'Meter reader reversed digits or recorded transcription error at site.'
        ],
        confidenceLimit: 'Medium confidence (requires physical dial inspection or meter replacement job-sheet).',
        safeChecksToPerform: [
          'Verify latest DISCOM meter change order or test report.',
          'Cross-examine physical meter serial number against previous inspection slip.',
          'Confirm whether utility reader took a photo timestamp of the dial.'
        ],
        status: 'flagged'
      });
    } else {
      // Definite decrease anomaly
      unitsConsumed = 0;
      anomalies.push({
        id: `anom-decrease-${Date.now()}`,
        type: 'reading_decrease_rollover',
        title: 'Reading Decrease / Negative Consumption Flagged',
        severity: 'potential_error',
        observedEvidence: `Current reading (${input.currentReading}) is strictly less than previous reading (${input.previousReading}) by ${Math.abs(rawDiff)} units without evidence of rollover.`,
        plausibleExplanations: [
          'Transcription or keying error by the field meter reader.',
          'Mismatched meter serial number inspected by mistake.',
          'Meter replacement installed with lower base reading without updating system record.'
        ],
        confidenceLimit: 'High likelihood of data entry error or unrecorded replacement.',
        safeChecksToPerform: [
          'Inspect physical meter reading and snap geotagged photo.',
          'Request manual meter verification audit from utility sub-division.'
        ],
        status: 'flagged'
      });
    }
  } else {
    unitsConsumed = Math.round((input.currentReading - input.previousReading) * 100) / 100;
  }

  // 2. Billing Period Check
  if (input.billingDays < 25 || input.billingDays > 35) {
    anomalies.push({
      id: `anom-period-${Date.now()}`,
      type: 'unusual_period_length',
      title: 'Unusual Billing Period Length',
      severity: 'advisory',
      observedEvidence: `Billing period spans ${input.billingDays} days (standard cycle is 30 ± 3 days).`,
      plausibleExplanations: [
        'Delayed or rescheduled meter reading cycle due to public holidays or staff rotation.',
        'Mid-cycle tariff revision or account migration split bill.'
      ],
      confidenceLimit: 'High factual observation.',
      safeChecksToPerform: [
        'Check prorated fixed charge calculations for proportional scaling.',
        'Verify slab boundaries were adjusted proportionally if required by tariff regulations.'
      ],
      status: 'flagged'
    });
  }

  // 3. Step 1: Fixed Charges
  const periodMonths = input.billingDays / 30;
  const fixedChargesRaw = input.sanctionedLoadKw * tariff.fixedChargePerKwPerMonth * periodMonths;
  const fixedCharges = Math.round(fixedChargesRaw * 100) / 100;

  steps.push({
    stepNumber: 1,
    description: `Fixed Capacity Charge (${input.sanctionedLoadKw} kW @ ₹${tariff.fixedChargePerKwPerMonth.toFixed(2)}/kW for ${input.billingDays} days)`,
    formula: `${input.sanctionedLoadKw} kW × ₹${tariff.fixedChargePerKwPerMonth} × (${input.billingDays}/30)`,
    subtotal: fixedCharges,
    tariffClauseRef: 'Tariff Clause 4.1 (Fixed Demand)'
  });

  // 4. Step 2: Energy Charges via Telescopic Slabs
  let remainingUnits = unitsConsumed;
  let totalEnergyCharges = 0;
  let slabIndex = 1;

  for (const slab of tariff.slabs) {
    if (remainingUnits <= 0) break;
    const slabSpan = slab.maxUnits !== null ? (slab.maxUnits - slab.minUnits) : remainingUnits;
    const unitsInThisSlab = Math.min(remainingUnits, slabSpan);

    if (unitsInThisSlab > 0) {
      const slabCost = Math.round(unitsInThisSlab * slab.ratePerUnit * 100) / 100;
      totalEnergyCharges += slabCost;

      steps.push({
        stepNumber: steps.length + 1,
        description: `Slab ${slabIndex}: ${slab.label} (${unitsInThisSlab.toFixed(1)} units @ ₹${slab.ratePerUnit.toFixed(2)}/unit)`,
        formula: `${unitsInThisSlab.toFixed(1)} × ₹${slab.ratePerUnit.toFixed(2)}`,
        units: unitsInThisSlab,
        rate: slab.ratePerUnit,
        subtotal: slabCost,
        tariffClauseRef: `Tariff Schedule Slabs`
      });

      remainingUnits -= unitsInThisSlab;
    }
    slabIndex++;
  }
  totalEnergyCharges = Math.round(totalEnergyCharges * 100) / 100;

  // Check if crossed slab boundary
  if (tariff.slabs.length > 1 && tariff.slabs[0].maxUnits !== null && unitsConsumed > tariff.slabs[0].maxUnits) {
    const higherUnits = unitsConsumed - tariff.slabs[0].maxUnits;
    anomalies.push({
      id: `anom-slab-${Date.now()}`,
      type: 'tariff_slab_boundary',
      title: 'Higher Tariff Slab Threshold Reached',
      severity: 'info',
      observedEvidence: `Usage of ${unitsConsumed} ${input.utility === 'electricity' ? 'kWh' : 'kL'} crossed beyond base slab limit (${tariff.slabs[0].maxUnits} units) by ${higherUnits.toFixed(1)} units, billed at ₹${tariff.slabs[1].ratePerUnit.toFixed(2)}/unit.`,
      plausibleExplanations: [
        'Higher seasonal weather demand (air conditioning / cooling or water heating).',
        'Additional residents or guests during the month.',
        'Slightly longer billing cycle pushing aggregate units into upper tier.'
      ],
      confidenceLimit: 'Mathematical certainty according to progressive tariff design.',
      safeChecksToPerform: [
        'Compare daily average consumption (DAC) with previous month rather than gross total.'
      ],
      status: 'flagged'
    });
  }

  // 5. Fuel Adjustment Charge (FAC / FPPCA)
  let fuelCharges = 0;
  if (tariff.fuelAdjustmentPerUnit > 0) {
    fuelCharges = Math.round(unitsConsumed * tariff.fuelAdjustmentPerUnit * 100) / 100;
    steps.push({
      stepNumber: steps.length + 1,
      description: `Fuel Adjustment Charges (FAC / FPPCA @ ₹${tariff.fuelAdjustmentPerUnit.toFixed(2)}/kWh)`,
      formula: `${unitsConsumed} kWh × ₹${tariff.fuelAdjustmentPerUnit}`,
      subtotal: fuelCharges,
      tariffClauseRef: 'KERC FPPCA Regulation Clause 7'
    });
  }

  // 6. Regulatory Surcharge & Sanitary Charges
  let regulatorySurcharges = 0;
  if (tariff.regulatorySurchargePct > 0) {
    regulatorySurcharges = Math.round((totalEnergyCharges * (tariff.regulatorySurchargePct / 100)) * 100) / 100;
    steps.push({
      stepNumber: steps.length + 1,
      description: `Regulatory Surcharges (${tariff.regulatorySurchargePct}% on energy charges)`,
      formula: `₹${totalEnergyCharges} × ${tariff.regulatorySurchargePct}%`,
      subtotal: regulatorySurcharges,
      tariffClauseRef: 'DERC Statutory Surcharge'
    });
  }

  // Sanitary charge for water boards (e.g. BWSSB 25%)
  if (tariff.sanitaryChargePct && tariff.sanitaryChargePct > 0) {
    const sanitary = Math.round((totalEnergyCharges * (tariff.sanitaryChargePct / 100)) * 100) / 100;
    regulatorySurcharges += sanitary;
    steps.push({
      stepNumber: steps.length + 1,
      description: `Sewerage & Sanitary Cess (${tariff.sanitaryChargePct}% on water consumption)`,
      formula: `₹${totalEnergyCharges} × ${tariff.sanitaryChargePct}%`,
      subtotal: sanitary,
      tariffClauseRef: 'BWSSB Act Sec 16'
    });
  }

  // 7. Taxes & Electricity Duties
  let taxesAndDuties = 0;
  if (tariff.taxPct > 0) {
    const taxableBase = totalEnergyCharges;
    taxesAndDuties = Math.round((taxableBase * (tariff.taxPct / 100)) * 100) / 100;
    steps.push({
      stepNumber: steps.length + 1,
      description: `State Electricity Duty / Tax (${tariff.taxPct}% on energy charges)`,
      formula: `₹${taxableBase} × ${tariff.taxPct}%`,
      subtotal: taxesAndDuties,
      tariffClauseRef: 'State Electricity Duty Act'
    });
  }

  // 8. Subsidies & Deductions
  let subsidiesDeductions = 0;
  if (input.applySubsidy) {
    for (const sub of tariff.subsidies) {
      if (sub.discountType === 'percentage' && sub.discountValue === 100) {
        if (!sub.eligibleMaxUnits || unitsConsumed <= sub.eligibleMaxUnits) {
          subsidiesDeductions += totalEnergyCharges;
          steps.push({
            stepNumber: steps.length + 1,
            description: `Government Subsidy: ${sub.name}`,
            formula: `-100% of Energy Charges (Eligible <= ${sub.eligibleMaxUnits} units)`,
            subtotal: -totalEnergyCharges,
            tariffClauseRef: sub.name
          });
        }
      }
    }
  }

  // 9. Arrears & Adjustments
  const arrears = input.arrears || 0;
  const adjustments = input.adjustments || 0;

  if (arrears > 0) {
    steps.push({
      stepNumber: steps.length + 1,
      description: 'Carried Forward Arrears (Previous unpaid balance)',
      formula: `₹${arrears.toFixed(2)}`,
      subtotal: arrears
    });
  }

  if (adjustments !== 0) {
    steps.push({
      stepNumber: steps.length + 1,
      description: 'Prior Period Adjustment / Credit Note',
      formula: `${adjustments < 0 ? '-' : '+'} ₹${Math.abs(adjustments).toFixed(2)}`,
      subtotal: adjustments
    });
  }

  // 10. Total and Rounding
  const unroundedTotal =
    fixedCharges +
    totalEnergyCharges +
    fuelCharges +
    regulatorySurcharges +
    taxesAndDuties -
    subsidiesDeductions +
    arrears +
    adjustments;

  const totalPayableAmount = Math.max(0, Math.round(unroundedTotal));
  const roundingPaiseAdjustment = Math.round((totalPayableAmount - unroundedTotal) * 100) / 100;

  steps.push({
    stepNumber: steps.length + 1,
    description: `Rounding Adjustment to nearest ₹ (Paise reconciliation)`,
    formula: `${roundingPaiseAdjustment >= 0 ? '+' : ''}${roundingPaiseAdjustment.toFixed(2)}`,
    subtotal: roundingPaiseAdjustment
  });

  // Check for arithmetic mismatch with reported provider total
  if (input.manualOverrideReportedTotal !== undefined) {
    const diff = Math.abs(input.manualOverrideReportedTotal - totalPayableAmount);
    if (diff > 1.0) {
      anomalies.push({
        id: `anom-arith-${Date.now()}`,
        type: 'arithmetic_mismatch',
        title: 'Provider Bill Arithmetic Mismatch Flagged',
        severity: 'potential_error',
        observedEvidence: `Reported bill total is ₹${input.manualOverrideReportedTotal.toFixed(2)}, whereas itemized reconstruction yields ₹${totalPayableAmount.toFixed(2)} (Discrepancy of ₹${diff.toFixed(2)}).`,
        plausibleExplanations: [
          'Unexplained surcharge, unitemized adjustment, or legacy penalty added without breakdown.',
          'Discom bill printing software calculation bug or legacy slab formula change.'
        ],
        confidenceLimit: 'High objective mathematical discrepancy.',
        safeChecksToPerform: [
          'Request detailed line-item ledger from utility sub-divisional accounts officer.',
          'Verify if unannounced prompt-payment discount or late interest was applied.'
        ],
        status: 'flagged'
      });
    }
  }

  return {
    unitsConsumed,
    isRolloverHypothesis,
    calculationSteps: steps,
    itemizedCharges: {
      fixedCharges,
      energyCharges: totalEnergyCharges,
      fuelAdjustmentCharges: fuelCharges,
      regulatorySurcharges,
      taxesAndDuties,
      subsidiesDeductions,
      arrears,
      adjustments,
      roundingPaiseAdjustment
    },
    totalPayableAmount,
    anomalies
  };
}

/**
 * Checks for consumption anomalies compared to a historical baseline
 */
export function checkHistoricalConsumptionAnomaly(
  currentUnits: number,
  historicalUnits: number[],
  previousBillReadingType?: ReadingType,
  currentBillReadingType?: ReadingType
): BillAnomaly[] {
  const anomalies: BillAnomaly[] = [];

  // Estimated to actual catch-up check
  if (previousBillReadingType === 'estimated' && currentBillReadingType === 'actual') {
    if (historicalUnits.length > 0) {
      const avg = historicalUnits.reduce((a, b) => a + b, 0) / historicalUnits.length;
      if (currentUnits > avg * 1.4) {
        anomalies.push({
          id: `anom-catchup-${Date.now()}`,
          type: 'estimated_to_actual_catchup',
          title: 'Estimated-to-Actual Catch-Up Bill Observed',
          severity: 'advisory',
          observedEvidence: `Previous reading was 'Estimated', and current reading is 'Actual'. Recorded consumption is ${currentUnits} units (+${Math.round(((currentUnits - avg) / avg) * 100)}% above normal baseline ${avg.toFixed(0)} units).`,
          plausibleExplanations: [
            'Prior estimated bill underestimated actual usage; unrecorded units accumulated and are now reconciled in this single cycle.',
            'Meter reader visited after multiple cycles of door-locked estimates.',
            'Actual household consumption may also have increased concurrently.'
          ],
          confidenceLimit: 'High likelihood of cumulative reconciliation rather than instantaneous surge.',
          safeChecksToPerform: [
            'Compute combined multi-month average across estimated + actual cycles.',
            'Check whether progressive tariff slab penalties were unfairly triggered by multi-month lump billing.'
          ],
          status: 'flagged'
        });
        return anomalies;
      }
    }
  }

  // Pure consumption surge check (without accusing user or jumping to conclusions)
  if (historicalUnits.length >= 2) {
    const avg = historicalUnits.reduce((a, b) => a + b, 0) / historicalUnits.length;
    const surgeRatio = currentUnits / avg;

    if (surgeRatio >= 1.6) {
      anomalies.push({
        id: `anom-surge-${Date.now()}`,
        type: 'unusual_consumption_surge',
        title: 'Consumption Surge Above Historical Baseline',
        severity: 'needs_review',
        observedEvidence: `Consumption of ${currentUnits} units is ${Math.round((surgeRatio - 1) * 100)}% higher than 3-month baseline (${avg.toFixed(0)} units).`,
        plausibleExplanations: [
          'High summer cooling / winter water-heating duty cycle.',
          'Temporary visitors, festive celebrations, or work-from-home schedule.',
          'Continuous toilet flapper leak, faulty pump float switch, or concealed plumbing seepage.',
          'Meter calibration drift or internal wiring neutral loop.'
        ],
        confidenceLimit: 'Unusual bill alone does NOT prove equipment failure, theft, or pipeline leak.',
        safeChecksToPerform: [
          'Perform a 2-hour no-appliance meter crawl test (turn off all taps/switches and verify if meter disc spins).',
          'Inspect toilet tanks with food dye for silent siphon leaks.',
          'Audit high-wattage geyser and AC timer settings.'
        ],
        status: 'flagged'
      });
    }
  }

  return anomalies;
}

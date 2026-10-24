/**
 * Utility Saathi - Savings Calculator & Sustainability Science Engine
 * Grounded in CEA CO2 Baseline Database Version 19.0 (0.716 kg CO2/kWh)
 * Uses telescopic tariff awareness so reductions drop highest-cost slabs first.
 */

import { VersionedTariff } from '../types';
import { PUBLISHED_TARIFFS } from './tariffEngine';

export interface SavingsTarget {
  id: string;
  category: 'electricity' | 'water';
  label: string;
  tip: string;
  estimatedReductionUnitsMonthly: number;
  reductionPercentage: number;
  implementationCostInr: number;
  feasibility: 'Immediate / Zero-cost' | 'Moderate investment' | 'Long-term';
}

export const PRACTICAL_RECOMMENDATIONS: SavingsTarget[] = [
  {
    id: 'elec-ac-temp',
    category: 'electricity',
    label: 'Set AC Thermostat to 24°C instead of 18°C-20°C',
    tip: 'BEE (Bureau of Energy Efficiency) studies demonstrate each 1°C increase saves approx 6% energy in tropical climates.',
    estimatedReductionUnitsMonthly: 36, // approx 1.2 kWh/day
    reductionPercentage: 14,
    implementationCostInr: 0,
    feasibility: 'Immediate / Zero-cost'
  },
  {
    id: 'elec-led-retrofit',
    category: 'electricity',
    label: 'Replace remaining CFL / Halogen fixtures with 9W LEDs',
    tip: 'Drops lighting load from ~40W-60W to 9W per active luminaire across 5 hours daily.',
    estimatedReductionUnitsMonthly: 24,
    reductionPercentage: 9,
    implementationCostInr: 600,
    feasibility: 'Immediate / Zero-cost'
  },
  {
    id: 'elec-geyser-timer',
    category: 'electricity',
    label: 'Geyser on-demand heating (15 mins) vs continuous standby',
    tip: 'Prevents standing thermostat reheating loss in 15L-25L storage water heaters.',
    estimatedReductionUnitsMonthly: 40,
    reductionPercentage: 15,
    implementationCostInr: 0,
    feasibility: 'Immediate / Zero-cost'
  },
  {
    id: 'water-aerators',
    category: 'water',
    label: 'Install tap aerators with flow restrictors (3.5 LPM)',
    tip: 'Maintains rinsing pressure while reducing sink tap discharge from 9-12 LPM down to 3.5 LPM.',
    estimatedReductionUnitsMonthly: 4.5, // 4,500 litres = 4.5 kL
    reductionPercentage: 18,
    implementationCostInr: 350,
    feasibility: 'Immediate / Zero-cost'
  },
  {
    id: 'water-dual-flush',
    category: 'water',
    label: 'Toilet dual-flush converter & cistern leak elimination',
    tip: 'Reduces flush volume from standard 10L single flush down to 3L/6L dual volumes and checks silent flapper leaks.',
    estimatedReductionUnitsMonthly: 5.0, // 5 kL
    reductionPercentage: 20,
    implementationCostInr: 500,
    feasibility: 'Moderate investment'
  }
];

export interface CalculationBreakdown {
  currentMonthlyUnits: number;
  reducedMonthlyUnits: number;
  unitsSavedMonthly: number;
  currentMonthlyCost: number;
  projectedMonthlyCost: number;
  monthlySavingsInr: number;
  annualSavingsInr: number;
  co2SavedKgMonthly: number;
  co2SavedKgAnnual: number;
  calculationFormula: string;
  tariffAssumption: string;
  co2FactorCiting: string;
  simplePaybackMonths?: number;
}

// CEA Official Emission Factor
export const CEA_GRID_EMISSION_FACTOR_KG_PER_KWH = 0.716; // kg CO2 / kWh
export const CEA_CITATION =
  'Central Electricity Authority (CEA), Ministry of Power, Govt of India: "CO2 Baseline Database for the Indian Power Sector", User Guide Version 19.0 (Published Dec 2023), Weighted Average Grid Emission Factor = 0.716 tCO2/MWh.';

export function calculateElectricitySavings(
  currentMonthlyKwh: number,
  reductionKwh: number,
  tariffId: string = 'BESCOM_LT2A_FY2425',
  sanctionedLoadKw: number = 3,
  upfrontCostInr: number = 0
): CalculationBreakdown {
  const tariff = PUBLISHED_TARIFFS[tariffId] || PUBLISHED_TARIFFS['BESCOM_LT2A_FY2425'];
  const unitsSaved = Math.min(currentMonthlyKwh, Math.max(0, reductionKwh));
  const projectedKwh = Math.max(0, currentMonthlyKwh - unitsSaved);

  // Compute energy cost for current usage
  const currentCost = computeEnergyCost(currentMonthlyKwh, tariff, sanctionedLoadKw);
  const projectedCost = computeEnergyCost(projectedKwh, tariff, sanctionedLoadKw);
  const monthlySavings = Math.max(0, currentCost - projectedCost);
  const annualSavings = monthlySavings * 12;

  // CO2 Emissions Avoided
  const co2SavedMonthly = Math.round(unitsSaved * CEA_GRID_EMISSION_FACTOR_KG_PER_KWH * 10) / 10;
  const co2SavedAnnual = Math.round(co2SavedMonthly * 12 * 10) / 10;

  const payback = upfrontCostInr > 0 && monthlySavings > 0
    ? Math.round((upfrontCostInr / monthlySavings) * 10) / 10
    : undefined;

  return {
    currentMonthlyUnits: currentMonthlyKwh,
    reducedMonthlyUnits: projectedKwh,
    unitsSavedMonthly: unitsSaved,
    currentMonthlyCost: currentCost,
    projectedMonthlyCost: projectedCost,
    monthlySavingsInr: monthlySavings,
    annualSavingsInr: annualSavings,
    co2SavedKgMonthly: co2SavedMonthly,
    co2SavedKgAnnual: co2SavedAnnual,
    calculationFormula: `Telescopic slab delta: [Energy charges at ${currentMonthlyKwh} kWh] - [Energy charges at ${projectedKwh} kWh] + Proportional Duty (${tariff.taxPct}%) and FAC (₹${tariff.fuelAdjustmentPerUnit}/unit)`,
    tariffAssumption: `${tariff.jurisdiction} - ${tariff.version}: Base slab 0-100 kWh @ ₹${tariff.slabs[0].ratePerUnit}, Upper slab >100 kWh @ ₹${tariff.slabs[1]?.ratePerUnit || tariff.slabs[0].ratePerUnit}`,
    co2FactorCiting: CEA_CITATION,
    simplePaybackMonths: payback
  };
}

export function calculateWaterSavings(
  currentMonthlyKl: number,
  reductionKl: number,
  tariffId: string = 'BWSSB_DOMESTIC_FY2425'
): CalculationBreakdown {
  const tariff = PUBLISHED_TARIFFS[tariffId] || PUBLISHED_TARIFFS['BWSSB_DOMESTIC_FY2425'];
  const unitsSaved = Math.min(currentMonthlyKl, Math.max(0, reductionKl));
  const projectedKl = Math.max(0, currentMonthlyKl - unitsSaved);

  const currentCost = computeWaterCost(currentMonthlyKl, tariff);
  const projectedCost = computeWaterCost(projectedKl, tariff);
  const monthlySavings = Math.max(0, currentCost - projectedCost);
  const annualSavings = monthlySavings * 12;

  return {
    currentMonthlyUnits: currentMonthlyKl,
    reducedMonthlyUnits: projectedKl,
    unitsSavedMonthly: unitsSaved,
    currentMonthlyCost: currentCost,
    projectedMonthlyCost: projectedCost,
    monthlySavingsInr: monthlySavings,
    annualSavingsInr: annualSavings,
    co2SavedKgMonthly: 0, // Water emissions require municipal pumping telemetry; adhering to prompt rule "Do not invent water-impact factors"
    co2SavedKgAnnual: 0,
    calculationFormula: `Water volumetric slab delta: [Slab charges at ${currentMonthlyKl} kL] - [Slab charges at ${projectedKl} kL] + 25% Sewerage Cess`,
    tariffAssumption: `${tariff.jurisdiction} - ${tariff.version}`,
    co2FactorCiting: 'Municipal water energy factor requires utility pump head telemetry; direct greenhouse gas impact is deliberately omitted to prevent unsupported claims.'
  };
}

function computeEnergyCost(units: number, tariff: VersionedTariff, kw: number): number {
  let remaining = units;
  let energyCharges = 0;

  for (const slab of tariff.slabs) {
    if (remaining <= 0) break;
    const span = slab.maxUnits !== null ? (slab.maxUnits - slab.minUnits) : remaining;
    const inSlab = Math.min(remaining, span);
    energyCharges += inSlab * slab.ratePerUnit;
    remaining -= inSlab;
  }

  const fac = units * tariff.fuelAdjustmentPerUnit;
  const duty = energyCharges * (tariff.taxPct / 100);
  const fixed = kw * tariff.fixedChargePerKwPerMonth;
  return Math.round(energyCharges + fac + duty + fixed);
}

function computeWaterCost(units: number, tariff: VersionedTariff): number {
  let remaining = units;
  let volCharges = 0;

  for (const slab of tariff.slabs) {
    if (remaining <= 0) break;
    const span = slab.maxUnits !== null ? (slab.maxUnits - slab.minUnits) : remaining;
    const inSlab = Math.min(remaining, span);
    volCharges += inSlab * slab.ratePerUnit;
    remaining -= inSlab;
  }

  const sanitary = volCharges * ((tariff.sanitaryChargePct || 0) / 100);
  const meterFee = tariff.fixedChargePerKwPerMonth;
  return Math.round(volCharges + sanitary + meterFee);
}

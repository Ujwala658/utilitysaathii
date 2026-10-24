/**
 * Utility Saathi - Friendly Savings Calculator
 * Simple, practical household tips with clear ₹ savings and green impact.
 */

import React, { useState } from 'react';
import {
  calculateElectricitySavings,
  calculateWaterSavings,
  PRACTICAL_RECOMMENDATIONS,
  CEA_GRID_EMISSION_FACTOR_KG_PER_KWH
} from '../services/savingsCalculator';
import {
  Zap,
  Droplets,
  Leaf,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export const SavingsCalculatorView: React.FC = () => {
  const [activeUtility, setActiveUtility] = useState<'electricity' | 'water'>('electricity');
  const [monthlyUnits, setMonthlyUnits] = useState<number>(250);
  const [reductionUnits, setReductionUnits] = useState<number>(45);
  const [selectedTips, setSelectedTips] = useState<string[]>(['elec-ac-temp']);

  const elecBreakdown = calculateElectricitySavings(monthlyUnits, reductionUnits, 'BESCOM_LT2A_FY2425', 3);
  const waterBreakdown = calculateWaterSavings(28, reductionUnits, 'BWSSB_DOMESTIC_FY2425');
  const breakdown = activeUtility === 'electricity' ? elecBreakdown : waterBreakdown;

  const toggleTip = (id: string, units: number) => {
    if (selectedTips.includes(id)) {
      setSelectedTips(prev => prev.filter(t => t !== id));
      setReductionUnits(prev => Math.max(10, prev - units));
    } else {
      setSelectedTips(prev => [...prev, id]);
      setReductionUnits(prev => prev + units);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Easy Ways to Save Money & Energy
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          See how small everyday tweaks reduce your electricity and water bills each month.
        </p>
      </div>

      {/* Utility Selector */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold self-start shadow-2xs">
        <button
          onClick={() => {
            setActiveUtility('electricity');
            setReductionUnits(45);
          }}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeUtility === 'electricity'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold shadow-xs'
              : 'text-slate-600 hover:text-amber-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>Save on Electricity</span>
        </button>
        <button
          onClick={() => {
            setActiveUtility('water');
            setReductionUnits(8);
          }}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeUtility === 'water'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-extrabold shadow-xs'
              : 'text-slate-600 hover:text-sky-800'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-sky-300 fill-sky-300" />
          <span>Save on Water</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Tips & Sliders */}
        <div className="lg:col-span-2 space-y-5">
          {/* Slider Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900">
              Your Typical Monthly Use
            </h2>

            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-600 font-medium">Currently Using:</span>
                <span className={`font-mono font-extrabold text-sm ${
                  activeUtility === 'electricity' ? 'text-amber-950' : 'text-sky-950'
                }`}>
                  {monthlyUnits} {activeUtility === 'electricity' ? 'units (kWh)' : 'thousand litres (kL)'}
                </span>
              </div>
              <input
                type="range"
                min={activeUtility === 'electricity' ? 80 : 8}
                max={activeUtility === 'electricity' ? 500 : 50}
                step={activeUtility === 'electricity' ? 10 : 1}
                value={monthlyUnits}
                onChange={e => setMonthlyUnits(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>
          </div>

          {/* Simple Practical Habits Checklist */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900">
              Pick Habits to Add to Your Savings Goal:
            </h2>

            <div className="space-y-2.5">
              {PRACTICAL_RECOMMENDATIONS.filter(r => r.category === activeUtility).map(tip => {
                const isSelected = selectedTips.includes(tip.id);

                return (
                  <div
                    key={tip.id}
                    onClick={() => toggleTip(tip.id, tip.estimatedReductionUnitsMonthly)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-400 bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-transparent ring-2 ring-amber-200 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs text-white ${
                          isSelected
                            ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-xs'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{tip.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{tip.tip}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-orange-950 font-mono bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                        ~{tip.estimatedReductionUnitsMonthly}{' '}
                        {tip.category === 'electricity' ? 'kWh' : 'kL'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Big Impact Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Estimated Monthly Savings
            </h2>

            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-purple-50 p-5 rounded-2xl border border-amber-300 space-y-1 text-center shadow-xs">
              <span className="text-xs text-amber-950 font-bold uppercase tracking-wide">You Could Save:</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                ₹{breakdown.monthlySavingsInr.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-purple-900 font-bold">
                That's ~₹{breakdown.annualSavingsInr.toLocaleString('en-IN')} saved every year!
              </div>
            </div>

            {activeUtility === 'electricity' && (
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 p-4 rounded-xl border border-emerald-300 space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950">
                  <Leaf className="w-4 h-4 text-emerald-600 fill-emerald-500" />
                  <span>Green Living Impact</span>
                </div>
                <div className="text-xl font-extrabold text-emerald-950 font-mono">
                  {breakdown.co2SavedKgMonthly} kg CO2
                </div>
                <p className="text-[11px] text-emerald-900 font-medium">
                  Avoided greenhouse emissions each month (Grounded in official Central Electricity Authority CEA data).
                </p>
              </div>
            )}

            <div className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              <strong className="text-slate-900 font-bold">Why savings add up quickly: </strong>
              In India, power is billed in slabs. When you save power, you drop your most expensive highest tier (₹7.00/unit) first!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Utility Saathi - Friendly Bill Breakdown Modal
 * Explains electricity and water bills in simple, conversational English.
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Zap,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Calculator,
  ArrowRight,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const BillDetailModal: React.FC = () => {
  const {
    selectedBillForInspection,
    setSelectedBillForInspection,
    setSelectedBillForPayment,
    setActiveTab,
    submitComplaint
  } = useApp();

  if (!selectedBillForInspection) return null;

  const bill = selectedBillForInspection;
  const isElec = bill.utility === 'electricity';
  const hasAnomalies = bill.anomalies.length > 0;
  const arithDiff = Math.abs(bill.reportedProviderTotal - bill.totalPayableAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isElec ? 'bg-amber-100 text-amber-800' : 'bg-cyan-100 text-cyan-800'
              }`}
            >
              {isElec ? <Zap className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {bill.propertyName}
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  (Bill #{bill.billNumber})
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Consumer No: <span className="font-mono font-medium">{bill.consumerNumber}</span> · {isElec ? 'Electricity' : 'Water'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedBillForInspection(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Summary Big Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Total Amount:</span>
              <span className="font-mono font-extrabold text-xl text-slate-900 tabular-nums">
                ₹{bill.totalPayableAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Units Used:</span>
              <span className="font-mono font-bold text-sm text-slate-900 mt-1 block">
                {bill.unitsConsumed} {bill.metricUnit}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Days Billed:</span>
              <span className="font-semibold text-slate-800 mt-1 block">
                {bill.billingDays} Days
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Pay By Date:</span>
              <span className="font-semibold text-teal-800 mt-1 block">
                {bill.dueDate}
              </span>
            </div>
          </div>

          {/* Friendly Anomaly / Surge Explanation (if any) */}
          {hasAnomalies && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-3 text-xs text-amber-950">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Notice: Why this bill is different from usual</span>
              </div>

              {bill.anomalies.map(anom => (
                <div key={anom.id} className="space-y-2">
                  <div className="font-semibold text-slate-900 text-xs">
                    {anom.title}
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>What happened: </strong>{anom.observedEvidence}
                  </p>
                  <div>
                    <strong className="text-slate-800">Possible harmless reasons:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
                      {anom.plausibleExplanations.map((exp, idx) => (
                        <li key={idx}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
                    <strong>Simple things you can check: </strong>
                    {anom.safeChecksToPerform.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Arithmetic Error Alert (if seeded error bill) */}
          {arithDiff > 1.0 && (
            <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-xs text-rose-950 space-y-2">
              <div className="font-bold text-sm text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Discrepancy Found in Printed Bill!</span>
              </div>
              <p>
                The paper bill printed ₹{bill.reportedProviderTotal.toFixed(2)}, but when we recalculate with official government rates, the real total should be ₹{bill.totalPayableAmount.toFixed(2)} (an overcharge of ₹{arithDiff.toFixed(2)}).
              </p>
              <p className="font-medium text-rose-800">
                You can raise a complaint directly from this page so the electricity board credits this back.
              </p>
            </div>
          )}

          {/* Simple Step-by-Step Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-teal-700" />
              <span>Step-by-Step Cost Breakdown</span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {bill.calculationSteps.map(step => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900">{step.description}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Calculation: {step.formula}
                    </div>
                  </div>

                  <div className="font-mono font-bold text-slate-900 text-sm shrink-0 tabular-nums">
                    {step.subtotal < 0 ? '-' : ''}₹{Math.abs(step.subtotal).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Total Row */}
              <div className="p-4 bg-teal-50/70 flex items-center justify-between text-teal-950 font-bold text-sm">
                <span>Total Amount to Pay</span>
                <span className="font-mono text-base text-teal-900 tabular-nums">
                  ₹{bill.totalPayableAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              setSelectedBillForInspection(null);
              submitComplaint({
                utility: bill.utility,
                category: 'billing',
                subject: `Billing Question for Bill #${bill.billNumber}`,
                description: `Inquiry regarding charges on bill ${bill.billNumber} (${bill.propertyName}).`,
                billReference: bill.billNumber,
                priority: hasAnomalies ? 'high' : 'normal'
              });
              setActiveTab('complaints');
            }}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>I Have a Question About this Bill</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedBillForInspection(null)}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                const b = bill;
                setSelectedBillForInspection(null);
                setSelectedBillForPayment(b);
              }}
              className="w-full sm:w-auto px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Pay Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Utility Saathi - Friendly Bills View
 * Visual cards with simple everyday wording and clear explanations.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authManager } from '../services/authAuthorization';
import {
  Zap,
  Droplets,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle
} from 'lucide-react';

export const BillsView: React.FC = () => {
  const {
    currentUser,
    bills,
    properties,
    setSelectedBillForInspection,
    setSelectedBillForPayment
  } = useApp();

  const [utilityFilter, setUtilityFilter] = useState<'all' | 'electricity' | 'water'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const authorizedBills = authManager.filterAuthorizedBills(currentUser, bills, properties);

  const filteredBills = authorizedBills.filter(b => {
    if (utilityFilter !== 'all' && b.utility !== utilityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!b.billNumber.toLowerCase().includes(q) && !b.propertyName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Utility Bills
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Click on any bill to see exactly how your charges were calculated in plain English.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setUtilityFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              utilityFilter === 'all'
                ? 'bg-gradient-to-r from-slate-900 to-purple-950 text-white font-extrabold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Bills ({authorizedBills.length})
          </button>
          <button
            onClick={() => setUtilityFilter('electricity')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              utilityFilter === 'electricity'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold shadow-xs'
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
            <span>Electricity</span>
          </button>
          <button
            onClick={() => setUtilityFilter('water')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              utilityFilter === 'water'
                ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-extrabold shadow-xs'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-sky-300 fill-sky-200" />
            <span>Water</span>
          </button>
        </div>
      </div>

      {/* Bill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBills.map(bill => {
          const isElec = bill.utility === 'electricity';
          const isPaid = bill.paymentStatus === 'paid';
          const isPending = bill.paymentStatus === 'payment_pending';
          const hasAnomaly = bill.anomalies.length > 0;

          return (
            <div
              key={bill.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                hasAnomaly
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : isElec
                  ? 'border-amber-200/90 hover:border-amber-400'
                  : 'border-sky-200/90 hover:border-sky-400'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        isElec
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white'
                          : 'bg-gradient-to-tr from-sky-500 to-cyan-600 text-white'
                      }`}
                    >
                      {isElec ? (
                        <Zap className="w-4 h-4 fill-white text-white" />
                      ) : (
                        <Droplets className="w-4 h-4 fill-white text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{isElec ? 'Electricity' : 'Water Supply'}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          isElec ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                        }`}>
                          {isElec ? 'BESCOM' : 'BWSSB'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        #{bill.billNumber}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isPending
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    {isPaid ? '✓ Paid' : isPending ? '⏳ Processing' : '● Unpaid'}
                  </span>
                </div>

                {/* Amount & Units */}
                <div className={`p-3.5 rounded-xl border space-y-1 ${
                  isElec
                    ? 'bg-gradient-to-br from-amber-50/60 to-orange-50/40 border-amber-200/80'
                    : 'bg-gradient-to-br from-sky-50/60 to-cyan-50/40 border-sky-200/80'
                }`}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-600 font-medium">Bill Amount:</span>
                    <span className={`text-2xl font-extrabold font-mono tabular-nums ${
                      isElec ? 'text-amber-950' : 'text-sky-950'
                    }`}>
                      ₹{bill.totalPayableAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Units Used:</span>
                    <span className="font-extrabold font-mono text-slate-900">
                      {bill.unitsConsumed} {bill.metricUnit}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                    <span>Due Date:</span>
                    <span className="text-slate-800 font-bold">{bill.dueDate}</span>
                  </div>
                </div>

                {/* Plain-Language Notice / Note */}
                {hasAnomaly ? (
                  <div className="text-xs text-rose-950 bg-rose-50 p-2.5 rounded-xl border border-rose-300 flex items-start gap-2 shadow-2xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-extrabold text-[11px] text-rose-900">{bill.anomalies[0].title}</div>
                      <div className="text-[11px] text-rose-800 mt-0.5 leading-snug">
                        Click 'How was this calculated?' below to see the plain math breakdown.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-medium">
                    {bill.propertyName} · Standard domestic tariff rate
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setSelectedBillForInspection(bill)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                  <span>How was this calculated?</span>
                </button>

                {!isPaid && (
                  <button
                    onClick={() => setSelectedBillForPayment(bill)}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                      isElec
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/20'
                        : 'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 shadow-sky-500/20'
                    }`}
                  >
                    <span>Pay Bill ₹{bill.totalPayableAmount.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

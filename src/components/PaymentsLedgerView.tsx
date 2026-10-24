/**
 * Utility Saathi - Friendly Payment History & Receipts View
 * Clean status tracking showing bank deduction vs board receipt, with double-debit shields.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  FileCheck,
  AlertTriangle
} from 'lucide-react';

export const PaymentsLedgerView: React.FC = () => {
  const { transactions, reconcilePayment } = useApp();
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Payment History & Receipts
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Every transaction is tracked with bank confirmation and official utility receipts.
        </p>
      </div>

      {/* Double Charge Protection Guarantee */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-100/70 border border-purple-300 rounded-2xl p-4 flex items-center gap-3.5 text-purple-950 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div className="text-xs leading-relaxed">
          <strong className="font-extrabold text-purple-950">Double-Charge Guarantee with Idempotency Locks: </strong>
          Once your bank confirms a payment, our system immediately locks the bill. Accidental double-clicks, duplicate tabs, or UPI network timeouts can never charge you twice.
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {transactions.map(txn => {
          const isExpanded = selectedTxnId === txn.id;
          const isPending = txn.state === 'debit_confirmed';
          const isPaid = txn.state === 'credit_reconciled';
          const isFailed = txn.state === 'failed';

          return (
            <div
              key={txn.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-3 ${
                isPending
                  ? 'border-amber-400 ring-2 ring-amber-100'
                  : isPaid
                  ? 'border-emerald-200/90 hover:border-emerald-300'
                  : 'border-slate-200'
              }`}
            >
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setSelectedTxnId(isExpanded ? null : txn.id)}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-xs text-white ${
                      isPaid
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-600'
                        : isPending
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500'
                        : 'bg-gradient-to-tr from-rose-500 to-red-600'
                    }`}
                  >
                    {isPaid ? '✓' : isPending ? <Clock className="w-5 h-5" /> : '!'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-base text-slate-900 font-mono">
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : isPending
                            ? 'bg-amber-50 text-amber-950 border-amber-300'
                            : 'bg-rose-50 text-rose-900 border-rose-300'
                        }`}
                      >
                        {isPaid
                          ? '✓ Fully Paid & Receipt Issued'
                          : isPending
                          ? '⏳ Bank Paid · Updating Board Receipt'
                          : '✕ Cancelled / Failed'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      <span>Method: <strong className="text-slate-700 font-semibold">{txn.paymentMethod}</strong></span>
                      <span> · </span>
                      <span>Ref #{txn.transactionReference}</span>
                      {txn.utilityReceiptNumber && (
                        <span> · <strong className="text-purple-900 font-mono font-bold">Receipt: {txn.utilityReceiptNumber}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0" onClick={e => e.stopPropagation()}>
                  {isPending && (
                    <button
                      onClick={() => reconcilePayment(txn.id)}
                      className="px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
                    >
                      Instant Clear Receipt
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedTxnId(isExpanded ? null : txn.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-purple-600" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expandable details */}
              {isExpanded && (
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Bank Reference:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {txn.bankReferenceNumber || 'Pending bank batch'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Date & Time:</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(txn.initiatedAt).toLocaleDateString('en-IN')} {new Date(txn.initiatedAt).toLocaleTimeString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Account:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {txn.consumerNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Status:</span>
                      <span className="font-extrabold text-purple-800">{txn.state}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block mb-1">
                      Event History:
                    </span>
                    <div className="space-y-1.5 border-l-2 border-purple-600 ml-1 pl-3 text-[11px]">
                      {txn.eventHistory.map(evt => (
                        <div key={evt.id} className="text-slate-600">
                          <strong className="text-purple-900 font-bold">{evt.toState.toUpperCase()}</strong>: {evt.note}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

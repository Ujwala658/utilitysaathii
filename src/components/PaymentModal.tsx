/**
 * Utility Saathi - Friendly Payment Modal & Double-Charge Protection
 * Protects users from being charged twice with warm, clear wording.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { paymentStore } from '../services/paymentEngine';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Receipt,
  Clock,
  Sparkles
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const {
    selectedBillForPayment,
    setSelectedBillForPayment,
    initiatePayment,
    reconcilePayment,
    setActiveTab
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NetBanking' | 'DebitCard'>('UPI');
  const [duplicateBlockResult, setDuplicateBlockResult] = useState<any | null>(null);
  const [completedTxn, setCompletedTxn] = useState<any | null>(null);

  if (!selectedBillForPayment) return null;

  const bill = selectedBillForPayment;
  const activeUnresolvedTxn = paymentStore.getActiveTransactionForBill(bill.id);

  const handlePay = () => {
    const res = initiatePayment(bill.id, paymentMethod);
    if (!res.success && res.blockedDuplicate) {
      setDuplicateBlockResult(res);
    } else if (res.success && res.transaction) {
      setCompletedTxn(res.transaction);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-teal-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Safe Payment & Double-Debit Protection
              </h2>
              <span className="text-[11px] font-semibold text-emerald-800">
                100% Protected Against Double Charges
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedBillForPayment(null);
              setDuplicateBlockResult(null);
              setCompletedTxn(null);
            }}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Bill summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center text-slate-600">
              <span>Paying For:</span>
              <span className="font-semibold text-slate-900">{bill.propertyName}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Bill Number:</span>
              <span className="font-mono text-slate-800">#{bill.billNumber}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-700">Total Due:</span>
              <span className="font-mono font-extrabold text-xl text-slate-900 tabular-nums">
                ₹{bill.totalPayableAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* DOUBLE CHARGE BLOCK ALERT */}
          {(duplicateBlockResult || (activeUnresolvedTxn && !completedTxn)) && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-3 text-amber-950">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-amber-950">
                    Payment Stopped to Protect Your Money
                  </h3>
                  <p className="mt-1 text-slate-700 leading-relaxed text-xs">
                    Your bank has already deducted ₹{activeUnresolvedTxn?.amount || bill.totalPayableAmount} for this bill (Ref: <strong className="font-mono">{activeUnresolvedTxn?.transactionReference}</strong>). We blocked this second payment attempt so you aren't charged twice!
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-3 rounded-lg border border-amber-200 text-[11px] space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Bank Deduction:</span>
                  <span className="text-emerald-700 font-bold">Confirmed ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Electricity Board Receipt:</span>
                  <span className="text-amber-800 font-semibold">Updating in background</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                {activeUnresolvedTxn && (
                  <button
                    onClick={() => {
                      reconcilePayment(activeUnresolvedTxn.id);
                      setSelectedBillForPayment(null);
                      setActiveTab('payments');
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold transition-colors shadow-xs"
                  >
                    Simulate Instant Clearance
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedBillForPayment(null);
                    setActiveTab('payments');
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  View Payment History
                </button>
              </div>
            </div>
          )}

          {/* FRESH PAYMENT FLOW */}
          {!duplicateBlockResult && !activeUnresolvedTxn && !completedTxn && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Choose How to Pay:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', sub: 'GPay / PhonePe / Paytm' },
                    { id: 'NetBanking', label: 'NetBanking', sub: 'HDFC, ICICI, SBI' },
                    { id: 'DebitCard', label: 'Debit Card', sub: 'RuPay / Visa' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === m.id
                          ? 'border-teal-700 bg-teal-50 ring-1 ring-teal-700'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold text-slate-900">{m.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-[11px]">
                  Safe & Encrypted: We never ask for PINs, passwords, or CVVs.
                </span>
              </div>
            </div>
          )}

          {/* PAYMENT COMPLETED */}
          {completedTxn && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3 text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Payment Accepted by Bank!</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-xs">
                Your payment of ₹{completedTxn.amount.toFixed(2)} is being processed under Reference #{completedTxn.transactionReference}.
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    reconcilePayment(completedTxn.id);
                    setSelectedBillForPayment(null);
                    setActiveTab('payments');
                  }}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-semibold text-xs transition-colors"
                >
                  Generate Official Receipt
                </button>
                <button
                  onClick={() => {
                    setSelectedBillForPayment(null);
                    setActiveTab('payments');
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium text-xs hover:bg-slate-50 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedBillForPayment(null);
              setDuplicateBlockResult(null);
              setCompletedTxn(null);
            }}
            className="text-slate-500 hover:text-slate-700 font-medium"
          >
            Cancel
          </button>

          {!duplicateBlockResult && !activeUnresolvedTxn && !completedTxn && (
            <button
              onClick={handlePay}
              className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Pay ₹{bill.totalPayableAmount.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

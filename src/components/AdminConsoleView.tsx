/**
 * Utility Saathi - Administrator Console & Explainable Alert Center
 * Provides audit event tracking, payment reconciliation workbench, and non-accusatory operational alerts.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  Receipt,
  FileText,
  Activity,
  CheckCircle2,
  Clock,
  RotateCcw,
  UserCheck
} from 'lucide-react';

export const AdminConsoleView: React.FC = () => {
  const {
    currentUser,
    bills,
    transactions,
    incidents,
    complaints,
    auditLogs,
    reconcilePayment,
    setSelectedBillForInspection,
    setActiveTab
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'alerts' | 'reconciliation' | 'audit'>('alerts');

  // Explainable Alerts compilation
  const explainableAlerts = [
    {
      id: 'alert-dup-01',
      title: 'Potential Duplicate Transaction Blocked by Sentinel',
      severity: 'advisory',
      rule: 'Unresolved Transaction Shield Rule P-12',
      trigger: 'Customer Rohan Verma attempted re-payment on Bill BL-KA-2024-91024 while HDFC bank debit was already confirmed.',
      limitation: 'Transaction is legitimate bank debit pending batch clearinghouse settlement; not fraud.',
      whatToVerify: 'Verify batch settlement acknowledgement from NPCI UPI switch.',
      isSynthetic: true,
      actionLabel: 'View in Ledger',
      action: () => setActiveTab('payments')
    },
    {
      id: 'alert-arith-02',
      title: 'Bill Arithmetic Discrepancy Flagged',
      severity: 'potential_error',
      rule: 'Statutory Reconstruction Check B-09',
      trigger: 'Reported total of ₹3,450 on Bill BL-KA-2024-ERR88 deviates by ₹602 from reconstructed KERC tariff total (₹2,848).',
      limitation: 'May represent unannounced prompt-payment discount or software version glitch.',
      whatToVerify: 'Cross-check meter reading raw slip with sub-divisional billing officer ledger.',
      isSynthetic: true,
      actionLabel: 'Inspect Discrepancy',
      action: () => {
        const b = bills.find(b => b.id === 'bill-arith-error-seeded');
        if (b) setSelectedBillForInspection(b);
      }
    },
    {
      id: 'alert-rollover-03',
      title: 'Dial Rollover Hypothesis Flagged for Physical Inspection',
      severity: 'needs_review',
      rule: 'Meter Continuity Check M-08',
      trigger: 'Reading dropped from 99,880 to 00,045 at Maple Heights Flat 201 (Calculated as 165 kWh under rollover hypothesis).',
      limitation: 'Requires physical inspection to confirm meter replacement vs dial completion.',
      whatToVerify: 'Check meter change job-card or physical dial photo.',
      isSynthetic: true,
      actionLabel: 'Inspect Bill',
      action: () => {
        const b = bills.find(b => b.id === 'bill-rollover-decrease');
        if (b) setSelectedBillForInspection(b);
      }
    },
    {
      id: 'alert-outage-04',
      title: 'Community Outage Cluster Awaiting Official Line Verification',
      severity: 'advisory',
      rule: 'Verification Gate D-17',
      trigger: 'Indiranagar 100ft Rd feeder cluster logged 2 reports; status remains unverified.',
      limitation: 'Community volume alone does not trigger official fault publishing.',
      whatToVerify: 'Verify 11kV substation breaker telemetry before dispatching line crew.',
      isSynthetic: true,
      actionLabel: 'View Outage Desk',
      action: () => setActiveTab('outages')
    }
  ];

  // Unresolved transactions requiring reconciliation
  const unresolvedTxns = transactions.filter(t => t.state === 'debit_confirmed');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-teal-800">
            <span>DISCOM Assistant Executive Engineer Portal</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 font-mono font-normal">Operator: Er. Vikram Singh</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Utility Operations & Explainable Alert Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
            RBAC: LEVEL 3 ADMIN PRIVILEGES
          </span>
        </div>
      </div>

      {/* Admin KPI Overview */}
      {/* Admin KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 p-4 rounded-xl border border-amber-300 shadow-2xs">
          <span className="text-amber-900 font-bold">Unresolved Bank Debits:</span>
          <div className="text-2xl font-extrabold text-amber-950 font-mono mt-1">
            {unresolvedTxns.length}
          </div>
          <span className="text-[11px] text-amber-800 font-medium">Awaiting utility credit</span>
        </div>

        <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/50 p-4 rounded-xl border border-rose-300 shadow-2xs">
          <span className="text-rose-900 font-bold">Active Grid Incidents:</span>
          <div className="text-2xl font-extrabold text-rose-950 font-mono mt-1">
            {incidents.filter(i => i.status !== 'closed' && i.status !== 'service_restored').length}
          </div>
          <span className="text-[11px] text-rose-800 font-medium">1 Verified Fault</span>
        </div>

        <div className="bg-gradient-to-br from-sky-50/80 to-cyan-50/50 p-4 rounded-xl border border-sky-300 shadow-2xs">
          <span className="text-sky-900 font-bold">Pending Grievances:</span>
          <div className="text-2xl font-extrabold text-sky-950 font-mono mt-1">
            {complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length}
          </div>
          <span className="text-[11px] text-sky-800 font-medium">1 Escalated case</span>
        </div>

        <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/50 p-4 rounded-xl border border-purple-300 shadow-2xs">
          <span className="text-purple-900 font-bold">System Audit Events:</span>
          <div className="text-2xl font-extrabold text-purple-950 font-mono mt-1">
            {auditLogs.length}
          </div>
          <span className="text-[11px] text-purple-800 font-medium">Append-only ledger</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTabSub('alerts')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTabSub === 'alerts'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Explainable Operational Alerts ({explainableAlerts.length})
        </button>
        <button
          onClick={() => setActiveTabSub('reconciliation')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTabSub === 'reconciliation'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Payment Reconciliation Workbench</span>
          {unresolvedTxns.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTabSub('audit')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTabSub === 'audit'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Audit Event Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: EXPLAINABLE ALERTS */}
      {activeTabSub === 'alerts' && (
        <div className="space-y-4">
          {explainableAlerts.map(alert => (
            <div
              key={alert.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      alert.severity === 'potential_error'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{alert.title}</h3>
                    <span className="text-[10px] text-teal-800 font-mono font-semibold">
                      Rule: {alert.rule}
                    </span>
                  </div>
                </div>

                <button
                  onClick={alert.action}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors shrink-0"
                >
                  {alert.actionLabel}
                </button>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <div>
                  <strong className="text-slate-800">Trigger / Evidence: </strong>
                  <span>{alert.trigger}</span>
                </div>
                <div>
                  <strong className="text-amber-900">Limitation: </strong>
                  <span>{alert.limitation}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-[11px]">
                  <strong className="text-slate-700">Recommended Operator Verification: </strong>
                  <span>{alert.whatToVerify}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PAYMENT RECONCILIATION WORKBENCH */}
      {activeTabSub === 'reconciliation' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
            Transactions where consumer account was debited at the bank, but utility settlement is pending.
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {unresolvedTxns.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                All bank debits have been reconciled with utility clearinghouse receipts.
              </div>
            ) : (
              unresolvedTxns.map(txn => (
                <div key={txn.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {txn.transactionReference}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px] font-mono">
                        DEBIT_CONFIRMED
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">Consumer: {txn.consumerNumber}</span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 font-mono">
                      <span>Bank Ref: {txn.bankReferenceNumber}</span>
                      <span> · </span>
                      <span>Initiated: {new Date(txn.initiatedAt).toLocaleString('en-IN')}</span>
                      <span> · </span>
                      <span>Amount: ₹{txn.amount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => reconcilePayment(txn.id)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs transition-colors"
                    >
                      Clear & Issue Receipt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT EVENT TRAIL */}
      {activeTabSub === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {log.actorName} ({log.actorRole})
                    </td>
                    <td className="py-2.5 px-4 text-teal-800 font-bold">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {log.entityType} ({log.entityId})
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-sans text-xs">
                      {log.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

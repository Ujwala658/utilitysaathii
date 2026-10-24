/**
 * Utility Saathi - Priority Assistance Consent Modal
 * Opt-in registration for life-support medical devices (oxygen concentrators, dialysis, elderly care).
 * Enforces DPDP-2023 consent capture, sensitive data redaction, and consent withdrawal.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  Lock,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const PriorityAssistanceModal: React.FC = () => {
  const {
    currentUser,
    priorityRegistrations,
    isPriorityModalOpen,
    setIsPriorityModalOpen,
    savePriorityConsent,
    withdrawPriorityConsent
  } = useApp();

  const activeRegistration = priorityRegistrations.find(
    p => p.userId === currentUser.id && p.consentGiven
  );

  const [category, setCategory] = useState<any>('life_support_equipment');
  const [equipmentType, setEquipmentType] = useState('Home Oxygen Concentrator (5 LPM continuous)');
  const [emergencyContact, setEmergencyContact] = useState('+91 98450 ••••• (Attending Physician)');
  const [consentChecked, setConsentChecked] = useState(false);

  if (!isPriorityModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked && !activeRegistration) return;
    savePriorityConsent({
      residentCategory: category,
      medicalEquipmentType: equipmentType,
      emergencyContact: emergencyContact
    });
    setIsPriorityModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Essential Service Priority Assistance
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">
                DPDP Act 2023 Consent Protocol
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsPriorityModalOpen(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Statutory Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-950 space-y-1">
            <strong className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Scope & Support Service Boundary</span>
            </strong>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Priority assistance notifies DISCOM feeder engineers and BWSSB water dispatchers prior to planned maintenance and flags outage tickets as critical. It does <strong className="font-semibold">not</strong> guarantee an on-site ambulance or substitute for emergency 112 medical response.
            </p>
          </div>

          {activeRegistration ? (
            /* Active Registration Card with Consent Withdrawal */
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3 text-emerald-950">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Priority Assistance is Opted In & Active</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-emerald-200 space-y-2 font-mono text-[11px] text-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-slate-900">{activeRegistration.residentCategory.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Equipment:</span>
                  <span className="font-bold text-slate-900">{activeRegistration.medicalEquipmentTypeMasked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consent Timestamp:</span>
                  <span>{new Date(activeRegistration.consentTimestamp).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Access Control:</span>
                  <span className="text-teal-800 font-semibold">Strict Role Redaction (Admin Only)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    withdrawPriorityConsent();
                    setIsPriorityModalOpen(false);
                  }}
                  className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Withdraw Consent & Deregister</span>
                </button>
              </div>
            </div>
          ) : (
            /* Consent Opt-In Form */
            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Resident Critical Need Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="life_support_equipment">Medical Life-Support Equipment (Oxygen / Dialysis / Ventilator)</option>
                  <option value="elderly_dependent">Elderly / Bedridden Resident</option>
                  <option value="critical_refrigeration">Temperature-Sensitive Medication (Insulin / Biologics)</option>
                  <option value="infant_care">Infant Specialized Care</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Equipment / Dependency Description (Masked in Public Logs)
                </label>
                <input
                  type="text"
                  value={equipmentType}
                  onChange={e => setEquipmentType(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attending Emergency Contact (Doctor / Caretaker)
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  required
                />
              </div>

              {/* Explicit DPDP Consent Checkbox */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={e => setConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded text-teal-800 focus:ring-teal-700"
                    required
                  />
                  <span className="text-[11px] text-slate-700 leading-tight">
                    I explicitly consent to storing this critical health status in accordance with the Digital Personal Data Protection Act 2023. I understand that only authorized sub-division dispatchers can view this information during outages, and I can withdraw consent at any time.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPriorityModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!consentChecked}
                  className={`px-5 py-2 rounded-lg font-semibold text-white transition-colors flex items-center gap-1.5 ${
                    consentChecked
                      ? 'bg-teal-800 hover:bg-teal-900 cursor-pointer shadow-sm'
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Register Opt-In Consent</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Utility Saathi - Friendly Help & Complaints View
 * Track disputes and questions with simple, transparent status updates.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authManager } from '../services/authAuthorization';
import { ComplaintCategory, ComplaintStatus, UtilityType } from '../types';
import {
  FileText,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

export const ComplaintsView: React.FC = () => {
  const {
    currentUser,
    complaints,
    properties,
    submitComplaint,
    updateComplaintStatus,
    bills
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Form state
  const [utility, setUtility] = useState<UtilityType>('electricity');
  const [category, setCategory] = useState<ComplaintCategory>('billing');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [billRef, setBillRef] = useState('');

  // Admin status update
  const [adminStatus, setAdminStatus] = useState<ComplaintStatus>('resolved');
  const [adminResolutionNotes, setAdminResolutionNotes] = useState('');

  const authorizedComplaints = authManager.filterAuthorizedComplaints(
    currentUser,
    complaints,
    properties
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitComplaint({
      utility,
      category,
      subject: subject || `${category} issue inquiry`,
      description: description || 'Resident submitted inquiry.',
      billReference: billRef || undefined,
      priority: 'normal'
    });
    setIsModalOpen(false);
    setSubject('');
    setDescription('');
    setBillRef('');
  };

  const handleUpdateStatus = (complaintId: string) => {
    if (!adminResolutionNotes) return;
    updateComplaintStatus(complaintId, adminStatus, adminResolutionNotes);
    setAdminResolutionNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Help & Dispute Tracker
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Need help with a meter reading or unexpected charge? Track all your requests here.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cyan-200" />
          <span>Ask a Question / File Complaint</span>
        </button>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {authorizedComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs font-medium">
            No questions or complaints filed yet. Click above if you need help with a bill or meter.
          </div>
        ) : (
          authorizedComplaints.map(cmp => {
            const isResolved = cmp.status === 'resolved' || cmp.status === 'closed';
            const isSelected = selectedComplaintId === cmp.id;

            return (
              <div
                key={cmp.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                <div
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70"
                  onClick={() => setSelectedComplaintId(isSelected ? null : cmp.id)}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {cmp.subject}
                        </span>
                        <span className="text-xs text-purple-900 font-mono font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          #{cmp.complaintNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                        <span>Office: <strong className="text-slate-700">{cmp.assignedDesk}</strong></span>
                        <span>·</span>
                        <span>Filed: {new Date(cmp.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0" onClick={e => e.stopPropagation()}>
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                        isResolved
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-amber-50 text-amber-950 border-amber-300'
                      }`}
                    >
                      {isResolved ? '✓ Resolved' : '⏳ In Progress'}
                    </span>
                    <button
                      onClick={() => setSelectedComplaintId(isSelected ? null : cmp.id)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      {isSelected ? 'Close Details' : 'View Progress'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="p-5 bg-slate-50/80 border-t border-slate-100 space-y-4 text-xs">
                    <div>
                      <strong className="text-slate-800 block mb-1">Your Message:</strong>
                      <p className="text-slate-800 bg-white p-3.5 rounded-xl border border-slate-200 font-medium">
                        {cmp.description}
                      </p>
                    </div>

                    {/* Progress timeline */}
                    <div>
                      <strong className="text-slate-800 block mb-2">Updates on Your Ticket:</strong>
                      <div className="space-y-2 border-l-2 border-indigo-600 ml-2 pl-4">
                        {cmp.timeline.map((evt, idx) => (
                          <div key={idx} className="relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 absolute -left-[22px] top-1.5 shadow-2xs" />
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{evt.action}</span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {new Date(evt.timestamp).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-0.5 text-xs font-medium">{evt.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Officer resolution input if Admin */}
                    {currentUser.role === 'admin' && (
                      <div className="bg-white p-4 rounded-xl border border-purple-200 space-y-3 mt-3 shadow-2xs">
                        <span className="font-extrabold text-purple-950 block text-xs">
                          Utility Officer Response:
                        </span>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={adminResolutionNotes}
                            onChange={e => setAdminResolutionNotes(e.target.value)}
                            placeholder="Add resolution notes for resident..."
                            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(cmp.id)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Ask a Question or Report an Issue
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service</label>
                <select
                  value={utility}
                  onChange={e => setUtility(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="electricity">BESCOM Electricity</option>
                  <option value="water">BWSSB Water</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topic</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="billing">Bill is higher than expected</option>
                  <option value="meter_reading">Meter reading discrepancy</option>
                  <option value="payment_reconciliation">Payment deduction issue</option>
                  <option value="power_quality">Voltage fluctuation</option>
                  <option value="water_contamination_or_pressure">Water pressure problem</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Summary</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="E.g. Why did units increase this month?"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Details</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tell us what you observed on your meter or bill..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Utility Saathi - Friendly Outages & Water Supply Tracker
 * Neighborhood status, simple reporting, and verified repair updates.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Incident, OutageCategory, UtilityType, IncidentStatus } from '../types';
import {
  Zap,
  Droplets,
  AlertCircle,
  Clock,
  Plus,
  Send,
  MapPin,
  CheckCircle2,
  Info
} from 'lucide-react';

export const OutageIncidentView: React.FC = () => {
  const {
    currentUser,
    incidents,
    submitServiceReport,
    verifyIncident
  } = useApp();

  const [utilityFilter, setUtilityFilter] = useState<'all' | 'electricity' | 'water'>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIncidentForUpdate, setSelectedIncidentForUpdate] = useState<Incident | null>(null);

  // New report form state
  const [reportUtility, setReportUtility] = useState<UtilityType>('electricity');
  const [reportCategory, setReportCategory] = useState<OutageCategory>('power_outage');
  const [reportLocality, setReportLocality] = useState<string>('Indiranagar');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [submissionFeedback, setSubmissionFeedback] = useState<any | null>(null);

  // Admin status update form state
  const [adminStatus, setAdminStatus] = useState<IncidentStatus>('verified_fault');
  const [adminNotes, setAdminNotes] = useState<string>('');

  const filteredIncidents = incidents.filter(inc => {
    if (utilityFilter !== 'all' && inc.utility !== utilityFilter) return false;
    return true;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitServiceReport({
      utility: reportUtility,
      category: reportCategory,
      locality: reportLocality,
      city: 'Bengaluru',
      feederOrZoneId: reportLocality === 'Indiranagar' ? 'F-INDIRA-04-TR2' : 'F-WHITE-02-TR1',
      description: reportDescription || `Reported by resident in ${reportLocality}.`
    });

    setSubmissionFeedback(res);
    setReportDescription('');
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentForUpdate) return;

    verifyIncident(
      selectedIncidentForUpdate.id,
      adminStatus,
      adminNotes || 'Confirmed by field line team.'
    );

    setSelectedIncidentForUpdate(null);
    setAdminNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Outages & Water Supply Status
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Real-time neighborhood updates. When multiple neighbors report a cut, we group them so utility crews respond quickly.
          </p>
        </div>

        <button
          onClick={() => {
            setSubmissionFeedback(null);
            setIsReportModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Report a Power Cut or Leak</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold self-start shadow-2xs">
        <button
          onClick={() => setUtilityFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            utilityFilter === 'all'
              ? 'bg-gradient-to-r from-slate-900 to-purple-950 text-white font-extrabold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Updates ({incidents.length})
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
          <span>Power Cuts</span>
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
          <span>Water Interruptions</span>
        </button>
      </div>

      {/* Incident Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIncidents.map(inc => {
          const isElec = inc.utility === 'electricity';
          const isVerified = inc.status === 'verified_fault';
          const isRestored = inc.status === 'service_restored';

          return (
            <div
              key={inc.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-3 transition-all hover:shadow-md ${
                isVerified
                  ? 'border-amber-400 ring-2 ring-amber-100'
                  : isRestored
                  ? 'border-emerald-300'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white ${
                        isElec
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-600'
                          : 'bg-gradient-to-tr from-sky-500 to-cyan-600'
                      }`}
                    >
                      {isElec ? (
                        <Zap className="w-4 h-4 fill-white text-white" />
                      ) : (
                        <Droplets className="w-4 h-4 fill-white text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{inc.title}</h3>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{inc.locality}, {inc.city}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isVerified
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : isRestored
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {isVerified ? '● Crew Dispatched' : isRestored ? '✓ Restored' : 'Reported'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                  {inc.officialRestorationNotes || 'Investigating report with local substation.'}
                </p>

                {inc.estimatedRestorationTime && (
                  <div className="text-xs text-slate-800 flex items-center gap-1.5 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Expected back around: <strong className="font-extrabold text-amber-950">{new Date(inc.estimatedRestorationTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</strong></span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-medium">
                  {inc.reportedCount} {inc.reportedCount === 1 ? 'resident reported' : 'residents reported'}
                </span>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setSelectedIncidentForUpdate(inc);
                      setAdminStatus(inc.status);
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Update Crew Status
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EASY REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Report a Power Cut or Water Leak
              </h2>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {submissionFeedback ? (
              <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <span>Report Received!</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {submissionFeedback.wasGrouped
                    ? `Your report was automatically linked with other reports in ${submissionFeedback.incident.locality} so engineers see the whole area affected.`
                    : `We opened a new incident ticket #${submissionFeedback.incident.incidentNumber} for your neighborhood.`}
                </p>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="w-full mt-2 py-2 bg-teal-800 text-white rounded-lg font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateReport} className="space-y-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">What is the problem?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReportUtility('electricity')}
                      className={`p-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 ${
                        reportUtility === 'electricity'
                          ? 'border-teal-700 bg-teal-50 text-teal-950'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Electricity Cut</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportUtility('water')}
                      className={`p-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 ${
                        reportUtility === 'water'
                          ? 'border-teal-700 bg-teal-50 text-teal-950'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <Droplets className="w-4 h-4 text-cyan-600" />
                      <span>Water Problem</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Issue</label>
                  <select
                    value={reportCategory}
                    onChange={e => setReportCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    {reportUtility === 'electricity' ? (
                      <>
                        <option value="power_outage">No Electricity (Blackout)</option>
                        <option value="low_voltage">Low Voltage / Dim Lights</option>
                      </>
                    ) : (
                      <>
                        <option value="water_interruption">No Water Supply</option>
                        <option value="low_pressure">Very Low Water Pressure</option>
                        <option value="suspected_leak">Street Water Pipe Leak</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Neighborhood</label>
                  <select
                    value={reportLocality}
                    onChange={e => setReportLocality(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="Indiranagar">Indiranagar (100 Feet Road)</option>
                    <option value="Whitefield">Whitefield (Palm Meadows)</option>
                    <option value="Koramangala">Koramangala (4th Block)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Details (Optional)</label>
                  <textarea
                    rows={2}
                    value={reportDescription}
                    onChange={e => setReportDescription(e.target.value)}
                    placeholder="E.g. nearby street lights also out..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 text-slate-500 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl"
                  >
                    Send Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADMIN STATUS UPDATE MODAL */}
      {selectedIncidentForUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Update Crew Status: {selectedIncidentForUpdate.locality}
              </h2>
              <button
                onClick={() => setSelectedIncidentForUpdate(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminVerify} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={adminStatus}
                  onChange={e => setAdminStatus(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                >
                  <option value="under_investigation">Under Investigation</option>
                  <option value="verified_fault">Crew Dispatched & Working on Line</option>
                  <option value="service_restored">Repairs Complete / Restored</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes for Residents</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="E.g. Fuse replaced on distribution transformer; supply restored."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIncidentForUpdate(null)}
                  className="px-4 py-2 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-semibold"
                >
                  Publish Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

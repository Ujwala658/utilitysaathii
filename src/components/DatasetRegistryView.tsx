/**
 * Utility Saathi - Dataset Source Registry & Provenance View
 * Grounding directory of official government datasets, licenses, endpoints, and limitations.
 */

import React, { useState } from 'react';
import { DATASET_REGISTRY } from '../data/mockFixtures';
import {
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';

export const DatasetRegistryView: React.FC = () => {
  const [sources, setSources] = useState(DATASET_REGISTRY);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const simulateRefresh = (id: string) => {
    setRefreshingId(id);
    setTimeout(() => {
      setSources(prev =>
        prev.map(s => (s.id === id ? { ...s, lastUpdateDate: '2024-11-29', lastRefreshStatus: 'active_verified' } : s))
      );
      setRefreshingId(null);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Official Dataset Source Registry & Provenance
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Verified government gazettes, emission factors, and tariff regulatory documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
            {sources.length} Official Data Sources Registered
          </span>
        </div>
      </div>

      {/* Provenance Classification Legend */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
        <div className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
          Classification Standard & Integrity Labels:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-teal-800 text-xs">OFFICIAL_LIVE / HISTORICAL</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Grounded in statutory publications (KERC Gazette, DERC Orders, CEA Baseline Database, BWSSB Regulations).
            </p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-amber-800 text-xs">SYNTHETIC_DEMO</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Individual consumer account numbers, private apartment readings, and bank transactions (No money moves).
            </p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-slate-700 text-xs">UNVERIFIED COMMUNITY FEED</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Citizen outage reports prior to official engineer line-patrol verification.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Sources Cards */}
      <div className="space-y-4">
        {sources.map(src => {
          const isRefreshing = refreshingId === src.id;

          return (
            <div
              key={src.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900">{src.name}</h3>
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {src.sourceClassification.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{src.lastRefreshStatus.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Publisher: <strong className="text-slate-800">{src.publisher}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => simulateRefresh(src.id)}
                    disabled={isRefreshing}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors border border-slate-200 text-xs flex items-center gap-1"
                    title="Poll endpoint status"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-700' : ''}`} />
                    <span className="hidden sm:inline">Refresh Check</span>
                  </button>

                  <a
                    href={src.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-teal-800 hover:bg-teal-50 rounded-md border border-teal-200 text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Geography:</span>
                  <span className="text-slate-800 font-medium">{src.geography}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Metrics / Units:</span>
                  <span className="text-slate-800 font-medium">{src.units}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Coverage / Series:</span>
                  <span className="text-slate-800 font-medium">{src.timePeriodCoverage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Statutory License:</span>
                  <span className="text-slate-800 font-medium">{src.license}</span>
                </div>
              </div>

              {/* Limitations & Verification Notes */}
              <div className="text-xs space-y-1 text-slate-600 pt-1">
                <div>
                  <strong className="text-slate-800">Grounding Scope: </strong>
                  <span>{src.verifiedNotes}</span>
                </div>
                <div>
                  <strong className="text-amber-900">Documented Limitations: </strong>
                  <span className="text-slate-500">{src.limitations}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

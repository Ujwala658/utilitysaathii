/**
 * Utility Saathi - Overview Dashboard with GitHub-Style Conservation Activity & Percentile Leaderboard
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { authManager } from '../services/authAuthorization';
import {
  Zap,
  Droplets,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HeartPulse,
  Trophy,
  Flame,
  TrendingDown,
  Layers,
  HelpCircle,
  Building,
  Check,
  User,
  MapPin
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    currentUser,
    properties,
    bills,
    incidents,
    priorityRegistrations,
    conservationStats,
    setActiveTab,
    setSelectedBillForInspection,
    setSelectedBillForPayment,
    setIsPriorityModalOpen,
    setIsLoginModalOpen
  } = useApp();

  const authorizedProps = properties.filter(p => authManager.canAccessProperty(currentUser, p));
  const authorizedBills = authManager.filterAuthorizedBills(currentUser, bills, properties);

  // Unpaid or pending bills
  const unpaidBills = authorizedBills.filter(
    b => b.paymentStatus === 'unpaid' || b.paymentStatus === 'payment_pending' || b.paymentStatus === 'overdue'
  );
  const totalDue = unpaidBills.reduce((acc, b) => acc + b.totalPayableAmount, 0);

  // Active outage in user area
  const userLocalities = new Set(authorizedProps.map(p => p.locality.toLowerCase()));
  const localIncidents = incidents.filter(
    inc =>
      userLocalities.has(inc.locality.toLowerCase()) &&
      inc.status !== 'closed' &&
      inc.status !== 'service_restored'
  );

  const hasPriorityActive = priorityRegistrations.some(
    p => p.userId === currentUser.id && p.consentGiven
  );

  // GitHub-style square color mapping
  const getLevelColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-emerald-600 hover:ring-2 hover:ring-emerald-400';
      case 3:
        return 'bg-emerald-500 hover:ring-2 hover:ring-emerald-300';
      case 2:
        return 'bg-emerald-400 hover:ring-2 hover:ring-emerald-200';
      case 1:
        return 'bg-emerald-200 hover:ring-2 hover:ring-emerald-100';
      default:
        return 'bg-slate-200 hover:ring-2 hover:ring-slate-300';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Visual Hero Card with Photography */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden">
          <img
            src="/src/assets/images/hero_modern_home_utilities_1792822293072.jpg"
            alt="Modern Indian home with solar roof and garden"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 w-fit">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>{authorizedProps[0]?.name || 'Indiranagar 2BHK'}</span>
              <span>·</span>
              <span className="text-orange-300">{authorizedProps[0]?.locality || 'Bengaluru'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">{currentUser.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              Track your home electricity and water, protect your wallet against double charges, and see how much energy you conserve each day.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsPriorityModalOpen(true)}
              className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 backdrop-blur-md rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-rose-500/50 shadow-xs cursor-pointer"
            >
              <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>{hasPriorityActive ? 'Medical Priority (Active)' : 'Medical Priority'}</span>
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 via-amber-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-orange-600/30 flex items-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <User className="w-4 h-4 text-amber-200" />
              <span>Log In / Switch Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* GITHUB-STYLE CONSERVATION LEADERBOARD & HEATMAP */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-xs">
                <Trophy className="w-4 h-4 text-white" />
              </span>
              <h2 className="text-base font-extrabold text-slate-900">
                Neighborhood Energy Ranking & Activity
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Community conservation benchmarks comparing your home to other 2BHKs in {authorizedProps[0]?.locality || 'Indiranagar'}.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className="flex items-center gap-1.5 text-xs font-extrabold text-purple-950 bg-gradient-to-r from-amber-100 via-rose-100 to-purple-100 hover:from-amber-200 hover:to-purple-200 px-3.5 py-1.5 rounded-full border border-purple-300 transition-all cursor-pointer shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>State Maps & 6M Trends →</span>
            </button>
            <span className="flex items-center gap-1 text-xs font-extrabold text-orange-950 bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1.5 rounded-full border border-orange-300 shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
              <span>{conservationStats.streakDays} Day Eco Streak!</span>
            </span>
          </div>
        </div>

        {/* 3 Metric Badges: Multi-color Indian Civic Palette */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Emerald/Jade - Efficiency */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 p-4 rounded-xl border border-emerald-300 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-emerald-950 font-bold">
              <span>Efficiency Percentile</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-950 font-mono mt-1">
              Top {100 - conservationStats.aheadOfPercent}%
            </div>
            <p className="text-[11px] text-emerald-900 font-semibold mt-1">
              Ahead of <strong className="font-extrabold text-emerald-700">{conservationStats.aheadOfPercent}%</strong> of nearby homes in energy conservation!
            </p>
          </div>

          {/* Card 2: Saffron/Gold - Ward Rank */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 p-4 rounded-xl border border-amber-300 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-amber-950 font-bold">
              <span>Ward Ranking</span>
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-950 font-mono mt-1">
              #{conservationStats.wardRank}{' '}
              <span className="text-xs text-amber-700 font-medium">/ {conservationStats.totalNeighbors} homes</span>
            </div>
            <p className="text-[11px] text-amber-900 font-semibold mt-1">
              Ranked in top tier for low off-peak wastage in {authorizedProps[0]?.locality || 'Indiranagar'}.
            </p>
          </div>

          {/* Card 3: Royal Purple/Amethyst - Daily Use */}
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100/60 p-4 rounded-xl border border-purple-300 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-purple-950 font-bold">
              <span>Average Daily Use</span>
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-purple-950 font-mono mt-1">
              3.8 kWh{' '}
              <span className="text-xs text-emerald-700 font-extrabold font-sans bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">-42% vs avg</span>
            </div>
            <p className="text-[11px] text-purple-900 font-semibold mt-1">
              Neighborhood baseline is 6.5 kWh/day.
            </p>
          </div>
        </div>

        {/* GitHub-Style 28-Day Activity Heatmap Grid */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              28-Day Conservation Activity:
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span>High Use</span>
              <div className="w-2.5 h-2.5 rounded-xs bg-slate-200" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-200" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
              <span className="text-emerald-800 font-bold">Super Efficient</span>
            </div>
          </div>

          {/* Squares Container */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-[500px]">
              {conservationStats.dailyActivity.map((day, idx) => (
                <div
                  key={idx}
                  title={`${day.date}: ${day.unitsKwh} kWh (Level ${day.level})`}
                  className={`flex-1 h-8 rounded-md transition-all cursor-pointer flex items-center justify-center text-[10px] text-white font-mono font-bold shadow-2xs ${getLevelColor(day.level)}`}
                >
                  {day.unitsKwh.toFixed(1)}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono font-medium mt-1.5 px-0.5">
              <span>{conservationStats.dailyActivity[0].date}</span>
              <span className="text-emerald-800 font-bold">Last 4 Weeks Eco Activity</span>
              <span>{conservationStats.dailyActivity[conservationStats.dailyActivity.length - 1].date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Outage Notice (if any) */}
      {localIncidents.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-950 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs uppercase text-rose-900 tracking-wide">
                  Power Outage in {localIncidents[0].locality}
                </span>
                <span className="text-[10px] text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                  Crew Working
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                {localIncidents[0].title}. Expected restoration around{' '}
                <strong className="font-extrabold text-rose-900">
                  {localIncidents[0].estimatedRestorationTime
                    ? new Date(localIncidents[0].estimatedRestorationTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                    : '2 hours'}
                </strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('outages')}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-500 hover:to-orange-500 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Track Outage
          </button>
        </div>
      )}

      {/* 3 Main Visual Feature Cards with Real Photos & Saffron / Azure / Purple themes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Electricity Meter (Saffron / Marigold) */}
        <div className="bg-white rounded-2xl border border-amber-200/90 overflow-hidden shadow-xs flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all">
          <div>
            <div className="h-40 w-full overflow-hidden relative">
              <img
                src="/src/assets/images/power_smart_meter_1792822293647.jpg"
                alt="Digital home electricity meter"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-amber-900 flex items-center gap-1 shadow-xs border border-amber-200">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Electricity · BESCOM</span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="text-2xl font-extrabold text-amber-950 font-mono tabular-nums">
                    ₹{unpaidBills.find(b => b.utility === 'electricity')?.totalPayableAmount || 1282}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Latest bill · 175 units (kWh)
                  </div>
                </div>

                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                  Normal Usage
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Calculated with official Karnataka rates. First 100 units at lower rate, remaining units at regular rate.
              </p>
            </div>
          </div>

          <div className="p-5 pt-0 space-y-2">
            <button
              onClick={() => {
                const b = authorizedBills.find(item => item.utility === 'electricity') || authorizedBills[0];
                setSelectedBillForInspection(b);
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Why is my bill this amount?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Water Supply (Peacock Azure / Cyan) */}
        <div className="bg-white rounded-2xl border border-sky-200/90 overflow-hidden shadow-xs flex flex-col justify-between hover:border-sky-400 hover:shadow-md transition-all">
          <div>
            <div className="h-40 w-full overflow-hidden relative">
              <img
                src="/src/assets/images/clean_water_supply_1792822294167.jpg"
                alt="Clear clean tap water pouring in glass"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-sky-900 flex items-center gap-1 shadow-xs border border-sky-200">
                <Droplets className="w-3.5 h-3.5 text-sky-600 fill-sky-500" />
                <span>Water Supply · BWSSB</span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="text-2xl font-extrabold text-sky-950 font-mono tabular-nums">
                    ₹230
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    16,000 Litres this month
                  </div>
                </div>

                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-300">
                  Clean & Safe
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Water is billed in simple steps per 1,000 litres, including city sanitary pipeline maintenance.
              </p>
            </div>
          </div>

          <div className="p-5 pt-0 space-y-2">
            <button
              onClick={() => {
                const b = authorizedBills.find(item => item.utility === 'water') || authorizedBills[1];
                setSelectedBillForInspection(b);
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>See Water Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Solar & Money Savings (Royal Purple / Ruby / Emerald) */}
        <div className="bg-white rounded-2xl border border-purple-200/90 overflow-hidden shadow-xs flex flex-col justify-between hover:border-purple-400 hover:shadow-md transition-all">
          <div>
            <div className="h-40 w-full overflow-hidden relative">
              <img
                src="/src/assets/images/solar_green_energy_1792822294519.jpg"
                alt="Solar panels on rooftop"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-purple-900 flex items-center gap-1 shadow-xs border border-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Save Up to ₹399/Mo</span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <div className="text-2xl font-extrabold text-purple-950 font-mono tabular-nums">
                  ~₹4,780 / year
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Easy household savings
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Small changes like setting your AC to 24°C drop your most expensive electricity slab first.
              </p>
            </div>
          </div>

          <div className="p-5 pt-0 space-y-2">
            <button
              onClick={() => setActiveTab('savings')}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Calculate My Savings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Community Support Strip with Rich Multi-Color Gradient */}
      <div className="bg-gradient-to-r from-amber-50/70 via-purple-50/50 to-sky-50/70 rounded-2xl p-6 border border-amber-200/90 flex flex-col md:flex-row items-center gap-6 shadow-xs">
        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 shadow-sm border border-amber-200">
          <img
            src="/src/assets/images/helpful_community_support_1792822295468.jpg"
            alt="Customer support officer helping resident"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-1 text-center md:text-left">
          <h3 className="font-extrabold text-base text-slate-900">
            Need help with your meter or have a question?
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            File an online inquiry with one click, get an official ticket number, and track updates in real-time.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('complaints')}
          className="px-5 py-2.5 bg-gradient-to-r from-slate-900 to-purple-950 hover:from-slate-800 hover:to-purple-900 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs flex items-center gap-2 cursor-pointer border border-purple-400/30"
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>Ask a Question</span>
        </button>
      </div>
    </div>
  );
};

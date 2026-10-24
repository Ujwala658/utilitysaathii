/**
 * Utility Saathi - Modern, Uncluttered Header
 * Prominent User Login, GitHub-style percentile badge, and clean feature icons.
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Home,
  Receipt,
  CreditCard,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Shield,
  CheckCircle2,
  User,
  LogIn,
  RotateCcw,
  Trophy,
  Flame,
  ChevronDown,
  BarChart3,
  MapPin
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setIsLoginModalOpen,
    resetAllFixtures,
    conservationStats
  } = useApp();

  const navItems = [
    { id: 'overview', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Analytics & Maps', icon: <MapPin className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'bills', label: 'My Bills', icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'outages', label: 'Outages', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { id: 'savings', label: 'Save Money', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'complaints', label: 'Help', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    ...(currentUser.role === 'admin'
      ? [{ id: 'admin', label: 'Officer Desk', icon: <Shield className="w-3.5 h-3.5" /> }]
      : []),
    { id: 'tests', label: 'Tests', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand Wordmark with Civic Icon */}
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-sm shadow-orange-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-purple-950 to-orange-950 bg-clip-text text-transparent">
                  Utility Saathi
                </span>
                <span className="text-[10px] font-extrabold text-amber-900 bg-gradient-to-r from-amber-100 to-orange-100 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs">
                  Civic OS
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-slate-500 font-medium">
                Electricity & Water Management · Pan-India
              </p>
            </div>
          </button>

          {/* GitHub-Style Ahead of X% Eco Badge (Direct in Header) */}
          <button
            onClick={() => setActiveTab('overview')}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 hover:from-emerald-100 hover:to-amber-100 border border-emerald-300/80 rounded-xl text-xs font-semibold text-emerald-950 transition-all shadow-2xs group cursor-pointer"
            title="Click to view full 28-day GitHub eco activity grid and neighborhood ranking"
          >
            <div className="flex items-center gap-0.5">
              <span className="w-2 h-2 rounded-[2px] bg-emerald-600 inline-block"></span>
              <span className="w-2 h-2 rounded-[2px] bg-emerald-500 inline-block"></span>
              <span className="w-2 h-2 rounded-[2px] bg-emerald-400 inline-block"></span>
              <span className="w-2 h-2 rounded-[2px] bg-amber-500 inline-block"></span>
            </div>
            <span className="text-emerald-950 font-extrabold">Ahead of {conservationStats.aheadOfPercent}%</span>
            <span className="text-[10px] text-amber-900 bg-amber-200/90 px-1.5 py-0.5 rounded-full font-bold border border-amber-300">
              Ward #{conservationStats.wardRank}
            </span>
          </button>

          {/* Desktop Navigation Links with Distinct Vivid Domain Accents */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-600">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              
              // Custom active colors per domain matching the Indian palette
              const activeColorMap: Record<string, string> = {
                overview: 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold shadow-2xs',
                analytics: 'bg-gradient-to-r from-rose-50 to-purple-50 text-purple-900 border-purple-300 font-bold shadow-2xs',
                bills: 'bg-amber-50 text-amber-950 border-amber-300 font-bold shadow-2xs',
                payments: 'bg-purple-50 text-purple-950 border-purple-300 font-bold shadow-2xs',
                outages: 'bg-rose-50 text-rose-950 border-rose-300 font-bold shadow-2xs',
                savings: 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold shadow-2xs',
                complaints: 'bg-cyan-50 text-cyan-950 border-cyan-300 font-bold shadow-2xs',
                admin: 'bg-violet-50 text-violet-950 border-violet-300 font-bold shadow-2xs',
                tests: 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold shadow-2xs'
              };

              const iconColorMap: Record<string, string> = {
                overview: 'text-indigo-600',
                analytics: 'text-rose-500',
                bills: 'text-amber-600',
                payments: 'text-purple-600',
                outages: 'text-rose-600',
                savings: 'text-emerald-600',
                complaints: 'text-cyan-600',
                admin: 'text-violet-600',
                tests: 'text-emerald-600'
              };

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all focus:outline-none whitespace-nowrap border ${
                    isActive
                      ? activeColorMap[item.id] || 'bg-slate-100 text-slate-900 border-slate-300 font-bold'
                      : 'border-transparent hover:text-slate-900 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className={isActive ? iconColorMap[item.id] || 'text-slate-700' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.id === 'tests' && (
                    <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-100 px-1 rounded border border-emerald-300">
                      23/23
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Login & Account Switcher Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-slate-50 to-orange-50/40 hover:from-amber-50 hover:to-orange-100 text-slate-900 rounded-xl text-xs font-semibold transition-all border border-amber-200 hover:border-amber-400 shadow-2xs hover:shadow-xs group cursor-pointer"
              title="Click to Log In, change user role, or sign in with OTP"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
                {currentUser.name[0]}
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-900 font-bold truncate max-w-[90px] sm:max-w-[120px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-purple-900 font-bold bg-purple-100 px-1.5 py-0.2 rounded border border-purple-200 uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-orange-700 font-medium flex items-center gap-0.5">
                  <span>Log In / Switch</span>
                  <ChevronDown className="w-2.5 h-2.5 text-orange-600" />
                </div>
              </div>
              <LogIn className="w-3.5 h-3.5 text-orange-500 group-hover:text-orange-700 ml-0.5 shrink-0" />
            </button>

            {/* Reset Fixtures Button */}
            <button
              onClick={resetAllFixtures}
              title="Reset demo data to baseline"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Nav Strip with Clean Sleek Colorful Pills */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-slate-100 text-xs scrollbar-none">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const mobileActiveMap: Record<string, string> = {
              overview: 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold',
              analytics: 'bg-gradient-to-r from-rose-50 to-purple-50 text-purple-900 border-purple-300 font-bold',
              bills: 'bg-amber-50 text-amber-950 border-amber-300 font-bold',
              payments: 'bg-purple-50 text-purple-950 border-purple-300 font-bold',
              outages: 'bg-rose-50 text-rose-950 border-rose-300 font-bold',
              savings: 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold',
              complaints: 'bg-cyan-50 text-cyan-950 border-cyan-300 font-bold',
              admin: 'bg-violet-50 text-violet-950 border-violet-300 font-bold',
              tests: 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold'
            };
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? mobileActiveMap[item.id] || 'bg-slate-100 text-slate-900 border-slate-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 border-transparent'
                }`}
              >
                <span className={isActive ? 'text-slate-900' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.id === 'tests' && (
                  <span className="text-[9px] font-bold font-mono text-emerald-800 bg-emerald-100 px-1 rounded border border-emerald-300">
                    23/23
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

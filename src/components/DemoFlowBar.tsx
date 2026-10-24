/**
 * Utility Saathi - Friendly Guided Tour & Shortcuts Bar
 * Clean feature icons, direct User Login button, and GitHub-style eco rank indicator.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ChevronRight,
  Zap,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Building,
  Shield,
  User,
  Flame,
  Trophy,
  BarChart3,
  MapPin
} from 'lucide-react';

export const DemoFlowBar: React.FC = () => {
  const {
    setCurrentUser,
    users,
    setActiveTab,
    bills,
    setSelectedBillForInspection,
    setSelectedBillForPayment,
    setIsLoginModalOpen,
    conservationStats
  } = useApp();

  const [activeStep, setActiveStep] = useState<number | null>(null);

  const demoSteps = [
    {
      step: 1,
      label: '1. Why is My Bill High?',
      icon: <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
      tag: 'Surge Math',
      colorClass: 'border-amber-500/40 hover:border-amber-400 text-amber-200',
      activeClass: 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-extrabold border-amber-300 shadow-md shadow-amber-500/30',
      desc: 'Opens surge bill with plain English math and simple reasons (not an accusation).',
      run: () => {
        const tenant = users.find(u => u.id === 'user-tenant-1')!;
        setCurrentUser(tenant);
        setActiveTab('bills');
        const b = bills.find(item => item.id === 'bill-ind-elec-nov24-catchup') || bills[2];
        setSelectedBillForInspection(b);
        setActiveStep(1);
      }
    },
    {
      step: 2,
      label: '2. Double-Charge Shield',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />,
      tag: 'Lock Tech',
      colorClass: 'border-purple-500/40 hover:border-purple-400 text-purple-200',
      activeClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold border-purple-300 shadow-md shadow-purple-500/30',
      desc: 'Simulates trying to pay twice — see how your money is kept safe with idempotency locks.',
      run: () => {
        const tenant = users.find(u => u.id === 'user-tenant-1')!;
        setCurrentUser(tenant);
        setActiveTab('bills');
        const b = bills.find(item => item.id === 'bill-ind-elec-nov24-catchup') || bills[2];
        setSelectedBillForPayment(b);
        setActiveStep(2);
      }
    },
    {
      step: 3,
      label: '3. Outage Updates',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
      tag: 'Feeder Sync',
      colorClass: 'border-rose-500/40 hover:border-rose-400 text-rose-200',
      activeClass: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold border-rose-300 shadow-md shadow-rose-500/30',
      desc: 'See neighborhood power cut updates and how reports are grouped by feeder.',
      run: () => {
        setActiveTab('outages');
        setActiveStep(3);
      }
    },
    {
      step: 4,
      label: '4. Quick Complaint Status',
      icon: <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
      tag: '1-Click',
      colorClass: 'border-cyan-500/40 hover:border-cyan-400 text-cyan-200',
      activeClass: 'bg-gradient-to-r from-sky-500 to-cyan-600 text-slate-950 font-extrabold border-cyan-300 shadow-md shadow-cyan-500/30',
      desc: 'Track a meter inquiry from start to finish with full timeline.',
      run: () => {
        setActiveTab('complaints');
        setActiveStep(4);
      }
    },
    {
      step: 5,
      label: '5. Landlord View',
      icon: <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      tag: 'Multi-Tenant',
      colorClass: 'border-emerald-500/40 hover:border-emerald-400 text-emerald-200',
      activeClass: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold border-emerald-300 shadow-md shadow-emerald-500/30',
      desc: 'Switch to owner Anita Desai to view all your rented homes in one place.',
      run: () => {
        const owner = users.find(u => u.id === 'user-owner-1')!;
        setCurrentUser(owner);
        setActiveTab('overview');
        setActiveStep(5);
      }
    },
    {
      step: 6,
      label: '6. Officer Desk',
      icon: <Shield className="w-3.5 h-3.5 text-violet-400 shrink-0" />,
      tag: 'Control Room',
      colorClass: 'border-violet-500/40 hover:border-violet-400 text-violet-200',
      activeClass: 'bg-gradient-to-r from-violet-600 to-indigo-700 text-white font-extrabold border-violet-300 shadow-md shadow-violet-500/30',
      desc: 'Switch to utility engineer to check alerts and confirm repairs.',
      run: () => {
        const admin = users.find(u => u.id === 'user-admin-1')!;
        setCurrentUser(admin);
        setActiveTab('admin');
        setActiveStep(6);
      }
    },
    {
      step: 7,
      label: '7. Save On AC & Solar',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />,
      tag: 'Save ₹399',
      colorClass: 'border-amber-500/40 hover:border-amber-400 text-amber-200',
      activeClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-extrabold border-yellow-200 shadow-md shadow-amber-400/30',
      desc: 'See how setting AC to 24°C saves ₹399/month and cuts carbon.',
      run: () => {
        setActiveTab('savings');
        setActiveStep(7);
      }
    },
    {
      step: 8,
      label: '8. State Maps & Analytics',
      icon: <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
      tag: '7 States',
      colorClass: 'border-rose-500/40 hover:border-rose-400 text-rose-200',
      activeClass: 'bg-gradient-to-r from-rose-500 via-purple-600 to-sky-500 text-white font-extrabold border-rose-300 shadow-md shadow-rose-500/30',
      desc: 'Explore interactive India state maps (Rajasthan, Delhi, Maharashtra, Gujarat, Kerala) and 6-month trends.',
      run: () => {
        setActiveTab('analytics');
        setActiveStep(8);
      }
    }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-2 px-4 sm:px-6 border-b border-slate-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 text-xs">
        {/* Left: Label & Direct Login Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 text-amber-300 font-extrabold">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="tracking-tight">Interactive Tour:</span>
          </div>

          {/* Quick User Login & Switcher Button inside demo bar */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-600/80 to-purple-600/80 hover:from-orange-500 hover:to-purple-500 text-white border border-orange-400/50 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Open User Sign In & Profile Switcher"
          >
            <User className="w-3.5 h-3.5 text-amber-200" />
            <span>Sign In / Switch</span>
          </button>
        </div>

        {/* Center: Scrollable Step Buttons with Individual Vibrant Hues */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          {demoSteps.map(s => {
            const isSelected = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={s.run}
                title={s.desc}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 border text-xs cursor-pointer ${
                  isSelected
                    ? s.activeClass
                    : `bg-slate-900/90 hover:bg-slate-800 ${s.colorClass}`
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  isSelected ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-300'
                }`}>
                  {s.tag}
                </span>
                <ChevronRight className={`w-3 h-3 ${isSelected ? 'opacity-90' : 'text-slate-500'}`} />
              </button>
            );
          })}
        </div>

        {/* Right: GitHub-Style Ahead of X% Badge with Contribution Dots */}
        <div className="hidden 2xl:flex items-center gap-2.5 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs text-slate-200 shrink-0 shadow-xs">
          <div className="flex items-center gap-1.5">
            {/* GitHub-style green squares */}
            <div className="inline-flex gap-0.5">
              <span className="w-2 h-2 rounded-[1.5px] bg-emerald-500"></span>
              <span className="w-2 h-2 rounded-[1.5px] bg-teal-400"></span>
              <span className="w-2 h-2 rounded-[1.5px] bg-amber-400"></span>
              <span className="w-2 h-2 rounded-[1.5px] bg-emerald-400"></span>
            </div>
            <span className="text-emerald-300 font-extrabold">
              Ahead of {conservationStats.aheadOfPercent}%
            </span>
          </div>
          <span className="text-slate-500">·</span>
          <span className="text-amber-300 font-bold flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>18d streak</span>
          </span>
        </div>
      </div>
    </div>
  );
};

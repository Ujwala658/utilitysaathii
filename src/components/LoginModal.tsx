/**
 * Utility Saathi - User Login & Profile Switcher Modal
 * Provides 1-click role logins and simulated Mobile/Consumer ID OTP sign-in.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  ShieldCheck,
  Building,
  KeyRound,
  Phone,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Sparkles,
  Zap,
  Droplets
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    currentUser,
    users,
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginUser,
    logoutUser,
    properties
  } = useApp();

  const [activeMode, setActiveMode] = useState<'quick' | 'otp'>('quick');
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    setOtpError('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue === '123456' || otpValue.length === 6) {
      // Find matching user or default to Rohan
      const matched = users.find(u => u.phone.includes(mobileNumber.slice(-5))) || users[0];
      loginUser(matched.id);
      setIsLoginModalOpen(false);
      setOtpSent(false);
      setOtpValue('');
    } else {
      setOtpError('Invalid OTP code. Please enter 123456 for the demo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-teal-100 flex items-center justify-center">
              <User className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                User Sign In & Account Switcher
              </h2>
              <span className="text-[11px] text-slate-500">
                Switch roles or sign in with your electricity account
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Account Strip */}
        <div className="px-6 py-3 bg-teal-50/70 border-b border-teal-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal-800 text-white font-bold flex items-center justify-center text-xs">
              {currentUser.name[0]}
            </div>
            <div>
              <span className="font-bold text-slate-900">{currentUser.name}</span>
              <span className="text-[10px] text-teal-800 font-semibold ml-2 uppercase bg-white px-1.5 py-0.2 rounded border border-teal-200">
                {currentUser.role}
              </span>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="text-xs text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Account</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveMode('quick')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeMode === 'quick' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Demo Profiles</span>
            </button>
            <button
              onClick={() => setActiveMode('otp')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeMode === 'otp' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-teal-700" />
              <span>Mobile OTP Sign In</span>
            </button>
          </div>

          {/* MODE 1: 1-Click Role Profiles */}
          {activeMode === 'quick' && (
            <div className="space-y-3">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
                Select a Verified Demo Profile:
              </span>

              {users.map(u => {
                const isCurrent = currentUser.id === u.id;

                let roleBadge = 'Tenant';
                let roleColor = 'bg-teal-100 text-teal-800 border-teal-200';
                let icon = <User className="w-4 h-4 text-teal-700" />;
                let description = 'Indiranagar 2BHK flat · Regular bills, surge catch-up & medical priority';

                if (u.role === 'owner') {
                  roleBadge = 'Property Owner';
                  roleColor = 'bg-amber-100 text-amber-900 border-amber-200';
                  icon = <Building className="w-4 h-4 text-amber-700" />;
                  description = 'Owns 2 rental properties in Indiranagar & Whitefield';
                } else if (u.role === 'admin') {
                  roleBadge = 'DISCOM Officer';
                  roleColor = 'bg-purple-100 text-purple-900 border-purple-200';
                  icon = <ShieldCheck className="w-4 h-4 text-purple-700" />;
                  description = 'Assistant Executive Engineer · Grid alerts & fault verification';
                } else if (u.id === 'user-tenant-2') {
                  description = 'Koramangala Studio 4B · Lifeline tariff slab & solar offset';
                }

                return (
                  <div
                    key={u.id}
                    onClick={() => loginUser(u.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-teal-700 bg-teal-50/60 ring-1 ring-teal-700'
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        {icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleColor}`}
                          >
                            {roleBadge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCurrent ? (
                        <span className="text-[11px] font-bold text-teal-800 bg-white px-2.5 py-1 rounded-full border border-teal-300 shadow-xs">
                          Active ✓
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 group-hover:text-slate-700">
                          Log In →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MODE 2: Simulated Mobile / Consumer ID OTP */}
          {activeMode === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Registered Mobile Number or 10-Digit Consumer ID
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={e => setMobileNumber(e.target.value)}
                        placeholder="+91 98765 43210 or 08234-EL-9901"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-teal-700"
                        required
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    We will send a 6-digit confirmation code to your phone to verify your electricity connection.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl text-teal-950 flex items-center justify-between">
                    <span>Code sent to <strong>{mobileNumber}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-teal-800 font-semibold underline text-[11px]"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Enter 6-Digit Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpValue}
                        onChange={e => setOtpValue(e.target.value)}
                        placeholder="123456"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-center tracking-widest text-base font-bold focus:outline-none focus:ring-1 focus:ring-teal-700"
                        required
                      />
                    </div>
                    <div className="text-[11px] text-teal-800 font-semibold mt-1">
                      Tip: Enter demo code <span className="font-mono font-bold bg-teal-100 px-1 rounded">123456</span> to log in instantly.
                    </div>
                  </div>

                  {otpError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[11px]">
                      {otpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-semibold transition-colors"
                  >
                    Confirm & Sign In
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
          <span>Single Civic Sign-On</span>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-slate-700 hover:text-slate-900 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Utility Saathi - Unified Utility Management System
 * React 19 + TypeScript + Tailwind CSS
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DemoFlowBar } from './components/DemoFlowBar';
import { OverviewView } from './components/OverviewView';
import { UsageAnalyticsView } from './components/UsageAnalyticsView';
import { BillsView } from './components/BillsView';
import { PaymentsLedgerView } from './components/PaymentsLedgerView';
import { OutageIncidentView } from './components/OutageIncidentView';
import { ComplaintsView } from './components/ComplaintsView';
import { SavingsCalculatorView } from './components/SavingsCalculatorView';
import { DatasetRegistryView } from './components/DatasetRegistryView';
import { AdminConsoleView } from './components/AdminConsoleView';
import { TestVerificationView } from './components/TestVerificationView';
import { BillDetailModal } from './components/BillDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { PriorityAssistanceModal } from './components/PriorityAssistanceModal';
import { LoginModal } from './components/LoginModal';
import { ShieldCheck, Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top 3-Zone Header Contract */}
      <Header />

      {/* 7-Step Hackathon Guided Tour Bar */}
      <DemoFlowBar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'analytics' && <UsageAnalyticsView />}
        {activeTab === 'bills' && <BillsView />}
        {activeTab === 'payments' && <PaymentsLedgerView />}
        {activeTab === 'outages' && <OutageIncidentView />}
        {activeTab === 'complaints' && <ComplaintsView />}
        {activeTab === 'savings' && <SavingsCalculatorView />}
        {activeTab === 'datasets' && <DatasetRegistryView />}
        {activeTab === 'admin' && <AdminConsoleView />}
        {activeTab === 'tests' && <TestVerificationView />}
      </main>

      {/* Global Interactive Modals */}
      <BillDetailModal />
      <PaymentModal />
      <PriorityAssistanceModal />
      <LoginModal />

      {/* Clean Civic Tech Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-800" />
            <span className="font-semibold text-slate-700">Utility Saathi</span>
            <span>·</span>
            <span>Unified Indian Civic Electricity & Water Management OS</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>KERC LT-2(a) FY24-25</span>
            <span>·</span>
            <span>BWSSB Water Gazette</span>
            <span>·</span>
            <span>CEA Grid Baseline v19 (0.716 kg CO2/kWh)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

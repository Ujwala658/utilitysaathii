/**
 * Utility Saathi - Global Application State & Storage
 * Supports instant role switching, fixture resets, and real-time reactive mutations.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Property,
  Bill,
  PaymentTransaction,
  ServiceReport,
  Incident,
  Complaint,
  PriorityAssistanceRegistration,
  AuditLogItem,
  UserRole
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_BILLS,
  INITIAL_TRANSACTIONS,
  INITIAL_SERVICE_REPORTS,
  INITIAL_INCIDENTS,
  INITIAL_COMPLAINTS,
  INITIAL_PRIORITY_ASSISTANCE
} from '../data/mockFixtures';
import { paymentStore } from '../services/paymentEngine';
import { incidentManager } from '../services/incidentGroupingEngine';
import { authManager } from '../services/authAuthorization';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  properties: Property[];
  bills: Bill[];
  transactions: PaymentTransaction[];
  incidents: Incident[];
  reports: ServiceReport[];
  complaints: Complaint[];
  priorityRegistrations: PriorityAssistanceRegistration[];
  auditLogs: AuditLogItem[];
  selectedBillForInspection: Bill | null;
  setSelectedBillForInspection: (bill: Bill | null) => void;
  selectedBillForPayment: Bill | null;
  setSelectedBillForPayment: (bill: Bill | null) => void;
  isPriorityModalOpen: boolean;
  setIsPriorityModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loginUser: (userId: string) => void;
  logoutUser: () => void;
  conservationStats: {
    aheadOfPercent: number;
    wardRank: number;
    totalNeighbors: number;
    streakDays: number;
    dailyActivity: Array<{ date: string; level: 0 | 1 | 2 | 3 | 4; unitsKwh: number }>;
  };
  // Actions
  resetAllFixtures: () => void;
  initiatePayment: (billId: string, method: 'UPI' | 'NetBanking' | 'DebitCard') => {
    success: boolean;
    blockedDuplicate?: boolean;
    blockReason?: string;
    transaction?: PaymentTransaction;
    message: string;
  };
  reconcilePayment: (txnId: string) => void;
  submitServiceReport: (report: {
    utility: 'electricity' | 'water';
    category: any;
    locality: string;
    city: string;
    feederOrZoneId: string;
    description: string;
  }) => { incident: Incident; wasGrouped: boolean; explanation: string };
  verifyIncident: (incidentId: string, status: any, notes: string) => { success: boolean; error?: string };
  submitComplaint: (data: {
    utility: 'electricity' | 'water';
    category: any;
    subject: string;
    description: string;
    billReference?: string;
    priority: 'normal' | 'high' | 'urgent';
  }) => Complaint;
  updateComplaintStatus: (complaintId: string, status: any, notes: string) => void;
  savePriorityConsent: (data: {
    residentCategory: any;
    medicalEquipmentType: string;
    emergencyContact: string;
  }) => void;
  withdrawPriorityConsent: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Start as Rohan Verma (Tenant)
  const [properties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [reports, setReports] = useState<ServiceReport[]>(INITIAL_SERVICE_REPORTS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [priorityRegistrations, setPriorityRegistrations] = useState<PriorityAssistanceRegistration[]>(INITIAL_PRIORITY_ASSISTANCE);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  
  const [selectedBillForInspection, setSelectedBillForInspection] = useState<Bill | null>(null);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Conservation stats (GitHub-style 28-day eco activity grid)
  const conservationStats = {
    aheadOfPercent: currentUser.role === 'owner' ? 91 : 84,
    wardRank: currentUser.role === 'owner' ? 6 : 14,
    totalNeighbors: 92,
    streakDays: 18,
    dailyActivity: [
      { date: 'Oct 01', level: 2 as const, unitsKwh: 4.8 },
      { date: 'Oct 02', level: 3 as const, unitsKwh: 4.1 },
      { date: 'Oct 03', level: 4 as const, unitsKwh: 3.5 },
      { date: 'Oct 04', level: 3 as const, unitsKwh: 4.0 },
      { date: 'Oct 05', level: 2 as const, unitsKwh: 4.6 },
      { date: 'Oct 06', level: 1 as const, unitsKwh: 6.2 },
      { date: 'Oct 07', level: 3 as const, unitsKwh: 4.2 },
      { date: 'Oct 08', level: 3 as const, unitsKwh: 3.9 },
      { date: 'Oct 09', level: 4 as const, unitsKwh: 3.4 },
      { date: 'Oct 10', level: 4 as const, unitsKwh: 3.6 },
      { date: 'Oct 11', level: 3 as const, unitsKwh: 4.1 },
      { date: 'Oct 12', level: 2 as const, unitsKwh: 4.9 },
      { date: 'Oct 13', level: 3 as const, unitsKwh: 4.0 },
      { date: 'Oct 14', level: 4 as const, unitsKwh: 3.3 },
      { date: 'Oct 15', level: 4 as const, unitsKwh: 3.2 },
      { date: 'Oct 16', level: 3 as const, unitsKwh: 3.8 },
      { date: 'Oct 17', level: 4 as const, unitsKwh: 3.5 },
      { date: 'Oct 18', level: 3 as const, unitsKwh: 4.1 },
      { date: 'Oct 19', level: 2 as const, unitsKwh: 4.7 },
      { date: 'Oct 20', level: 3 as const, unitsKwh: 3.9 },
      { date: 'Oct 21', level: 4 as const, unitsKwh: 3.1 },
      { date: 'Oct 22', level: 4 as const, unitsKwh: 3.4 },
      { date: 'Oct 23', level: 4 as const, unitsKwh: 3.0 },
      { date: 'Oct 24', level: 3 as const, unitsKwh: 3.7 },
      { date: 'Oct 25', level: 4 as const, unitsKwh: 3.2 },
      { date: 'Oct 26', level: 4 as const, unitsKwh: 3.3 },
      { date: 'Oct 27', level: 3 as const, unitsKwh: 3.9 },
      { date: 'Oct 28', level: 4 as const, unitsKwh: 3.1 }
    ]
  };

  const loginUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsLoginModalOpen(false);
      authManager.logEvent(found.name, found.role, 'USER_LOGIN', 'SESSION', found.id, `User logged in as ${found.role}`);
      setAuditLogs(authManager.getAuditLogs());
    }
  };

  const logoutUser = () => {
    // Return to guest or first demo user
    setCurrentUser(INITIAL_USERS[0]);
    setIsLoginModalOpen(true);
  };

  // Initialize service engines with mock data
  useEffect(() => {
    paymentStore.seedTransactions(INITIAL_TRANSACTIONS);
    incidentManager.seed(INITIAL_INCIDENTS, INITIAL_SERVICE_REPORTS);
    authManager.logEvent('System Init', 'admin', 'DATA_SEED', 'SYSTEM', 'SYS-01', 'Loaded seed fixtures for BESCOM & BWSSB demo accounts');
    setAuditLogs(authManager.getAuditLogs());
  }, []);

  const resetAllFixtures = () => {
    setBills(INITIAL_BILLS);
    setTransactions(INITIAL_TRANSACTIONS);
    setIncidents(INITIAL_INCIDENTS);
    setReports(INITIAL_SERVICE_REPORTS);
    setComplaints(INITIAL_COMPLAINTS);
    setPriorityRegistrations(INITIAL_PRIORITY_ASSISTANCE);
    paymentStore.seedTransactions(INITIAL_TRANSACTIONS);
    incidentManager.seed(INITIAL_INCIDENTS, INITIAL_SERVICE_REPORTS);
    authManager.logEvent(currentUser.name, currentUser.role, 'FIXTURE_RESET', 'SYSTEM', 'ALL', 'Reset all demo fixtures to initial baseline');
    setAuditLogs(authManager.getAuditLogs());
    setCurrentUser(INITIAL_USERS[0]); // Reset to tenant
  };

  const initiatePayment = (billId: string, method: 'UPI' | 'NetBanking' | 'DebitCard') => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) {
      return { success: false, message: 'Bill not found' };
    }

    const idempotencyKey = `idemp-${bill.id}-${Date.now()}`;
    const result = paymentStore.initiatePayment({
      billId: bill.id,
      consumerNumber: bill.consumerNumber,
      amount: bill.totalPayableAmount,
      paymentMethod: method,
      idempotencyKey,
      actor: currentUser.name
    });

    if (result.success && result.transaction) {
      // Transition from initiated -> pending
      paymentStore.transitionState(
        result.transaction.id,
        'pending',
        'user_action',
        `Collect request initiated via ${method}`,
        currentUser.name
      );

      // In simulated demo, simulate bank debit confirmation after quick second
      paymentStore.transitionState(
        result.transaction.id,
        'debit_confirmed',
        'bank_webhook',
        'Bank debit confirmed. Utility credit reconciliation queued.',
        'Simulated Bank Switch',
        { bankRef: `BANK-${Date.now().toString().slice(-8)}` }
      );

      // Update bill payment status to payment_pending
      setBills(prev =>
        prev.map(b => (b.id === billId ? { ...b, paymentStatus: 'payment_pending' } : b))
      );

      authManager.logEvent(
        currentUser.name,
        currentUser.role,
        'PAYMENT_INITIATED',
        'BILL',
        bill.billNumber,
        `Initiated ₹${bill.totalPayableAmount} via ${method} (Ref: ${result.transaction.transactionReference})`
      );
    } else if (result.blockedDuplicate) {
      authManager.logEvent(
        currentUser.name,
        currentUser.role,
        'DUPLICATE_PAYMENT_BLOCKED',
        'BILL',
        bill.billNumber,
        `Blocked duplicate payment: ${result.blockReason}`
      );
    }

    setTransactions(paymentStore.getAll());
    setAuditLogs(authManager.getAuditLogs());
    return result;
  };

  const reconcilePayment = (txnId: string) => {
    const res = paymentStore.transitionState(
      txnId,
      'credit_reconciled',
      'utility_gateway',
      'Utility credited; receipt issued by billing clearinghouse.',
      currentUser.name
    );

    if (res.success && res.transaction) {
      const billId = res.transaction.billId;
      setBills(prev =>
        prev.map(b => (b.id === billId ? { ...b, paymentStatus: 'paid' } : b))
      );
      authManager.logEvent(
        currentUser.name,
        currentUser.role,
        'PAYMENT_RECONCILED',
        'TRANSACTION',
        res.transaction.transactionReference,
        `Reconciled receipt ${res.transaction.utilityReceiptNumber} for ₹${res.transaction.amount}`
      );
      setTransactions(paymentStore.getAll());
      setAuditLogs(authManager.getAuditLogs());
    }
  };

  const submitServiceReport = (reportData: {
    utility: 'electricity' | 'water';
    category: any;
    locality: string;
    city: string;
    feederOrZoneId: string;
    description: string;
  }) => {
    const result = incidentManager.submitReport({
      utility: reportData.utility,
      category: reportData.category,
      locality: reportData.locality,
      city: reportData.city,
      feederOrZoneId: reportData.feederOrZoneId,
      timestamp: new Date().toISOString(),
      description: reportData.description,
      reporterUserId: currentUser.id,
      reporterMaskedName: `${currentUser.name.split(' ')[0]} ${currentUser.name.split(' ')[1]?.[0] || ''}.`,
      provenance: 'SIMULATED'
    });

    setIncidents(incidentManager.getAllIncidents());
    setReports(incidentManager.getAllReports());

    authManager.logEvent(
      currentUser.name,
      currentUser.role,
      'SERVICE_REPORT_SUBMITTED',
      'INCIDENT',
      result.incident.incidentNumber,
      `Reported ${reportData.category} in ${reportData.locality}. ${result.wasGrouped ? 'Clustered into existing incident' : 'Created new unverified incident'}`
    );
    setAuditLogs(authManager.getAuditLogs());

    return {
      incident: result.incident,
      wasGrouped: result.wasGrouped,
      explanation: result.ruleExplanation
    };
  };

  const verifyIncident = (incidentId: string, newStatus: any, notes: string) => {
    const result = incidentManager.updateIncidentStatus(
      incidentId,
      newStatus,
      'admin_manual',
      currentUser.role,
      notes,
      new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      'DISCOM Sub-Divisional Operations Center'
    );

    if (result.success && result.incident) {
      setIncidents(incidentManager.getAllIncidents());
      authManager.logEvent(
        currentUser.name,
        currentUser.role,
        'INCIDENT_STATUS_VERIFIED',
        'INCIDENT',
        result.incident.incidentNumber,
        `Transitioned status to ${newStatus}. Notes: ${notes}`
      );
      setAuditLogs(authManager.getAuditLogs());
      return { success: true };
    }

    return { success: false, error: result.error };
  };

  const submitComplaint = (data: {
    utility: 'electricity' | 'water';
    category: any;
    subject: string;
    description: string;
    billReference?: string;
    priority: 'normal' | 'high' | 'urgent';
  }) => {
    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      id: `cmp-${Date.now().toString().slice(-6)}`,
      complaintNumber: `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userRole: currentUser.role,
      propertyId: currentUser.propertyIds[0] || 'prop-indiranagar',
      utility: data.utility,
      category: data.category,
      billReference: data.billReference,
      subject: data.subject,
      description: data.description,
      status: 'submitted',
      assignedDesk: `${data.utility === 'electricity' ? 'BESCOM' : 'BWSSB'} Consumer Redressal Desk`,
      priority: data.priority,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          timestamp: now,
          action: 'Complaint Registered',
          actor: `${currentUser.name} (${currentUser.role})`,
          notes: 'Formal grievance submitted via Utility Saathi portal.'
        }
      ],
      provenance: 'SIMULATED'
    };

    setComplaints(prev => [newComplaint, ...prev]);
    authManager.logEvent(
      currentUser.name,
      currentUser.role,
      'COMPLAINT_FILED',
      'COMPLAINT',
      newComplaint.complaintNumber,
      `Registered grievance regarding ${data.category} (${data.subject})`
    );
    setAuditLogs(authManager.getAuditLogs());
    return newComplaint;
  };

  const updateComplaintStatus = (complaintId: string, status: any, notes: string) => {
    const now = new Date().toISOString();
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          return {
            ...c,
            status,
            updatedAt: now,
            timeline: [
              ...c.timeline,
              {
                timestamp: now,
                action: `Status transitioned to ${status}`,
                actor: `${currentUser.name} (${currentUser.role})`,
                notes
              }
            ]
          };
        }
        return c;
      })
    );

    authManager.logEvent(
      currentUser.name,
      currentUser.role,
      'COMPLAINT_UPDATED',
      'COMPLAINT',
      complaintId,
      `Status changed to ${status}: ${notes}`
    );
    setAuditLogs(authManager.getAuditLogs());
  };

  const savePriorityConsent = (data: {
    residentCategory: any;
    medicalEquipmentType: string;
    emergencyContact: string;
  }) => {
    const now = new Date().toISOString();
    const newReg: PriorityAssistanceRegistration = {
      id: `pa-${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      propertyId: currentUser.propertyIds[0] || 'prop-indiranagar',
      residentCategory: data.residentCategory,
      medicalEquipmentTypeMasked: data.medicalEquipmentType,
      consentGiven: true,
      consentTimestamp: now,
      consentVersion: 'DPDP-2023-CONSENT-V1',
      maskedEmergencyContact: data.emergencyContact,
      accessAuditedByRoleOnly: true
    };

    setPriorityRegistrations(prev => [newReg, ...prev.filter(p => p.userId !== currentUser.id)]);
    authManager.logEvent(
      currentUser.name,
      currentUser.role,
      'PRIORITY_ASSISTANCE_OPT_IN',
      'CONSENT',
      newReg.id,
      `Resident opt-in recorded under category: ${data.residentCategory}. Consent timestamp locked.`
    );
    setAuditLogs(authManager.getAuditLogs());
  };

  const withdrawPriorityConsent = () => {
    const now = new Date().toISOString();
    setPriorityRegistrations(prev =>
      prev.map(p => {
        if (p.userId === currentUser.id) {
          return {
            ...p,
            consentGiven: false,
            withdrawalTimestamp: now
          };
        }
        return p;
      })
    );

    authManager.logEvent(
      currentUser.name,
      currentUser.role,
      'PRIORITY_ASSISTANCE_CONSENT_WITHDRAWN',
      'CONSENT',
      currentUser.id,
      'Resident exercised consent withdrawal. Medical vulnerability flagged as revoked.'
    );
    setAuditLogs(authManager.getAuditLogs());
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        properties,
        bills,
        transactions,
        incidents,
        reports,
        complaints,
        priorityRegistrations,
        auditLogs,
        selectedBillForInspection,
        setSelectedBillForInspection,
        selectedBillForPayment,
        setSelectedBillForPayment,
        isPriorityModalOpen,
        setIsPriorityModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        activeTab,
        setActiveTab,
        loginUser,
        logoutUser,
        conservationStats,
        resetAllFixtures,
        initiatePayment,
        reconcilePayment,
        submitServiceReport,
        verifyIncident,
        submitComplaint,
        updateComplaintStatus,
        savePriorityConsent,
        withdrawPriorityConsent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

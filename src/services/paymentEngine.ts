/**
 * Utility Saathi - Payment State Tracking & Duplicate-Payment Protection Engine
 * Enforces explicit states, append-only event logs, idempotency, and double-debit shields.
 * Labels all outputs: SIMULATED – NO MONEY MOVES
 */

import { PaymentState, PaymentTransaction, PaymentEvent } from '../types';

export interface InitiatePaymentRequest {
  billId: string;
  consumerNumber: string;
  amount: number;
  paymentMethod: 'UPI' | 'NetBanking' | 'DebitCard';
  idempotencyKey: string;
  actor: string;
}

export interface PaymentAttemptResult {
  success: boolean;
  blockedDuplicate?: boolean;
  blockReason?: string;
  transaction?: PaymentTransaction;
  message: string;
}

// In-memory transaction registry & idempotency store
class PaymentStore {
  private transactions: Map<string, PaymentTransaction> = new Map();
  private idempotencyIndex: Map<string, string> = new Map(); // idempotencyKey -> transactionId
  private billActiveTxnIndex: Map<string, string> = new Map(); // billId -> activeTransactionId

  public getAll(): PaymentTransaction[] {
    return Array.from(this.transactions.values()).sort(
      (a, b) => new Date(b.initiatedAt).getTime() - new Date(a.initiatedAt).getTime()
    );
  }

  public getById(id: string): PaymentTransaction | undefined {
    return this.transactions.get(id);
  }

  public getByBillId(billId: string): PaymentTransaction[] {
    return Array.from(this.transactions.values()).filter(t => t.billId === billId);
  }

  public getActiveTransactionForBill(billId: string): PaymentTransaction | undefined {
    const activeId = this.billActiveTxnIndex.get(billId);
    if (!activeId) return undefined;
    return this.transactions.get(activeId);
  }

  public seedTransactions(txns: PaymentTransaction[]) {
    for (const t of txns) {
      this.transactions.set(t.id, t);
      this.idempotencyIndex.set(t.idempotencyKey, t.id);
      if (this.isUnresolvedState(t.state)) {
        this.billActiveTxnIndex.set(t.billId, t.id);
      }
    }
  }

  public isUnresolvedState(state: PaymentState): boolean {
    return state === 'initiated' || state === 'pending' || state === 'debit_confirmed';
  }

  public initiatePayment(req: InitiatePaymentRequest): PaymentAttemptResult {
    // 1. Check idempotency key collision
    if (this.idempotencyIndex.has(req.idempotencyKey)) {
      const existingId = this.idempotencyIndex.get(req.idempotencyKey)!;
      const existing = this.transactions.get(existingId)!;
      return {
        success: true,
        transaction: existing,
        message: `Idempotent request detected. Returning existing transaction reference ${existing.transactionReference}.`
      };
    }

    // 2. Check if this bill currently has an unresolved transaction
    const activeTxn = this.getActiveTransactionForBill(req.billId);
    if (activeTxn && this.isUnresolvedState(activeTxn.state)) {
      let stateExplanation = '';
      if (activeTxn.state === 'debit_confirmed') {
        stateExplanation = `Your bank has already confirmed a debit of ₹${activeTxn.amount.toFixed(2)} under reference ${activeTxn.transactionReference}, but credit reconciliation at the utility is currently pending. Initiating another payment may result in double debit.`;
      } else if (activeTxn.state === 'pending') {
        stateExplanation = `A payment of ₹${activeTxn.amount.toFixed(2)} (${activeTxn.transactionReference}) is currently pending bank gateway confirmation. Please wait 15 minutes before retrying.`;
      } else {
        stateExplanation = `A payment session (${activeTxn.transactionReference}) was already initiated.`;
      }

      return {
        success: false,
        blockedDuplicate: true,
        blockReason: stateExplanation,
        transaction: activeTxn,
        message: `DUPLICATE PAYMENT BLOCKED: Transaction ${activeTxn.transactionReference} is unresolved (${activeTxn.state}). Duplicate payment attempt rejected to protect your funds.`
      };
    }

    // 3. Create fresh transaction
    const nowIso = new Date().toISOString();
    const txnId = `TXN-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const initialEvent: PaymentEvent = {
      id: `evt-${Date.now()}-1`,
      timestamp: nowIso,
      fromState: 'none',
      toState: 'initiated',
      trigger: 'user_action',
      note: `Payment initiated for Bill ${req.billId} (Amount ₹${req.amount.toFixed(2)}) via ${req.paymentMethod}`,
      actor: req.actor
    };

    const newTxn: PaymentTransaction = {
      id: txnId,
      billId: req.billId,
      consumerNumber: req.consumerNumber,
      amount: req.amount,
      idempotencyKey: req.idempotencyKey,
      transactionReference: `REF-${txnId}`,
      paymentMethod: req.paymentMethod,
      state: 'initiated',
      initiatedAt: nowIso,
      eventHistory: [initialEvent],
      provenance: 'SIMULATED – NO MONEY MOVES'
    };

    this.transactions.set(txnId, newTxn);
    this.idempotencyIndex.set(req.idempotencyKey, txnId);
    this.billActiveTxnIndex.set(req.billId, txnId);

    return {
      success: true,
      transaction: newTxn,
      message: `Transaction ${newTxn.transactionReference} initiated successfully.`
    };
  }

  public transitionState(
    transactionId: string,
    targetState: PaymentState,
    trigger: PaymentEvent['trigger'],
    note: string,
    actor: string,
    extraFields?: {
      bankRef?: string;
      receiptNo?: string;
      failureReason?: string;
    }
  ): { success: boolean; transaction?: PaymentTransaction; error?: string } {
    const txn = this.transactions.get(transactionId);
    if (!txn) {
      return { success: false, error: `Transaction ${transactionId} not found.` };
    }

    const currentState = txn.state;

    // Validate legal state transitions
    const legalTransitions: Record<PaymentState, PaymentState[]> = {
      initiated: ['pending', 'failed'],
      pending: ['debit_confirmed', 'failed'],
      debit_confirmed: ['credit_reconciled', 'reversed'],
      credit_reconciled: [], // terminal success
      failed: [], // terminal fail - unlocks bill for safe retry
      reversed: [] // terminal reversed - unlocks bill for safe retry
    };

    if (!legalTransitions[currentState].includes(targetState)) {
      return {
        success: false,
        error: `Illegal state transition from '${currentState}' to '${targetState}'.`
      };
    }

    const nowIso = new Date().toISOString();
    const event: PaymentEvent = {
      id: `evt-${Date.now()}-${txn.eventHistory.length + 1}`,
      timestamp: nowIso,
      fromState: currentState,
      toState: targetState,
      trigger,
      note,
      actor
    };

    txn.state = targetState;
    txn.eventHistory.push(event);

    if (targetState === 'debit_confirmed') {
      txn.debitConfirmedAt = nowIso;
      if (extraFields?.bankRef) txn.bankReferenceNumber = extraFields.bankRef;
    } else if (targetState === 'credit_reconciled') {
      txn.creditReconciledAt = nowIso;
      txn.utilityReceiptNumber = extraFields?.receiptNo || `RCPT-${Math.floor(100000 + Math.random() * 900000)}`;
      // Clear active unresolved lock
      this.billActiveTxnIndex.delete(txn.billId);
    } else if (targetState === 'failed') {
      txn.failedAt = nowIso;
      txn.failureReason = extraFields?.failureReason || note;
      // Clear active unresolved lock, enabling safe retry
      this.billActiveTxnIndex.delete(txn.billId);
    } else if (targetState === 'reversed') {
      txn.failureReason = extraFields?.failureReason || 'Bank refund reversed to customer account';
      // Clear active unresolved lock, enabling safe retry
      this.billActiveTxnIndex.delete(txn.billId);
    }

    return { success: true, transaction: txn };
  }
}

export const paymentStore = new PaymentStore();

/**
 * Utility Saathi - Authorization, Role-Based Access Control & Consent Manager
 * Enforces role barriers, property-level tenant data isolation, and sensitive priority assistance redaction.
 */

import {
  User,
  UserRole,
  Property,
  Bill,
  Complaint,
  PriorityAssistanceRegistration,
  AuditLogItem
} from '../types';

export class AuthorizationManager {
  private auditLogs: AuditLogItem[] = [];

  public logEvent(
    actorName: string,
    actorRole: UserRole,
    action: string,
    entityType: string,
    entityId: string,
    summary: string
  ) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      action,
      entityType,
      entityId,
      summary
    });
  }

  public getAuditLogs(): AuditLogItem[] {
    return [...this.auditLogs];
  }

  /**
   * Evaluates if user has permission to view a property
   */
  public canAccessProperty(user: User, property: Property): boolean {
    if (user.role === 'admin') return true;
    if (user.role === 'owner') return property.ownerId === user.id;
    if (user.role === 'tenant') return property.tenantIds.includes(user.id);
    return false;
  }

  /**
   * Filters bills based on user authorization
   */
  public filterAuthorizedBills(user: User, bills: Bill[], properties: Property[]): Bill[] {
    if (user.role === 'admin') {
      return bills;
    }

    const authorizedPropIds = new Set(
      properties.filter(p => this.canAccessProperty(user, p)).map(p => p.id)
    );

    return bills.filter(b => authorizedPropIds.has(b.propertyId));
  }

  /**
   * Checks if user can access a specific bill
   */
  public canAccessBill(user: User, bill: Bill, property?: Property): boolean {
    if (user.role === 'admin') return true;
    if (!property) return user.propertyIds.includes(bill.propertyId);
    return this.canAccessProperty(user, property);
  }

  /**
   * Filters complaints based on user role and ownership
   */
  public filterAuthorizedComplaints(user: User, complaints: Complaint[], properties: Property[]): Complaint[] {
    if (user.role === 'admin') {
      return complaints;
    }

    if (user.role === 'owner') {
      const ownedPropertyIds = new Set(
        properties.filter(p => p.ownerId === user.id).map(p => p.id)
      );
      // Owner sees complaints for properties they own or created by themselves
      return complaints.filter(c => ownedPropertyIds.has(c.propertyId) || c.userId === user.id);
    }

    // Tenant sees strictly their own complaints
    return complaints.filter(c => c.userId === user.id);
  }

  /**
   * Priority Assistance Access Check:
   * Sensitive medical vulnerability data is RESTRICTED to administrators / verified utility operators.
   * Tenants/unauthorized users cannot see other residents' sensitive assistance data.
   */
  public canViewSensitivePriorityAssistance(user: User, record: PriorityAssistanceRegistration): boolean {
    if (user.role === 'admin') return true;
    // Resident can view their own record only
    return record.userId === user.id;
  }

  /**
   * Redacts sensitive medical data if viewed by non-admin or unprivileged viewer
   */
  public sanitizePriorityRecord(
    user: User,
    record: PriorityAssistanceRegistration
  ): Partial<PriorityAssistanceRegistration> | null {
    if (!this.canViewSensitivePriorityAssistance(user, record)) {
      return null; // completely hidden
    }

    if (user.role === 'admin') {
      return record;
    }

    // Return with own view
    return record;
  }
}

export const authManager = new AuthorizationManager();

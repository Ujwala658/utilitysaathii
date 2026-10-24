/**
 * Utility Saathi - Incident Grouping & Verification Engine
 * Explainable topological clustering for outage and water interruption reports.
 * Enforces administrative verification gates (community volume alone does not verify).
 */

import { Incident, ServiceReport, IncidentStatus, UtilityType, UserRole } from '../types';

export interface GroupingRuleResult {
  matchedIncidentId?: string;
  reason: string;
}

export class IncidentManager {
  private incidents: Map<string, Incident> = new Map();
  private reports: Map<string, ServiceReport> = new Map();

  public getAllIncidents(): Incident[] {
    return Array.from(this.incidents.values()).sort(
      (a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
    );
  }

  public getIncidentById(id: string): Incident | undefined {
    return this.incidents.get(id);
  }

  public getAllReports(): ServiceReport[] {
    return Array.from(this.reports.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public seed(incidents: Incident[], reports: ServiceReport[]) {
    for (const inc of incidents) {
      this.incidents.set(inc.id, inc);
    }
    for (const rep of reports) {
      this.reports.set(rep.id, rep);
    }
  }

  /**
   * Explainable Grouping Logic:
   * 1. Utility type MUST match (power outage never groups with water supply).
   * 2. Locality MUST match.
   * 3. Must match either same Feeder/Substation/Zone OR within a 4-hour time window.
   * Unrelated reports (e.g. water vs power, or different locality/feeders) are NOT grouped.
   */
  public evaluateGrouping(report: ServiceReport): GroupingRuleResult {
    const reportTime = new Date(report.timestamp).getTime();

    for (const inc of this.incidents.values()) {
      // Must not be closed
      if (inc.status === 'closed' || inc.status === 'service_restored') {
        continue;
      }

      // Rule 1: Utility type must strictly match
      if (inc.utility !== report.utility) {
        continue;
      }

      // Rule 2: Locality must match
      if (inc.locality.toLowerCase().trim() !== report.locality.toLowerCase().trim()) {
        continue;
      }

      // Rule 3: Feeder/Substation match
      if (
        report.feederOrZoneId &&
        inc.feederOrZone &&
        report.feederOrZoneId.toLowerCase() === inc.feederOrZone.toLowerCase()
      ) {
        return {
          matchedIncidentId: inc.id,
          reason: `Grouped with ${inc.incidentNumber}: exact match on utility (${report.utility}), locality (${report.locality}), and electrical feeder/water zone (${report.feederOrZoneId}).`
        };
      }

      // Rule 4: Time window proximity (within 4 hours of first report) in same locality
      const incFirstTime = new Date(inc.firstReportedAt).getTime();
      const diffHours = Math.abs(reportTime - incFirstTime) / (1000 * 60 * 60);

      if (diffHours <= 4.0) {
        return {
          matchedIncidentId: inc.id,
          reason: `Grouped with ${inc.incidentNumber}: temporal cluster within ${diffHours.toFixed(1)} hrs in identical locality (${report.locality}).`
        };
      }
    }

    return {
      reason: `No matching incident found. Report represents a distinct locality, utility type, or time frame.`
    };
  }

  /**
   * Submit and group a user service report
   */
  public submitReport(
    report: Omit<ServiceReport, 'id' | 'status' | 'incidentId'>
  ): { report: ServiceReport; incident: Incident; wasGrouped: boolean; ruleExplanation: string } {
    const reportId = `REP-${Date.now().toString().slice(-6)}`;
    const fullReport: ServiceReport = {
      ...report,
      id: reportId,
      status: 'reported_raw'
    };

    const grouping = this.evaluateGrouping(fullReport);

    if (grouping.matchedIncidentId && this.incidents.has(grouping.matchedIncidentId)) {
      const incident = this.incidents.get(grouping.matchedIncidentId)!;
      incident.reportedCount += 1;
      incident.lastUpdatedAt = new Date().toISOString();
      incident.associatedReportIds.push(reportId);

      fullReport.status = 'grouped_in_incident';
      fullReport.incidentId = incident.id;
      this.reports.set(reportId, fullReport);

      return {
        report: fullReport,
        incident,
        wasGrouped: true,
        ruleExplanation: grouping.reason
      };
    } else {
      // Create new incident in 'reported_unverified' state
      const incId = `INC-${Date.now().toString().slice(-6)}`;
      const newIncident: Incident = {
        id: incId,
        incidentNumber: `INC-${report.utility.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
        utility: report.utility,
        title: `${report.category.replace('_', ' ').toUpperCase()} in ${report.locality}`,
        locality: report.locality,
        city: report.city,
        feederOrZone: report.feederOrZoneId || 'Local Distribution Node',
        status: 'reported_unverified', // Strict default
        verificationSource: 'none',
        reportedCount: 1,
        firstReportedAt: report.timestamp,
        lastUpdatedAt: new Date().toISOString(),
        estimatedRestorationTime: null,
        etaSource: null,
        officialRestorationNotes: 'Community cluster logged; awaiting sub-division engineer verification.',
        associatedReportIds: [reportId],
        provenance: 'SIMULATED'
      };

      this.incidents.set(incId, newIncident);
      fullReport.status = 'grouped_in_incident';
      fullReport.incidentId = incId;
      this.reports.set(reportId, fullReport);

      return {
        report: fullReport,
        incident: newIncident,
        wasGrouped: false,
        ruleExplanation: 'New incident created in Reported - Unverified state. Community report volume does not auto-verify.'
      };
    }
  }

  /**
   * Administrative status transition with verification governance
   */
  public updateIncidentStatus(
    incidentId: string,
    newStatus: IncidentStatus,
    verificationSource: Incident['verificationSource'],
    operatorRole: UserRole,
    notes: string,
    eta?: string,
    etaSource?: string
  ): { success: boolean; incident?: Incident; error?: string } {
    const inc = this.incidents.get(incidentId);
    if (!inc) {
      return { success: false, error: 'Incident not found' };
    }

    // Authorization check: Only Admin can transition to verified statuses
    const verifiedStatuses: IncidentStatus[] = [
      'verified_fault',
      'planned_maintenance',
      'restoration_in_progress',
      'service_restored'
    ];

    if (verifiedStatuses.includes(newStatus) && operatorRole !== 'admin') {
      return {
        success: false,
        error: `SECURITY REJECTION: Role '${operatorRole}' is not authorized to verify incidents or publish official restoration statuses. Only authorized utility administrators or certified SCADA feeds can verify.`
      };
    }

    if (newStatus === 'verified_fault' && verificationSource === 'none') {
      return {
        success: false,
        error: `AUDIT REJECTION: Incident cannot be marked 'verified_fault' without a verified evidence source (e.g. admin_manual or discom_scada_verified).`
      };
    }

    inc.status = newStatus;
    inc.verificationSource = verificationSource;
    inc.officialRestorationNotes = notes;
    inc.lastUpdatedAt = new Date().toISOString();

    if (eta) {
      inc.estimatedRestorationTime = eta;
      inc.etaSource = etaSource || 'Illustrative DISCOM Field ETA (Subject to site conditions)';
    }

    return { success: true, incident: inc };
  }
}

export const incidentManager = new IncidentManager();

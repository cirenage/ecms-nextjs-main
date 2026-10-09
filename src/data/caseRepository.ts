import {
  UserProfile,
  CaseRecord,
  FilingItem,
  FilingStatus,
  FilingActivity,
  HearingItem,
  SystemTask,
  NotificationItem,
  InvoiceItem,
  BusinessPartner,
  UserRole,
  SubsequentFilingItem,
} from '../types';
import { generateOfficialSuitNumber } from '../services/suitNumberService';
import {
  DEMO_USERS,
  INITIAL_CASES,
  INITIAL_FILINGS,
  INITIAL_HEARINGS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_INVOICES,
  INITIAL_BUSINESS_PARTNERS,
} from './mockData';

const STORAGE_KEY_PREFIX = 'jsg_ecms_';

function loadOrInit<T>(key: string, initial: T): T {
  if (typeof window === 'undefined') return initial;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load from localStorage', e);
  }
  return initial;
}

function save<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export class CaseRepository {
  private static instance: CaseRepository;

  private currentUser: UserProfile;
  private cases: CaseRecord[];
  private filings: FilingItem[];
  private hearings: HearingItem[];
  private tasks: SystemTask[];
  private notifications: NotificationItem[];
  private invoices: InvoiceItem[];
  private businessPartners: BusinessPartner[];
  private subsequentFilings: SubsequentFilingItem[];

  private listeners: (() => void)[] = [];

  private constructor() {
    this.currentUser = loadOrInit<UserProfile>('current_user', DEMO_USERS.registrar);
    this.cases = loadOrInit<CaseRecord[]>('cases', INITIAL_CASES);
    this.filings = loadOrInit<FilingItem[]>('filings', INITIAL_FILINGS);
    this.hearings = loadOrInit<HearingItem[]>('hearings', INITIAL_HEARINGS);
    this.tasks = loadOrInit<SystemTask[]>('tasks', INITIAL_TASKS);
    this.notifications = loadOrInit<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
    this.invoices = loadOrInit<InvoiceItem[]>('invoices', INITIAL_INVOICES);
    this.businessPartners = loadOrInit<BusinessPartner[]>('business_partners', INITIAL_BUSINESS_PARTNERS);
    this.subsequentFilings = loadOrInit<SubsequentFilingItem[]>('subsequent_filings', []);
  }

  public static getInstance(): CaseRepository {
    if (!CaseRepository.instance) {
      CaseRepository.instance = new CaseRepository();
    }
    return CaseRepository.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // User Management & Role Switching
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public switchRole(role: UserRole): UserProfile {
    const user = DEMO_USERS[role] || DEMO_USERS.registrar;
    this.currentUser = user;
    save('current_user', user);
    this.notify();
    return user;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    save('current_user', user);
    this.notify();
  }

  // Cases
  public getCases(): CaseRecord[] {
    return this.cases;
  }

  public getCaseById(id: string): CaseRecord | undefined {
    return this.cases.find((c) => c.id === id || c.suitNumber === id);
  }

  public addCase(newCase: CaseRecord): void {
    this.cases = [newCase, ...this.cases];
    save('cases', this.cases);
    this.notify();
  }

  public updateCaseStatus(id: string, status: CaseRecord['status'], mandatory?: CaseRecord['mandatoryProcess']): void {
    this.cases = this.cases.map((c) => {
      if (c.id === id || c.suitNumber === id) {
        return {
          ...c,
          status,
          ...(mandatory ? { mandatoryProcess: mandatory } : {}),
        };
      }
      return c;
    });
    save('cases', this.cases);
    this.notify();
  }

  public assignJudge(id: string, judgeId: string, judgeName: string): void {
    this.cases = this.cases.map(c => c.id === id ? { ...c, assignedJudgeId: judgeId, assignedJudgeName: judgeName, status: 'Case Management' } : c);
    save('cases', this.cases);
    this.notify();
  }

  // Filings (Intake & E-Filing)
  public getFilings(): FilingItem[] {
    return this.filings;
  }

  public getFilingById(id: string): FilingItem | undefined {
    return this.filings.find((f) => f.id === id || f.intakeId === id || f.filingReference === id);
  }

  public addFiling(filing: FilingItem): void {
    this.filings = [filing, ...this.filings];
    save('filings', this.filings);

    // Also trigger notification for registrar
    this.addNotification({
      id: `notif_${Date.now()}`,
      title: 'New Filing Submitted',
      description: `${filing.caseTitle} (${filing.filingReference}) submitted by ${filing.submittedBy}`,
      timestamp: 'Just now',
      timeLabel: 'Just now',
      category: 'filing',
      unread: true,
      caseRef: filing.filingReference,
    });

    this.notify();
  }

  public updateFilingDecision(
    id: string,
    decision: 'Approved' | 'Clarification' | 'Rejected',
    notes?: string
  ): void {
    let approvedFiling: FilingItem | undefined;

    this.filings = this.filings.map((f) => {
      if (f.id === id || f.intakeId === id) {
        approvedFiling = {
          ...f,
          status: decision === 'Approved' ? 'Ready for Registration' : decision === 'Clarification' ? 'Correction Required' : 'Returned / Rejected',
          registrarNotes: notes || f.registrarNotes,
        };
        return approvedFiling;
      }
      return f;
    });
    save('filings', this.filings);

    // If approved, create or register active case
    if (decision === 'Approved' && approvedFiling && !this.cases.some(c => c.filingRef === approvedFiling!.filingReference)) {
      const generatedSuit = generateOfficialSuitNumber({
        divisionCode: 'CV',
        existingSuitNumbers: this.cases.map((c) => c.suitNumber),
      });

      const newCase: CaseRecord = {
        id: `case_${Date.now()}`,
        suitNumber: generatedSuit,
        caseTitle: approvedFiling.caseTitle,
        caseType: approvedFiling.caseType,
        category: 'Commercial',
        court: approvedFiling.court,
        courtRoom: 'Court 2, Law Court Complex, Accra',
        division: approvedFiling.division,
        claimAmount: approvedFiling.claimAmount,
        natureOfClaim: approvedFiling.natureOfClaim,
        dateFiled: new Date().toISOString().split('T')[0],
        status: 'Case Registered',
        mandatoryProcess: 'Submitted',
        filerName: approvedFiling.submittedBy,
        filerRole: approvedFiling.submittedByRole,
        parties: approvedFiling.parties,
        documents: approvedFiling.documents,
        filingRef: approvedFiling.filingReference,
        intakeRef: approvedFiling.intakeId,
      };
      this.cases = [newCase, ...this.cases];
      save('cases', this.cases);

      this.addNotification({
        id: `notif_${Date.now()}`,
        title: 'Filing Approved & Case Registered',
        description: `${approvedFiling.caseTitle} has been registered under Suit No. ${generatedSuit}`,
        timestamp: 'Just now',
        timeLabel: 'Just now',
        category: 'case_update',
        unread: true,
        caseRef: generatedSuit,
      });
    }

    this.notify();
  }

  public updateFilingStatus(
    id: string,
    newStatus: FilingStatus,
    actorName: string,
    actorRole: string = 'filing_clerk',
    notes?: string
  ): void {
    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    this.filings = this.filings.map((f) => {
      if (f.id === id || f.filingReference === id || f.intakeId === id) {
        const activities: FilingActivity[] = [
          ...(f.activities || []),
          {
            id: `act_${Date.now()}`,
            timestamp,
            actor: actorName,
            actorRole,
            action: `Status changed to ${newStatus}`,
            notes,
            previousStatus: f.status,
            newStatus,
          },
        ];

        return {
          ...f,
          status: newStatus,
          internalNotes: notes || f.internalNotes,
          activities,
        };
      }
      return f;
    });

    save('filings', this.filings);
    this.notify();
  }

  public requestCorrection(
    filingId: string,
    reason: string,
    notes: string,
    actor: UserProfile
  ): void {
    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let targetFiling: FilingItem | undefined;

    this.filings = this.filings.map((f) => {
      if (f.id === filingId || f.filingReference === filingId || f.intakeId === filingId) {
        targetFiling = f;
        const correctionRequests = [
          ...(f.correctionRequests || []),
          {
            id: `cor_${Date.now()}`,
            requestedAt: timestamp,
            requestedBy: `${actor.name} (${actor.title})`,
            reason,
            notes,
          },
        ];

        const activities: FilingActivity[] = [
          ...(f.activities || []),
          {
            id: `act_${Date.now()}`,
            timestamp,
            actor: actor.name,
            actorRole: actor.role,
            action: 'Correction Requested',
            notes: `${reason}: ${notes}`,
            previousStatus: f.status,
            newStatus: 'Correction Required',
          },
        ];

        return {
          ...f,
          status: 'Correction Required' as FilingStatus,
          registrarNotes: notes,
          correctionRequests,
          activities,
        };
      }
      return f;
    });

    save('filings', this.filings);

    if (targetFiling) {
      this.addNotification({
        id: `notif_${Date.now()}`,
        title: 'Filing Correction Required',
        description: `Correction requested for "${targetFiling.caseTitle}" (${targetFiling.filingReference}): ${reason}`,
        timestamp: 'Just now',
        timeLabel: 'Just now',
        category: 'action_required',
        unread: true,
        caseRef: targetFiling.filingReference,
      });
    }

    this.notify();
  }

  public resubmitFiling(
    filingId: string,
    updatedData: Partial<FilingItem>,
    actor: UserProfile
  ): void {
    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let targetFiling: FilingItem | undefined;

    this.filings = this.filings.map((f) => {
      if (f.id === filingId || f.filingReference === filingId || f.intakeId === filingId) {
        targetFiling = f;

        const resolvedCorrections = (f.correctionRequests || []).map((cr) => ({
          ...cr,
          resolvedAt: cr.resolvedAt || timestamp,
          resolvedNotes: 'Amended and re-submitted by filer.',
        }));

        const activities: FilingActivity[] = [
          ...(f.activities || []),
          {
            id: `act_${Date.now()}`,
            timestamp,
            actor: actor.name,
            actorRole: actor.role,
            action: 'Filing Re-submitted with Amendments',
            previousStatus: f.status,
            newStatus: 'Under Review',
          },
        ];

        return {
          ...f,
          ...updatedData,
          status: 'Under Review' as FilingStatus,
          correctionRequests: resolvedCorrections,
          activities,
        };
      }
      return f;
    });

    save('filings', this.filings);

    if (targetFiling) {
      this.addNotification({
        id: `notif_${Date.now()}`,
        title: 'Amended Filing Re-submitted',
        description: `Filer re-submitted "${targetFiling.caseTitle}" (${targetFiling.filingReference}) following corrections.`,
        timestamp: 'Just now',
        timeLabel: 'Just now',
        category: 'filing',
        unread: true,
        caseRef: targetFiling.filingReference,
      });
    }

    this.notify();
  }

  public registerCaseFromFiling(
    filingId: string,
    registeringOfficer: UserProfile,
    divisionCode?: string
  ): CaseRecord | undefined {
    const targetFiling = this.getFilingById(filingId);
    if (!targetFiling) return undefined;

    // Check if already registered
    const existing = this.cases.find(
      (c) => c.filingRef === targetFiling.filingReference || c.intakeRef === targetFiling.intakeId
    );
    if (existing) return existing;

    const divCode = divisionCode || (targetFiling.division?.includes('Commercial') ? 'COMM' : targetFiling.division?.includes('Land') ? 'LD' : 'CV');
    const officialSuit = generateOfficialSuitNumber({
      divisionCode: divCode,
      existingSuitNumbers: this.cases.map((c) => c.suitNumber),
    });

    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newCase: CaseRecord = {
      id: `case_${Date.now()}`,
      suitNumber: officialSuit,
      caseTitle: targetFiling.caseTitle,
      caseType: targetFiling.caseType,
      category: (targetFiling.caseCategory as CaseRecord['category']) || 'Commercial',
      court: targetFiling.court,
      courtRoom: 'Law Court Complex, Court 2, Accra',
      division: targetFiling.division,
      claimAmount: targetFiling.claimAmount,
      natureOfClaim: targetFiling.natureOfClaim,
      dateFiled: new Date().toISOString().split('T')[0],
      status: 'Case Registered',
      mandatoryProcess: 'Submitted',
      filerName: targetFiling.submittedBy,
      filerRole: targetFiling.submittedByRole,
      parties: targetFiling.parties,
      documents: targetFiling.documents.map((d) => ({
        ...d,
        status: 'Accepted in Docket',
        verified: true,
      })),
      filingRef: targetFiling.filingReference,
      intakeRef: targetFiling.intakeId,
    };

    this.cases = [newCase, ...this.cases];
    save('cases', this.cases);

    // Update filing item status to Registered with official references
    this.filings = this.filings.map((f) => {
      if (f.id === targetFiling.id) {
        const activities: FilingActivity[] = [
          ...(f.activities || []),
          {
            id: `act_${Date.now()}`,
            timestamp,
            actor: registeringOfficer.name,
            actorRole: registeringOfficer.role,
            action: `Case Officially Registered as Suit No. ${officialSuit}`,
            previousStatus: f.status,
            newStatus: 'Registered',
            notes: `Registered by ${registeringOfficer.name} (${registeringOfficer.title})`,
          },
        ];

        return {
          ...f,
          status: 'Registered' as FilingStatus,
          registeredSuitNumber: officialSuit,
          registeredAt: timestamp,
          registeredBy: `${registeringOfficer.name} (${registeringOfficer.title})`,
          activities,
        };
      }
      return f;
    });
    save('filings', this.filings);

    // Add notification for the filing lawyer/litigant
    this.addNotification({
      id: `notif_${Date.now()}`,
      title: 'Case Officially Registered',
      description: `"${targetFiling.caseTitle}" has been officially registered with Suit Number ${officialSuit}.`,
      timestamp: 'Just now',
      timeLabel: 'Just now',
      category: 'case_update',
      unread: true,
      caseRef: officialSuit,
    });

    this.notify();
    return newCase;
  }

  // Hearings
  public getHearings(): HearingItem[] {
    return this.hearings;
  }

  public addHearing(hearing: HearingItem): void {
    this.hearings = [hearing, ...this.hearings];
    save('hearings', this.hearings);
    this.cases = this.cases.map(c => c.id === hearing.caseId ? { ...c, nextHearingDate: hearing.date, nextHearingTime: hearing.time } : c);
    save('cases', this.cases);

    this.addNotification({
      id: `notif_${Date.now()}`,
      title: 'Hearing Scheduled',
      description: `${hearing.caseTitle}: Scheduled for ${hearing.date} at ${hearing.time} in ${hearing.courtRoom}`,
      timestamp: 'Just now',
      timeLabel: 'Just now',
      category: 'hearing',
      unread: true,
      caseRef: hearing.suitNumber,
    });

    this.notify();
  }

  // Tasks
  public getTasks(role?: UserRole): SystemTask[] {
    if (!role) return this.tasks;
    return this.tasks.filter((t) => t.roleTarget === role);
  }

  // Notifications
  public getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  public markNotificationAsRead(id: string): void {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
    save('notifications', this.notifications);
    this.notify();
  }

  public addNotification(notification: NotificationItem): void {
    this.notifications = [notification, ...this.notifications];
    save('notifications', this.notifications);
    this.notify();
  }

  // Invoices
  public getInvoices(): InvoiceItem[] {
    return this.invoices;
  }

  public addInvoice(invoice: InvoiceItem): void {
    this.invoices = [invoice, ...this.invoices];
    save('invoices', this.invoices);
    this.notify();
  }

  public payInvoice(invoiceRefNo: string, confirmationNo: string): void {
    this.invoices = this.invoices.map((inv) => {
      if (inv.invoiceRefNo === invoiceRefNo) {
        return {
          ...inv,
          status: 'Payment Done',
          paymentConfirmationNo: confirmationNo,
          paymentDate: new Date().toISOString().split('T')[0],
        };
      }
      return inv;
    });
    save('invoices', this.invoices);
    this.notify();
  }

  public simulatePayment(
    invoiceRefNo: string,
    outcome: 'success' | 'failed' | 'pending',
    paymentMethod: string,
    customTxRef?: string
  ): { success: boolean; transactionRef: string; message: string } {
    const targetInvoice = this.invoices.find((i) => i.invoiceRefNo === invoiceRefNo);
    const txRef = customTxRef || `GH-ECOBANK-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (outcome === 'success') {
      this.invoices = this.invoices.map((inv) => {
        if (inv.invoiceRefNo === invoiceRefNo) {
          return {
            ...inv,
            status: 'Payment Done',
            paymentConfirmationNo: txRef,
            paymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return inv;
      });
      save('invoices', this.invoices);

      // Advance any filing linked to this invoice or suitNumber/caseTitle
      this.filings = this.filings.map((f) => {
        const isMatch =
          f.invoiceId === invoiceRefNo ||
          f.filingReference === invoiceRefNo ||
          (targetInvoice && f.caseTitle === targetInvoice.caseTitle);

        if (isMatch) {
          const newStatus: FilingStatus =
            f.status === 'Awaiting Payment'
              ? f.checklist?.allDocumentsUploaded
                ? 'Ready for Registration'
                : 'Under Review'
              : f.status === 'Submitted'
              ? 'Under Review'
              : f.status;

          const activities: FilingActivity[] = [
            ...(f.activities || []),
            {
              id: `act_${Date.now()}`,
              timestamp,
              actor: 'Ghana.gov / Ecobank Gateway',
              actorRole: 'Payment Officer',
              action: `Payment Verified (${targetInvoice ? `GHS ${targetInvoice.amount.toFixed(2)}` : 'Fees'})`,
              notes: `Method: ${paymentMethod}. Transaction Ref: ${txRef}. Outcome: Approved.`,
              previousStatus: f.status,
              newStatus,
            },
          ];

          return {
            ...f,
            paymentStatus: 'Paid',
            status: newStatus,
            transactionRef: txRef,
            activities,
          };
        }
        return f;
      });
      save('filings', this.filings);

      this.addNotification({
        id: `notif_${Date.now()}`,
        title: 'Payment Confirmed',
        description: `Payment of GHS ${targetInvoice?.amount.toFixed(2) || '0.00'} verified via ${paymentMethod} (Ref: ${txRef}).`,
        timestamp: 'Just now',
        timeLabel: 'Just now',
        category: 'payment',
        unread: true,
        caseRef: targetInvoice?.suitNumber || invoiceRefNo,
      });

      this.notify();
      return { success: true, transactionRef: txRef, message: 'Payment successfully processed and verified by Ecobank gateway.' };
    } else if (outcome === 'failed') {
      this.addNotification({
        id: `notif_${Date.now()}`,
        title: 'Payment Simulation Failed',
        description: `Simulated transaction failed for Invoice ${invoiceRefNo}: Insufficient funds / network timeout.`,
        timestamp: 'Just now',
        timeLabel: 'Just now',
        category: 'payment',
        unread: true,
        caseRef: invoiceRefNo,
      });
      this.notify();
      return { success: false, transactionRef: txRef, message: 'Payment simulation failed. Gateway returned declined status.' };
    } else {
      // Pending
      this.notify();
      return { success: false, transactionRef: txRef, message: 'Payment is pending banking network clearance.' };
    }
  }

  // Subsequent Filings
  public getSubsequentFilings(): SubsequentFilingItem[] {
    return this.subsequentFilings;
  }

  public addSubsequentFiling(subsequent: SubsequentFilingItem): void {
    this.subsequentFilings = [subsequent, ...this.subsequentFilings];
    save('subsequent_filings', this.subsequentFilings);

    // If accepted or under review, link document to the target case
    this.cases = this.cases.map((c) => {
      if (c.id === subsequent.caseId || c.suitNumber === subsequent.suitNumber) {
        return {
          ...c,
          documents: [
            ...c.documents,
            {
              ...subsequent.document,
              folder: 'Subsequent Filings',
              status: 'Accepted in Docket',
              verified: true,
            },
          ],
        };
      }
      return c;
    });
    save('cases', this.cases);

    this.addNotification({
      id: `notif_${Date.now()}`,
      title: 'Subsequent Filing Received',
      description: `"${subsequent.documentTitle}" filed by ${subsequent.submittedBy} on Case ${subsequent.suitNumber}.`,
      timestamp: 'Just now',
      timeLabel: 'Just now',
      category: 'filing',
      unread: true,
      caseRef: subsequent.suitNumber,
    });

    this.notify();
  }

  // Business Partners
  public getBusinessPartners(): BusinessPartner[] {
    return this.businessPartners;
  }

  // Reset to seed data
  public resetToDefault(): void {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
    this.currentUser = DEMO_USERS.registrar;
    this.cases = INITIAL_CASES;
    this.filings = INITIAL_FILINGS;
    this.hearings = INITIAL_HEARINGS;
    this.tasks = INITIAL_TASKS;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.invoices = INITIAL_INVOICES;
    this.businessPartners = INITIAL_BUSINESS_PARTNERS;
    this.subsequentFilings = [];
    this.notify();
  }
}

export const repository = CaseRepository.getInstance();

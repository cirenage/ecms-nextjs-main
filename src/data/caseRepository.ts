import {
  UserProfile,
  CaseRecord,
  FilingItem,
  HearingItem,
  SystemTask,
  NotificationItem,
  InvoiceItem,
  BusinessPartner,
  UserRole,
} from '../types';
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
          status: decision,
          registrarNotes: notes || f.registrarNotes,
        };
        return approvedFiling;
      }
      return f;
    });
    save('filings', this.filings);

    // If approved, create or register active case
    if (decision === 'Approved' && approvedFiling && !this.cases.some(c => c.filingRef === approvedFiling!.filingReference)) {
      const suitYear = new Date().getFullYear();
      const generatedSuit = `CV/${String(this.cases.length + 1001)}/${suitYear}`;
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
    this.notify();
  }
}

export const repository = CaseRepository.getInstance();

export type UserRole =
  | 'administrator'
  | 'registrar'
  | 'judge'
  | 'lawyer'
  | 'filing_clerk'
  | 'court_clerk'
  | 'chief_bailiff'
  | 'public_bailiff'
  | 'payment_officer'
  | 'litigant';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  email: string;
  phone?: string;
  badgeOrLicense?: string;
  division?: string;
  courtRoom?: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export type CaseStatus =
  | 'New'
  | 'Case Registered'
  | 'Under Review'
  | 'Case Management'
  | 'Pre-Trial'
  | 'Hearing'
  | 'In Session'
  | 'Awaiting Judgment'
  | 'Closed'
  | 'Referred to ADR'
  | 'Execution';

export type MandatoryProcess =
  | 'Outstanding'
  | 'Submitted'
  | 'Commercial Motion'
  | 'Originating Motion'
  | 'Charge Sheet';

export interface CaseParty {
  id: string;
  name: string;
  role: 'Plaintiff' | 'Defendant' | 'Applicant' | 'Respondent' | 'Counsel' | 'Witness' | 'Third Party';
  representedBy?: string;
  bpNumber?: string;
  contact?: string;
  email?: string;
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  verified: boolean;
  status?: string;
  folder?: string;
}

export interface CaseRecord {
  id: string;
  suitNumber: string;
  caseTitle: string;
  caseType: string;
  category: 'Commercial' | 'Criminal' | 'Civil' | 'Land' | 'Divorce & Matrimonial' | 'Financial & Economic' | 'Probate & Administration';
  court: string;
  courtRoom: string;
  division: string;
  claimAmount: string;
  natureOfClaim: string;
  dateFiled: string;
  status: CaseStatus;
  mandatoryProcess: MandatoryProcess;
  assignedJudgeId?: string;
  assignedJudgeName?: string;
  filerName: string;
  filerRole: string;
  parties: CaseParty[];
  documents: CaseDocument[];
  nextHearingDate?: string;
  nextHearingTime?: string;
  estimatedDuration?: string;
  filingRef?: string;
  intakeRef?: string;
}

export type FilingStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Correction Required'
  | 'Awaiting Payment'
  | 'Payment Confirmed'
  | 'Ready for Registration'
  | 'Registered'
  | 'Returned / Rejected'
  | 'Withdrawn'
  // Backward compatibility aliases
  | 'Clarification'
  | 'Approved'
  | 'Rejected';

export interface FilingActivity {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  notes?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface CorrectionRequestItem {
  id: string;
  requestedAt: string;
  requestedBy: string;
  reason: string;
  notes: string;
  resolvedAt?: string;
  resolvedNotes?: string;
}

export interface FilingItem {
  id: string;
  intakeId: string;
  filingReference: string;
  provisionalCaseId?: string;
  caseTitle: string;
  court: string;
  courtLevel?: string;
  region?: string;
  courtStation?: string;
  division: string;
  caseCategory?: string;
  caseType: string;
  filingType?: string;
  natureOfClaim: string;
  claimAmount: string;
  estimatedFees: string;
  submittedBy: string;
  submittedByRole: string;
  submissionDate: string;
  status: FilingStatus;
  paymentStatus: 'Paid' | 'Pending Payment' | 'Fees Exempt';
  checklist: {
    allDocumentsUploaded: boolean;
    courtFeesPaid: boolean;
    partiesProvided: boolean;
    claimDetailsProvided: boolean;
    supportingDocumentsAttached: boolean;
    compliesWithRules: boolean;
  };
  documents: CaseDocument[];
  parties: CaseParty[];
  briefDescription: string;
  registrarNotes?: string;
  internalNotes?: string;
  correctionRequests?: CorrectionRequestItem[];
  activities?: FilingActivity[];
  invoiceId?: string;
  transactionRef?: string;
  registeredSuitNumber?: string;
  registeredAt?: string;
  registeredBy?: string;
}

export interface SubsequentFilingItem {
  id: string;
  caseId: string;
  suitNumber: string;
  caseTitle: string;
  filingRef: string;
  documentType: string;
  documentTitle: string;
  submittedBy: string;
  submittingPartyRole: string;
  submissionDate: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  feeAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Exempt';
  document: CaseDocument;
  reviewNotes?: string;
  acceptedAt?: string;
}

export interface ValidationIssue {
  field?: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FeeLineItem {
  id: string;
  description: string;
  category: string;
  amount: number;
}

export interface FeeAssessment {
  filingRef: string;
  lineItems: FeeLineItem[];
  subtotal: number;
  itLevy: number;
  total: number;
  isExempt: boolean;
  exemptionReason?: string;
}

export interface HearingItem {
  id: string;
  caseId: string;
  suitNumber: string;
  caseTitle: string;
  hearingType: 'Case Management Conference' | 'Pre-Trial Review' | 'Trial / Hearing' | 'Motion' | 'Ruling' | 'Judgement Delivery';
  courtRoom: string;
  date: string;
  time: string;
  judgeName: string;
  status: 'Scheduled' | 'In Session' | 'Adjourned' | 'Completed' | 'Case to take normal course';
  mode: 'In-Person' | 'Virtual' | 'Hybrid';
  location: string;
  capacity?: number;
  duration: string;
  notifiedParties: { name: string; channel: string }[];
}

export interface SystemTask {
  id: string;
  title: string;
  category: string;
  count?: number;
  dueDate?: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  roleTarget: UserRole;
  relatedCase?: string;
  link?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  timeLabel: string;
  category: 'hearing' | 'document' | 'action_required' | 'payment' | 'case_update' | 'filing';
  unread: boolean;
  actionRequired?: boolean;
  caseRef?: string;
  actionUrl?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceRefNo: string;
  caseTitle: string;
  suitNumber?: string;
  payeeName: string;
  payeeBpId: string;
  category: 'Fees' | 'Fines' | 'Document Certification' | 'Payment into Court' | 'Appeals Revenue' | 'Appeals Bond' | 'Appeals Withholding Tax';
  accountNumber: string;
  amount: number;
  currency: string;
  status: 'Pending Payment' | 'Payment Done' | 'Approved - Audit' | 'Payment Cancelled';
  dateCreated: string;
  paymentConfirmationNo?: string;
  paymentDate?: string;
}

export interface ActivityItem {
  id: string;
  type: 'Process Service' | 'Hearing' | 'Motion' | 'ADR' | 'Execution' | 'Appeals' | 'Leave' | 'Pre-Trial Conference';
  caseTitle: string;
  suitNumber: string;
  employeeResponsible: string;
  startDate: string;
  endDate: string;
  startTime: string;
  status: string;
  category: string;
  notes?: string;
}

export interface BusinessPartner {
  id: string;
  bpNumber: string;
  name: string;
  type: 'Person' | 'Organization';
  title?: string;
  legalForm?: string;
  licenseNumber?: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  country: string;
}

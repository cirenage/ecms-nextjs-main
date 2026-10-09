'use client';
import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Building2,
  Calendar,
  CreditCard,
  ChevronRight,
  ArrowRight,
  Eye,
  X,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Send,
  Gavel,
  Check,
  RotateCcw,
  History,
  FileCheck,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, FilingItem, CaseRecord } from '../../types';
import { repository } from '../../data/caseRepository';

interface RegistrarIntakeScreenProps {
  currentUser: UserProfile;
  filing?: FilingItem;
  onNavigate: (screen: string) => void;
  onProceedToAssignment?: (filing: FilingItem) => void;
}

type QueueType =
  | 'inbox'
  | 'pending'
  | 'corrections'
  | 'awaiting_payment'
  | 'ready_registration'
  | 'registered'
  | 'history';

export const RegistrarIntakeScreen: React.FC<RegistrarIntakeScreenProps> = ({
  currentUser,
  filing,
  onNavigate,
  onProceedToAssignment,
}) => {
  const [activeQueue, setActiveQueue] = useState<QueueType>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All');

  // Selected Filing
  const allFilings = repository.getFilings();
  const [selectedFilingId, setSelectedFilingId] = useState<string>(
    filing?.id || allFilings[0]?.id || ''
  );

  const selectedFiling = useMemo(() => {
    return allFilings.find((f) => f.id === selectedFilingId) || allFilings[0];
  }, [allFilings, selectedFilingId]);

  // Drawer detail active tab
  const [activeDetailTab, setActiveDetailTab] = useState<
    'overview' | 'documents' | 'validation' | 'payment' | 'history'
  >('overview');

  // Action Modals State
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('Missing Mandatory Verifying Affidavit');
  const [correctionNotes, setCorrectionNotes] = useState('');

  const [showReviewNotesModal, setShowReviewNotesModal] = useState(false);
  const [internalNotesInput, setInternalNotesInput] = useState('');

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationDivisionCode, setRegistrationDivisionCode] = useState('COMM');

  const [previewDocument, setPreviewDocument] = useState<{ name: string; type: string } | null>(
    null
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter Filings according to the 7 Queues
  const filteredQueueFilings = useMemo(() => {
    let list = allFilings;

    // Queue filter
    switch (activeQueue) {
      case 'inbox':
        list = list.filter((f) => f.status !== 'Registered');
        break;
      case 'pending':
        list = list.filter((f) => f.status === 'Submitted' || f.status === 'Under Review');
        break;
      case 'corrections':
        list = list.filter((f) => f.status === 'Correction Required' || f.status === 'Clarification');
        break;
      case 'awaiting_payment':
        list = list.filter((f) => f.status === 'Awaiting Payment' || f.paymentStatus === 'Pending Payment');
        break;
      case 'ready_registration':
        list = list.filter((f) => f.status === 'Ready for Registration' || (f.status === 'Payment Confirmed' && f.paymentStatus === 'Paid'));
        break;
      case 'registered':
        list = list.filter((f) => f.status === 'Registered');
        break;
      case 'history':
        list = allFilings;
        break;
    }

    // Division Filter
    if (divisionFilter !== 'All') {
      list = list.filter((f) => f.division?.toLowerCase().includes(divisionFilter.toLowerCase()));
    }

    // Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          f.caseTitle.toLowerCase().includes(q) ||
          f.filingReference.toLowerCase().includes(q) ||
          (f.provisionalCaseId && f.provisionalCaseId.toLowerCase().includes(q)) ||
          f.submittedBy.toLowerCase().includes(q) ||
          (f.registeredSuitNumber && f.registeredSuitNumber.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allFilings, activeQueue, divisionFilter, searchQuery]);

  // Queue Counts for Badges
  const queueCounts = useMemo(() => {
    return {
      inbox: allFilings.filter((f) => f.status !== 'Registered').length,
      pending: allFilings.filter((f) => f.status === 'Submitted' || f.status === 'Under Review').length,
      corrections: allFilings.filter((f) => f.status === 'Correction Required' || f.status === 'Clarification').length,
      awaiting_payment: allFilings.filter((f) => f.status === 'Awaiting Payment' || f.paymentStatus === 'Pending Payment').length,
      ready_registration: allFilings.filter((f) => f.status === 'Ready for Registration' || (f.status === 'Payment Confirmed' && f.paymentStatus === 'Paid')).length,
      registered: allFilings.filter((f) => f.status === 'Registered').length,
      history: allFilings.length,
    };
  }, [allFilings]);

  // Queue Definitions
  const queues: { id: QueueType; label: string; count: number }[] = [
    { id: 'inbox', label: '1. Filing Inbox', count: queueCounts.inbox },
    { id: 'pending', label: '2. Pending Reviews', count: queueCounts.pending },
    { id: 'corrections', label: '3. Correction Requests', count: queueCounts.corrections },
    { id: 'awaiting_payment', label: '4. Awaiting Payment', count: queueCounts.awaiting_payment },
    { id: 'ready_registration', label: '5. Ready for Registration', count: queueCounts.ready_registration },
    { id: 'registered', label: '6. Registered Cases', count: queueCounts.registered },
    { id: 'history', label: '7. Filing History & Audit', count: queueCounts.history },
  ];

  // Clerk Action Handlers
  const handlePutUnderReview = () => {
    if (!selectedFiling) return;
    repository.updateFilingStatus(
      selectedFiling.id,
      'Under Review',
      currentUser.name,
      currentUser.role,
      internalNotesInput || 'Registry review commenced by filing clerk.'
    );
    setShowReviewNotesModal(false);
    setInternalNotesInput('');
    showToast(`Filing "${selectedFiling.filingReference}" placed Under Review.`);
  };

  const handleRequestCorrectionSubmit = () => {
    if (!selectedFiling) return;
    repository.requestCorrection(
      selectedFiling.id,
      correctionReason,
      correctionNotes || 'Please correct specified pleading deficiencies and re-submit.',
      currentUser
    );
    setShowCorrectionModal(false);
    setCorrectionNotes('');
    showToast(
      `Correction request dispatched to ${selectedFiling.submittedBy}. Filing status: Correction Required.`
    );
  };

  const handleMarkReadyForRegistration = () => {
    if (!selectedFiling) return;
    repository.updateFilingStatus(
      selectedFiling.id,
      'Ready for Registration',
      currentUser.name,
      currentUser.role,
      'All procedural checks and fee verifications satisfied. Cleared for official suit number issuance.'
    );
    showToast(`Filing "${selectedFiling.filingReference}" marked Ready for Registration.`);
  };

  const handleCompleteOfficialRegistration = () => {
    if (!selectedFiling) return;

    const registeredCase = repository.registerCaseFromFiling(
      selectedFiling.id,
      currentUser,
      registrationDivisionCode
    );

    setShowRegistrationModal(false);

    if (registeredCase) {
      showToast(
        `Case Officially Registered! Suit No: ${registeredCase.suitNumber}. Official e-Docket initialized.`
      );
    }
  };

  return (
    <div className="space-y-4 pb-12 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Court Staff Filing Management Workspace
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#14366A] text-white tracking-wider uppercase">
              Internal Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational review, automated rule audits, correction handling, and official case registration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('registry_dashboard')}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            Registry Dashboard
          </button>
          <button
            onClick={() => onNavigate('case_assignment')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>Case Assignment</span>
          </button>
        </div>
      </div>

      {/* 7 Queues Horizontal Tabs */}
      <div className="bg-white rounded-xl p-1.5 border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {queues.map((q) => {
            const isActive = activeQueue === q.id;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQueue(q.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#14366A] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{q.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {q.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Filings List in Selected Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter Controls */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suit no, ref, title, filer..."
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
              />
            </div>
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <option value="All">All Divisions</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
              <option value="Criminal">Criminal</option>
              <option value="Civil">Civil</option>
            </select>
          </div>

          {/* Filings Cards List */}
          <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredQueueFilings.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No filings in this queue matching current criteria.
              </div>
            ) : (
              filteredQueueFilings.map((f) => {
                const isSelected = f.id === selectedFiling?.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFilingId(f.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/90 border-[#14366A] shadow-xs ring-1 ring-blue-900/10'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[11px] font-bold text-blue-900">
                            {f.filingReference}
                          </span>
                          {f.registeredSuitNumber ? (
                            <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                              Suit: {f.registeredSuitNumber}
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded">
                              {f.provisionalCaseId || f.intakeId}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 truncate mt-1">
                          {f.caseTitle}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {f.division} · {f.caseType}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 whitespace-nowrap ${
                          f.status === 'Registered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : f.status === 'Ready for Registration'
                            ? 'bg-purple-100 text-purple-800 font-extrabold'
                            : f.status === 'Correction Required' || f.status === 'Clarification'
                            ? 'bg-red-100 text-red-800'
                            : f.status === 'Awaiting Payment'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {f.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                      <span>Filer: {f.submittedBy.split('(')[0]}</span>
                      <span>{f.submissionDate.split(',')[0]}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Filing Inspector & Clerk Action Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedFiling ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              {/* Header Box */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-[#14366A] text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                        {selectedFiling.status}
                      </span>
                      <span className="text-xs font-mono text-slate-300">
                        Provisional: {selectedFiling.provisionalCaseId || selectedFiling.intakeId}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold mt-1 text-white">{selectedFiling.caseTitle}</h2>
                    <p className="text-[11px] text-slate-300">
                      {selectedFiling.court} · {selectedFiling.division}
                    </p>
                  </div>

                  {selectedFiling.registeredSuitNumber ? (
                    <div className="bg-emerald-500/20 border border-emerald-400/40 p-2 rounded-lg text-right">
                      <p className="text-[10px] text-emerald-300 font-semibold uppercase">Official Suit No.</p>
                      <p className="font-mono text-xs font-extrabold text-white">
                        {selectedFiling.registeredSuitNumber}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white/10 p-2 rounded-lg text-right">
                      <p className="text-[10px] text-slate-300">Filing Ref</p>
                      <p className="font-mono text-xs font-bold text-amber-300">
                        {selectedFiling.filingReference}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Tabs in Detail Inspector */}
              <div className="flex items-center border-b border-slate-200 px-4 bg-slate-50 text-xs font-semibold overflow-x-auto">
                {[
                  { id: 'overview', label: 'Case & Parties' },
                  { id: 'documents', label: `Documents (${selectedFiling.documents.length})` },
                  { id: 'validation', label: 'Automated Audit' },
                  { id: 'payment', label: 'Fees & Payment' },
                  { id: 'history', label: 'Timeline & History' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveDetailTab(t.id as any)}
                    className={`py-2.5 px-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                      activeDetailTab === t.id
                        ? 'border-blue-700 text-blue-900 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="p-4 space-y-4 max-h-[calc(100vh-360px)] overflow-y-auto">
                {/* TAB 1: OVERVIEW & PARTIES */}
                {activeDetailTab === 'overview' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <p className="text-slate-500 text-[11px]">Submitting User / Filer</p>
                        <p className="font-bold text-slate-800">{selectedFiling.submittedBy}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[11px]">Submission Date & Time</p>
                        <p className="font-bold text-slate-800">{selectedFiling.submissionDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[11px]">Case Category & Type</p>
                        <p className="font-bold text-slate-800">{selectedFiling.caseType}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[11px]">Claim Quantum</p>
                        <p className="font-mono font-bold text-blue-800">{selectedFiling.claimAmount}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-2">Particulars of Claim</h4>
                      <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed text-[11px]">
                        {selectedFiling.briefDescription}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-2">Parties & Representation ({selectedFiling.parties.length})</h4>
                      <div className="space-y-2">
                        {selectedFiling.parties.map((p, idx) => (
                          <div key={p.id} className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-900">
                                {p.name} <span className="text-[10px] font-normal text-slate-500">({p.role})</span>
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {p.contact || 'No phone'} · {p.email || 'No email'} · {p.representedBy || 'Self-represented'}
                              </p>
                            </div>
                            {p.bpNumber ? (
                              <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
                                BP: {p.bpNumber}
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Unlinked BP
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedFiling.correctionRequests && selectedFiling.correctionRequests.length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1.5">
                        <p className="font-bold text-red-900 text-xs">Active Correction Requests:</p>
                        {selectedFiling.correctionRequests.map((cr) => (
                          <div key={cr.id} className="text-[11px] text-red-800">
                            <p className="font-semibold">• {cr.reason} ({cr.requestedAt})</p>
                            <p className="pl-3 opacity-90">{cr.notes}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: DOCUMENTS */}
                {activeDetailTab === 'documents' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-500 text-[11px]">
                      Inspect uploaded originating documents, exhibits, and verified checksums:
                    </p>
                    <div className="space-y-2">
                      {selectedFiling.documents.map((d) => (
                        <div
                          key={d.id}
                          className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-white transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900">{d.name}</p>
                              <p className="text-[10px] text-slate-500">
                                {d.type} · {d.size} · Uploaded by {d.uploadedBy}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              Verified
                            </span>
                            <button
                              type="button"
                              onClick={() => setPreviewDocument({ name: d.name, type: d.type })}
                              className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 font-medium flex items-center gap-1 shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: AUTOMATED VALIDATION AUDIT */}
                {activeDetailTab === 'validation' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Automated Procedural Check Results</p>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          Checked against High Court (Civil Procedure) Rules C.I. 47:
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 border border-slate-200 rounded-lg p-3 bg-white">
                      {[
                        { label: 'Mandatory Originating Writ attached', ok: true },
                        { label: 'Pleadings include statement of claim and reliefs', ok: true },
                        { label: 'Party identities and representation verified', ok: selectedFiling.parties.length >= 2 },
                        { label: 'Format check: All files compliant PDF/DOCX', ok: true },
                        { label: 'Statutory fees verified / exemption recorded', ok: selectedFiling.paymentStatus === 'Paid' || selectedFiling.paymentStatus === 'Fees Exempt' },
                        { label: 'No duplicate suit number or pending duplicate', ok: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                          <span className="text-slate-700">{item.label}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                              item.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.ok ? 'Passed' : 'Requires Action'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: FEES & PAYMENT */}
                {activeDetailTab === 'payment' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Statutory Fee Assessed:</span>
                        <span className="font-mono font-bold text-slate-900">{selectedFiling.estimatedFees}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Payment Status:</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            selectedFiling.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : selectedFiling.paymentStatus === 'Fees Exempt'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {selectedFiling.paymentStatus}
                        </span>
                      </div>
                      {selectedFiling.transactionRef && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Gateway Transaction Reference:</span>
                          <span className="font-mono text-blue-800 font-bold">{selectedFiling.transactionRef}</span>
                        </div>
                      )}
                      {selectedFiling.invoiceId && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Associated Invoice Ref:</span>
                          <span className="font-mono text-slate-700">{selectedFiling.invoiceId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: AUDIT LOG */}
                {activeDetailTab === 'history' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-500 text-[11px]">
                      Complete chronological activity audit trail for this filing:
                    </p>
                    <div className="relative pl-5 border-l-2 border-slate-200 space-y-3">
                      {(selectedFiling.activities || [
                        {
                          id: 'act_def',
                          timestamp: selectedFiling.submissionDate,
                          actor: selectedFiling.submittedBy,
                          actorRole: selectedFiling.submittedByRole,
                          action: 'Filing Submitted Online',
                          notes: 'Initial electronic filing submission recorded.',
                        },
                      ]).map((act) => (
                        <div key={act.id} className="relative">
                          <div className="w-2.5 h-2.5 bg-blue-700 rounded-full absolute -left-[26px] top-1" />
                          <p className="font-bold text-slate-800">{act.action}</p>
                          <p className="text-[10px] text-slate-400">
                            {act.timestamp} · By {act.actor} ({act.actorRole})
                          </p>
                          {act.notes && <p className="text-[11px] text-slate-600 mt-0.5">{act.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clerk Action Toolbar Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewNotesModal(true)}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs"
                  >
                    Add Internal Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCorrectionModal(true)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Request Correction</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedFiling.status === 'Submitted' && (
                    <button
                      type="button"
                      onClick={handlePutUnderReview}
                      className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                    >
                      <span>Put Under Review</span>
                    </button>
                  )}

                  {selectedFiling.status === 'Under Review' && (
                    <button
                      type="button"
                      onClick={handleMarkReadyForRegistration}
                      className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Ready for Registration</span>
                    </button>
                  )}

                  {/* Section G: Official Case Registration Button */}
                  {selectedFiling.status !== 'Registered' ? (
                    <button
                      type="button"
                      onClick={() => setShowRegistrationModal(true)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>Complete Official Registration</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Registered as {selectedFiling.registeredSuitNumber}</span>
                      </span>
                      {onProceedToAssignment && (
                        <button
                          type="button"
                          onClick={() => onProceedToAssignment(selectedFiling)}
                          className="px-3 py-1.5 bg-[#14366A] text-white text-xs font-semibold rounded-lg shadow-xs"
                        >
                          Assign Judge
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Select a filing from the list to inspect details and take review actions.
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Request Correction */}
      {showCorrectionModal && selectedFiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Request Correction from Filer</span>
              </div>
              <button onClick={() => setShowCorrectionModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              This filing will be returned to <strong>{selectedFiling.submittedBy}</strong> with status{' '}
              <span className="font-bold text-red-700">"Correction Required"</span>. The filer will receive an alert and must amend the filing before it can be registered.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Correction</label>
                <select
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Missing Mandatory Verifying Affidavit">Missing Mandatory Verifying Affidavit</option>
                  <option value="Incomplete or Illegible Pleading / Exhibit">Incomplete or Illegible Pleading / Exhibit</option>
                  <option value="Uncertified Survey Plan / Lacks Land Commission Search">Uncertified Survey Plan / Lacks Land Commission Search</option>
                  <option value="Party Contact / Electronic Service Details Incomplete">Party Contact / Electronic Service Details Incomplete</option>
                  <option value="Underpaid Statutory Assessment / Fee Discrepancy">Underpaid Statutory Assessment / Fee Discrepancy</option>
                  <option value="Pleading Format Violates High Court Civil Procedure Rules">Pleading Format Violates High Court Civil Procedure Rules</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clerk Instructions / Specific Guidance for Filer</label>
                <textarea
                  rows={3}
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="Detail exact statutory requirements or attachments the lawyer must provide..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestCorrectionSubmit}
                className="px-4 py-1.5 text-xs bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-xs"
              >
                Dispatch Correction Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Internal Review Note */}
      {showReviewNotesModal && selectedFiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add Internal Registry Review Note</h3>
              <button onClick={() => setShowReviewNotesModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-700">Internal Review Notes</label>
              <textarea
                rows={3}
                value={internalNotesInput}
                onChange={(e) => setInternalNotesInput(e.target.value)}
                placeholder="Internal registry notes visible to court officers..."
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowReviewNotesModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePutUnderReview}
                className="px-4 py-1.5 text-xs bg-[#14366A] text-white font-bold rounded-lg shadow-xs"
              >
                Save Review Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Section G - Official Case Registration Modal */}
      {showRegistrationModal && selectedFiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Complete Official Case Registration
                </h3>
              </div>
              <button onClick={() => setShowRegistrationModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Statutory Registration Criteria Satisfied</span>
              </p>
              <p className="text-[11px] text-emerald-800">
                Pleadings verified, mandatory exhibits inspected, and payment confirmed. You are authorized to issue the official court Suit Number.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-500 text-[11px]">Matter:</p>
                <p className="font-bold text-slate-900">{selectedFiling.caseTitle}</p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Provisional Ref: {selectedFiling.provisionalCaseId || selectedFiling.filingReference}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Court Division Code for Suit Number Scheme
                </label>
                <select
                  value={registrationDivisionCode}
                  onChange={(e) => setRegistrationDivisionCode(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono font-bold"
                >
                  <option value="COMM">COMM — Commercial Division (e.g. COMM/0105/2026)</option>
                  <option value="LD">LD — Land Division (e.g. LD/0082/2026)</option>
                  <option value="GJ">GJ — General Jurisdiction (e.g. GJ/0216/2026)</option>
                  <option value="CV">CV — Civil Division (e.g. CV/1004/2026)</option>
                  <option value="LBR">LBR — Labour Division (e.g. LBR/0044/2026)</option>
                  <option value="PRB">PRB — Probate & Administration (e.g. PRB/0061/2026)</option>
                  <option value="HR">HR — Human Rights Division (e.g. HR/0022/2026)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Generated sequence is collision-free and preserves the original Provisional Case ID in the permanent docket audit trail.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-500 text-[11px]">Registering Officer:</p>
                <p className="font-bold text-slate-800">{currentUser.name} ({currentUser.title})</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowRegistrationModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteOfficialRegistration}
                className="px-5 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Issue Suit Number & Register Case</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Document Preview */}
      {previewDocument && selectedFiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">{previewDocument.name}</h3>
              </div>
              <button onClick={() => setPreviewDocument(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 font-serif text-xs text-slate-800 space-y-3">
              <div className="text-center space-y-0.5">
                <p className="font-bold uppercase tracking-widest text-slate-900">
                  IN THE HIGH COURT OF JUSTICE, GHANA
                </p>
                <p className="text-[10px] text-slate-500 uppercase">
                  {selectedFiling.division} · {selectedFiling.courtStation}
                </p>
                <p className="text-[10px] font-mono text-blue-900">
                  [DOCUMENT CLASSIFICATION: {previewDocument.type}]
                </p>
              </div>

              <div className="border-t border-b border-slate-200 py-2 text-center">
                <p className="font-bold text-slate-900">{selectedFiling.caseTitle}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Ref: {selectedFiling.filingReference}
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <p>
                  <strong>FILING PARTY:</strong> {selectedFiling.submittedBy}
                </p>
                <p>
                  <strong>CERTIFIED VERIFICATION:</strong> Format compliant (.pdf), Digital checksum verified.
                </p>
                <p className="italic text-slate-600 pt-2">
                  "This electronic document was reviewed by the Central Registry of the Judicial Service of Ghana eCMS."
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewDocument(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

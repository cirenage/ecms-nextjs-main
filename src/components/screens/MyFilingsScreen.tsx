'use client';
import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Printer,
  Eye,
  PlusCircle,
  Upload,
  Calendar,
  Building2,
  Scale,
  ShieldCheck,
  X,
  ChevronRight,
  RotateCcw,
  FileCheck,
  Receipt,
  Download,
} from 'lucide-react';
import { UserProfile, FilingItem, FilingStatus, CaseDocument } from '../../types';
import { repository } from '../../data/caseRepository';

interface MyFilingsScreenProps {
  currentUser: UserProfile;
  onNavigate: (screen: string) => void;
  onSelectFiling?: (filing: FilingItem) => void;
  onTrackCase?: (suitNumber: string) => void;
}

type TabFilter = 'all' | 'under_review' | 'correction_required' | 'awaiting_payment' | 'ready_registration' | 'registered';

export const MyFilingsScreen: React.FC<MyFilingsScreenProps> = ({
  currentUser,
  onNavigate,
  onSelectFiling,
  onTrackCase,
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiling, setSelectedFiling] = useState<FilingItem | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<CaseDocument | null>(null);

  // Correction Resolution Modal state
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionFile, setCorrectionFile] = useState<string>('Verifying_Affidavit_Amended.pdf');
  const [correctionNote, setCorrectionNote] = useState<string>('Enclosed duly sworn Verifying Affidavit executed before Commissioner for Oaths in compliance with C.I. 47.');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filings = repository.getFilings();

  // Filter filings
  const filteredFilings = useMemo(() => {
    let list = filings;

    // Filter by tab
    switch (activeTab) {
      case 'under_review':
        list = list.filter((f) => f.status === 'Under Review' || f.status === 'Submitted');
        break;
      case 'correction_required':
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
      case 'all':
      default:
        break;
    }

    // Filter by search text
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          f.caseTitle.toLowerCase().includes(q) ||
          f.filingReference.toLowerCase().includes(q) ||
          (f.provisionalCaseId && f.provisionalCaseId.toLowerCase().includes(q)) ||
          (f.registeredSuitNumber && f.registeredSuitNumber.toLowerCase().includes(q)) ||
          f.division.toLowerCase().includes(q) ||
          f.submittedBy.toLowerCase().includes(q)
      );
    }

    return list;
  }, [filings, activeTab, searchQuery]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: filings.length,
      under_review: filings.filter((f) => f.status === 'Under Review' || f.status === 'Submitted').length,
      correction_required: filings.filter((f) => f.status === 'Correction Required' || f.status === 'Clarification').length,
      awaiting_payment: filings.filter((f) => f.status === 'Awaiting Payment' || f.paymentStatus === 'Pending Payment').length,
      ready_registration: filings.filter((f) => f.status === 'Ready for Registration' || (f.status === 'Payment Confirmed' && f.paymentStatus === 'Paid')).length,
      registered: filings.filter((f) => f.status === 'Registered').length,
    };
  }, [filings]);

  // Handle re-submitting filing after correction
  const handleResubmitCorrection = () => {
    if (!selectedFiling) return;

    const newDoc: CaseDocument = {
      id: `doc_corr_${Date.now()}`,
      name: correctionFile,
      type: 'Verifying Affidavit (Amended)',
      size: '420 KB',
      uploadedAt: 'Today, Just now',
      uploadedBy: currentUser.name,
      verified: true,
      folder: 'Correction Filings',
    };

    const updatedDocuments = [...selectedFiling.documents, newDoc];

    repository.resubmitFiling(
      selectedFiling.id,
      {
        documents: updatedDocuments,
        internalNotes: `Amended document "${correctionFile}" supplied by counsel.`,
      },
      currentUser
    );

    setShowCorrectionModal(false);
    setShowDetailDrawer(false);
    showToast(`Amended filing for "${selectedFiling.caseTitle}" successfully resubmitted to the Registry!`);
  };

  // Helper status badge styling
  const renderStatusBadge = (status: FilingStatus) => {
    switch (status) {
      case 'Registered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Registered
          </span>
        );
      case 'Correction Required':
      case 'Clarification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            Correction Required
          </span>
        );
      case 'Awaiting Payment':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <CreditCard className="w-3 h-3 text-amber-600" />
            Awaiting Payment
          </span>
        );
      case 'Ready for Registration':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Ready for Registration
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" />
            Under Registry Review
          </span>
        );
      case 'Submitted':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" />
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-12 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              My Electronic Filings
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#14366A] text-white tracking-wider uppercase">
              Lawyer Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your originating processes, monitor registry review milestones, respond to court correction directives, and inspect official receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('subsequent_filings')}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>Subsequent Filing</span>
          </button>
          <button
            onClick={() => onNavigate('filing_receipts')}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-600" />
            <span>Filing Receipts</span>
          </button>
          <button
            onClick={() => onNavigate('filing_new')}
            className="px-4 py-1.5 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>File New Case</span>
          </button>
        </div>
      </div>

      {/* Urgent Action Banner if corrections are pending */}
      {tabCounts.correction_required > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-900">
                Action Required: {tabCounts.correction_required} Filing{tabCounts.correction_required > 1 ? 's require' : ' requires'} Registry Correction
              </h3>
              <p className="text-[11px] text-red-700 mt-0.5">
                The Court Registry has returned filing queries. Please rectify and re-submit the required affidavits or pleadings to avoid case dismissal.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('correction_required')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs shrink-0 flex items-center gap-1 self-start sm:self-center"
          >
            <span>Review Queries</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Filings', count: tabCounts.all },
            { id: 'under_review', label: 'Under Review', count: tabCounts.under_review },
            { id: 'correction_required', label: 'Corrections', count: tabCounts.correction_required, alert: tabCounts.correction_required > 0 },
            { id: 'awaiting_payment', label: 'Awaiting Payment', count: tabCounts.awaiting_payment },
            { id: 'ready_registration', label: 'Ready', count: tabCounts.ready_registration },
            { id: 'registered', label: 'Registered', count: tabCounts.registered },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabFilter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#14366A] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.alert
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ref, title, suit no..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Filings Table & Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredFilings.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No filings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'No filings match your search criteria. Try a different term or clear the filter.'
                : 'No filings in this category. Use the New Filing button to submit originating processes to court.'}
            </p>
            <button
              onClick={() => onNavigate('filing_new')}
              className="mt-2 px-4 py-2 bg-[#14366A] text-white text-xs font-semibold rounded-lg shadow-2xs inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>File New Case</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Filing Ref & Date</th>
                  <th className="py-3 px-4">Case Title & Division</th>
                  <th className="py-3 px-4">Filing Type & Parties</th>
                  <th className="py-3 px-4">Fees & Payment</th>
                  <th className="py-3 px-4">Review Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredFilings.map((f) => {
                  const isCorrection = f.status === 'Correction Required' || f.status === 'Clarification';
                  return (
                    <tr
                      key={f.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isCorrection ? 'bg-red-50/30' : ''
                      }`}
                    >
                      {/* Filing Ref & Date */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{f.filingReference}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{f.submissionDate}</p>
                        {f.provisionalCaseId && (
                          <span className="inline-block mt-1 font-mono text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                            {f.provisionalCaseId}
                          </span>
                        )}
                      </td>

                      {/* Case Title & Division */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">{f.caseTitle}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{f.division}</span>
                        </p>
                        {f.registeredSuitNumber && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-mono">
                              Suit: {f.registeredSuitNumber}
                            </span>
                            <button
                              onClick={() => {
                                if (onTrackCase) onTrackCase(f.registeredSuitNumber!);
                                else onNavigate('case_tracking');
                              }}
                              className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold underline"
                            >
                              eDocket
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Filing Type & Parties */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-semibold text-slate-800 text-[11px] block">
                          {f.filingType || f.caseType}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {f.parties.length} Part{f.parties.length === 1 ? 'y' : 'ies'} · {f.documents.length} Document{f.documents.length === 1 ? '' : 's'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Claim: {f.claimAmount || 'Non-Monetary Relief'}
                        </p>
                      </td>

                      {/* Fees & Payment */}
                      <td className="py-3.5 px-4 align-top">
                        <p className="font-mono font-bold text-slate-900">{f.estimatedFees}</p>
                        <div className="mt-1">
                          {f.paymentStatus === 'Paid' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Paid
                            </span>
                          ) : f.paymentStatus === 'Fees Exempt' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              Exempt
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                Pending
                              </span>
                              <button
                                onClick={() => onNavigate('bills_payments')}
                                className="text-[10px] font-bold text-amber-800 hover:underline flex items-center gap-0.5"
                              >
                                <span>Pay Now</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Review Status */}
                      <td className="py-3.5 px-4 align-top">
                        {renderStatusBadge(f.status)}
                        {isCorrection && (
                          <div className="mt-1 text-[10px] text-red-700 font-medium bg-red-50 p-1.5 rounded border border-red-200 max-w-[200px]">
                            {f.registrarNotes || 'Correction required by registry'}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedFiling(f);
                            setShowDetailDrawer(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          <span>View</span>
                        </button>

                        {isCorrection && (
                          <button
                            onClick={() => {
                              setSelectedFiling(f);
                              setShowCorrectionModal(true);
                            }}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors"
                            title="Respond to Correction"
                          >
                            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                            <span>Rectify</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedFiling(f);
                            onNavigate('filing_receipts');
                          }}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold rounded-md transition-colors"
                          title="View Official Receipt"
                        >
                          <Receipt className="w-3.5 h-3.5 inline mr-1" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer / Modal */}
      {showDetailDrawer && selectedFiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Filing Packet: {selectedFiling.filingReference}
                  </h2>
                  {renderStatusBadge(selectedFiling.status)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provisional Case ID: {selectedFiling.provisionalCaseId || 'N/A'} · Intake ID: {selectedFiling.intakeId}
                </p>
              </div>
              <button
                onClick={() => setShowDetailDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Case Title:</span>
                <span className="font-bold text-slate-900">{selectedFiling.caseTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Court Station & Division:</span>
                <span className="font-semibold text-slate-800">{selectedFiling.courtStation} · {selectedFiling.division}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Submission Date:</span>
                <span className="font-semibold text-slate-800">{selectedFiling.submissionDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Filing Type:</span>
                <span className="font-semibold text-slate-800">{selectedFiling.filingType || selectedFiling.caseType}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Claim Value:</span>
                <span className="font-bold text-slate-900">{selectedFiling.claimAmount}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Statutory Assessment:</span>
                <span className="font-mono font-bold text-blue-900">{selectedFiling.estimatedFees}</span>
              </div>
            </div>

            {/* If correction required */}
            {(selectedFiling.status === 'Correction Required' || selectedFiling.status === 'Clarification') && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Registry Correction Directives</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">
                  {selectedFiling.registrarNotes || 'Please upload the mandatory sworn verifying affidavit and signed statement of claim.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setShowCorrectionModal(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Rectification & Resubmit</span>
                  </button>
                </div>
              </div>
            )}

            {/* Documents Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-700" />
                <span>Enclosed Pleading Documents ({selectedFiling.documents.length})</span>
              </h3>
              <div className="space-y-1.5">
                {selectedFiling.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {doc.type} · {doc.size} · Uploaded by {doc.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreviewDocument(doc)}
                      className="px-2.5 py-1 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pleading Audit Trail */}
            {selectedFiling.activities && selectedFiling.activities.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Procedural Activity Trail</span>
                </h3>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                  {selectedFiling.activities.map((act) => (
                    <div key={act.id} className="p-3 text-xs flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{act.action}</p>
                        {act.notes && <p className="text-[11px] text-slate-600 mt-0.5">{act.notes}</p>}
                        <p className="text-[10px] text-slate-400 mt-1">
                          Actor: {act.actor} ({act.actorRole})
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{act.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <button
                onClick={() => {
                  setShowDetailDrawer(false);
                  onNavigate('filing_receipts');
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Receipt className="w-4 h-4 text-amber-600" />
                <span>View Official Receipt</span>
              </button>

              <button
                onClick={() => setShowDetailDrawer(false)}
                className="px-5 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Correction Rectification Modal */}
      {showCorrectionModal && selectedFiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Address Registry Correction Directive
                </h3>
              </div>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-red-900">
              <p className="font-bold">Court Registry Note:</p>
              <p className="mt-0.5 text-[11px] text-red-800">
                {selectedFiling.registrarNotes || 'Upload required supporting process.'}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Amended / Missing Document File Name:
                </label>
                <input
                  type="text"
                  value={correctionFile}
                  onChange={(e) => setCorrectionFile(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 font-mono"
                  placeholder="e.g. Verifying_Affidavit_Amended.pdf"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Counsel's Explanatory Note to Registrar:
                </label>
                <textarea
                  rows={3}
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600"
                  placeholder="Explain corrections made to comply with rules..."
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  Resubmission will immediately place the filing back into the Court Registrar's Active Review Queue with a timestamped audit record.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResubmitCorrection}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Submit Rectification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Inspector Modal */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">{previewDocument.name}</h3>
              </div>
              <button
                onClick={() => setPreviewDocument(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50 font-serif text-xs text-slate-800 space-y-3 shadow-inner">
              <div className="text-center space-y-0.5">
                <p className="font-bold uppercase tracking-widest text-slate-900">
                  JUDICIAL SERVICE OF GHANA
                </p>
                <p className="text-[10px] text-slate-500">ELECTRONIC CASE MANAGEMENT SYSTEM (eCMS 2.0)</p>
                <p className="text-[11px] font-mono text-blue-900 font-bold">[{previewDocument.type}]</p>
              </div>

              <div className="border-t border-b border-slate-200 py-2.5 text-[11px] space-y-1">
                <p><strong>DOCUMENT NAME:</strong> {previewDocument.name}</p>
                <p><strong>SIZE:</strong> {previewDocument.size} · <strong>CATEGORY:</strong> {previewDocument.folder || 'Pleadings'}</p>
                <p><strong>UPLOADED BY:</strong> {previewDocument.uploadedBy} on {previewDocument.uploadedAt}</p>
                <p><strong>DIGITAL CHECKSUM:</strong> SHA-256 Validated (JSG-DIGITAL-CERT)</p>
              </div>

              <p className="italic text-slate-600 text-[11px]">
                "Certified electronic process filed through the Judicial Service of Ghana e-Filing portal."
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
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

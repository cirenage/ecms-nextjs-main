'use client';
import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Search,
  Upload,
  ArrowRight,
  Eye,
  PlusCircle,
  Building2,
  Calendar,
  Scale,
  ShieldCheck,
  Receipt,
  FileCheck,
  X,
  Printer,
  ChevronRight,
  Gavel,
  History,
} from 'lucide-react';
import { UserProfile, CaseRecord, SubsequentFilingItem, CaseDocument } from '../../types';
import { repository } from '../../data/caseRepository';

interface SubsequentFilingsScreenProps {
  currentUser: UserProfile;
  cases: CaseRecord[];
  onNavigate: (screen: string) => void;
  onSelectCase?: (caseItem: CaseRecord) => void;
}

export const SubsequentFilingsScreen: React.FC<SubsequentFilingsScreenProps> = ({
  currentUser,
  cases,
  onNavigate,
  onSelectCase,
}) => {
  const [activeTab, setActiveTab] = useState<'new_filing' | 'history'>('new_filing');

  // Form State
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [caseSearchTerm, setCaseSearchTerm] = useState('');
  const [documentCategory, setDocumentCategory] = useState<string>('Interlocutory Motion');
  const [documentTitle, setDocumentTitle] = useState<string>('Motion on Notice for Interlocutory Injunction');
  const [partyRole, setPartyRole] = useState<string>('Plaintiff / Applicant');
  const [fileNameInput, setFileNameInput] = useState<string>('Motion_for_Injunction_Affidavit.pdf');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [statutoryDeclaration, setStatutoryDeclaration] = useState<boolean>(false);
  const [isExempt, setIsExempt] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('Application brought pursuant to Order 25 Rule 1 of the High Court Civil Procedure Rules (C.I. 47).');

  // Submission result
  const [submittedItem, setSubmittedItem] = useState<SubsequentFilingItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<CaseDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedCase = useMemo(() => {
    return cases.find((c) => c.id === selectedCaseId || c.suitNumber === selectedCaseId) || cases[0];
  }, [cases, selectedCaseId]);

  // Filter cases for dropdown
  const filteredCases = useMemo(() => {
    if (!caseSearchTerm.trim()) return cases;
    const q = caseSearchTerm.toLowerCase();
    return cases.filter(
      (c) =>
        c.suitNumber.toLowerCase().includes(q) ||
        c.caseTitle.toLowerCase().includes(q) ||
        c.division.toLowerCase().includes(q)
    );
  }, [cases, caseSearchTerm]);

  // Fee Calculation based on document category
  const calculatedFee = useMemo(() => {
    if (isExempt) return 0;
    switch (documentCategory) {
      case 'Interlocutory Motion':
        return 120.0;
      case 'Responsive Pleading':
        return 80.0;
      case 'Affidavits & Sworn Declarations':
        return 50.0;
      case 'Appeals & Post-Judgment Applications':
        return 250.0;
      case 'Evidence & Witness Statements':
        return 60.0;
      case 'Administrative & Representation':
        return 40.0;
      default:
        return 75.0;
    }
  }, [documentCategory, isExempt]);

  // Subsequent filings history from repository
  const subsequentFilingsHistory = repository.getSubsequentFilings();

  // Submission handler
  const handleSubmitSubsequentFiling = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCase) {
      showToast('Please select a valid registered court case.');
      return;
    }

    if (!statutoryDeclaration) {
      showToast('Please certify the statutory declaration compliance checkbox.');
      return;
    }

    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const filingRef = `SUB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newDoc: CaseDocument = {
      id: `doc_sub_${Date.now()}`,
      name: fileNameInput.trim() || `${documentTitle}.pdf`,
      type: documentCategory,
      size: `${(Math.random() * 1.5 + 0.4).toFixed(1)} MB`,
      uploadedAt: timestamp,
      uploadedBy: currentUser.name,
      verified: true,
      folder: 'Subsequent Filings',
    };

    const newSubsequentFiling: SubsequentFilingItem = {
      id: `sub_filing_${Date.now()}`,
      caseId: selectedCase.id,
      suitNumber: selectedCase.suitNumber,
      caseTitle: selectedCase.caseTitle,
      filingRef,
      documentType: documentCategory,
      documentTitle,
      submittedBy: `${currentUser.name} (${currentUser.title})`,
      submittingPartyRole: partyRole,
      submissionDate: timestamp,
      status: 'Submitted',
      feeAmount: calculatedFee,
      paymentStatus: isExempt ? 'Exempt' : 'Paid',
      document: newDoc,
      reviewNotes: notes,
    };

    // Save into repository
    repository.addSubsequentFiling(newSubsequentFiling);

    // If payment required, create receipt/invoice
    if (calculatedFee > 0) {
      repository.addInvoice({
        id: `inv_sub_${Date.now()}`,
        invoiceRefNo: `SUB-INV-${Math.floor(1000000 + Math.random() * 9000000)}`,
        caseTitle: `${selectedCase.caseTitle} (${selectedCase.suitNumber})`,
        payeeName: currentUser.name,
        payeeBpId: currentUser.badgeOrLicense || 'BP-3000004128',
        category: 'Fees',
        accountNumber: 'ECO-JSG-REVENUE-001',
        amount: calculatedFee,
        currency: 'GHS',
        status: 'Payment Done',
        dateCreated: new Date().toISOString().split('T')[0],
        paymentConfirmationNo: `ECO-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentDate: new Date().toISOString().split('T')[0],
      });
    }

    setSubmittedItem(newSubsequentFiling);
    showToast(`Subsequent filing "${documentTitle}" successfully lodged into Case ${selectedCase.suitNumber}!`);
  };

  const handleResetForm = () => {
    setSubmittedItem(null);
    setStatutoryDeclaration(false);
    setDocumentTitle('Affidavit in Opposition');
    setFileNameInput('Affidavit_In_Opposition.pdf');
  };

  return (
    <div className="space-y-5 pb-12 max-w-6xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Subsequent Court Filings
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#14366A] text-white tracking-wider uppercase">
              Lawyer Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Lodge interlocutory motions, affidavits, statements of defence, witness statements, and post-judgment processes into active court dockets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('filing_list')}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-blue-700" />
            <span>My Filings</span>
          </button>
          <button
            onClick={() => onNavigate('filing_receipts')}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-600" />
            <span>Filing Receipts</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setActiveTab('new_filing');
            setSubmittedItem(null);
          }}
          className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'new_filing'
              ? 'bg-[#14366A] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
          <span>Lodge Subsequent Document</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'history'
              ? 'bg-[#14366A] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-slate-400" />
          <span>Subsequent Filings Lodged ({subsequentFilingsHistory.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'new_filing' ? (
        submittedItem ? (
          /* Submission Success State */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Subsequent Process Successfully Filed
              </span>
              <h2 className="text-xl font-bold text-slate-900 pt-1">
                LODGED INTO CASE: {submittedItem.suitNumber}
              </h2>
              <p className="text-xs text-slate-500">
                Filing Reference: <span className="font-mono font-bold text-slate-800">{submittedItem.filingRef}</span>
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                <div>
                  <p className="text-slate-500 text-[11px]">Case Title</p>
                  <p className="font-bold text-slate-900">{submittedItem.caseTitle}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Suit Number</p>
                  <p className="font-mono font-bold text-blue-900">{submittedItem.suitNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Document Lodged</p>
                  <p className="font-semibold text-slate-800">{submittedItem.documentTitle}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Category</p>
                  <p className="font-medium text-slate-700">{submittedItem.documentType}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Statutory Fee Paid</p>
                  <p className="font-mono font-bold text-emerald-700">
                    {submittedItem.feeAmount > 0 ? `GHS ${submittedItem.feeAmount.toFixed(2)}` : 'Exempt'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px]">Lodgement Timestamp</p>
                  <p className="font-semibold text-slate-800">{submittedItem.submissionDate}</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 space-y-1">
                <p className="font-bold">Court Processing Note:</p>
                <p>
                  This document has been immediately transmitted into the official electronic court docket.
                  The presiding judge and court registrar have been notified.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('filing_receipts')}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5"
              >
                <Receipt className="w-4 h-4 text-amber-600" />
                <span>View Official Receipt</span>
              </button>

              <button
                onClick={() => {
                  if (onSelectCase && selectedCase) onSelectCase(selectedCase);
                  onNavigate('case_tracking');
                }}
                className="px-5 py-2 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Gavel className="w-4 h-4 text-[#D4AF37]" />
                <span>Open in Case eDocket</span>
              </button>

              <button
                onClick={handleResetForm}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                File Another Document
              </button>
            </div>
          </div>
        ) : (
          /* Subsequent Filing Wizard Form */
          <form onSubmit={handleSubmitSubsequentFiling} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Form Details (2 cols) */}
              <div className="lg:col-span-2 space-y-5">
                {/* Step 1: Select Registered Case */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <span className="w-6 h-6 rounded-full bg-[#14366A] text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">
                      Select Registered Court Case
                    </h2>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Search & Select Registered Suit Number:
                      </label>
                      <select
                        value={selectedCaseId}
                        onChange={(e) => setSelectedCaseId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:bg-white"
                      >
                        {cases.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.suitNumber} — {c.caseTitle} ({c.division})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Case Snapshot Card */}
                    {selectedCase && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-blue-900 text-sm">
                            {selectedCase.suitNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            {selectedCase.status}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900">{selectedCase.caseTitle}</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Court & Division:</span>
                            <span>{selectedCase.court} · {selectedCase.division}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Assigned Judge:</span>
                            <span>{selectedCase.assignedJudgeName || 'Pending Assignment'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Next Hearing:</span>
                            <span>{selectedCase.nextHearingDate || 'Not Scheduled'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Current Docket Size:</span>
                            <span>{selectedCase.documents.length} Enclosed Documents</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Document Classification */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <span className="w-6 h-6 rounded-full bg-[#14366A] text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">
                      Process Category & Pleading Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Document Classification Category:
                      </label>
                      <select
                        value={documentCategory}
                        onChange={(e) => setDocumentCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:bg-white"
                      >
                        <option value="Interlocutory Motion">Interlocutory Motion (Orders, Injunctions)</option>
                        <option value="Responsive Pleading">Responsive Pleading (Defence, Reply, Counterclaim)</option>
                        <option value="Affidavits & Sworn Declarations">Affidavits (Opposition, Service, Supplementary)</option>
                        <option value="Evidence & Witness Statements">Witness Statements & Expert Reports</option>
                        <option value="Appeals & Post-Judgment Applications">Appeals & Stay of Execution</option>
                        <option value="Administrative & Representation">Change of Solicitor & Administrative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Submitting Party Representation:
                      </label>
                      <select
                        value={partyRole}
                        onChange={(e) => setPartyRole(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 focus:bg-white"
                      >
                        <option value="Plaintiff / Applicant">Counsel for Plaintiff / Applicant</option>
                        <option value="Defendant / Respondent">Counsel for Defendant / Respondent</option>
                        <option value="Interested Party">Interested Party / Intervener</option>
                        <option value="Amicus Curiae">Amicus Curiae</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Official Process Title / Heading:
                      </label>
                      <input
                        type="text"
                        value={documentTitle}
                        onChange={(e) => setDocumentTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600"
                        placeholder="e.g. Motion on Notice for Interlocutory Injunction"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Pleading Summary / Legal Authority / Rules Invoked:
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600"
                        placeholder="State relevant procedural rules or reliefs sought..."
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="urgent_toggle"
                        checked={isUrgent}
                        onChange={(e) => setIsUrgent(e.target.checked)}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-600"
                      />
                      <label htmlFor="urgent_toggle" className="text-xs text-slate-700 font-semibold cursor-pointer">
                        Urgent / Ex-Parte Application (Flag for immediate registrar attention)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Step 3: Document Upload */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <span className="w-6 h-6 rounded-full bg-[#14366A] text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">
                      Upload Executed Process Document
                    </h2>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50/60 hover:bg-slate-50 transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-semibold text-slate-800">
                        Drop certified court document or specify electronic file
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Accepted Formats: PDF (Certified A4), DOCX · Max 25 MB
                      </p>

                      <div className="mt-3 max-w-sm mx-auto">
                        <input
                          type="text"
                          value={fileNameInput}
                          onChange={(e) => setFileNameInput(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-600 text-center"
                          placeholder="File name (e.g. Affidavit_In_Opposition.pdf)"
                          required
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-700 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900">{fileNameInput}</p>
                          <p className="text-[11px] text-slate-500">PDF Document · Signed & Commissioned</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Format Valid
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Fee Assessment & Declaration (1 col) */}
              <div className="space-y-5">
                {/* Fee Assessment Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-700" />
                      <span>Fee Assessment</span>
                    </h3>
                    <span className="text-[10px] text-slate-400">Statutory Tariff</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Filing Tariff ({documentCategory}):</span>
                      <span className="font-mono font-semibold text-slate-800">
                        GHS {calculatedFee > 0 ? (calculatedFee * 0.85).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Judicial IT & Automation Levy:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        GHS {calculatedFee > 0 ? (calculatedFee * 0.15).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    {isUrgent && (
                      <div className="flex justify-between text-amber-700 font-semibold">
                        <span>Urgent Ex-Parte Handling:</span>
                        <span className="font-mono">Included</span>
                      </div>
                    )}

                    <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-sm">Total Payable:</span>
                      <span className="font-mono font-bold text-slate-950 text-base">
                        GHS {calculatedFee.toFixed(2)}
                      </span>
                    </div>

                    {/* Exemption Checkbox */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="fee_exemption"
                        checked={isExempt}
                        onChange={(e) => setIsExempt(e.target.checked)}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-600"
                      />
                      <label htmlFor="fee_exemption" className="text-[11px] text-slate-600 cursor-pointer">
                        Statutory Fee Exemption (Legal Aid / Republic)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Statutory Certification */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <Scale className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Solicitor's Declaration
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1">
                      <p className="font-bold">Certification of Compliance:</p>
                      <p className="leading-relaxed">
                        I certify that this process conforms to the High Court Civil Procedure Rules (C.I. 47) and that true copies will be served on all adverse parties within prescribed statutory timelines.
                      </p>
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="declaration_checkbox"
                        checked={statutoryDeclaration}
                        onChange={(e) => setStatutoryDeclaration(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-600"
                        required
                      />
                      <label
                        htmlFor="declaration_checkbox"
                        className="text-xs text-slate-700 font-semibold cursor-pointer"
                      >
                        I attest and execute this declaration as Counsel of Record ({currentUser.badgeOrLicense || 'GBA12345'}).
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!statutoryDeclaration}
                      className={`w-full py-2.5 rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                        statutoryDeclaration
                          ? 'bg-[#14366A] hover:bg-[#0E264D] text-white cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Upload className="w-4 h-4 text-[#D4AF37]" />
                      <span>Submit Subsequent Process</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )
      ) : (
        /* History of Subsequent Filings */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Subsequent Documents Lodged in Docket
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Complete record of interlocutory processes, affidavits, and pleadings filed into ongoing proceedings.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('new_filing')}
              className="px-3 py-1.5 bg-[#14366A] text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Subsequent Process</span>
            </button>
          </div>

          {subsequentFilingsHistory.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No subsequent filings recorded yet</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Use the "Lodge Subsequent Document" tab above to file motions or affidavits into existing cases.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Ref & Date</th>
                    <th className="py-3 px-4">Case Suit No & Title</th>
                    <th className="py-3 px-4">Document Title & Category</th>
                    <th className="py-3 px-4">Filer & Role</th>
                    <th className="py-3 px-4">Fee Paid</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {subsequentFilingsHistory.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 align-top font-mono font-bold text-slate-900">
                        {sub.filingRef}
                        <span className="block text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                          {sub.submissionDate}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span className="font-mono font-bold text-blue-900 block">{sub.suitNumber}</span>
                        <span className="font-semibold text-slate-800 line-clamp-1">{sub.caseTitle}</span>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span className="font-semibold text-slate-900 block">{sub.documentTitle}</span>
                        <span className="text-[10px] text-slate-500">{sub.documentType}</span>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span className="font-medium text-slate-800">{sub.submittedBy}</span>
                        <span className="block text-[10px] text-slate-500">{sub.submittingPartyRole}</span>
                      </td>

                      <td className="py-3 px-4 align-top font-mono font-semibold text-emerald-700">
                        {sub.feeAmount > 0 ? `GHS ${sub.feeAmount.toFixed(2)}` : 'Exempt'}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          {sub.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const target = cases.find((c) => c.suitNumber === sub.suitNumber);
                            if (target && onSelectCase) onSelectCase(target);
                            onNavigate('case_tracking');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                        >
                          eDocket
                        </button>
                        <button
                          onClick={() => onNavigate('filing_receipts')}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-semibold"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

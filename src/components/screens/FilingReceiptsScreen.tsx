'use client';
import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Printer,
  Download,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  Scale,
  FileText,
  QrCode,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  X,
  Share2,
} from 'lucide-react';
import { UserProfile, FilingItem, SubsequentFilingItem, CaseRecord } from '../../types';
import { repository } from '../../data/caseRepository';

interface FilingReceiptsScreenProps {
  currentUser: UserProfile;
  cases: CaseRecord[];
  onNavigate: (screen: string) => void;
  onTrackCase?: (suitNumber: string) => void;
}

interface PrintableReceiptData {
  receiptNumber: string;
  filingRef: string;
  provisionalCaseId?: string;
  suitNumber?: string;
  caseTitle: string;
  court: string;
  division: string;
  processType: string;
  filerName: string;
  filerLicense: string;
  submissionDate: string;
  amount: string;
  paymentMethod: string;
  transactionRef: string;
  status: string;
  documents: { name: string; type: string; size: string }[];
  verificationHash: string;
}

export const FilingReceiptsScreen: React.FC<FilingReceiptsScreenProps> = ({
  currentUser,
  cases,
  onNavigate,
  onTrackCase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'originating' | 'subsequent'>('all');

  const filings = repository.getFilings();
  const subsequentFilings = repository.getSubsequentFilings();

  // Selected receipt to view / print
  const [selectedReceipt, setSelectedReceipt] = useState<PrintableReceiptData | null>(null);

  // Unified receipts list
  const allReceipts = useMemo(() => {
    const list: PrintableReceiptData[] = [];

    // Add originating filings
    filings.forEach((f, idx) => {
      list.push({
        receiptNumber: `JSG-REC-2026-${String(4000 + idx).padStart(5, '0')}`,
        filingRef: f.filingReference,
        provisionalCaseId: f.provisionalCaseId,
        suitNumber: f.registeredSuitNumber,
        caseTitle: f.caseTitle,
        court: f.court || 'High Court of Justice',
        division: f.division,
        processType: f.filingType || f.caseType,
        filerName: f.submittedBy,
        filerLicense: currentUser.badgeOrLicense || 'GBA12345',
        submissionDate: f.submissionDate,
        amount: f.estimatedFees,
        paymentMethod: f.paymentStatus === 'Fees Exempt' ? 'Statutory Exemption' : 'Ghana.gov / Ecobank GH',
        transactionRef: f.transactionRef || `ECO-TXN-88${idx}102`,
        status: f.paymentStatus,
        documents: f.documents.map((d) => ({ name: d.name, type: d.type, size: d.size })),
        verificationHash: `SHA256: 8F4B-99E${idx}-EC91-JSG`,
      });
    });

    // Add subsequent filings
    subsequentFilings.forEach((s, idx) => {
      list.push({
        receiptNumber: `JSG-SUB-2026-${String(7000 + idx).padStart(5, '0')}`,
        filingRef: s.filingRef,
        suitNumber: s.suitNumber,
        caseTitle: s.caseTitle,
        court: 'High Court of Justice',
        division: 'Specialised Courts Division',
        processType: `${s.documentType} — ${s.documentTitle}`,
        filerName: s.submittedBy,
        filerLicense: currentUser.badgeOrLicense || 'GBA12345',
        submissionDate: s.submissionDate,
        amount: s.feeAmount > 0 ? `GHS ${s.feeAmount.toFixed(2)}` : 'GHS 0.00 (Exempt)',
        paymentMethod: s.feeAmount > 0 ? 'Ghana.gov / Ecobank GH' : 'Statutory Exemption',
        transactionRef: `ECO-SUB-55${idx}419`,
        status: s.paymentStatus === 'Paid' ? 'Paid' : 'Exempt',
        documents: [{ name: s.document.name, type: s.document.type, size: s.document.size }],
        verificationHash: `SHA256: 3A1D-77F${idx}-SUB9-JSG`,
      });
    });

    return list;
  }, [filings, subsequentFilings, currentUser]);

  // Set initial selected receipt
  React.useEffect(() => {
    if (!selectedReceipt && allReceipts.length > 0) {
      setSelectedReceipt(allReceipts[0]);
    }
  }, [allReceipts, selectedReceipt]);

  // Filtered receipts
  const filteredReceipts = useMemo(() => {
    let list = allReceipts;

    if (filterType === 'originating') {
      list = list.filter((r) => r.receiptNumber.startsWith('JSG-REC'));
    } else if (filterType === 'subsequent') {
      list = list.filter((r) => r.receiptNumber.startsWith('JSG-SUB'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.receiptNumber.toLowerCase().includes(q) ||
          r.filingRef.toLowerCase().includes(q) ||
          r.caseTitle.toLowerCase().includes(q) ||
          (r.suitNumber && r.suitNumber.toLowerCase().includes(q)) ||
          r.processType.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allReceipts, filterType, searchQuery]);

  return (
    <div className="space-y-5 pb-12 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Electronic Filing Receipts
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#14366A] text-white tracking-wider uppercase">
              Official eCMS Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically verified court filing receipts and payment vouchers issued under the authority of the Judicial Service of Ghana.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Print Current Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Split view with Receipt list on left, Preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Receipts List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search receipt no, suit no, case..."
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

            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All Receipts' },
                { id: 'originating', label: 'Originating' },
                { id: 'subsequent', label: 'Subsequent' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilterType(t.id as any)}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                    filterType === t.id
                      ? 'bg-[#14366A] text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Receipt Items Scrollable List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
            {filteredReceipts.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-slate-500">
                No receipts match your search.
              </div>
            ) : (
              filteredReceipts.map((rec) => {
                const isSelected = selectedReceipt?.receiptNumber === rec.receiptNumber;
                return (
                  <div
                    key={rec.receiptNumber}
                    onClick={() => setSelectedReceipt(rec)}
                    className={`p-3.5 transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-l-[#14366A]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {rec.receiptNumber}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {rec.amount}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {rec.caseTitle}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="line-clamp-1">{rec.processType}</span>
                      <span className="font-mono text-[10px] shrink-0">{rec.submissionDate}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-slate-400 font-mono">
                        Ref: {rec.filingRef}
                      </span>
                      {rec.suitNumber && (
                        <span className="text-blue-700 font-bold font-mono">
                          {rec.suitNumber}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Printable High-Fidelity Receipt Card (7 cols) */}
        <div className="lg:col-span-7">
          {selectedReceipt ? (
            <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden text-slate-800 font-sans print:shadow-none print:border-none print:p-0">
              {/* Ghana Gold / Navy Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#14366A] via-[#D4AF37] to-[#14366A]" />

              {/* Header: Ghana Judicial Service Crest & Heading */}
              <div className="text-center space-y-1.5 border-b border-slate-200 pb-5">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                    <img
                      src="/jsg-logo.svg"
                      alt="JSG Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#14366A]">
                      Judicial Service of Ghana
                    </h2>
                    <p className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold">
                      Electronic Case Management System (eCMS 2.0)
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Specialised Courts Central Registry · Law Court Complex, Accra
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-[#14366A] text-[#D4AF37] text-xs font-extrabold uppercase tracking-widest rounded-md">
                    Official Electronic Filing Acknowledgement Receipt
                  </span>
                </div>
              </div>

              {/* Receipt Key Metadata Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Receipt No.</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{selectedReceipt.receiptNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Filing Reference</span>
                  <span className="font-mono font-bold text-blue-900 text-xs">{selectedReceipt.filingRef}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Date & Time Issued</span>
                  <span className="font-semibold text-slate-800 text-xs">{selectedReceipt.submissionDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Filing Mode</span>
                  <span className="font-bold text-emerald-700 text-xs">Certified Online</span>
                </div>
              </div>

              {/* Case Particulars */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-[#14366A] text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cause & Proceedings Particulars</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Case Title / Cause:</span>
                    <span className="font-bold text-slate-900">{selectedReceipt.caseTitle}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">Court & Division:</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.court} · {selectedReceipt.division}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">Process Category Filed:</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.processType}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">Official Registered Suit No.:</span>
                    <span className="font-mono font-bold text-blue-900">
                      {selectedReceipt.suitNumber || 'Provisional Assignment Pending Intake'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Filer / Solicitor Particulars */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-[#14366A] text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>Filing Solicitor & Litigant Representation</span>
                </h3>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Filed By / Counsel:</span>
                    <span className="font-semibold text-slate-900">{selectedReceipt.filerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Bar License / Business Partner ID:</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedReceipt.filerLicense}</span>
                  </div>
                </div>
              </div>

              {/* Schedule of Process Documents Filed */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-[#14366A] text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Schedule of Electronically Sealed Documents</span>
                </h3>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Document Title</th>
                        <th className="py-2 px-3">Process Category</th>
                        <th className="py-2 px-3">File Size</th>
                        <th className="py-2 px-3 text-right">Integrity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {selectedReceipt.documents.map((doc, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-semibold text-slate-900">{doc.name}</td>
                          <td className="py-2 px-3 text-slate-600">{doc.type}</td>
                          <td className="py-2 px-3 font-mono text-slate-500">{doc.size}</td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-700">SHA-256 Valid</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Statutory Fee Assessment & Payment Breakdown */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-[#14366A] text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                  <span>Court Tariff Assessment & Settlement</span>
                </h3>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Channel:</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Reference / Auth:</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedReceipt.transactionRef}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Total Statutory Tariff Paid:</span>
                    <span className="font-mono font-bold text-slate-950 text-sm">
                      {selectedReceipt.amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Cryptographic Seal & Registrar Stamp */}
              <div className="border-t-2 border-dashed border-slate-300 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* QR Code Verification Box */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                    {/* SVG QR Code Simulation */}
                    <svg viewBox="0 0 40 40" className="w-full h-full text-slate-900">
                      <rect width="40" height="40" fill="white" />
                      <rect x="2" y="2" width="10" height="10" fill="#14366A" />
                      <rect x="4" y="4" width="6" height="6" fill="white" />
                      <rect x="28" y="2" width="10" height="10" fill="#14366A" />
                      <rect x="30" y="4" width="6" height="6" fill="white" />
                      <rect x="2" y="28" width="10" height="10" fill="#14366A" />
                      <rect x="4" y="30" width="6" height="6" fill="white" />
                      <rect x="16" y="4" width="4" height="4" fill="#14366A" />
                      <rect x="22" y="8" width="4" height="4" fill="#14366A" />
                      <rect x="16" y="16" width="8" height="8" fill="#14366A" />
                      <rect x="28" y="16" width="6" height="4" fill="#14366A" />
                      <rect x="4" y="16" width="8" height="4" fill="#14366A" />
                      <rect x="16" y="28" width="4" height="6" fill="#14366A" />
                      <rect x="24" y="26" width="8" height="8" fill="#14366A" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">eCMS Public Verification Code</p>
                    <p className="font-mono text-[10px] font-bold text-slate-900">{selectedReceipt.verificationHash}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Scan to verify authentic court filing records</p>
                  </div>
                </div>

                {/* Registrar Stamp Box */}
                <div className="text-center sm:text-right space-y-1">
                  <div className="inline-block border-2 border-blue-900/40 rounded-lg px-4 py-1.5 bg-blue-50/50">
                    <p className="text-[9px] uppercase font-bold text-blue-900 tracking-wider">
                      JUDICIAL SERVICE OF GHANA
                    </p>
                    <p className="text-[8px] uppercase tracking-wider text-slate-600">
                      ELECTRONIC REGISTRY CERTIFIED
                    </p>
                    <p className="text-[8px] font-mono text-blue-800">
                      AUTHENTICATED UNDER C.I. 47
                    </p>
                  </div>
                  <p className="text-[9px] text-slate-400 italic">
                    Certified electronic record. No manual signature required.
                  </p>
                </div>
              </div>

              {/* Bottom Action Buttons (Hidden on Print) */}
              <div className="print:hidden pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Print Official Receipt</span>
                  </button>

                  <button
                    onClick={() => alert('Official Electronic Receipt downloaded as PDF.')}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>

                {selectedReceipt.suitNumber && (
                  <button
                    onClick={() => {
                      if (onTrackCase) onTrackCase(selectedReceipt.suitNumber!);
                      else onNavigate('case_tracking');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Case Tracking</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              Select a receipt from the list on the left to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

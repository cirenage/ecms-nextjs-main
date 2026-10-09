import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Clock,
  User,
  ShieldCheck,
  Check,
  X,
  FileCheck,
  Building2,
  Calendar,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Eye,
  CornerDownRight,
} from 'lucide-react';
import { UserProfile, FilingItem } from '../../types';
import { repository } from '../../data/caseRepository';

interface RegistrarIntakeScreenProps {
  currentUser: UserProfile;
  filing?: FilingItem;
  onNavigate: (screen: string) => void;
  onProceedToAssignment?: (filing: FilingItem) => void;
}

export const RegistrarIntakeScreen: React.FC<RegistrarIntakeScreenProps> = ({
  currentUser,
  filing,
  onNavigate,
  onProceedToAssignment,
}) => {
  const currentFiling = filing || repository.getFilings()[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'parties' | 'claim' | 'history'>('overview');
  const [decision, setDecision] = useState<'accept' | 'clarify' | 'escalate' | 'reject'>('accept');
  const [registrarNotes, setRegistrarNotes] = useState(
    currentFiling?.registrarNotes || 'All mandatory exhibits included. Fee paid via Ghana.gov Ecobank portal receipt JS-009-2024.'
  );
  const [comments, setComments] = useState('');
  const [isCompliant, setIsCompliant] = useState(true);

  const handleDecisionSubmit = () => {
    if (decision === 'accept') {
      repository.updateFilingDecision(currentFiling.id, 'Approved', registrarNotes);
      alert(
        `Filing Accepted & Intaked!\nFiling Ref: ${currentFiling.filingReference}\nCase registered in system.\n\nProceeding to Case Assignment (Assign Judge).`
      );
      if (onProceedToAssignment) {
        onProceedToAssignment(currentFiling);
      } else {
        onNavigate('case_assignment');
      }
    } else if (decision === 'clarify') {
      repository.updateFilingDecision(currentFiling.id, 'Clarification', comments || 'Clarification requested by registrar');
      alert('Clarification request sent to filer.');
      onNavigate('registry_dashboard');
    } else if (decision === 'reject') {
      repository.updateFilingDecision(currentFiling.id, 'Rejected', comments || 'Rejected by registrar');
      alert('Filing has been rejected.');
      onNavigate('registry_dashboard');
    } else {
      alert('Escalated to Court Manager.');
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner Row matching Page 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Review Filing
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
              INTAKE ID: {currentFiling.intakeId}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Submitted on: {currentFiling.submissionDate} by{' '}
            <strong className="text-slate-700">{currentFiling.submittedBy}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Downloading complete PDF bundle with electronic time-stamp')}
            className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All</span>
          </button>
          <button
            onClick={() => alert('More Options: Print Summary, Audit Docket, Assign Priority Flag')}
            className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            More Actions v
          </button>
        </div>
      </div>

      {/* Horizontal Status Stepper matching Page 7 */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto relative text-center">
          <div className="absolute left-8 right-8 top-3.5 h-0.5 bg-slate-200 -z-0" />

          {/* Step 1: Submitted */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 mt-1">Submitted</span>
            <span className="text-[10px] text-slate-400">20 May 2024</span>
          </div>

          {/* Step 2: Under Review */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-blue-100 shadow-xs">
              2
            </div>
            <span className="text-[11px] font-bold text-blue-900 mt-1">Under Review</span>
            <span className="text-[10px] text-blue-600 font-medium">Current Step</span>
          </div>

          {/* Step 3: Clarification */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-[11px] font-medium text-slate-600 mt-1">Clarification</span>
            <span className="text-[10px] text-slate-400">(If Required)</span>
          </div>

          {/* Step 4: Approved */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span className="text-[11px] font-medium text-slate-600 mt-1">Approved</span>
            <span className="text-[10px] text-slate-400">(Intake)</span>
          </div>

          {/* Step 5: Case Created */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">
              5
            </div>
            <span className="text-[11px] font-medium text-slate-600 mt-1">Case Created</span>
            <span className="text-[10px] text-slate-400">(Complete)</span>
          </div>
        </div>
      </div>

      {/* Tabs Row matching Page 7 */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        {[
          { id: 'overview', label: 'Filing Overview' },
          { id: 'documents', label: `Documents (${currentFiling.documents.length})` },
          { id: 'parties', label: `Parties (${currentFiling.parties.length})` },
          { id: 'claim', label: 'Claim Details' },
          { id: 'history', label: 'Review History' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Filing Info + Right Intake Decision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Information Pane (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filing Information Card matching Page 7 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
              Filing Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <div>
                <p className="text-slate-500">Case Title</p>
                <p className="font-bold text-slate-900 mt-0.5">{currentFiling.caseTitle}</p>
              </div>

              <div>
                <p className="text-slate-500">Filing Type</p>
                <p className="font-bold text-slate-900 mt-0.5">New Case Filing</p>
              </div>

              <div>
                <p className="text-slate-500">Court</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentFiling.court}</p>
              </div>

              <div>
                <p className="text-slate-500">Submitted By</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentFiling.submittedBy}</p>
              </div>

              <div>
                <p className="text-slate-500">Division</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentFiling.division}</p>
              </div>

              <div>
                <p className="text-slate-500">Submission Date</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentFiling.submissionDate}</p>
              </div>

              <div>
                <p className="text-slate-500">Case Type</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentFiling.caseType}</p>
              </div>

              <div>
                <p className="text-slate-500">Filing Reference</p>
                <p className="font-bold text-blue-700 font-mono mt-0.5">
                  {currentFiling.filingReference}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Nature of Claim</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentFiling.natureOfClaim}</p>
              </div>

              <div>
                <p className="text-slate-500">Estimated Fees</p>
                <p className="font-bold font-mono text-slate-900 mt-0.5">{currentFiling.estimatedFees}</p>
              </div>

              <div>
                <p className="text-slate-500">Claim Amount</p>
                <p className="font-bold font-mono text-slate-900 mt-0.5">{currentFiling.claimAmount}</p>
              </div>

              <div>
                <p className="text-slate-500">Payment Status</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  {currentFiling.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Preliminary Review Checklist matching Page 7 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
              Preliminary Review Checklist
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700">All required documents uploaded</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Yes
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700">Claim details provided</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Yes
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700">Court fees paid</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Yes
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700">Supporting documents attached</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Yes
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700">Parties information provided</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Yes
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700">Filing complies with rules</span>
                <button
                  type="button"
                  onClick={() => setIsCompliant(!isCompliant)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isCompliant
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isCompliant ? 'Verified' : 'Review'}
                </button>
              </div>
            </div>

            {/* Registrar's Notes (Internal) */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registrar's Notes (Internal)
              </label>
              <textarea
                rows={2}
                value={registrarNotes}
                onChange={(e) => setRegistrarNotes(e.target.value)}
                placeholder="Add any internal notes about this review..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[10px] text-slate-400 font-mono">
                {registrarNotes.length}/1000
              </span>
            </div>
          </div>

          {/* Uploaded Documents & Parties row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Uploaded Documents */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h5 className="text-xs font-bold text-slate-800">
                  Uploaded Documents ({currentFiling.documents.length})
                </h5>
                <span className="text-[11px] text-blue-600 font-medium">View all</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {currentFiling.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">{doc.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold shrink-0">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parties Summary */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h5 className="text-xs font-bold text-slate-800">
                  Parties Summary ({currentFiling.parties.length})
                </h5>
                <span className="text-[11px] text-blue-600 font-medium">View all</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {currentFiling.parties.map((party) => (
                  <div key={party.id} className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50">
                    <div className="flex items-center gap-2 truncate">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">{party.name}</span>
                      <span className="text-[10px] text-slate-400">({party.role})</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold shrink-0">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Box: Intake Decision matching Page 7 */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Intake Decision
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Choose the appropriate action for this filing.
              </p>
            </div>

            {/* Radio Options matching Page 7 */}
            <div className="space-y-3 text-xs">
              <label
                onClick={() => setDecision('accept')}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  decision === 'accept'
                    ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-medium'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="intakeDecision"
                  checked={decision === 'accept'}
                  onChange={() => setDecision('accept')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <p className="font-bold text-slate-900">Accept & Intake Case</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Filing is complete and compliant. Intake case into the system.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setDecision('clarify')}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  decision === 'clarify'
                    ? 'border-amber-500 bg-amber-50/40 text-amber-900 font-medium'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="intakeDecision"
                  checked={decision === 'clarify'}
                  onChange={() => setDecision('clarify')}
                  className="mt-0.5 text-amber-600"
                />
                <div>
                  <p className="font-bold text-slate-900">Request Clarification</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Send the filing back to the filer for clarification or additional documents.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setDecision('escalate')}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  decision === 'escalate'
                    ? 'border-purple-500 bg-purple-50/40 text-purple-900 font-medium'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="intakeDecision"
                  checked={decision === 'escalate'}
                  onChange={() => setDecision('escalate')}
                  className="mt-0.5 text-purple-600"
                />
                <div>
                  <p className="font-bold text-slate-900">Refer to Manager</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Escalate this filing for senior review.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setDecision('reject')}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  decision === 'reject'
                    ? 'border-rose-500 bg-rose-50/40 text-rose-900 font-medium'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="intakeDecision"
                  checked={decision === 'reject'}
                  onChange={() => setDecision('reject')}
                  className="mt-0.5 text-rose-600"
                />
                <div>
                  <p className="font-bold text-slate-900">Reject Filing</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Filing does not comply with court requirements.
                  </p>
                </div>
              </label>
            </div>

            {/* Comments box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add comments for your decision..."
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-600"
                maxLength={500}
              />
              <span className="text-[10px] text-slate-400 font-mono">
                {comments.length}/500
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleDecisionSubmit}
              className={`w-full py-2.5 px-4 text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 ${
                decision === 'accept'
                  ? 'bg-[#14366A] hover:bg-[#0E264D]'
                  : decision === 'clarify'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : decision === 'reject'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {decision === 'accept'
                  ? 'Accept & Intake Case'
                  : decision === 'clarify'
                  ? 'Send Clarification Request'
                  : decision === 'reject'
                  ? 'Confirm Rejection'
                  : 'Escalate to Manager'}
              </span>
            </button>

            <button
              onClick={() => onNavigate('registry_dashboard')}
              className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Save for Later
            </button>
          </div>

          {/* Intake Workflow Timeline matching Page 7 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Intake Workflow
            </h5>

            <div className="space-y-3 text-xs pl-1">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-slate-900">Filing Submitted</p>
                  <p className="text-[11px] text-slate-400">20 May 2024, 08:45 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-blue-900">Under Review</p>
                  <p className="text-[11px] text-blue-600 font-medium">Current Step</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 opacity-60">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-slate-800">Clarification (If Required)</p>
                  <p className="text-[11px] text-slate-400">Pending</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 opacity-60">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="font-medium text-slate-800">Approved (Intake)</p>
                  <p className="text-[11px] text-slate-400">Pending</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 opacity-60">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <p className="font-medium text-slate-800">Case Created</p>
                  <p className="text-[11px] text-slate-400">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation matching Page 7 */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <button
          onClick={() => onNavigate('registry_dashboard')}
          className="flex items-center gap-1.5 hover:text-slate-900 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Filing</span>
        </button>

        <div className="flex items-center gap-6 text-[11px]">
          <div>
            Total Filings in Queue: <strong className="text-slate-900">12</strong>
          </div>
          <div>
            My Reviews: <strong className="text-slate-900">5</strong>
          </div>
          <div>
            Completed Today: <strong className="text-emerald-700">3</strong>
          </div>
        </div>

        <button
          onClick={() => onNavigate('case_assignment')}
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold"
        >
          <span>Next Filing</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

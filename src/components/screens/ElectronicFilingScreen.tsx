import React, { useState } from 'react';
import {
  FileText,
  Users,
  FolderOpen,
  CheckCircle2,
  HelpCircle,
  Lock,
  ArrowRight,
  Save,
  ChevronRight,
  ShieldCheck,
  Building2,
  CreditCard,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, FilingItem } from '../../types';
import { repository } from '../../data/caseRepository';

interface ElectronicFilingScreenProps {
  currentUser: UserProfile;
  onNavigate: (screen: string) => void;
  onFilingComplete?: () => void;
}

export const ElectronicFilingScreen: React.FC<ElectronicFilingScreenProps> = ({
  currentUser,
  onNavigate,
  onFilingComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [court, setCourt] = useState('High Court (Accra)');
  const [division, setDivision] = useState('Civil Division');
  const [caseType, setCaseType] = useState('Contract');
  const [natureOfClaim, setNatureOfClaim] = useState('Breach of Contract');
  const [caseTitle, setCaseTitle] = useState('Ama Serwaa v. Kwame Boateng');
  const [claimAmount, setClaimAmount] = useState('250,000.00');
  const [caseNumber, setCaseNumber] = useState('');
  const [briefDescription, setBriefDescription] = useState(
    'Claimant seeks damages for breach of contract and associated reliefs regarding agricultural commodity supply.'
  );

  const steps = [
    { num: 1, label: 'Case Details' },
    { num: 2, label: 'Parties' },
    { num: 3, label: 'Documents' },
    { num: 4, label: 'Filing Details' },
    { num: 5, label: 'Review' },
    { num: 6, label: 'Payment' },
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create new filing and submit to intake
      const newFiling: FilingItem = {
        id: `filing_${Date.now()}`,
        intakeId: `INT-2024-00${Math.floor(590 + Math.random() * 90)}`,
        filingReference: `EFL-2024-00${Math.floor(1260 + Math.random() * 90)}`,
        caseTitle,
        court,
        division,
        caseType,
        natureOfClaim,
        claimAmount: `GHS ${claimAmount}`,
        estimatedFees: 'GHS 350.00',
        submittedBy: `${currentUser.name} (${currentUser.title})`,
        submittedByRole: currentUser.role,
        submissionDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Submitted',
        paymentStatus: 'Paid',
        checklist: {
          allDocumentsUploaded: true,
          courtFeesPaid: true,
          partiesProvided: true,
          claimDetailsProvided: true,
          supportingDocumentsAttached: true,
          compliesWithRules: true,
        },
        briefDescription,
        parties: [
          { id: 'p1', name: 'Ama Serwaa', role: 'Plaintiff', bpNumber: '3000004128' },
          { id: 'p2', name: 'Kwame Boateng', role: 'Defendant', bpNumber: '3000005510' },
        ],
        documents: [
          { id: 'd1', name: 'Statement of Claim.pdf', type: 'Primary Document', size: '245 KB', uploadedAt: 'Today', uploadedBy: currentUser.name, verified: true },
          { id: 'd2', name: 'Contract Agreement.pdf', type: 'Exhibit', size: '1.2 MB', uploadedAt: 'Today', uploadedBy: currentUser.name, verified: true },
        ],
      };

      repository.addFiling(newFiling);
      alert(`Filing Submitted Successfully!\nIntake Reference: ${newFiling.intakeId}\nFiling Reference: ${newFiling.filingReference}\n\nThis filing is now awaiting registrar review in the Intake Queue.`);
      if (onFilingComplete) onFilingComplete();
      else onNavigate('intake_review');
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            New Electronic Filing
          </h2>
          <p className="text-xs text-slate-500">
            Step {currentStep} of 6: {steps[currentStep - 1]?.label}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('lawyer_dashboard')}
            className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save as Draft</span>
          </button>
          <button
            onClick={() => alert('Filing Guidelines: Standard High Court (Civil Procedure) Rules C.I. 47 and Specialised Commercial Court Practice Directions apply.')}
            className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100/70 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>View Filing Guidelines</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation matching Page 5 */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto relative">
          {/* Connector Line */}
          <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-200 -z-0" />
          {steps.map((s) => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;

            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className="flex flex-col items-center group relative z-10"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[11px] mt-1 font-medium transition-colors ${
                    isCurrent
                      ? 'text-blue-900 font-bold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Form Left (8 cols) + Filing Summary Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Form Content */}
        <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-5">
          {/* Section Header */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {steps[currentStep - 1]?.label}
              </h3>
              <p className="text-xs text-slate-500">
                Provide details of the case you are filing for.
              </p>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Court <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
                  >
                    <option>High Court (Accra)</option>
                    <option>High Court (Kumasi)</option>
                    <option>High Court (Takoradi)</option>
                    <option>Court of Appeal (Accra)</option>
                    <option>Supreme Court of Ghana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Division <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Civil Division</option>
                    <option>Commercial Division</option>
                    <option>Criminal Division</option>
                    <option>Land Division</option>
                    <option>Financial & Economic Crimes</option>
                    <option>Probate & Letters of Administration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Case Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Contract</option>
                    <option>Commercial Debt</option>
                    <option>Maritime & Shipping</option>
                    <option>Land Title Declaration</option>
                    <option>Tort & Negligence</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nature of Claim <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={natureOfClaim}
                    onChange={(e) => setNatureOfClaim(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Breach of Contract</option>
                    <option>Specific Performance</option>
                    <option>Recovery of Possession</option>
                    <option>Interlocutory Injunction</option>
                    <option>Damages for Conversion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Case Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="e.g. Ama Serwaa v. Kwame Boateng"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Enter the title of the case as it should appear on court records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Claim Amount (GHS)
                  </label>
                  <input
                    type="text"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    placeholder="250,000.00"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono font-medium focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Case Number (If existing)
                  </label>
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="e.g. CV/0123/2024"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Brief Description of Claim <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-600"
                  maxLength={500}
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>(Maximum 500 characters)</span>
                  <span className="font-mono">{briefDescription.length}/500</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Specify all Plaintiff, Defendant, and Legal Representation details:
              </p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Party 1 (Plaintiff)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">Claimant</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" readOnly value="Ama Serwaa" className="p-1.5 bg-white border border-slate-200 rounded" />
                    <input type="text" readOnly value="BP ID: 3000004128" className="p-1.5 bg-white border border-slate-200 rounded font-mono" />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Party 2 (Defendant)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Respondent</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" readOnly value="Kwame Boateng" className="p-1.5 bg-white border border-slate-200 rounded" />
                    <input type="text" readOnly value="BP ID: 3000005510" className="p-1.5 bg-white border border-slate-200 rounded font-mono" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep >= 3 && (
            <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 space-y-2 text-xs">
              <p className="font-semibold text-blue-900">
                Documents & Exhibits Attached:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Statement of Claim.pdf (Primary Document - 245 KB)</li>
                <li>Witness Statement - John Doe.pdf (Evidence - 512 KB)</li>
                <li>Contract Agreement.pdf (Exhibit - 1.2 MB)</li>
                <li>Damages Evidence.jpg (Evidence - 1.8 MB)</li>
                <li>Legal Authorities.docx (Supporting - 78 KB)</li>
              </ul>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              &larr; Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>{currentStep === 6 ? 'Submit & Process Case' : 'Save & Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Security Banner at Bottom */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All data is encrypted and secure in compliance with Judicial Service data protection standards.</span>
            </div>
            <span className="font-semibold text-slate-700">256-bit SSL</span>
          </div>
        </div>

        {/* Right Contextual Panel: Filing Summary & Progress matching Page 5 */}
        <div className="lg:col-span-4 space-y-4">
          {/* Filing Summary Card */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Filing Summary
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">NEW-EFL</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Filing Type</span>
                <span className="font-semibold text-slate-900">New Case Filing</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Court</span>
                <span className="font-semibold text-slate-900">{court}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Division</span>
                <span className="font-semibold text-slate-900">{division}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Case Type</span>
                <span className="font-semibold text-slate-900">{caseType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Estimated Fees</span>
                <span className="font-bold text-blue-700 font-mono">GHS 350.00</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900">
              All filings are secure, encrypted and time-stamped upon transmission.
            </div>
          </div>

          {/* Filing Progress */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-slate-200 flex items-center justify-center font-bold text-xs text-blue-900">
                {Math.round((currentStep / 6) * 100)}%
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Step {currentStep} of 6
              </p>
              <p className="text-[11px] text-slate-500">
                {steps[currentStep - 1]?.label} In Progress
              </p>
            </div>
          </div>

          {/* Need Help? Box */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 text-xs">
            <h5 className="font-bold text-slate-800">Need Help?</h5>
            <div className="space-y-1.5 text-slate-600 text-[11px]">
              <a href="#guide" className="flex items-center justify-between hover:text-blue-700 py-1">
                <span>View Filing Guidelines</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <a href="#manual" className="flex items-center justify-between hover:text-blue-700 py-1">
                <span>Download User Manual</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Contact Support</span>
                <span className="font-bold font-mono text-slate-800">0302 661 919</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

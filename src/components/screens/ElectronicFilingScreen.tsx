'use client';
import React, { useState, useMemo } from 'react';
import {
  FileText,
  Users,
  FolderOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Building2,
  CreditCard,
  Plus,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Search,
  Upload,
  Eye,
  X,
  Printer,
  ExternalLink,
  ShieldAlert,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { UserProfile, FilingItem, CaseParty, CaseDocument, FeeAssessment } from '../../types';
import { repository } from '../../data/caseRepository';
import {
  COURT_LEVELS,
  GHANA_REGIONS,
  COURT_STATIONS,
  COURT_DIVISIONS,
  CASE_CATEGORIES,
  FILING_TYPES,
  getDocumentRulesForFiling,
} from '../../services/courtConfigService';
import { validateFiling } from '../../services/filingValidationService';
import { calculateFilingFees } from '../../services/feeAssessmentEngine';
import { generateProvisionalCaseId, generateFilingReference } from '../../services/suitNumberService';

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

  // STEP 1 State: Court Information
  const [courtLevel, setCourtLevel] = useState<string>('High Court of Justice');
  const [region, setRegion] = useState<string>('Greater Accra Region');
  const [courtStation, setCourtStation] = useState<string>('Law Court Complex (High Court Buildings)');
  const [division, setDivision] = useState<string>('Commercial Division');
  const [caseCategory, setCaseCategory] = useState<string>('Commercial');
  const [caseType, setCaseType] = useState<string>('Breach of Commercial Contract');
  const [filingType, setFilingType] = useState<string>('Writ of Summons with Statement of Claim');
  const [caseTitle, setCaseTitle] = useState<string>('Ama Serwaa v. Kwame Boateng & Anor');
  const [claimAmount, setClaimAmount] = useState<string>('250,000.00');
  const [natureOfClaim, setNatureOfClaim] = useState<string>(
    'Claimant seeks recovery of contractual sums, damages for breach of supply agreement, and interest at the prevailing commercial bank rate.'
  );

  // STEP 2 State: Parties and Representation
  const [parties, setParties] = useState<CaseParty[]>([
    {
      id: 'p_init_1',
      name: 'Ama Serwaa',
      role: 'Plaintiff',
      bpNumber: '3000004128',
      contact: '+233 24 412 3456',
      email: 'ama.serwaa@ghana.com',
      representedBy: `${currentUser.name} (${currentUser.title})`,
    },
    {
      id: 'p_init_2',
      name: 'Kwame Boateng',
      role: 'Defendant',
      bpNumber: '3000005510',
      contact: '+233 20 889 0011',
      email: 'kboateng@supplier.gh',
    },
  ]);

  // Business Partner Search State
  const [bpSearchQuery, setBpSearchQuery] = useState('');
  const [isSearchingBp, setIsSearchingBp] = useState(false);
  const [bpSearchRoleTarget, setBpSearchRoleTarget] = useState<'Plaintiff' | 'Defendant'>('Plaintiff');

  // STEP 3 State: Document Upload
  const [documents, setDocuments] = useState<CaseDocument[]>([
    {
      id: 'doc_init_1',
      name: 'Writ of Summons.pdf',
      type: 'Writ of Summons',
      size: '280 KB',
      uploadedAt: 'Today, 08:30 AM',
      uploadedBy: currentUser.name,
      verified: true,
      folder: 'Originating Process',
    },
    {
      id: 'doc_init_2',
      name: 'Statement of Claim.pdf',
      type: 'Statement of Claim',
      size: '512 KB',
      uploadedAt: 'Today, 08:32 AM',
      uploadedBy: currentUser.name,
      verified: true,
      folder: 'Originating Process',
    },
    {
      id: 'doc_init_3',
      name: 'Verifying Affidavit.pdf',
      type: 'Verifying Affidavit',
      size: '340 KB',
      uploadedAt: 'Today, 08:35 AM',
      uploadedBy: currentUser.name,
      verified: true,
      folder: 'Originating Process',
    },
  ]);
  const [selectedDocTypeToAdd, setSelectedDocTypeToAdd] = useState('Exhibits & Supporting Documents');
  const [mockFileNameInput, setMockFileNameInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<CaseDocument | null>(null);

  // STEP 4 State: Review, Fee & Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isExempt, setIsExempt] = useState(false);
  const [exemptionReason, setExemptionReason] = useState('Legal Aid Board Representation');

  // STEP 5 State: Final Submission Acknowledgement
  const [submittedFiling, setSubmittedFiling] = useState<FilingItem | null>(null);

  // Filtered Court Stations based on Level & Region
  const availableStations = useMemo(() => {
    return COURT_STATIONS.filter(
      (s) => s.level === courtLevel && (s.region === region || region === '')
    );
  }, [courtLevel, region]);

  // Filtered Divisions based on Level
  const availableDivisions = useMemo(() => {
    return COURT_DIVISIONS.filter((d) => d.level === courtLevel);
  }, [courtLevel]);

  // Filtered Case Types based on selected Category
  const availableCaseTypes = useMemo(() => {
    const matchedCategory = CASE_CATEGORIES.find((c) => c.name === caseCategory);
    return matchedCategory ? matchedCategory.types : [];
  }, [caseCategory]);

  // Document Rules for Current Filing & Case Type
  const documentRules = useMemo(() => {
    return getDocumentRulesForFiling(filingType, caseType);
  }, [filingType, caseType]);

  // Automated Validation Result
  const validationResult = useMemo(() => {
    return validateFiling({
      courtLevel,
      region,
      courtStation,
      division,
      caseCategory,
      caseType,
      filingType,
      caseTitle,
      natureOfClaim,
      claimAmount,
      parties,
      documents,
      declarationAccepted,
    });
  }, [
    courtLevel,
    region,
    courtStation,
    division,
    caseCategory,
    caseType,
    filingType,
    caseTitle,
    natureOfClaim,
    claimAmount,
    parties,
    documents,
    declarationAccepted,
  ]);

  // Fee Assessment Breakdown
  const feeAssessment: FeeAssessment = useMemo(() => {
    const claimNum = parseFloat(claimAmount.replace(/,/g, '')) || 0;
    const defendants = parties.filter((p) => p.role === 'Defendant' || p.role === 'Respondent').length;
    return calculateFilingFees({
      filingRef: 'PROV-ESTIMATE',
      courtLevel,
      division,
      caseCategory,
      claimAmountNum: claimNum,
      defendantsCount: Math.max(1, defendants),
      documentsCount: documents.length,
      isExempt,
      exemptionReason,
    });
  }, [courtLevel, division, caseCategory, claimAmount, parties, documents.length, isExempt, exemptionReason]);

  // Business Partner Search Results
  const businessPartners = repository.getBusinessPartners();
  const searchResults = useMemo(() => {
    if (!bpSearchQuery.trim()) return [];
    const q = bpSearchQuery.toLowerCase();
    return businessPartners.filter(
      (bp) =>
        bp.name.toLowerCase().includes(q) ||
        bp.bpNumber.includes(q) ||
        bp.mobile.includes(q) ||
        bp.email.toLowerCase().includes(q)
    );
  }, [bpSearchQuery, businessPartners]);

  // Steps configuration
  const steps = [
    { num: 1, label: 'Court Details' },
    { num: 2, label: 'Parties' },
    { num: 3, label: 'Documents' },
    { num: 4, label: 'Review & Fees' },
    { num: 5, label: 'Acknowledgement' },
  ];

  // Party Management Handlers
  const handleAddParty = (role: 'Plaintiff' | 'Defendant') => {
    const newId = `p_${Date.now()}`;
    const newParty: CaseParty = {
      id: newId,
      name: '',
      role,
      contact: '',
      email: '',
    };
    setParties([...parties, newParty]);
  };

  const handleUpdateParty = (id: string, field: keyof CaseParty, val: string) => {
    setParties(parties.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  const handleRemoveParty = (id: string) => {
    if (parties.length <= 2) return;
    setParties(parties.filter((p) => p.id !== id));
  };

  const handleSelectBusinessPartner = (bp: (typeof businessPartners)[0]) => {
    const newParty: CaseParty = {
      id: `bp_${Date.now()}`,
      name: bp.name,
      role: bpSearchRoleTarget,
      bpNumber: bp.bpNumber,
      contact: bp.mobile,
      email: bp.email,
    };
    setParties([...parties, newParty]);
    setIsSearchingBp(false);
    setBpSearchQuery('');
  };

  // Document Upload Handlers
  const handleUploadDocument = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUploadError(null);

    const docName = mockFileNameInput.trim() || `${selectedDocTypeToAdd}.pdf`;
    const ext = docName.slice(docName.lastIndexOf('.')).toLowerCase();

    if (!['.pdf', '.docx'].includes(ext)) {
      setUploadError('Invalid format. Judicial Service accepts .pdf and .docx only.');
      return;
    }

    const newDoc: CaseDocument = {
      id: `doc_${Date.now()}`,
      name: docName,
      type: selectedDocTypeToAdd,
      size: `${(Math.random() * 2 + 0.3).toFixed(1)} MB`,
      uploadedAt: 'Just now',
      uploadedBy: currentUser.name,
      verified: true,
      folder: 'Filing Attachments',
    };

    setDocuments([...documents, newDoc]);
    setMockFileNameInput('');
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  // Submission Handler
  const handleSubmitFiling = () => {
    if (!validationResult.isValid) return;

    const provisionalId = generateProvisionalCaseId();
    const filingRef = generateFilingReference();
    const intakeId = `INT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newFiling: FilingItem = {
      id: `filing_${Date.now()}`,
      intakeId,
      filingReference: filingRef,
      provisionalCaseId: provisionalId,
      caseTitle,
      court: courtLevel,
      courtLevel,
      region,
      courtStation,
      division,
      caseCategory,
      caseType,
      filingType,
      natureOfClaim,
      claimAmount: `GHS ${claimAmount}`,
      estimatedFees: isExempt ? 'GHS 0.00 (Exempt)' : `GHS ${feeAssessment.total.toFixed(2)}`,
      submittedBy: `${currentUser.name} (${currentUser.title})`,
      submittedByRole: currentUser.role,
      submissionDate: timestamp,
      status: isExempt ? 'Submitted' : 'Awaiting Payment',
      paymentStatus: isExempt ? 'Fees Exempt' : 'Pending Payment',
      invoiceId: `inv_${Math.floor(8000000000 + Math.random() * 900000)}`,
      checklist: {
        allDocumentsUploaded: true,
        courtFeesPaid: isExempt,
        partiesProvided: true,
        claimDetailsProvided: true,
        supportingDocumentsAttached: true,
        compliesWithRules: true,
      },
      documents,
      parties,
      briefDescription: natureOfClaim,
      activities: [
        {
          id: `act_${Date.now()}`,
          timestamp,
          actor: currentUser.name,
          actorRole: currentUser.role,
          action: 'Originating Filing Submitted Online',
          notes: `Provisional Case ID: ${provisionalId}. Awaiting registry intake review and statutory payment.`,
        },
      ],
    };

    // Save to repository
    repository.addFiling(newFiling);

    // If fees apply, generate an invoice in repository
    if (!isExempt) {
      repository.addInvoice({
        id: `inv_rec_${Date.now()}`,
        invoiceRefNo: newFiling.invoiceId!,
        caseTitle: newFiling.caseTitle,
        payeeName: currentUser.name,
        payeeBpId: currentUser.badgeOrLicense || 'BP-3000004128',
        category: 'Fees',
        accountNumber: 'ECO-JSG-REVENUE-001',
        amount: feeAssessment.total,
        currency: 'GHS',
        status: 'Pending Payment',
        dateCreated: new Date().toISOString().split('T')[0],
      });
    }

    setSubmittedFiling(newFiling);
    setCurrentStep(5);
  };

  return (
    <div className="space-y-5 pb-12 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Electronic Case Filing Portal
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#14366A] text-white tracking-wider uppercase">
              BPR Streamlined
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Judicial Service of Ghana · Minimum Operational Judiciary Platform (Phase 1)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('filing_list')}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            My Filings
          </button>
          <button
            onClick={() => onNavigate('lawyer_dashboard')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto relative text-center">
          <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-slate-200 -z-0" />

          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div key={s.num} className="flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < currentStep && currentStep !== 5) {
                      setCurrentStep(s.num);
                    }
                  }}
                  disabled={currentStep === 5 || s.num > currentStep}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#14366A] text-white ring-4 ring-blue-100 font-extrabold'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </button>
                <span
                  className={`text-[11px] font-bold mt-1 ${
                    isCurrent ? 'text-slate-900 font-extrabold' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {isCompleted ? 'Completed' : isCurrent ? 'Active' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: COURT INFORMATION */}
      {currentStep === 1 && (
        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-800" />
                Step 1: Court & Case Classification
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select court level, station, division, and case classification to configure applicable filing rules.
              </p>
            </div>
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-medium">
              Indicative JSG Hierarchy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Court Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Court Level <span className="text-red-500">*</span>
              </label>
              <select
                value={courtLevel}
                onChange={(e) => {
                  setCourtLevel(e.target.value);
                  // Update default station
                  const matched = COURT_STATIONS.find((s) => s.level === e.target.value);
                  if (matched) setCourtStation(matched.name);
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {COURT_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {GHANA_REGIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Court Station */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Court Station / Registry Location <span className="text-red-500">*</span>
              </label>
              <select
                value={courtStation}
                onChange={(e) => setCourtStation(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {availableStations.length > 0 ? (
                  availableStations.map((stn) => (
                    <option key={stn.id} value={stn.name}>
                      {stn.name}
                    </option>
                  ))
                ) : (
                  <option value="Central High Court Registry">Central High Court Registry</option>
                )}
              </select>
            </div>

            {/* Division */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Court Division <span className="text-red-500">*</span>
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {availableDivisions.map((div) => (
                  <option key={div.id} value={div.name}>
                    {div.name} ({div.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Case Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Case Category <span className="text-red-500">*</span>
              </label>
              <select
                value={caseCategory}
                onChange={(e) => {
                  setCaseCategory(e.target.value);
                  const cat = CASE_CATEGORIES.find((c) => c.name === e.target.value);
                  if (cat && cat.types.length > 0) {
                    setCaseType(cat.types[0].name);
                  }
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {CASE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Case Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Case Type / Cause of Action <span className="text-red-500">*</span>
              </label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {availableCaseTypes.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filing Type */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Originating Filing Type <span className="text-red-500">*</span>
              </label>
              <select
                value={filingType}
                onChange={(e) => setFilingType(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
              >
                {FILING_TYPES.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>

            {/* Case Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Case Title / Cause Heading <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="e.g. Ama Serwaa v. Kwame Boateng & Anor"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Standard format: <code className="bg-slate-100 px-1 py-0.5 rounded">Plaintiff v. Defendant</code> or{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded">Applicant v. Respondent</code>
              </p>
            </div>

            {/* Claim Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Quantum Claimed (GHS)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">GHS</span>
                <input
                  type="text"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-xs pl-12 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Nature of Claim */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brief Particulars of Claim / Reliefs Sought <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={natureOfClaim}
                onChange={(e) => setNatureOfClaim(e.target.value)}
                placeholder="Succinct statement of facts giving rise to cause of action..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition-all"
            >
              <span>Next: Parties & Representation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: PARTIES AND REPRESENTATION */}
      {currentStep === 2 && (
        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-800" />
                Step 2: Parties & Legal Representation
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add Plaintiffs, Applicants, Defendants, Respondents and their legal counsel.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setBpSearchRoleTarget('Plaintiff');
                  setIsSearchingBp(true);
                }}
                className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Business Partner</span>
              </button>
            </div>
          </div>

          {/* Business Partner Search Modal / Drawer */}
          {isSearchingBp && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-700" />
                  <h3 className="text-xs font-bold text-blue-900">
                    Search Registered Business Partner / Organization
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchingBp(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={bpSearchQuery}
                  onChange={(e) => setBpSearchQuery(e.target.value)}
                  placeholder="Search by company name, BP ID (e.g. 3000004128), phone or email..."
                  className="flex-1 text-xs p-2.5 bg-white border border-slate-300 rounded-lg outline-hidden"
                  autoFocus
                />
                <select
                  value={bpSearchRoleTarget}
                  onChange={(e) => setBpSearchRoleTarget(e.target.value as 'Plaintiff' | 'Defendant')}
                  className="text-xs p-2.5 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Plaintiff">Add as Plaintiff / Applicant</option>
                  <option value="Defendant">Add as Defendant / Respondent</option>
                </select>
              </div>

              {searchResults.length > 0 && (
                <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {searchResults.map((bp) => (
                    <div
                      key={bp.id}
                      onClick={() => handleSelectBusinessPartner(bp)}
                      className="p-2.5 hover:bg-blue-50/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{bp.name}</p>
                        <p className="text-[11px] text-slate-500">
                          BP No: <span className="font-mono text-blue-700">{bp.bpNumber}</span> · {bp.mobile} · {bp.city}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                        Select
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Party List */}
          <div className="space-y-3">
            {parties.map((p, idx) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {p.role} #{idx + 1}
                    </span>
                    {p.bpNumber && (
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        BP: {p.bpNumber}
                      </span>
                    )}
                  </div>
                  {parties.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParty(p.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Remove Party"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Full Legal Name / Entity Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => handleUpdateParty(p.id, 'name', e.target.value)}
                      placeholder="e.g. Ama Serwaa or Apex Energy Ltd"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Party Capacity / Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={p.role}
                      onChange={(e) =>
                        handleUpdateParty(p.id, 'role', e.target.value as CaseParty['role'])
                      }
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="Plaintiff">Plaintiff</option>
                      <option value="Defendant">Defendant</option>
                      <option value="Applicant">Applicant</option>
                      <option value="Respondent">Respondent</option>
                      <option value="Third Party">Third Party</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Phone Number (Process Service)
                    </label>
                    <input
                      type="text"
                      value={p.contact || ''}
                      onChange={(e) => handleUpdateParty(p.id, 'contact', e.target.value)}
                      placeholder="+233 24 000 0000"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Email Address (Electronic Notifications)
                    </label>
                    <input
                      type="email"
                      value={p.email || ''}
                      onChange={(e) => handleUpdateParty(p.id, 'email', e.target.value)}
                      placeholder="litigant@domain.com"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Legal Representation (Counsel & GBA License)
                    </label>
                    <input
                      type="text"
                      value={p.representedBy || ''}
                      onChange={(e) => handleUpdateParty(p.id, 'representedBy', e.target.value)}
                      placeholder="e.g. Esi Amankwah (GBA12345) or Self-Represented"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleAddParty('Plaintiff')}
              className="px-3 py-1.5 border border-dashed border-blue-400 text-blue-700 bg-blue-50/50 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Plaintiff / Applicant</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddParty('Defendant')}
              className="px-3 py-1.5 border border-dashed border-slate-400 text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Defendant / Respondent</span>
            </button>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Court Details</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2"
            >
              <span>Next: Document Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: DOCUMENT UPLOAD */}
      {currentStep === 3 && (
        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-800" />
              Step 3: Document Upload & Verification
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload mandatory pleadings and supporting exhibits. All files are checked for PDF compliance and size limits.
            </p>
          </div>

          {/* Configurable Requirements Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-700" />
              <span>Mandatory & Recommended Document Checklist for {filingType}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {documentRules.map((rule) => {
                const isUploaded = documents.some((d) => d.type === rule.docType);
                return (
                  <div
                    key={rule.docType}
                    className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                      isUploaded
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : rule.isMandatory
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="mt-0.5">
                      {isUploaded ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold flex items-center gap-1">
                        <span>{rule.label}</span>
                        {rule.isMandatory && (
                          <span className="text-[10px] bg-red-100 text-red-800 px-1 py-0.2 rounded font-extrabold uppercase">
                            Mandatory
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] opacity-80 mt-0.5">{rule.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Upload Form */}
          <div className="p-4 border border-dashed border-blue-300 rounded-xl bg-blue-50/40 space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Add New Document Attachment</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Document Classification <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDocTypeToAdd}
                  onChange={(e) => setSelectedDocTypeToAdd(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                >
                  {documentRules.map((r) => (
                    <option key={r.docType} value={r.docType}>
                      {r.label}
                    </option>
                  ))}
                  <option value="Notice of Appearance">Notice of Appearance</option>
                  <option value="Affidavit of Service">Affidavit of Service</option>
                  <option value="Search Report / Site Plan">Survey Plan / Search Report</option>
                  <option value="Supplementary Pleading">Supplementary Pleading</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  File Name / PDF Title
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mockFileNameInput}
                    onChange={(e) => setMockFileNameInput(e.target.value)}
                    placeholder="e.g. Executed_Supply_Agreement_Exhibit_A.pdf"
                    className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleUploadDocument}
                    className="px-4 py-2 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{uploadError}</span>
              </p>
            )}

            <p className="text-[11px] text-slate-500">
              Supported Formats: <strong>.pdf</strong> (preferred), <strong>.docx</strong>. Maximum size: <strong>25MB per document</strong>.
            </p>
          </div>

          {/* Uploaded Documents Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Uploaded Case Documents ({documents.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Simulated secure object store abstraction
              </span>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/50 text-slate-600 border-b border-slate-100">
                <tr>
                  <th className="p-3">Document Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Uploaded by {doc.uploadedBy} · {doc.uploadedAt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {doc.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{doc.size}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[10px] flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1 text-slate-500 hover:text-blue-700 transition-colors"
                          title="Preview Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Parties</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2"
            >
              <span>Next: Review & Fee Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: REVIEW & FEE ASSESSMENT */}
      {currentStep === 4 && (
        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-800" />
              Step 4: Automated Validation & Filing Summary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review filing details, automated procedural rule checks, and statutory fee assessment before submission.
            </p>
          </div>

          {/* Validation Status Card */}
          <div
            className={`p-4 rounded-xl border ${
              validationResult.isValid
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-red-50/70 border-red-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {validationResult.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3
                  className={`text-xs font-bold ${
                    validationResult.isValid ? 'text-emerald-950' : 'text-red-950'
                  }`}
                >
                  {validationResult.isValid
                    ? 'Automated Procedural Validation Passed'
                    : 'Procedural Validation Issues Found'}
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Automated checks verify mandatory pleadings, party counts, and document thresholds. Final legal validity is adjudicated by court officers.
                </p>

                {validationResult.errors.length > 0 && (
                  <div className="mt-2.5 space-y-1">
                    <p className="text-[11px] font-bold text-red-800">Blocking Errors (Must resolve to submit):</p>
                    <ul className="list-disc pl-4 text-[11px] text-red-700 space-y-0.5">
                      {validationResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-[11px] font-bold text-amber-800">Advisory Warnings:</p>
                    <ul className="list-disc pl-4 text-[11px] text-amber-700 space-y-0.5">
                      {validationResult.warnings.map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Court & Matter Summary */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>Court & Cause Overview</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-blue-700 hover:underline text-[10px]"
                >
                  Edit
                </button>
              </h4>
              <div className="text-xs space-y-1 text-slate-700">
                <p>
                  <strong className="text-slate-900">Court:</strong> {courtLevel} · {division}
                </p>
                <p>
                  <strong className="text-slate-900">Station:</strong> {courtStation}
                </p>
                <p>
                  <strong className="text-slate-900">Case Category:</strong> {caseCategory} ({caseType})
                </p>
                <p>
                  <strong className="text-slate-900">Filing Type:</strong> {filingType}
                </p>
                <p>
                  <strong className="text-slate-900">Case Title:</strong> {caseTitle}
                </p>
                <p>
                  <strong className="text-slate-900">Claim Quantum:</strong> GHS {claimAmount}
                </p>
              </div>
            </div>

            {/* Parties Summary */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>Parties ({parties.length})</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-blue-700 hover:underline text-[10px]"
                >
                  Edit
                </button>
              </h4>
              <div className="text-xs space-y-1.5 text-slate-700">
                {parties.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{p.name}</span>
                      <span className="text-[10px] text-slate-500 ml-1">({p.role})</span>
                    </div>
                    {p.bpNumber && (
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1 py-0.2 rounded">
                        BP: {p.bpNumber}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fee Assessment Engine Itemization */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-xs font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Itemised Statutory Fee Assessment</span>
                </p>
                <p className="text-[10px] text-slate-300">
                  Calculated by JSG Rule Engine · Demonstrative tariff rates
                </p>
              </div>

              {/* Exemption Selector */}
              <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isExempt}
                  onChange={(e) => setIsExempt(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span>Apply Statutory Fee Exemption</span>
              </label>
            </div>

            {isExempt && (
              <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs flex items-center gap-2">
                <span className="font-semibold text-amber-900">Exemption Authority / Reason:</span>
                <select
                  value={exemptionReason}
                  onChange={(e) => setExemptionReason(e.target.value)}
                  className="p-1 bg-white border border-amber-300 rounded text-xs"
                >
                  <option value="Legal Aid Board Representation">Legal Aid Commission Representation</option>
                  <option value="State Proceedings (Attorney General)">State / Public Prosecutor Proceedings</option>
                  <option value="In Forma Pauperis Judicial Grant">Court Order - In Forma Pauperis Grant</option>
                </select>
              </div>
            )}

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-3">Fee Category / Tariff Description</th>
                  <th className="p-3 text-right">Amount (GHS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feeAssessment.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3">
                      <span className="font-medium text-slate-800">{item.description}</span>
                      <span className="text-[10px] text-slate-400 block">{item.category}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/80 border-t border-slate-200">
                <tr>
                  <td className="p-3 font-bold text-slate-900 text-right">Total Assessment:</td>
                  <td className="p-3 font-mono font-extrabold text-sm text-blue-900 text-right">
                    GHS {feeAssessment.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Legal Declaration */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-0.5 rounded text-blue-800"
              />
              <span className="text-xs text-slate-800 leading-relaxed">
                <strong>Certification & Undertaking:</strong> I hereby certify that the pleadings, exhibits, and details submitted herein are true, compliant with the High Court (Civil Procedure) Rules and statutory filing guidelines. I understand that submitting false or misleading judicial records constitutes contempt of court and professional misconduct.
              </span>
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: Documents</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitFiling}
              disabled={!validationResult.isValid}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-all ${
                validationResult.isValid
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Submit Originating Filing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: SUBMISSION ACKNOWLEDGEMENT RECEIPT */}
      {currentStep === 5 && submittedFiling && (
        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Filing Successfully Submitted
            </h2>
            <p className="text-xs text-slate-500">
              Your originating process has been received by the Central Registry.
            </p>
          </div>

          {/* Official Distinguishing Notice */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-center max-w-2xl mx-auto space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-amber-900 font-extrabold text-xs uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Provisional Submission Acknowledgement</span>
            </div>
            <p className="text-xs text-amber-800">
              This notice confirms intake receipt only. <strong>An official Court Suit Number is NOT yet assigned.</strong> Official Suit Numbers are issued only following registry review and payment settlement.
            </p>
          </div>

          {/* Printable Acknowledgement Slip */}
          <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/40 max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img src="/jsg-logo.svg" alt="JSG" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="text-xs font-extrabold uppercase text-slate-900">
                    Judicial Service of Ghana
                  </h3>
                  <p className="text-[10px] text-[#041B44] font-semibold">
                    Electronic Case Filing Acknowledgement
                  </p>
                  <p className="text-[10px] text-slate-500">{submittedFiling.courtStation}</p>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="text-right">
                <div className="font-mono text-[9px] tracking-widest bg-white border border-slate-200 px-2 py-1 rounded">
                  ||||||| | ||||| |||| |
                </div>
                <span className="text-[9px] font-mono text-slate-500">
                  {submittedFiling.filingReference}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500 text-[11px]">Provisional Case ID</p>
                <p className="font-mono font-bold text-blue-900 text-sm">
                  {submittedFiling.provisionalCaseId}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-[11px]">Filing Reference Number</p>
                <p className="font-mono font-bold text-slate-800 text-sm">
                  {submittedFiling.filingReference}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-[11px]">Intake Tracking ID</p>
                <p className="font-mono font-semibold text-slate-700">{submittedFiling.intakeId}</p>
              </div>

              <div>
                <p className="text-slate-500 text-[11px]">Submission Timestamp</p>
                <p className="font-semibold text-slate-800">{submittedFiling.submissionDate}</p>
              </div>

              <div className="col-span-2">
                <p className="text-slate-500 text-[11px]">Case Title</p>
                <p className="font-bold text-slate-900">{submittedFiling.caseTitle}</p>
              </div>

              <div>
                <p className="text-slate-500 text-[11px]">Assessed Statutory Fees</p>
                <p className="font-mono font-bold text-slate-800">
                  {submittedFiling.estimatedFees}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-[11px]">Current Filing Status</p>
                <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">
                  {submittedFiling.status}
                </span>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1">
              <p className="font-bold text-blue-950">Next Procedural Steps:</p>
              <ol className="list-decimal pl-4 text-blue-900 text-[11px] space-y-0.5">
                <li>
                  {submittedFiling.paymentStatus === 'Paid' || submittedFiling.paymentStatus === 'Fees Exempt'
                    ? 'Payment verified. Submission has been placed in the Filing Clerk Inbox for document verification.'
                    : 'Statutory fees must be settled via the Ecobank / Ghana.gov portal to release the filing for registration.'}
                </li>
                <li>
                  Registry review officer examines submitted documents against High Court procedure rules.
                </li>
                <li>
                  Upon official registration, you will receive notification with your assigned Suit Number.
                </li>
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Acknowledgement</span>
            </button>

            {submittedFiling.paymentStatus === 'Pending Payment' && (
              <button
                type="button"
                onClick={() => onNavigate('bills_payments')}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Pay Fees</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('filing_list')}
              className="px-5 py-2 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Track in My Filings</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('lawyer_dashboard')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </section>
      )}

      {/* Document Inline Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">{previewDoc.name}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 border border-slate-200 rounded-lg bg-slate-50 font-serif text-xs text-slate-800 space-y-4 shadow-inner min-h-[220px]">
              <div className="text-center space-y-1">
                <p className="font-bold uppercase tracking-widest text-slate-900">
                  IN THE HIGH COURT OF JUSTICE, GHANA
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {courtStation} · {division}
                </p>
                <p className="text-[10px] font-mono text-blue-900">
                  [PROVISIONAL E-FILING: {previewDoc.type}]
                </p>
              </div>

              <div className="border-t border-b border-slate-200 py-3 text-center">
                <p className="font-bold text-slate-900">{caseTitle}</p>
              </div>

              <div className="space-y-2 leading-relaxed text-[11px]">
                <p>
                  <strong>DOCUMENT TITLE:</strong> {previewDoc.name} ({previewDoc.type})
                </p>
                <p>
                  <strong>UPLOADED BY:</strong> {previewDoc.uploadedBy} on {previewDoc.uploadedAt}
                </p>
                <p>
                  <strong>VERIFICATION STATUS:</strong> Certified format (PDF), Digital checksum valid.
                </p>
                <p className="italic text-slate-600">
                  "This electronic document was generated and filed through the Judicial Service of Ghana eCMS 2.0 electronic court filing platform."
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
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

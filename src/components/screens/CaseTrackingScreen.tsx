import React from 'react';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  PlusCircle,
  Gavel,
  Check,
} from 'lucide-react';
import { UserProfile, CaseRecord } from '../../types';
import { repository } from '../../data/caseRepository';

interface CaseTrackingScreenProps {
  currentUser: UserProfile;
  caseRecord?: CaseRecord;
  onNavigate: (screen: string) => void;
  onPayFee?: () => void;
}

export const CaseTrackingScreen: React.FC<CaseTrackingScreenProps> = ({
  currentUser,
  caseRecord,
  onNavigate,
  onPayFee,
}) => {
  const currentCase =
    caseRecord ||
    repository.getCases().find((c) => c.suitNumber === 'CV/0566/2024') ||
    repository.getCases()[0];

  const stages = [
    { num: 1, label: 'Filed', date: '20 May 2024', status: 'completed' },
    { num: 2, label: 'Under Review', date: '21 May 2024', status: 'completed' },
    { num: 3, label: 'Accepted', date: '24 May 2024', status: 'completed' },
    { num: 4, label: 'Case Management', date: 'Current Stage', status: 'current' },
    { num: 5, label: 'Pre-Trial', date: 'Pending', status: 'pending' },
    { num: 6, label: 'Hearing', date: 'Pending', status: 'pending' },
    { num: 7, label: 'Judgment', date: 'Pending', status: 'pending' },
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner Row matching Page 10 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Case Tracking
          </h2>
          <p className="text-xs text-slate-500">
            Track the status and progress of your case in real-time.
          </p>
        </div>

        <button
          onClick={() => onNavigate('my_cases')}
          className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Cases</span>
        </button>
      </div>

      {/* Case Header Card matching Page 10 */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {currentCase.caseTitle}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span>
                  Case Reference: <strong className="text-slate-800 font-mono">{currentCase.filingRef || 'EFL-2024-001256'}</strong>
                </span>
                <span>·</span>
                <span>Case Type: <strong className="text-slate-800">{currentCase.caseType}</strong></span>
                <span>·</span>
                <span>Court: <strong className="text-slate-800">{currentCase.court}</strong></span>
                <span>·</span>
                <span>Division: <strong className="text-slate-800">{currentCase.division}</strong></span>
                <span>·</span>
                <span>Filed On: <strong className="text-slate-800">{currentCase.dateFiled}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Generating certified Case Summary PDF docket.')}
            className="px-3.5 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Case Summary</span>
          </button>
        </div>
      </div>

      {/* Horizontal Lifecycle Stepper matching Page 10 */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between max-w-4xl mx-auto relative text-center">
          <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-slate-200 -z-0" />

          {stages.map((st) => (
            <div key={st.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  st.status === 'completed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : st.status === 'current'
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                {st.status === 'completed' ? <Check className="w-3.5 h-3.5" /> : st.num}
              </div>
              <span
                className={`text-[11px] font-bold mt-1 ${
                  st.status === 'current'
                    ? 'text-blue-900'
                    : st.status === 'completed'
                    ? 'text-emerald-800'
                    : 'text-slate-400'
                }`}
              >
                {st.label}
              </span>
              <span className="text-[10px] text-slate-400">{st.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid: Left Progress & Hearing (8 cols) + Right Notices & Documents (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Columns */}
        <div className="lg:col-span-8 space-y-4">
          {/* Case Progress Timeline matching Page 10 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Case Progress Timeline
            </h4>

            <div className="space-y-4 pl-2 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Case Filed</p>
                    <p className="text-[11px] text-slate-500">The case was filed electronically.</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">20 May 2024, 08:45 AM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Under Review</p>
                    <p className="text-[11px] text-slate-500">Registrar is reviewing the filing and documents.</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">21 May 2024, 10:30 AM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Accepted for Filing</p>
                    <p className="text-[11px] text-slate-500">The filing has been accepted and case created.</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">24 May 2024, 02:15 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="font-bold text-blue-900">Case Management Conference</p>
                    <p className="text-[11px] text-blue-600 font-medium">Case assigned to Justice K. A. Mensah.</p>
                  </div>
                  <span className="text-[10px] text-blue-700 font-mono">30 May 2024, 09:00 AM</span>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-50">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  5
                </div>
                <div className="flex-1 flex justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Pre-Trial Review</p>
                  </div>
                  <span className="text-[10px] text-slate-400">Pending</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                onClick={() => alert('Displaying full audit trail of 18 automated workflow events.')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                View Full History &rarr;
              </button>
            </div>
          </div>

          {/* Upcoming Hearing Box matching Page 10 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Upcoming Hearing
            </h4>

            <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">
                  Case Management Conference
                </span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  In-Person
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600 text-[11px]">
                <div>
                  <span className="text-slate-400">Date:</span> <strong className="text-slate-800">30 May 2024</strong>
                </div>
                <div>
                  <span className="text-slate-400">Time:</span> <strong className="text-slate-800">09:00 AM</strong>
                </div>
                <div>
                  <span className="text-slate-400">Court Room:</span> <strong className="text-slate-800">Court 2, High Court (Accra)</strong>
                </div>
                <div>
                  <span className="text-slate-400">Before:</span> <strong className="text-slate-800">Justice K. A. Mensah</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert('Added to calendar.')}
                  className="px-3 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  + Add to Calendar
                </button>
              </div>
            </div>
          </div>

          {/* Case Details Box */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Case Details
              </h4>
              <button
                onClick={() => onNavigate('my_cases')}
                className="text-[11px] text-blue-600 font-medium"
              >
                View Case Summary &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Nature of Claim</span>
                <p className="font-semibold text-slate-900 mt-0.5">{currentCase.natureOfClaim}</p>
              </div>
              <div>
                <span className="text-slate-500">Claim Amount</span>
                <p className="font-bold font-mono text-slate-900 mt-0.5">{currentCase.claimAmount}</p>
              </div>
              <div>
                <span className="text-slate-500">Parties</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  Ama Serwaa (Claimant) vs. Kwame Boateng (Defendant)
                </p>
              </div>
              <div>
                <span className="text-slate-500">Assigned Judge</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {currentCase.assignedJudgeName || 'Justice K. A. Mensah'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Notices & Documents matching Page 10 */}
        <div className="lg:col-span-4 space-y-4">
          {/* Notices & Actions Required matching Page 10 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span>Notices & Actions Required</span>
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
              </h4>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Notice 1 */}
              <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-rose-950">File Witness Statement</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      You are required to file and serve your witness statement.
                    </p>
                    <p className="text-[10px] text-rose-700 font-semibold mt-1">Due Date: 27 May 2024</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Opening E-Filing process for Witness Statement.')}
                  className="w-full py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded shadow-2xs transition-colors"
                >
                  Take Action
                </button>
              </div>

              {/* Notice 2 */}
              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-950">Pay Court Fees</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      Balance payment of GHS 150.00 is due.
                    </p>
                    <p className="text-[10px] text-amber-800 font-semibold mt-1">Due Date: 28 May 2024</p>
                  </div>
                </div>
                <button
                  onClick={onPayFee || (() => onNavigate('bills_payments'))}
                  className="w-full py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold rounded shadow-2xs transition-colors"
                >
                  Make Payment
                </button>
              </div>

              {/* Notice 3 */}
              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 space-y-1.5">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-950">Case Management Conference</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Reminder for the scheduled court conference.
                    </p>
                    <p className="text-[10px] text-blue-800 font-medium">Date: 30 May 2024, 09:00 AM</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('hearings_calendar')}
                  className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded shadow-2xs transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>

            <div className="pt-1 text-center">
              <button
                onClick={() => onNavigate('notifications')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                View All Notices &rarr;
              </button>
            </div>
          </div>

          {/* Documents & Filings matching Page 10 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Documents & Filings
              </h4>
              <button
                onClick={() => onNavigate('documents')}
                className="text-[11px] text-blue-600 font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-900">Statement of Claim.pdf</p>
                  <p className="text-[10px] text-slate-400">Filed on 20 May 2024</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Filed
                </span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-900">Defence.pdf</p>
                  <p className="text-[10px] text-slate-400">Filed on 26 May 2024</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Filed
                </span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-900">Witness Statement - Ama Serwaa.pdf</p>
                  <p className="text-[10px] text-amber-600">Due on 27 May 2024</p>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  Pending
                </span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-900">Court's Directions.pdf</p>
                  <p className="text-[10px] text-slate-400">Issued on 24 May 2024</p>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  Issued
                </span>
              </div>
            </div>

            <div className="pt-2 text-center border-t border-slate-100">
              <button
                onClick={() => onNavigate('documents')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                View All Documents &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Timestamp Footer matching Page 10 */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure. Reliable. Transparent. All case information is secure and updated in real-time.</span>
        </div>
        <span className="font-mono">Last updated: 24 May 2024, 02:20 PM</span>
      </div>
    </div>
  );
};

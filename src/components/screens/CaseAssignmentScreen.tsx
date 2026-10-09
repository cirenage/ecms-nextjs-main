import React, { useState } from 'react';
import {
  Gavel,
  CheckCircle2,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Building2,
  TrendingDown,
  Clock,
  Filter,
} from 'lucide-react';
import { UserProfile, CaseRecord } from '../../types';
import { repository } from '../../data/caseRepository';

interface CaseAssignmentScreenProps {
  currentUser: UserProfile;
  caseRecord?: CaseRecord;
  onNavigate: (screen: string) => void;
  onAssignmentComplete?: (assignedJudge: string) => void;
}

export const CaseAssignmentScreen: React.FC<CaseAssignmentScreenProps> = ({
  currentUser,
  caseRecord,
  onNavigate,
  onAssignmentComplete,
}) => {
  const currentCase =
    caseRecord ||
    repository.getCases().find((c) => c.suitNumber === 'CV/0566/2024') ||
    repository.getCases()[0];

  const [selectedJudge, setSelectedJudge] = useState<string>('Justice K. A. Mensah');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  const availableJudges = [
    {
      id: 'j1',
      name: 'Justice K. A. Mensah',
      court: 'High Court Judge',
      division: 'Civil Division',
      currentLoad: 12,
      capacityPct: 40,
      availability: 'Available',
      expertise: 'Contract Law',
      lastAssigned: '20 May 2024',
      isBestMatch: true,
    },
    {
      id: 'j2',
      name: 'Justice E. K. Addo',
      court: 'High Court Judge',
      division: 'Civil Division',
      currentLoad: 15,
      capacityPct: 50,
      availability: 'Available',
      expertise: 'Contract Law',
      lastAssigned: '19 May 2024',
    },
    {
      id: 'j3',
      name: 'Justice P. O. Bannerman',
      court: 'High Court Judge',
      division: 'Civil Division',
      currentLoad: 18,
      capacityPct: 60,
      availability: 'Available',
      expertise: 'Civil Litigation',
      lastAssigned: '20 May 2024',
    },
    {
      id: 'j4',
      name: 'Justice F. N. Tawiah',
      court: 'High Court Judge',
      division: 'Civil Division',
      currentLoad: 22,
      capacityPct: 73,
      availability: 'Available',
      expertise: 'Commercial Law',
      lastAssigned: '18 May 2024',
    },
    {
      id: 'j5',
      name: 'Justice A. Bentil',
      court: 'High Court Judge',
      division: 'Civil Division',
      currentLoad: 28,
      capacityPct: 93,
      availability: 'Busy',
      expertise: 'Civil Litigation',
      lastAssigned: '17 May 2024',
    },
  ];

  const handleConfirmAssignment = () => {
    const judge = availableJudges.find(j => j.name === selectedJudge);
    repository.assignJudge(currentCase.id, judge?.id || selectedJudge, selectedJudge);
    alert(
      `Case Successfully Assigned!\nCase: ${currentCase.caseTitle}\nSuit Number: ${currentCase.suitNumber}\nAssigned Judge: ${selectedJudge}\n\nDemo assignment saved locally.`
    );
    if (onAssignmentComplete) {
      onAssignmentComplete(selectedJudge);
    } else {
      onNavigate('hearing_scheduling');
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner Row matching Page 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Assign Case
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
              {currentCase.intakeRef || 'INT-2024-00587'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {currentCase.caseTitle}
          </p>
        </div>

        <button
          onClick={() => onNavigate('intake_review')}
          className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Filing</span>
        </button>
      </div>

      {/* Stepper matching Page 8 */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto relative text-center">
          <div className="absolute left-8 right-8 top-3.5 h-0.5 bg-slate-200 -z-0" />

          <div className="flex flex-col items-center relative z-10">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <span className="text-[11px] font-bold text-slate-900 mt-1">Case Details</span>
            <span className="text-[10px] text-slate-400">Completed</span>
          </div>

          <div className="flex flex-col items-center relative z-10">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-blue-100">
              2
            </div>
            <span className="text-[11px] font-bold text-blue-900 mt-1">Select Judge</span>
            <span className="text-[10px] text-blue-600 font-medium">Current Step</span>
          </div>

          <div className="flex flex-col items-center relative z-10 opacity-50">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-[11px] font-medium text-slate-600 mt-1">Assignment Details</span>
            <span className="text-[10px] text-slate-400">Pending</span>
          </div>

          <div className="flex flex-col items-center relative z-10 opacity-50">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span className="text-[11px] font-medium text-slate-600 mt-1">Review</span>
            <span className="text-[10px] text-slate-400">Pending</span>
          </div>

          <div className="flex flex-col items-center relative z-10 opacity-50">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">
              5
            </div>
            <span className="text-[11px] font-medium text-slate-600 mt-1">Assignment Complete</span>
            <span className="text-[10px] text-slate-400">Pending</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Selection (8 cols) + Right Summary & Workload (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Case Info + Suggested Judges + All Available Judges */}
        <div className="lg:col-span-8 space-y-4">
          {/* Case Information Box matching Page 8 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Case Information
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-slate-500">Case Title</p>
                <p className="font-bold text-slate-900 truncate mt-0.5">{currentCase.caseTitle}</p>
              </div>
              <div>
                <p className="text-slate-500">Filing Reference</p>
                <p className="font-bold font-mono text-blue-700 mt-0.5">{currentCase.filingRef || 'EFL-2024-001256'}</p>
              </div>
              <div>
                <p className="text-slate-500">Court</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentCase.court}</p>
              </div>
              <div>
                <p className="text-slate-500">Date Filed</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentCase.dateFiled}</p>
              </div>
              <div>
                <p className="text-slate-500">Division</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentCase.division}</p>
              </div>
              <div>
                <p className="text-slate-500">Nature of Claim</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentCase.natureOfClaim}</p>
              </div>
              <div>
                <p className="text-slate-500">Case Type</p>
                <p className="font-medium text-slate-800 mt-0.5">{currentCase.caseType}</p>
              </div>
              <div>
                <p className="text-slate-500">Claim Amount</p>
                <p className="font-bold font-mono text-slate-900 mt-0.5">{currentCase.claimAmount}</p>
              </div>
            </div>
          </div>

          {/* Suggested Judges matching Page 8 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Suggested Judges
                </h4>
                <p className="text-[10px] text-slate-500">
                  Based on case type, workload and expertise
                </p>
              </div>
              <span className="text-[11px] text-blue-600 font-medium">View all</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availableJudges.slice(0, 3).map((judge) => {
                const isSelected = selectedJudge === judge.name;
                return (
                  <div
                    key={judge.id}
                    onClick={() => setSelectedJudge(judge.name)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-200 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-serif font-bold text-xs">
                        {judge.name.split(' ')[1]?.[0] || 'J'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {judge.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {judge.court}
                        </p>
                      </div>
                    </div>

                    {judge.isBestMatch && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 mb-1">
                        Best Match
                      </span>
                    )}

                    <div className="text-[11px] space-y-0.5 text-slate-600 pt-1">
                      <div className="flex justify-between">
                        <span>Current Load</span>
                        <strong className="text-slate-800">{judge.currentLoad} cases</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Availability</span>
                        <span className="text-emerald-700 font-semibold">● {judge.availability}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJudge(judge.name);
                      }}
                      className={`w-full mt-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Selected ✓' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Available Judges Table matching Page 8 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                All Available Judges
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <button className="flex items-center gap-1 text-slate-600 border border-slate-200 px-2 py-1 rounded bg-slate-50">
                  <Filter className="w-3 h-3" />
                  <span>Filter</span>
                </button>
                <select className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-600 font-medium">
                  <option>All Divisions</option>
                  <option>Civil Division</option>
                  <option>Commercial Division</option>
                </select>
                <select className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-600 font-medium">
                  <option>Sort by: Workload (Low to High)</option>
                  <option>Sort by: Seniority</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                    <th className="py-2 px-3">Judge</th>
                    <th className="py-2 px-2">Division</th>
                    <th className="py-2 px-2">Current Load</th>
                    <th className="py-2 px-2">Availability</th>
                    <th className="py-2 px-2">Expertise</th>
                    <th className="py-2 px-2">Last Assigned</th>
                    <th className="py-2 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {availableJudges.map((j) => {
                    const isSelected = selectedJudge === j.name;
                    return (
                      <tr
                        key={j.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <td className="py-2 px-3 font-semibold text-slate-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-700 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                            {j.name.split(' ')[1]?.[0] || 'J'}
                          </div>
                          <span>{j.name}</span>
                        </td>
                        <td className="py-2 px-2 text-slate-600 text-[11px]">{j.division}</td>
                        <td className="py-2 px-2 font-mono">
                          <div className="flex items-center gap-2">
                            <span>{j.currentLoad} cases</span>
                            <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  j.capacityPct > 80 ? 'bg-rose-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${j.capacityPct}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400">{j.capacityPct}%</span>
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              j.availability === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            ● {j.availability}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-[11px] text-slate-600">{j.expertise}</td>
                        <td className="py-2 px-2 text-[11px] text-slate-500">{j.lastAssigned}</td>
                        <td className="py-2 px-2 text-right">
                          <button
                            onClick={() => setSelectedJudge(j.name)}
                            disabled={j.availability !== 'Available'}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : j.availability === 'Available'
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {isSelected ? 'Assigned' : 'Assign'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Assignment Summary + Workload Overview + Action Buttons */}
        <div className="lg:col-span-4 space-y-4">
          {/* Assignment Summary Box matching Page 8 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Assignment Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Case Title</span>
                <span className="font-bold text-slate-900 truncate max-w-[170px] text-right">
                  {currentCase.caseTitle}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Filing Reference</span>
                <span className="font-bold text-blue-700 font-mono">
                  {currentCase.filingRef || 'EFL-2024-001256'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Selected Judge</span>
                <span className="font-bold text-slate-900">{selectedJudge}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Court</span>
                <span className="font-medium text-slate-800">{currentCase.court}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Division</span>
                <span className="font-medium text-slate-800">{currentCase.division}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Priority</span>
                <span className="font-semibold text-emerald-700">Normal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Estimated Duration</span>
                <span className="font-medium text-slate-800">3-5 Days</span>
              </div>
            </div>
          </div>

          {/* Workload Overview (Donut Breakdown) matching Page 8 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Workload Overview
            </h4>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-4 border-emerald-500 border-r-amber-500 border-b-blue-600 flex items-center justify-center font-bold text-sm text-slate-900">
                  12
                </div>
              </div>
              <div className="text-[11px] space-y-1 text-slate-600 flex-1">
                <div className="flex justify-between">
                  <span>● 0 - 10 cases</span>
                  <strong>3 Judges</strong>
                </div>
                <div className="flex justify-between">
                  <span>● 11 - 20 cases</span>
                  <strong>4 Judges</strong>
                </div>
                <div className="flex justify-between">
                  <span>● 21 - 30 cases</span>
                  <strong>2 Judges</strong>
                </div>
                <div className="flex justify-between">
                  <span>● 31+ cases</span>
                  <strong>0 Judges</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Notes (Optional) */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={assignmentNotes}
              onChange={(e) => setAssignmentNotes(e.target.value)}
              placeholder="Add any notes or instructions for the assigned Judge..."
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-600"
              maxLength={500}
            />
            <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[10px] text-slate-500">
              <strong className="text-slate-700">Secure Assignment:</strong> Case assignments are logged and tracked for accountability.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleConfirmAssignment}
              className="w-full py-2.5 px-4 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Confirm Assignment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('registry_dashboard')}
              className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

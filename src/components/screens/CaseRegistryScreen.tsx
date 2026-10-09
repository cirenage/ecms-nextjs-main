import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Plus,
  Building2,
  ChevronRight,
  Gavel,
} from 'lucide-react';
import { UserProfile, CaseRecord } from '../../types';

interface CaseRegistryScreenProps {
  currentUser: UserProfile;
  cases: CaseRecord[];
  onSelectCase: (caseItem: CaseRecord) => void;
  onNavigate: (screen: string) => void;
}

export const CaseRegistryScreen: React.FC<CaseRegistryScreenProps> = ({
  currentUser,
  cases,
  onSelectCase,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCase, setSelectedCase] = useState<CaseRecord>(cases[0]);
  const [activeTab, setActiveTab] = useState<'edocket' | 'parties' | 'activities' | 'notes'>('edocket');

  const filtered = cases.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.caseTitle.toLowerCase().includes(q) ||
        c.suitNumber.toLowerCase().includes(q) ||
        c.division.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Case Records & Electronic Docket Registry
          </h2>
          <p className="text-xs text-slate-500">
            Specialised Courts Case Directory · e-Docket Maintenance, Electronic Filings & Parties
          </p>
        </div>

        <button
          onClick={() => onNavigate('filing_new')}
          className="px-3.5 py-1.5 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Case Filing</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by suit number, party name, or subject..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Category:</span>
          {['All', 'Commercial', 'Criminal', 'Civil'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Left Case List (5 cols) + Right Detail & E-Docket (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Case List */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
            Cases ({filtered.length})
          </h4>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-blue-700 text-[11px]">
                        {c.suitNumber}
                      </span>
                      <h5 className="font-bold text-slate-900 mt-0.5">{c.caseTitle}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {c.courtRoom.split(',')[0]} · {c.category}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status === 'In Session'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'Hearing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Filed: {c.dateFiled}</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                      Open Docket <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Case Details & E-Docket View */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCase ? (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
              {/* Header Box */}
              <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                      {selectedCase.suitNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedCase.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedCase.caseTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedCase.court} · {selectedCase.division}
                  </p>
                </div>

                <button
                  onClick={() => onSelectCase(selectedCase)}
                  className="px-3 py-1.5 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 self-start"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Interactive Case Tracker</span>
                </button>
              </div>

              {/* General Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px]">Assigned Judge</span>
                  <p className="font-bold text-slate-900 mt-0.5 truncate">
                    {selectedCase.assignedJudgeName || 'Pending Assignment'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Claim Amount</span>
                  <p className="font-bold font-mono text-slate-900 mt-0.5">{selectedCase.claimAmount}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Mandatory Process</span>
                  <p className="font-bold text-blue-700 mt-0.5">{selectedCase.mandatoryProcess}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Next Sitting</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {selectedCase.nextHearingDate ? `${selectedCase.nextHearingDate} (${selectedCase.nextHearingTime})` : 'To be set'}
                  </p>
                </div>
              </div>

              {/* Sub-Tabs matching eJustice Manual: E-Docket, Parties Involved, Activities */}
              <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
                <button
                  onClick={() => setActiveTab('edocket')}
                  className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
                    activeTab === 'edocket'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Electronic Docket ({selectedCase.documents.length})
                </button>
                <button
                  onClick={() => setActiveTab('parties')}
                  className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
                    activeTab === 'parties'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Parties Involved ({selectedCase.parties.length})
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-2 px-3 font-semibold border-b-2 transition-colors ${
                    activeTab === 'notes'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Court Notes & Orders
                </button>
              </div>

              {/* Tab Content: E-Docket Table matching manual page 91-93 */}
              {activeTab === 'edocket' && (
                <div className="space-y-2 text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                          <th className="py-2 px-2">Document Name</th>
                          <th className="py-2 px-2">Type</th>
                          <th className="py-2 px-2">Size</th>
                          <th className="py-2 px-2">Uploaded</th>
                          <th className="py-2 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedCase.documents.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-2 font-medium text-slate-900 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="truncate max-w-[200px]">{doc.name}</span>
                            </td>
                            <td className="py-2.5 px-2 text-slate-600 text-[11px]">{doc.type}</td>
                            <td className="py-2.5 px-2 text-slate-500 font-mono text-[11px]">{doc.size}</td>
                            <td className="py-2.5 px-2 text-slate-500 text-[11px]">{doc.uploadedAt}</td>
                            <td className="py-2.5 px-2 text-right">
                              <button
                                onClick={() => alert(`Opening electronic document viewer: ${doc.name}`)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-[11px] font-semibold"
                              >
                                View / Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab Content: Parties matching manual page 28 */}
              {activeTab === 'parties' && (
                <div className="space-y-2 text-xs">
                  <div className="divide-y divide-slate-100">
                    {selectedCase.parties.map((p) => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                            {p.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{p.name}</p>
                            <p className="text-[11px] text-slate-500">
                              Relationship: <strong className="text-slate-700">{p.role}</strong>
                              {p.bpNumber && ` · BP ID: ${p.bpNumber}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Verified Party
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: Notes */}
              {activeTab === 'notes' && (
                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2">
                  <p className="font-semibold text-slate-800">Judicial Notes:</p>
                  <p className="text-slate-600 leading-relaxed">
                    Directions issued regarding discovery timetable and witness bundles. Mandatory appearance scheduled for Court Management Conference.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-xl border text-center text-slate-400 text-xs">
              Select a case on the left to inspect records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  FileText,
  Scale,
  Bell,
  ChevronRight,
  MoreVertical,
  Upload,
  CreditCard,
  Search,
  BookOpen,
  Eye,
  FileCheck,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, CaseRecord, HearingItem } from '../../types';
import { GhanaScalesCard } from '../layout/GhanaScalesCard';

interface LawyerDashboardProps {
  currentUser: UserProfile;
  cases: CaseRecord[];
  hearings: HearingItem[];
  onNavigate: (screen: string) => void;
  onSelectCase: (caseItem: CaseRecord) => void;
  onStartFiling: () => void;
}

export const LawyerDashboard: React.FC<LawyerDashboardProps> = ({
  currentUser,
  cases,
  hearings,
  onNavigate,
  onSelectCase,
  onStartFiling,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'closed'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredCases = cases.filter((c) => {
    if (searchFilter) {
      const match =
        c.caseTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.suitNumber.toLowerCase().includes(searchFilter.toLowerCase());
      if (!match) return false;
    }
    if (activeTab === 'active') return c.status === 'In Session' || c.status === 'Case Management' || c.status === 'Hearing';
    if (activeTab === 'pending') return c.status === 'Under Review' || c.status === 'Case Registered' || c.status === 'Pre-Trial';
    if (activeTab === 'closed') return c.status === 'Closed';
    return true;
  });

  return (
    <div className="space-y-5 pb-8">
      {/* Header / Greeting matching Page 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {currentUser.name.split(' ')[0]}! <span className="text-lg">⚖️</span>
          </h2>
          <p className="text-xs text-slate-500">
            Here's an overview of your cases and activities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onStartFiling}
            className="px-3.5 py-1.5 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Electronic Filing</span>
          </button>
          <button
            onClick={() => onNavigate('case_tracking')}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Case</span>
          </button>
        </div>
      </div>

      {/* 5 Top Stat Cards matching Page 4 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Card 1: My Active Cases */}
        <div
          onClick={() => onNavigate('my_cases')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">My Active Cases</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">24</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <span>View all cases</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Pending Hearings */}
        <div
          onClick={() => onNavigate('hearings_calendar')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Pending Hearings</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">8</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>View calendar</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Pending Filings */}
        <div
          onClick={() => onNavigate('filing_list')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Pending Filings</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">5</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <span>Continue filing</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Orders Received */}
        <div
          onClick={() => onNavigate('orders_judgments')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Orders Received</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">12</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-purple-600 font-semibold flex items-center gap-1">
            <span>View orders</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 5: Unread Notifications */}
        <div
          onClick={() => onNavigate('notifications')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Unread Notifications</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">7</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Middle Section: My Cases Table (Left 7-8 cols) + Upcoming Hearings (Right 4-5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: My Cases Table matching Page 4 */}
        <div className="lg:col-span-8 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  My Cases
                </h4>
                {/* Tabs: All | Active | Pending | Closed */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                  {(['all', 'active', 'pending', 'closed'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-0.5 rounded-md font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('my_cases')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                View all cases &rarr;
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                    <th className="py-2.5 px-3">Case Title & Number</th>
                    <th className="py-2.5 px-2">Court</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2">Next Hearing</th>
                    <th className="py-2.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCases.slice(0, 5).map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCase(c)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900 hover:text-blue-700">
                          {c.caseTitle}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {c.suitNumber} · {c.caseType}
                        </p>
                      </td>
                      <td className="py-2.5 px-2 text-[11px] text-slate-600">
                        {c.courtRoom.split(',')[0]}
                        <span className="block text-[10px] text-slate-400">Accra</span>
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                            c.status === 'In Session'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'Case Management'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-[11px]">
                        <p className="font-medium text-slate-800">
                          {c.nextHearingDate || '20 May 2024'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {c.nextHearingTime || '09:00 AM'}
                        </p>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCase(c);
                          }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Footer matching Page 4 */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500 mt-2">
            <span>Showing 1 to 5 of 24 cases</span>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 rounded bg-[#14366A] text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-700">
                2
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-700">
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-700">
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right: Upcoming Hearings Stack matching Page 4 */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Upcoming Hearings
              </h4>
              <button
                onClick={() => onNavigate('hearings_calendar')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                View calendar &rarr;
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {/* Hearing 1 */}
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-900 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-blue-200">
                  <span className="text-sm leading-none">20</span>
                  <span className="text-[9px] uppercase font-semibold">MAY</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    State v. Richard Appiah
                  </p>
                  <p className="text-[11px] text-slate-500">
                    CR/0301/2024 · Galamsey
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                    09:00 AM · Court 2
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                  In Session
                </span>
              </div>

              {/* Hearing 2 */}
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                  <span className="text-sm leading-none">21</span>
                  <span className="text-[9px] uppercase font-semibold">MAY</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    The Republic v. Kofi Agyei
                  </p>
                  <p className="text-[11px] text-slate-500">
                    CR/0187/2024 · Corruption
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                    10:30 AM · Court 1
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                  Scheduled
                </span>
              </div>

              {/* Hearing 3 */}
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                  <span className="text-sm leading-none">27</span>
                  <span className="text-[9px] uppercase font-semibold">MAY</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    State v. Benjamin Asare
                  </p>
                  <p className="text-[11px] text-slate-500">
                    CR/0412/2024 · Cybercrime
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                    11:00 AM · Court 3
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                  Scheduled
                </span>
              </div>

              {/* Hearing 4 */}
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                  <span className="text-sm leading-none">03</span>
                  <span className="text-[9px] uppercase font-semibold">JUN</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Ama Serwaa v. Kwame Boateng
                  </p>
                  <p className="text-[11px] text-slate-500">
                    CV/0566/2024 · Contract
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                    09:30 AM · Court 4
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                  Scheduled
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-center border-t border-slate-100">
            <button
              onClick={() => onNavigate('hearings_calendar')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              View all hearings &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activities + My Tasks + Quick Actions + Quote Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Activities (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Recent Activities
            </h4>
            <button
              onClick={() => onNavigate('my_cases')}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
            >
              View all
            </button>
          </div>

          <div className="space-y-3 mt-3">
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">
                  Filing submitted in State v. Richard Appiah
                </p>
                <p className="text-[11px] text-slate-500">CR/0301/2024</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">Today, 08:45 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">
                  Document uploaded in The Republic v. Kofi Agyei
                </p>
                <p className="text-[11px] text-slate-500">CR/0187/2024</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">Today, 08:25 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">
                  Hearing scheduled in State v. Benjamin Asare
                </p>
                <p className="text-[11px] text-slate-500">CR/0412/2024</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">Yesterday, 04:10 PM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">
                  Order issued in The Republic v. Mensah & 2 Others
                </p>
                <p className="text-[11px] text-slate-500">CR/0098/2024</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">Yesterday, 02:25 PM</span>
            </div>
          </div>
        </div>

        {/* My Tasks (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              My Tasks
            </h4>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
            >
              View all tasks &rarr;
            </button>
          </div>

          <div className="space-y-2 mt-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Complete affidavit for filing</p>
                <p className="text-[10px] text-slate-500">State v. Richard Appiah</p>
              </div>
              <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                2
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Prepare submissions</p>
                <p className="text-[10px] text-slate-500">The Republic v. Kofi Agyei</p>
              </div>
              <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                3
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Review case documents</p>
                <p className="text-[10px] text-slate-500">State v. Benjamin Asare</p>
              </div>
              <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                2
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Respond to court order</p>
                <p className="text-[10px] text-slate-500">The Republic v. Mensah & 2 Others</p>
              </div>
              <span className="font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                1
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions (5 cols) matching Page 4 */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 pb-2 border-b border-slate-100">
              Quick Actions
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={onStartFiling}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900">New Filing</p>
                <p className="text-[10px] text-slate-500">Start a new filing</p>
              </button>

              <button
                onClick={() => onNavigate('case_tracking')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900">Track Case</p>
                <p className="text-[10px] text-slate-500">Track case status</p>
              </button>

              <button
                onClick={() => onNavigate('subsequent_filings')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded bg-purple-100 text-purple-700 flex items-center justify-center mb-1 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900">Subsequent Filing</p>
                <p className="text-[10px] text-slate-500">File into active case</p>
              </button>

              <button
                onClick={() => onNavigate('bills_payments')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded bg-amber-100 text-amber-700 flex items-center justify-center mb-1 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <CreditCard className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900">Make Payment</p>
                <p className="text-[10px] text-slate-500">Pay court fees</p>
              </button>

              <button
                onClick={() => onNavigate('orders_judgments')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Scale className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900">Request Order</p>
                <p className="text-[10px] text-slate-500">Apply for an order</p>
              </button>

              <button
                onClick={() => onNavigate('law_library')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center mb-1 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900">Legal Library</p>
                <p className="text-[10px] text-slate-500">Access resources</p>
              </button>
            </div>
          </div>

          <GhanaScalesCard variant="lawyer" />
        </div>
      </div>
    </div>
  );
};

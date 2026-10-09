import React from 'react';
import {
  FileText,
  Clock,
  Briefcase,
  Calendar,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { UserProfile, CaseRecord, FilingItem, HearingItem } from '../../types';
import { FILINGS_CHART_DATA } from '../../data/mockData';
import { GhanaScalesCard } from '../layout/GhanaScalesCard';

interface RegistryDashboardProps {
  currentUser: UserProfile;
  cases: CaseRecord[];
  filings: FilingItem[];
  hearings: HearingItem[];
  onNavigate: (screen: string) => void;
  onSelectCase?: (caseItem: CaseRecord) => void;
  onSelectFiling?: (filing: FilingItem) => void;
}

export const RegistryDashboard: React.FC<RegistryDashboardProps> = ({
  currentUser,
  cases,
  filings,
  hearings,
  onNavigate,
  onSelectCase,
  onSelectFiling,
}) => {
  const pendingFilingsCount = filings.filter((f) => f.status === 'Submitted' || f.status === 'Under Review').length || 18;
  const incompleteFilingsCount = filings.filter((f) => f.status === 'Clarification').length || 7;
  const casesAwaitingAssignment = cases.filter((c) => !c.assignedJudgeId || c.status === 'Case Registered').length || 5;
  const todaysHearingsCount = 14;

  return (
    <div className="space-y-5 pb-8">
      {/* Welcome Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {currentUser.name.split(' ')[0]}! <span className="text-lg">👋</span>
          </h2>
          <p className="text-xs text-slate-500">
            Here's what's happening in the system today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('intake_review')}
            className="px-3 py-1.5 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Process Intake Queue ({pendingFilingsCount})</span>
          </button>
          <button
            onClick={() => onNavigate('case_assignment')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Assign Cases</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Row matching Page 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New Filings */}
        <div
          onClick={() => onNavigate('intake_review')}
          className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">New Filings</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">32</h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ 18% from yesterday</span>
          </div>
        </div>

        {/* Card 2: Pending Review */}
        <div
          onClick={() => onNavigate('intake_review')}
          className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Pending Review</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {pendingFilingsCount}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Requires your attention</span>
          </div>
        </div>

        {/* Card 3: Assigned Cases */}
        <div
          onClick={() => onNavigate('my_cases')}
          className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Assigned Cases</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">56</h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-medium">
            Across all courts
          </div>
        </div>

        {/* Card 4: Today's Hearings */}
        <div
          onClick={() => onNavigate('hearings_calendar')}
          className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Today's Hearings</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {todaysHearingsCount}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1">
            <span>View calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Middle Section: My Tasks + Filings Overview Chart + Dark Navy Scales Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: My Tasks (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  My Tasks
                </h4>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                View all tasks
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              <button
                onClick={() => onNavigate('intake_review')}
                className="w-full py-2.5 flex items-center justify-between text-left hover:bg-slate-50 px-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-700">Filings Awaiting Review</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 tabular-nums">18</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('intake_review')}
                className="w-full py-2.5 flex items-center justify-between text-left hover:bg-slate-50 px-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-slate-700">Incomplete Filings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 tabular-nums">7</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('case_assignment')}
                className="w-full py-2.5 flex items-center justify-between text-left hover:bg-slate-50 px-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-slate-700">Cases Awaiting Assignment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 tabular-nums">5</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('hearings_calendar')}
                className="w-full py-2.5 flex items-center justify-between text-left hover:bg-slate-50 px-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-slate-700">Hearings Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 tabular-nums">14</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Specialised Courts Division</span>
            <span className="font-semibold text-slate-700">Accra Complex</span>
          </div>
        </div>

        {/* Middle: Filings Overview Line Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Filings Overview
              </h4>
              <select className="text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-slate-600 font-medium">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>

            {/* Chart Area matching Page 2 */}
            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FILINGS_CHART_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '11px',
                      border: 'none',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="filings"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#2563eb' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics summary row matching Page 2 */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
            <div>
              <p className="text-[10px] text-slate-500">Total Filings</p>
              <p className="text-xs font-bold text-slate-900 tabular-nums">275</p>
              <span className="text-[10px] text-emerald-600 font-medium">↑ 24%</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Electronic Filings</p>
              <p className="text-xs font-bold text-slate-900 tabular-nums">238</p>
              <span className="text-[10px] text-slate-400">86%</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Paper Filings</p>
              <p className="text-xs font-bold text-slate-900 tabular-nums">37</p>
              <span className="text-[10px] text-slate-400">14%</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Disposal Rate</p>
              <p className="text-xs font-bold text-slate-900 tabular-nums">72%</p>
              <span className="text-[10px] text-emerald-600 font-medium">↑ 8%</span>
            </div>
          </div>
        </div>

        {/* Right: Signature Dark Navy Scales Card (3 cols) */}
        <div className="lg:col-span-3">
          <GhanaScalesCard variant="registry" className="h-full" />
        </div>
      </div>

      {/* Bottom Section: Upcoming Hearings + Recent Activities + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Column 1: Upcoming Hearings (5 cols) matching Page 2 */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Upcoming Hearings
            </h4>
            <button
              onClick={() => onNavigate('hearings_calendar')}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
            >
              View calendar
            </button>
          </div>

          <div className="space-y-3 mt-3">
            {/* Hearing 1 */}
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                  09:00 AM
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    State v. Kwame Darko
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    CR/0245/2024 · Cybercrime · Court 3, Accra · 20 May 2024
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded shrink-0">
                Today
              </span>
            </div>

            {/* Hearing 2 */}
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                  11:00 AM
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    The Republic v. Joseph Mensah
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    CR/0187/2024 · Corruption · Court 1, Accra · 20 May 2024
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded shrink-0">
                Today
              </span>
            </div>

            {/* Hearing 3 */}
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-slate-800 font-mono bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                  02:30 PM
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    State v. Richard Appiah
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    CR/0301/2024 · Galamsey · Court 2, Takoradi · 20 May 2024
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded shrink-0">
                Today
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <button
              onClick={() => onNavigate('hearings_calendar')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              View all hearings &rarr;
            </button>
          </div>
        </div>

        {/* Column 2: Recent Activities (4 cols) matching Page 2 */}
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
                <p className="text-xs font-semibold text-slate-900">New filing submitted</p>
                <p className="text-[11px] text-slate-500 truncate">
                  CR/0320/2024 · State v. Kofi Agyeman
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">10:24 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">Case assigned</p>
                <p className="text-[11px] text-slate-500 truncate">
                  CR/0299/2024 · Assigned to Court 3
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">09:45 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">Hearing scheduled</p>
                <p className="text-[11px] text-slate-500 truncate">
                  CR/0280/2024 · 27 May 2024, 10:00 AM
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">09:15 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">Document uploaded</p>
                <p className="text-[11px] text-slate-500 truncate">
                  CR/0276/2024 · Prosecution Bundle
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">08:50 AM</span>
            </div>
          </div>
        </div>

        {/* Column 3: System Status (3 cols) matching Page 2 */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                System Status
              </h4>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Operational</span>
              </div>
            </div>

            <div className="space-y-2.5 mt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">E-Filing Service</span>
                <span className="text-[11px] text-emerald-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Case Management</span>
                <span className="text-[11px] text-emerald-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Notification Service</span>
                <span className="text-[11px] text-emerald-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Document Storage</span>
                <span className="text-[11px] text-emerald-600 font-medium">Operational</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => alert('All court infrastructure nodes in Accra, Kumasi, and Takoradi are operational.')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center justify-between w-full"
            >
              <span>View System Health</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

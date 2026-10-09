import React from 'react';
import {
  Briefcase,
  Calendar,
  Gavel,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Scale,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { UserProfile, CaseRecord, HearingItem } from '../../types';
import { JUDGE_CASES_DONUT, JUDGE_PERFORMANCE_DATA } from '../../data/mockData';
import { GhanaScalesCard } from '../layout/GhanaScalesCard';

interface JudgeDashboardProps {
  currentUser: UserProfile;
  cases: CaseRecord[];
  hearings: HearingItem[];
  onNavigate: (screen: string) => void;
  onSelectHearing?: (hearing: HearingItem) => void;
  onSelectCase?: (caseItem: CaseRecord) => void;
}

export const JudgeDashboard: React.FC<JudgeDashboardProps> = ({
  currentUser,
  cases,
  hearings,
  onNavigate,
  onSelectHearing,
  onSelectCase,
}) => {
  return (
    <div className="space-y-5 pb-8">
      {/* Greeting Banner matching Page 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Good morning, Justice Mensah <span className="text-lg">⚖️</span>
          </h2>
          <p className="text-xs text-slate-500">
            You have 6 hearings today and 11 tasks pending.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('hearings_calendar')}
            className="px-3 py-1.5 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Open Judicial Cause List</span>
          </button>
        </div>
      </div>

      {/* 5 Stat Cards matching Page 3 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Card 1: Assigned Cases */}
        <div
          onClick={() => onNavigate('my_cases')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Assigned Cases</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">48</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Across all courts</div>
          <div className="mt-1 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <span>View all cases</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Hearings Today */}
        <div
          onClick={() => onNavigate('hearings_calendar')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Hearings Today</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">6</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Next: 09:00 AM</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>View today's list</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Judgments Reserved */}
        <div
          onClick={() => onNavigate('orders_judgments')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Judgments Reserved</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">5</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Pending delivery</div>
          <div className="mt-1 text-[11px] text-purple-600 font-semibold flex items-center gap-1">
            <span>View judgments</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Pending Orders */}
        <div
          onClick={() => onNavigate('orders_judgments')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Pending Orders</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">11</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Awaiting signature</div>
          <div className="mt-1 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <span>View orders</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 5: Urgent Tasks */}
        <div
          onClick={() => onNavigate('tasks')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Urgent Tasks</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">6</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 font-medium">Requires attention</div>
          <div className="mt-1 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
            <span>View tasks</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Middle Section: Today's Hearings + My Cases Overview (Donut) + My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Today's Hearings (5 cols) matching Page 3 */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Today's Hearings
              </h4>
              <button
                onClick={() => onNavigate('hearings_calendar')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                View Calendar
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {/* Row 1 */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                    09:00 AM
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      State v. Richard Appiah
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      CR/0301/2024 · Galamsey · Court 2
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                  In Session
                </span>
              </div>

              {/* Row 2 */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                    10:30 AM
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      The Republic v. Kofi Agyei
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      CR/0187/2024 · Corruption · Court 1
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                  Scheduled
                </span>
              </div>

              {/* Row 3 */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                    12:00 PM
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      State v. Benjamin Asare
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      CR/0412/2024 · Cybercrime · Court 3
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                  Scheduled
                </span>
              </div>

              {/* Row 4 */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                    02:30 PM
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      The Republic v. Mensah & 2 Others
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      CR/0098/2024 · Corruption · Court 1
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
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

        {/* Center: My Cases Overview (Donut Chart) (4 cols) matching Page 3 */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                My Cases Overview
              </h4>
              <button
                onClick={() => onNavigate('my_cases')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                View all cases
              </button>
            </div>

            {/* Donut Chart with Center Total */}
            <div className="relative h-40 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={JUDGE_CASES_DONUT}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {JUDGE_CASES_DONUT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900 leading-none">48</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Total Cases</span>
              </div>
            </div>

            {/* Legend with percentages */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              {JUDGE_CASES_DONUT.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 truncate">{item.name}</span>
                  <span className="font-bold text-slate-900 ml-auto tabular-nums">
                    {item.value} ({item.percentage})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-500 text-center border-t border-slate-100">
            You have <strong className="text-slate-800">28 cases</strong> in progress
          </div>
        </div>

        {/* Right: My Tasks (3 cols) matching Page 3 */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                My Tasks
              </h4>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                View all tasks
              </button>
            </div>

            <div className="space-y-2.5 mt-3 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Review case submissions</span>
                <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  3
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Draft judgments</span>
                <span className="font-bold text-rose-700 font-mono bg-rose-50 px-2 py-0.5 rounded">
                  2
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Sign pending orders</span>
                <span className="font-bold text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded">
                  4
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Respond to applications</span>
                <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  1
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Case management reviews</span>
                <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  1
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Priority assigned by Registrar & Cause List Clerk
          </div>
        </div>
      </div>

      {/* Bottom Section: Upcoming Hearings (This Week) + Recent Activities + Performance + Quote Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Upcoming Hearings (This Week) 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Upcoming Hearings (This Week)
            </h4>
            <button
              onClick={() => onNavigate('hearings_calendar')}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
            >
              View calendar
            </button>
          </div>

          {/* Days Breakdown Cards matching Page 3 */}
          <div className="grid grid-cols-6 gap-2 mt-3 text-center">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-[10px] font-bold text-blue-800">TUE</p>
              <p className="text-[9px] text-blue-600">20 MAY</p>
              <p className="text-lg font-extrabold text-blue-900 mt-1 tabular-nums">6</p>
              <span className="text-[9px] text-blue-700">Hearings</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-700">WED</p>
              <p className="text-[9px] text-slate-500">21 MAY</p>
              <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">5</p>
              <span className="text-[9px] text-slate-500">Hearings</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-700">THU</p>
              <p className="text-[9px] text-slate-500">22 MAY</p>
              <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">4</p>
              <span className="text-[9px] text-slate-500">Hearings</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-700">FRI</p>
              <p className="text-[9px] text-slate-500">23 MAY</p>
              <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">3</p>
              <span className="text-[9px] text-slate-500">Hearings</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-700">MON</p>
              <p className="text-[9px] text-slate-500">26 MAY</p>
              <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">2</p>
              <span className="text-[9px] text-slate-500">Hearings</span>
            </div>

            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-[10px] font-bold text-amber-800">TOTAL</p>
              <p className="text-[9px] text-amber-600">20-26 MAY</p>
              <p className="text-lg font-extrabold text-amber-900 mt-1 tabular-nums">20</p>
              <span className="text-[9px] text-amber-700">Hearings</span>
            </div>
          </div>
        </div>

        {/* Center: Recent Case Activities 4 cols */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Recent Case Activities
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
                  New filing submitted in State v. Richard Appiah
                </p>
                <p className="text-[11px] text-slate-500">CR/0301/2024 · Galamsey</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">08:45 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">
                  Prosecution bundle uploaded in The Republic v. Kofi Agyei
                </p>
                <p className="text-[11px] text-slate-500">CR/0187/2024 · Corruption</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">08:25 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">
                  Hearing completed in State v. Benjamin Asare
                </p>
                <p className="text-[11px] text-slate-500">CR/0412/2024 · Cybercrime</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">Yesterday</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">
                  Order issued in The Republic v. Mensah & 2 Others
                </p>
                <p className="text-[11px] text-slate-500">CR/0098/2024 · Corruption</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">Yesterday</span>
            </div>
          </div>
        </div>

        {/* Right: Court Performance + Quote Card 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Court Performance
              </h4>
              <span className="text-[10px] text-slate-500 font-medium">This Month</span>
            </div>

            <div className="h-32 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={JUDGE_PERFORMANCE_DATA} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="metric" hide />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-slate-600 border-t border-slate-100">
              <div>Determined: <strong className="text-slate-900">32</strong></div>
              <div>Hearings: <strong className="text-slate-900">45</strong></div>
              <div>Judgments: <strong className="text-slate-900">28</strong></div>
              <div>Adjourned: <strong className="text-slate-900">12%</strong></div>
            </div>
          </div>

          <GhanaScalesCard variant="judge" />
        </div>
      </div>
    </div>
  );
};

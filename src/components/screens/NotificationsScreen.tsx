import React, { useState } from 'react';
import {
  Bell,
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Search,
  Filter,
  Check,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  FileText,
  Sliders,
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../../types';
import { repository } from '../../data/caseRepository';

interface NotificationsScreenProps {
  currentUser: UserProfile;
  notifications: NotificationItem[];
  onNavigate: (screen: string) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  currentUser,
  notifications,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [toggles, setToggles] = useState({
    inSystem: true,
    sms: true,
    email: true,
    hearing: true,
    action: true,
    payment: true,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => repository.markNotificationAsRead(n.id));
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner Row matching Page 11 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Notifications
          </h2>
          <p className="text-xs text-slate-500">
            Stay updated on all case activities and deadlines.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* 4 Top Stat Cards matching Page 11 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Unread</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">9</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">New notifications</p>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Today</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">12</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Received today</p>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Action Required</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">3</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-1">Needs your attention</p>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">This Week</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">28</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total notifications</p>
        </div>
      </div>

      {/* Main Grid: Left Notification Feed (8 cols) + Right Preferences (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Feed matching Page 11 */}
        <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              All Notifications
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                />
              </div>
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700">
                <option>All Types</option>
                <option>Hearings</option>
                <option>Filings</option>
                <option>Payments</option>
              </select>
            </div>
          </div>

          {/* Group 1: Today */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              Today
            </p>

            <div className="space-y-2">
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        notif.category === 'hearing'
                          ? 'bg-blue-100 text-blue-700'
                          : notif.category === 'action_required'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {notif.category === 'hearing' ? (
                        <Calendar className="w-4 h-4" />
                      ) : notif.category === 'action_required' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">{notif.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        {notif.description}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        {notif.timestamp}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('case_tracking')}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold shrink-0 transition-colors"
                  >
                    Action
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: Earlier This Week */}
          <div className="space-y-3 pt-2">
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              Earlier This Week
            </p>

            <div className="space-y-2">
              {notifications.slice(3, 6).map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">{notif.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        {notif.description}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        {notif.timestamp}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">Read</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preferences & Triggers matching Page 11 */}
        <div className="lg:col-span-4 space-y-4">
          {/* Notification Preferences */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Notification Preferences
            </h4>
            <p className="text-[11px] text-slate-500">Manage how you receive alerts</p>

            <div className="space-y-2.5 text-xs">
              {[
                { key: 'inSystem' as const, label: 'In-System Notifications' },
                { key: 'sms' as const, label: 'SMS Alerts (Ghana Mobile)' },
                { key: 'email' as const, label: 'Email Notifications' },
                { key: 'hearing' as const, label: 'Hearing Reminders' },
                { key: 'action' as const, label: 'Action Reminders' },
                { key: 'payment' as const, label: 'Payment Reminders' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <span className="text-slate-700">{label}</span>
                  <button
                    onClick={() => handleToggle(key)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      toggles[key] ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        toggles[key] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Set Up Triggers */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Set Up Triggers
            </h4>

            <div className="divide-y divide-slate-100 text-[11px]">
              <a href="#trigger" className="py-2 flex items-center justify-between hover:text-blue-700">
                <div>
                  <p className="font-semibold text-slate-900">New Filing</p>
                  <p className="text-slate-400 text-[10px]">When a document is filed in your case</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a href="#trigger" className="py-2 flex items-center justify-between hover:text-blue-700">
                <div>
                  <p className="font-semibold text-slate-900">Hearing Scheduled</p>
                  <p className="text-slate-400 text-[10px]">When a hearing date is set</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a href="#trigger" className="py-2 flex items-center justify-between hover:text-blue-700">
                <div>
                  <p className="font-semibold text-slate-900">Deadline Approaching</p>
                  <p className="text-slate-400 text-[10px]">When a deadline is 2 days away</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a href="#trigger" className="py-2 flex items-center justify-between hover:text-blue-700">
                <div>
                  <p className="font-semibold text-slate-900">Case Status Change</p>
                  <p className="text-slate-400 text-[10px]">When case moves to a new stage</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

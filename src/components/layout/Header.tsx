import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Mail,
  Calendar as CalendarIcon,
  ChevronDown,
  Menu,
  Shield,
  Smartphone,
  RefreshCw,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { repository } from '../../data/caseRepository';

interface HeaderProps {
  currentUser: UserProfile;
  currentScreen: string;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (screen: string) => void;
  onToggleMobilePreview?: () => void;
  isMobilePreview?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentScreen,
  onRoleChange,
  onNavigate,
  onToggleMobilePreview,
  isMobilePreview = false,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  const getScreenTitleAndSubtitle = () => {
    switch (currentScreen) {
      case 'registry_dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Overview of court activities and your tasks',
        };
      case 'judge_dashboard':
        return {
          title: 'Judge Dashboard',
          subtitle: 'Overview of your cases, hearings and judicial tasks',
        };
      case 'lawyer_dashboard':
        return {
          title: 'Lawyer Dashboard',
          subtitle: 'Manage your cases, filings and court activities',
        };
      case 'filing_new':
        return {
          title: 'Electronic Filing',
          subtitle: 'File your documents electronically with the court',
        };
      case 'intake_review':
        return {
          title: 'Registrar Review & Case Intake',
          subtitle: 'Review filings, verify documents and intake cases into the system.',
        };
      case 'case_assignment':
        return {
          title: 'Case Assignment',
          subtitle: 'Assign cases to Judges and manage workload distribution.',
        };
      case 'hearing_scheduling':
        return {
          title: 'Hearing Scheduling',
          subtitle: 'Schedule and manage court hearings efficiently.',
        };
      case 'case_tracking':
        return {
          title: 'Case Tracking',
          subtitle: 'Track the status and progress of your case in real-time.',
        };
      case 'notifications':
        return {
          title: 'Notifications',
          subtitle: 'Stay updated on all case activities and deadlines.',
        };
      case 'my_cases':
        return {
          title: 'Case Records Registry',
          subtitle: 'Manage electronic case dockets, parties, and proceedings.',
        };
      default:
        return {
          title: 'Judicial Management',
          subtitle: 'Specialised Courts Electronic System',
        };
    }
  };

  const { title, subtitle } = getScreenTitleAndSubtitle();

  const handleResetData = () => {
    if (confirm('Reset all demo data back to default fictional records?')) {
      repository.resetToDefault();
      window.location.reload();
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 shrink-0 flex items-center justify-between gap-4 z-20 shadow-2xs">
      {/* Left: Menu & Context Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 truncate tracking-tight">
              {title}
            </h2>
            <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400">·</span>
            <span className="hidden sm:inline-block text-xs text-slate-500 truncate">
              {subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md items-center">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases, filings, parties..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium" suppressHydrationWarning>
            {currentDateStr || 'Today'}
          </span>
        </div>

        {/* Mobile Preview Toggle */}
        <button
          onClick={onToggleMobilePreview}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md border transition-colors ${
            isMobilePreview
              ? 'bg-blue-600 text-white border-blue-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle Mobile / Responsive View Preview (Page 12)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Responsive View</span>
        </button>

        {/* Reset Demo Data Button */}
        <button
          onClick={handleResetData}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
          title="Reset Demo Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Mail Icon */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          title="Court Correspondence"
        >
          <Mail className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
        </button>

        {/* User Role Quick Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-2 pr-2 py-1 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-7 h-7 shrink-0 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs border border-amber-300">
              {currentUser.name[0]}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 uppercase font-medium">
                {currentUser.role.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role selection modal/menu */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Demo Persona (8 Roles)
                </p>
                <p className="text-xs text-slate-600">
                  Select role to view corresponding dashboard & workflows:
                </p>
              </div>

              <div className="max-h-72 overflow-y-auto py-1">
                {(Object.keys(DEMO_USERS) as UserRole[]).map((r) => {
                  const u = DEMO_USERS[r];
                  const isSelected = currentUser.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-amber-50/80 text-amber-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-500 capitalize">
                          {r.replace('_', ' ')} · {u.title}
                        </p>
                      </div>
                      {isSelected && <UserCheck className="w-4 h-4 text-amber-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    onNavigate('login');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out to Login Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

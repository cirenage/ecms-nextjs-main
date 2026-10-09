import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Calendar,
  CheckSquare,
  Bell,
  BarChart3,
  BookOpen,
  FolderOpen,
  Users,
  Settings,
  Scale,
  CreditCard,
  FileCheck,
  Send,
  HelpCircle,
  Gavel,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface SidebarProps {
  currentUser: UserProfile;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  unreadNotificationsCount?: number;
  openTasksCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  subItems?: { id: string; label: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentScreen,
  onNavigate,
  unreadNotificationsCount = 12,
  openTasksCount = 6,
}) => {
  const getNavItems = (role: UserRole): NavItem[] => {
    switch (role) {
      case 'judge':
        return [
          { id: 'judge_dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'my_cases', label: 'My Cases', icon: Briefcase },
          { id: 'hearings_calendar', label: 'Hearings & Calendar', icon: Calendar },
          { id: 'virtual_court', label: 'Virtual Court', icon: Users },
          { id: 'orders_judgments', label: 'Orders & Judgments', icon: Gavel },
          { id: 'documents', label: 'Documents', icon: FolderOpen },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: openTasksCount },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'law_library', label: 'Law Library', icon: BookOpen },
          { id: 'directory', label: 'Directory', icon: Users },
        ];
      case 'lawyer':
        return [
          { id: 'lawyer_dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'my_cases', label: 'My Cases', icon: Briefcase },
          {
            id: 'efiling',
            label: 'E-Filing',
            icon: FileText,
            subItems: [
              { id: 'filing_new', label: 'File New Case' },
              { id: 'filing_list', label: 'My Filings' },
              { id: 'subsequent_filings', label: 'Subsequent Filings' },
              { id: 'filing_receipts', label: 'Filing Receipts' },
            ],
          },
          { id: 'hearings_calendar', label: 'Hearings & Calendar', icon: Calendar },
          { id: 'virtual_court', label: 'Virtual Court', icon: Users },
          { id: 'orders_judgments', label: 'Orders & Rulings', icon: Scale },
          { id: 'documents', label: 'Documents', icon: FolderOpen },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: openTasksCount },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: 7 },
          { id: 'bills_payments', label: 'Bills & Payments', icon: CreditCard },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'law_library', label: 'Legal Library', icon: BookOpen },
          { id: 'directory', label: 'Directory', icon: Users },
        ];
      case 'registrar':
      case 'administrator':
      case 'filing_clerk':
      case 'court_clerk':
      case 'chief_bailiff':
      case 'public_bailiff':
      default:
        return [
          { id: 'registry_dashboard', label: 'Dashboard', icon: LayoutDashboard },
          {
            id: 'efiling',
            label: 'E-Filing',
            icon: FileText,
            subItems: [
              { id: 'filing_new', label: 'New Filing' },
              { id: 'intake_review', label: 'Intake Queue' },
              { id: 'case_assignment', label: 'Case Assignment' },
              { id: 'subsequent_filings', label: 'Subsequent Filings' },
              { id: 'filing_receipts', label: 'Filing Receipts' },
            ],
          },
          { id: 'my_cases', label: 'Cases', icon: Briefcase },
          { id: 'hearings_calendar', label: 'Hearings & Calendar', icon: Calendar },
          { id: 'virtual_court', label: 'Virtual Court', icon: Users },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: openTasksCount },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
          { id: 'bills_payments', label: 'Invoices & Payments', icon: CreditCard },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'directory', label: 'Directory', icon: Users },
          { id: 'admin_config', label: 'Admin', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems(currentUser.role);

  return (
    <aside className="w-64 bg-[#041B44] text-slate-100 flex flex-col shrink-0 h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col items-center text-center">
        <div className="w-24 h-24 mb-3 shrink-0 flex items-center justify-center">
          <img
            src="/jsg-logo.svg"
            alt="Judicial Service of Ghana"
            className="w-full h-full object-contain"
            onError={(e) => {
              // fallback to text / svg if needed
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <h1 className="text-xs font-bold tracking-wider uppercase text-white">
          Judicial Service
        </h1>
        <h2 className="text-xs font-bold tracking-wide uppercase text-white">
          of Ghana
        </h2>
        <span className="text-[10px] text-[#D4AF37] tracking-tight mt-1">
          Specialised Courts Platform
        </span>
      </div>

      {/* Navigation Items List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (item.subItems && item.subItems.some((sub) => sub.id === currentScreen));

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                onClick={() => {
                  if (item.subItems && item.subItems.length > 0) {
                    const isAlreadyInSub = item.subItems.some((sub) => sub.id === currentScreen);
                    if (!isAlreadyInSub) {
                      onNavigate(item.subItems[0].id);
                      return;
                    }
                  }
                  onNavigate(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all text-left font-medium ${
                  isActive
                    ? 'bg-[#E5A824] text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-slate-900 text-amber-300'
                        : 'bg-blue-600/90 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Sub items if active */}
              {item.subItems && isActive && (
                <div className="pl-7 pr-1 py-1 space-y-0.5">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onNavigate(sub.id)}
                      className={`w-full text-left px-2 py-1.5 text-[11px] rounded transition-colors ${
                        currentScreen === sub.id
                          ? 'bg-slate-800 text-amber-400 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      • {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Status / Profile Footer */}
      <div className="p-3 bg-[#081220] border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs border border-amber-400/40">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#081220] ${
                currentUser.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {currentUser.name}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {currentUser.title.split(',')[0]}
            </p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

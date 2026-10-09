'use client';
import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, CaseRecord, FilingItem } from './types';
import { repository } from './data/caseRepository';
import { DEMO_USERS } from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegistryDashboard } from './components/screens/RegistryDashboard';
import { JudgeDashboard } from './components/screens/JudgeDashboard';
import { LawyerDashboard } from './components/screens/LawyerDashboard';
import { ElectronicFilingScreen } from './components/screens/ElectronicFilingScreen';
import { RegistrarIntakeScreen } from './components/screens/RegistrarIntakeScreen';
import { CaseAssignmentScreen } from './components/screens/CaseAssignmentScreen';
import { HearingSchedulingScreen } from './components/screens/HearingSchedulingScreen';
import { CaseTrackingScreen } from './components/screens/CaseTrackingScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { CaseRegistryScreen } from './components/screens/CaseRegistryScreen';
import { InvoicesPaymentsScreen } from './components/screens/InvoicesPaymentsScreen';
import { VirtualCourtScreen } from './components/screens/VirtualCourtScreen';
import { HearingsCalendarScreen } from './components/screens/HearingsCalendarScreen';
import { MobileResponsivePreview } from './components/screens/MobileResponsivePreview';
import { MyFilingsScreen } from './components/screens/MyFilingsScreen';
import { SubsequentFilingsScreen } from './components/screens/SubsequentFilingsScreen';
import { FilingReceiptsScreen } from './components/screens/FilingReceiptsScreen';
import { Sparkles, Info, Shield, CheckCircle } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(repository.getCurrentUser());
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [selectedCase, setSelectedCase] = useState<CaseRecord | undefined>();
  const [selectedFiling, setSelectedFiling] = useState<FilingItem | undefined>();
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [, setTick] = useState(0);

  // Subscribe to repository updates
  useEffect(() => {
    const unsubscribe = repository.subscribe(() => {
      setCurrentUser(repository.getCurrentUser());
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const handleRoleChange = (role: UserRole) => {
    const updatedUser = repository.switchRole(role);
    setCurrentUser(updatedUser);

    // Route to role default dashboard
    if (role === 'judge') {
      setCurrentScreen('judge_dashboard');
    } else if (role === 'lawyer') {
      setCurrentScreen('lawyer_dashboard');
    } else {
      setCurrentScreen('registry_dashboard');
    }
  };

  const handleLogin = (role: UserRole) => {
    handleRoleChange(role);
  };

  // If on login screen
  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={(role) => {
          handleLogin(role);
        }}
      />
    );
  }

  const cases = repository.getCases();
  const activeCase = selectedCase ? repository.getCaseById(selectedCase.id) : undefined;
  const filings = repository.getFilings();
  const hearings = repository.getHearings();
  const notifications = repository.getNotifications();
  const invoices = repository.getInvoices();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6F9] font-sans text-slate-900 select-none antialiased">
      {/* Dark Navy Sidebar matching PDF */}
      <Sidebar
        currentUser={currentUser}
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        unreadNotificationsCount={notifications.filter((n) => n.unread).length}
        openTasksCount={6}
      />

      {/* Main Viewport Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Prototype Environment Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#14366A] to-slate-900 text-white text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-blue-900/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-extrabold rounded text-[9px] uppercase tracking-wider">
              Prototype Phase 1
            </span>
            <span className="text-slate-200">
              Judicial Service of Ghana · eCMS 2.0 (Specialised Courts Platform)
            </span>
            <span className="hidden md:inline text-slate-400">· Demonstration Records Fictional</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Role Jump */}
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-[10px] text-slate-400 mr-1">Demo Role:</span>
              {(['registrar', 'judge', 'lawyer', 'filing_clerk'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`text-[10px] px-2 py-0.5 rounded capitalize transition-colors ${
                    currentUser.role === r
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentScreen('login')}
              className="text-[10px] text-amber-300 hover:text-amber-200 font-semibold underline ml-2"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Global Header */}
        <Header
          currentUser={currentUser}
          currentScreen={currentScreen}
          onRoleChange={handleRoleChange}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onToggleMobilePreview={() => setIsMobilePreviewOpen(!isMobilePreviewOpen)}
          isMobilePreview={isMobilePreviewOpen}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-5">
          {currentScreen === 'virtual_court' && <VirtualCourtScreen hearings={hearings} cases={cases} currentUser={currentUser} />}
          {currentScreen === 'hearings_calendar' && <HearingsCalendarScreen hearings={hearings} onSchedule={() => setCurrentScreen('hearing_scheduling')} onVirtual={() => setCurrentScreen('virtual_court')} />}
          {/* Registry Dashboard (Page 2) */}
          {currentScreen === 'registry_dashboard' && (
            <RegistryDashboard
              currentUser={currentUser}
              cases={cases}
              filings={filings}
              hearings={hearings}
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectCase={(c) => {
                setSelectedCase(c);
                setCurrentScreen('case_tracking');
              }}
              onSelectFiling={(f) => {
                setSelectedFiling(f);
                setCurrentScreen('intake_review');
              }}
            />
          )}

          {/* Judge Dashboard (Page 3) */}
          {currentScreen === 'judge_dashboard' && (
            <JudgeDashboard
              currentUser={currentUser}
              cases={cases}
              hearings={hearings}
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectHearing={(h) => {
                const matched = cases.find((c) => c.suitNumber === h.suitNumber);
                if (matched) setSelectedCase(matched);
                setCurrentScreen('case_tracking');
              }}
              onSelectCase={(c) => {
                setSelectedCase(c);
                setCurrentScreen('case_tracking');
              }}
            />
          )}

          {/* Lawyer Dashboard (Page 4) */}
          {currentScreen === 'lawyer_dashboard' && (
            <LawyerDashboard
              currentUser={currentUser}
              cases={cases}
              hearings={hearings}
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectCase={(c) => {
                setSelectedCase(c);
                setCurrentScreen('case_tracking');
              }}
              onStartFiling={() => setCurrentScreen('filing_new')}
            />
          )}

          {/* Electronic Filing (Page 5 & 6) */}
          {currentScreen === 'filing_new' && (
            <ElectronicFilingScreen
              currentUser={currentUser}
              onNavigate={(s) => setCurrentScreen(s)}
              onFilingComplete={() => {
                if (currentUser.role === 'registrar') {
                  setCurrentScreen('intake_review');
                } else {
                  setCurrentScreen('case_tracking');
                }
              }}
            />
          )}

          {/* Registrar Review & Case Intake (Page 7) */}
          {currentScreen === 'intake_review' && (
            <RegistrarIntakeScreen
              currentUser={currentUser}
              filing={selectedFiling}
              onNavigate={(s) => setCurrentScreen(s)}
              onProceedToAssignment={(f) => {
                const targetCase = repository.getCases().find(
                  (c) => c.filingRef === f.filingReference || c.caseTitle === f.caseTitle
                );
                if (targetCase) setSelectedCase(targetCase);
                setCurrentScreen('case_assignment');
              }}
            />
          )}

          {/* Case Assignment (Page 8) */}
          {currentScreen === 'case_assignment' && (
            <CaseAssignmentScreen
              currentUser={currentUser}
              caseRecord={activeCase}
              onNavigate={(s) => setCurrentScreen(s)}
              onAssignmentComplete={(judge) => {
                setCurrentScreen('hearing_scheduling');
              }}
            />
          )}

          {/* Hearing Scheduling (Page 9) */}
          {currentScreen === 'hearing_scheduling' && (
            <HearingSchedulingScreen
              currentUser={currentUser}
              caseRecord={activeCase}
              onNavigate={(s) => setCurrentScreen(s)}
              onSchedulingComplete={() => setCurrentScreen('case_tracking')}
            />
          )}

          {/* Case Tracking (Page 10) */}
          {currentScreen === 'case_tracking' && (
            <CaseTrackingScreen
              currentUser={currentUser}
              caseRecord={activeCase}
              onNavigate={(s) => setCurrentScreen(s)}
              onPayFee={() => setCurrentScreen('bills_payments')}
            />
          )}

          {/* Notifications (Page 11) */}
          {currentScreen === 'notifications' && (
            <NotificationsScreen
              currentUser={currentUser}
              notifications={notifications}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          )}

          {/* Full Case Records Registry & eDocket */}
          {(currentScreen === 'my_cases' || currentScreen === 'documents') && (
            <CaseRegistryScreen
              currentUser={currentUser}
              cases={cases}
              onSelectCase={(c) => {
                setSelectedCase(c);
                setCurrentScreen('case_tracking');
              }}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          )}

          {/* Orders & Judgments / Rulings */}
          {currentScreen === 'orders_judgments' && (
            <CaseRegistryScreen
              currentUser={currentUser}
              cases={cases}
              onSelectCase={(c) => {
                setSelectedCase(c);
                setCurrentScreen('case_tracking');
              }}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          )}

          {/* External Lawyer / Staff: My Filings */}
          {(currentScreen === 'filing_list' || currentScreen === 'filing_drafts') && (
            <MyFilingsScreen
              currentUser={currentUser}
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectFiling={(f) => {
                setSelectedFiling(f);
                if (currentUser.role === 'registrar') {
                  setCurrentScreen('intake_review');
                }
              }}
              onTrackCase={(suitNo) => {
                const matched = cases.find((c) => c.suitNumber === suitNo);
                if (matched) setSelectedCase(matched);
                setCurrentScreen('case_tracking');
              }}
            />
          )}

          {/* Subsequent Filings on Existing Cases */}
          {currentScreen === 'subsequent_filings' && (
            <SubsequentFilingsScreen
              currentUser={currentUser}
              cases={cases}
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectCase={(c) => {
                setSelectedCase(c);
                setCurrentScreen('case_tracking');
              }}
            />
          )}

          {/* Official Electronic Filing Receipts Repository */}
          {currentScreen === 'filing_receipts' && (
            <FilingReceiptsScreen
              currentUser={currentUser}
              cases={cases}
              onNavigate={(s) => setCurrentScreen(s)}
              onTrackCase={(suitNo) => {
                const matched = cases.find((c) => c.suitNumber === suitNo);
                if (matched) setSelectedCase(matched);
                setCurrentScreen('case_tracking');
              }}
            />
          )}

          {/* Direct efiling parent route handler */}
          {currentScreen === 'efiling' && (
            currentUser.role === 'registrar' || currentUser.role === 'filing_clerk' ? (
              <RegistrarIntakeScreen
                currentUser={currentUser}
                filing={selectedFiling}
                onNavigate={(s) => setCurrentScreen(s)}
                onProceedToAssignment={(f) => {
                  const targetCase = repository.getCases().find(
                    (c) => c.filingRef === f.filingReference || c.caseTitle === f.caseTitle
                  );
                  if (targetCase) setSelectedCase(targetCase);
                  setCurrentScreen('case_assignment');
                }}
              />
            ) : (
              <MyFilingsScreen
                currentUser={currentUser}
                onNavigate={(s) => setCurrentScreen(s)}
                onTrackCase={(suitNo) => {
                  const matched = cases.find((c) => c.suitNumber === suitNo);
                  if (matched) setSelectedCase(matched);
                  setCurrentScreen('case_tracking');
                }}
              />
            )
          )}

          {/* Invoices & Ecobank Payments */}
          {currentScreen === 'bills_payments' && (
            <InvoicesPaymentsScreen
              currentUser={currentUser}
              invoices={invoices}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          )}

          {/* Fallback for other sidebar items */}
          {![
            'virtual_court',
            'hearings_calendar',
            'registry_dashboard',
            'judge_dashboard',
            'lawyer_dashboard',
            'filing_new',
            'filing_list',
            'filing_drafts',
            'subsequent_filings',
            'filing_receipts',
            'orders_judgments',
            'efiling',
            'intake_review',
            'case_assignment',
            'hearing_scheduling',
            'case_tracking',
            'notifications',
            'my_cases',
            'documents',
            'bills_payments',
          ].includes(currentScreen) && (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-2xs text-center space-y-3 max-w-xl mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 capitalize">
                {currentScreen.replace('_', ' ')} Module
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This operational module is linked to active Judicial Service workflows in subsequent phases.
                Navigate to primary Phase 1 dashboards using the sidebar or top role switcher.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => handleRoleChange('registrar')}
                  className="px-3 py-1.5 bg-[#14366A] text-white rounded-lg text-xs font-semibold"
                >
                  Registrar Dashboard
                </button>
                <button
                  onClick={() => handleRoleChange('judge')}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
                >
                  Judge Dashboard
                </button>
                <button
                  onClick={() => handleRoleChange('lawyer')}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold"
                >
                  Lawyer Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile / Responsive Preview Modal (Page 12) */}
      {isMobilePreviewOpen && (
        <MobileResponsivePreview onClose={() => setIsMobilePreviewOpen(false)} />
      )}
    </div>
  );
}

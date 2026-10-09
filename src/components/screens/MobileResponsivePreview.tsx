import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Layout,
  Menu,
  FileText,
  Calendar,
  CreditCard,
  Briefcase,
  Bell,
  ChevronRight,
  X,
  Scale,
  FolderOpen,
} from 'lucide-react';

interface MobileResponsivePreviewProps {
  onClose: () => void;
}

export const MobileResponsivePreview: React.FC<MobileResponsivePreviewProps> = ({ onClose }) => {
  const [activeDevice, setActiveDevice] = useState<'all' | 'portrait' | 'menu' | 'tablet'>('all');

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      {/* Top Controls */}
      <div className="w-full max-w-7xl flex items-center justify-between text-white pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif text-white">
              Mobile / Responsive Interface Preview
            </h3>
            <p className="text-xs text-slate-400">
              Access the Specialised Courts Platform anywhere, on any device (Page 12 Design Reference)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveDevice('all')}
              className={`px-3 py-1 rounded font-medium ${
                activeDevice === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Devices
            </button>
            <button
              onClick={() => setActiveDevice('portrait')}
              className={`px-3 py-1 rounded font-medium ${
                activeDevice === 'portrait' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mobile Portrait
            </button>
            <button
              onClick={() => setActiveDevice('menu')}
              className={`px-3 py-1 rounded font-medium ${
                activeDevice === 'menu' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Menu Open
            </button>
            <button
              onClick={() => setActiveDevice('tablet')}
              className={`px-3 py-1 rounded font-medium ${
                activeDevice === 'tablet' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tablet View
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Device Previews Grid */}
      <div className="w-full max-w-7xl py-6 flex flex-wrap items-start justify-center gap-8">
        {/* Device 1: Mobile (Portrait) */}
        {(activeDevice === 'all' || activeDevice === 'portrait') && (
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-semibold text-slate-300">Mobile (Portrait)</span>
            <div className="w-[300px] h-[600px] bg-slate-900 rounded-[36px] p-2.5 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
              {/* Phone Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-30" />

              {/* Screen Content */}
              <div className="w-full h-full bg-slate-50 rounded-[28px] overflow-y-auto flex flex-col justify-between pt-6 text-slate-900 text-xs">
                {/* Header */}
                <div className="px-3 py-2 flex items-center justify-between border-b border-slate-200 bg-white">
                  <div className="flex items-center gap-1.5">
                    <img src="/jsg-logo.svg" alt="JSG" className="w-5 h-5" />
                    <span className="font-serif font-bold text-[11px] text-slate-900">JUDICIAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-slate-600" />
                    <Menu className="w-4 h-4 text-slate-700" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-3 space-y-3 flex-1">
                  <div>
                    <p className="text-[10px] text-slate-400">Welcome back,</p>
                    <p className="text-sm font-bold text-slate-900">Ama Serwaa</p>
                    <p className="text-[9px] text-slate-500">Legal Practitioner</p>
                  </div>

                  {/* Case Card */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-800">My Cases</span>
                      <span className="text-[9px] text-blue-600">View All</span>
                    </div>
                    <p className="font-bold text-[11px] text-slate-900">Ama Serwaa v. Kwame Boateng</p>
                    <p className="text-[9px] text-slate-500 font-mono">EFL-2024-001256 · Active</p>
                    <p className="text-[9px] text-slate-600 mt-1">High Court (Accra) · Case Mgmt</p>
                    <div className="mt-1 pt-1 border-t border-slate-100 text-[9px] text-slate-500">
                      Next: Case Management (30 May 2024, 09:00 AM)
                    </div>
                  </div>

                  {/* Quick Grid */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[9px]">
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                      <FileText className="w-3.5 h-3.5 mx-auto text-blue-600 mb-0.5" />
                      <span>E-Filing</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 mx-auto text-emerald-600 mb-0.5" />
                      <span>Calendar</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                      <Scale className="w-3.5 h-3.5 mx-auto text-purple-600 mb-0.5" />
                      <span>Orders</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                      <CreditCard className="w-3.5 h-3.5 mx-auto text-amber-600 mb-0.5" />
                      <span>Payments</span>
                    </div>
                  </div>

                  {/* Hearing Reminder */}
                  <div className="bg-blue-50 border border-blue-200 p-2 rounded-xl text-[10px]">
                    <p className="font-bold text-blue-900">Upcoming Hearing</p>
                    <p className="text-[9px] text-slate-600">30 May 2024, 09:00 AM</p>
                    <p className="text-[9px] text-slate-500">Court 2, High Court (Accra)</p>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="px-3 py-1.5 bg-white border-t border-slate-200 flex items-center justify-around text-[9px] text-slate-500">
                  <div className="text-blue-600 font-bold text-center">Home</div>
                  <div className="text-center">My Cases</div>
                  <div className="text-center font-bold text-slate-900">+ File</div>
                  <div className="text-center">Calendar</div>
                  <div className="text-center">More</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Device 2: Mobile (Menu Open) matching Page 12 */}
        {(activeDevice === 'all' || activeDevice === 'menu') && (
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-semibold text-slate-300">Mobile (Menu Open)</span>
            <div className="w-[300px] h-[600px] bg-slate-900 rounded-[36px] p-2.5 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
              <div className="w-full h-full bg-[#0B192C] text-white rounded-[28px] overflow-y-auto flex flex-col justify-between pt-6 text-xs">
                {/* User info */}
                <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                      AS
                    </div>
                    <div>
                      <p className="font-bold text-[11px]">Ama Serwaa</p>
                      <p className="text-[9px] text-slate-400">Legal Practitioner</p>
                    </div>
                  </div>
                  <X className="w-4 h-4 text-slate-400" />
                </div>

                {/* Nav Items */}
                <div className="p-2 space-y-1 text-[11px] flex-1">
                  <div className="p-1.5 rounded bg-[#E5A824] text-slate-950 font-bold flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5" /> Dashboard
                  </div>
                  <div className="p-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" /> My Cases
                  </div>
                  <div className="p-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> E-Filing
                  </div>
                  <div className="p-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Hearing Calendar
                  </div>
                  <div className="p-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5" /> Orders & Rulings
                  </div>
                  <div className="p-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5" /> Documents
                  </div>
                  <div className="p-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5" /> Notifications
                    </div>
                    <span className="text-[9px] bg-blue-600 px-1 rounded-full">7</span>
                  </div>
                  <div className="p-1.5 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" /> Bills & Payments
                  </div>
                </div>

                {/* Logout */}
                <div className="p-3 border-t border-slate-800 text-[11px] text-rose-400">
                  Logout
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Device 3: Tablet Portrait matching Page 12 */}
        {(activeDevice === 'all' || activeDevice === 'tablet') && (
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-semibold text-slate-300">Tablet (Portrait)</span>
            <div className="w-[420px] h-[600px] bg-slate-900 rounded-[32px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
              <div className="w-full h-full bg-slate-50 rounded-[22px] overflow-y-auto flex flex-col text-slate-900 text-xs">
                {/* Tablet Top Bar */}
                <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/jsg-logo.svg" alt="JSG" className="w-6 h-6" />
                    <div>
                      <p className="font-serif font-bold text-xs">JUDICIAL SERVICE</p>
                      <p className="text-[9px] text-amber-600">OF GHANA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Bell className="w-4 h-4" />
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                      AS
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Good morning, Ama Serwaa
                    </h4>
                    <p className="text-[10px] text-slate-500">Legal Practitioner</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <p className="font-bold text-xs">Case Overview</p>
                    <p className="font-semibold text-slate-800">Ama Serwaa v. Kwame Boateng</p>
                    <p className="text-[10px] text-slate-500 font-mono">EFL-2024-001256 · High Court (Accra)</p>
                    <div className="p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-bold text-blue-900 text-[11px]">30 May 2024, 09:00 AM</p>
                        <p className="text-[10px] text-slate-600">Court 2, High Court (Accra)</p>
                      </div>
                      <button className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold">
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Tablet Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <FileText className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                      E-Filing
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <Calendar className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                      Hearing Calendar
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <Briefcase className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                      My Cases
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <Scale className="w-4 h-4 mx-auto text-purple-600 mb-1" />
                      Orders & Rulings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-400 pb-2">
        Click <strong className="text-white">Close (X)</strong> in top right to return to standard desktop workstation mode.
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Users,
  CheckCircle2,
  Building2,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Send,
  Save,
  Check,
} from 'lucide-react';
import { UserProfile, CaseRecord, HearingItem } from '../../types';
import { repository } from '../../data/caseRepository';

interface HearingSchedulingScreenProps {
  currentUser: UserProfile;
  caseRecord?: CaseRecord;
  onNavigate: (screen: string) => void;
  onSchedulingComplete?: () => void;
}

export const HearingSchedulingScreen: React.FC<HearingSchedulingScreenProps> = ({
  currentUser,
  caseRecord,
  onNavigate,
  onSchedulingComplete,
}) => {
  const currentCase =
    caseRecord ||
    repository.getCases().find((c) => c.suitNumber === 'CV/0566/2024') ||
    repository.getCases()[0];

  const [selectedDate, setSelectedDate] = useState('20 May 2024');
  const [selectedSlot, setSelectedSlot] = useState('02:30 PM - 03:30 PM');
  const [courtRoom, setCourtRoom] = useState('Court 2');
  const [hearingType, setHearingType] = useState<'Case Management Conference' | 'Pre-Trial Review' | 'Trial / Hearing' | 'Motion'>('Case Management Conference');
  const [duration, setDuration] = useState('1 Hour');
  const [hearingMode, setHearingMode] = useState<'In-Person' | 'Virtual' | 'Hybrid'>('In-Person');

  const handleConfirmSchedule = () => {
    const newHearing: HearingItem = {
      id: `h_${Date.now()}`,
      caseId: currentCase.id,
      suitNumber: currentCase.suitNumber,
      caseTitle: currentCase.caseTitle,
      hearingType,
      courtRoom: `${courtRoom}, High Court (Accra)`,
      date: selectedDate,
      time: selectedSlot.split(' - ')[0],
      judgeName: currentCase.assignedJudgeName || 'Justice K. A. Mensah',
      status: 'Scheduled',
      mode: hearingMode,
      location: `${courtRoom}, Law Court Complex, Accra`,
      capacity: 50,
      duration,
      notifiedParties: [
        { name: 'Ama Serwaa (Claimant)', channel: 'SMS & Email' },
        { name: 'Kwame Boateng (Defendant)', channel: 'SMS & Email' },
        { name: 'John Doe (Witness)', channel: 'Email' },
      ],
    };

    repository.addHearing(newHearing);
    alert(
      `Hearing Scheduled Successfully!\nCase: ${currentCase.caseTitle}\nDate: ${selectedDate} at ${selectedSlot}\nCourt Room: ${courtRoom}\nType: ${hearingType}\nMode: ${hearingMode}\n\nDemo notification saved locally. SMS and email delivery are not connected.`
    );
    if (onSchedulingComplete) onSchedulingComplete();
    else onNavigate('case_tracking');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner matching Page 9 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Hearing Scheduling
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
              {currentCase.filingRef || 'EFL-2024-001256'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {currentCase.caseTitle}
          </p>
        </div>

        <button
          onClick={() => onNavigate('case_assignment')}
          className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case</span>
        </button>
      </div>

      {/* Stepper matching Page 9 */}
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
            <span className="text-[11px] font-bold text-blue-900 mt-1">Select Date & Time</span>
            <span className="text-[10px] text-blue-600 font-medium">Current Step</span>
          </div>

          <div className="flex flex-col items-center relative z-10 opacity-50">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-[11px] font-medium text-slate-600 mt-1">Hearing Details</span>
            <span className="text-[10px] text-slate-400">Pending</span>
          </div>

          <div className="flex flex-col items-center relative z-10 opacity-50">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span className="text-[11px] font-medium text-slate-600 mt-1">Notify Parties</span>
            <span className="text-[10px] text-slate-400">Pending</span>
          </div>

          <div className="flex flex-col items-center relative z-10 opacity-50">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">
              5
            </div>
            <span className="text-[11px] font-medium text-slate-600 mt-1">Confirm Schedule</span>
            <span className="text-[10px] text-slate-400">Pending</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Slot Selection (8 cols) + Right Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Scheduling Controls */}
        <div className="lg:col-span-8 space-y-4">
          {/* Date & Time Picker Container */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Select Date & Time
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Mini Calendar UI matching Page 9 */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs font-bold text-slate-800">
                  <span>May 2024</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Today: 20 May
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-500 font-semibold mb-1">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['28', '29', '30', '1', '2', '3', '4'].map((d, i) => (
                    <span key={i} className="py-1 text-slate-300">{d}</span>
                  ))}
                  {['5', '6', '7', '8', '9', '10', '11'].map((d) => (
                    <span key={d} className="py-1 text-slate-700 hover:bg-slate-200 rounded cursor-pointer">{d}</span>
                  ))}
                  {['12', '13', '14', '15', '16', '17', '18'].map((d) => (
                    <span key={d} className="py-1 text-slate-700 hover:bg-slate-200 rounded cursor-pointer">{d}</span>
                  ))}
                  <span className="py-1 text-slate-700">19</span>
                  <span className="py-1 bg-[#14366A] text-white rounded-full font-bold shadow-xs cursor-pointer">
                    20
                  </span>
                  {['21', '22', '23', '24', '25'].map((d) => (
                    <span key={d} className="py-1 text-slate-700 hover:bg-slate-200 rounded cursor-pointer">{d}</span>
                  ))}
                  {['26', '27', '28', '29', '30', '31', '1'].map((d, i) => (
                    <span key={i} className="py-1 text-slate-700 hover:bg-slate-200 rounded cursor-pointer">{d}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-200 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Limited
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" /> Unavailable
                  </span>
                </div>
              </div>

              {/* Time Slots matching Page 9 */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-800">
                  Available Time Slots · Mon, 20 May 2024
                </p>

                <div className="space-y-2 text-xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Morning</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedSlot('09:00 AM - 09:30 AM')}
                      className={`p-1.5 rounded border text-left text-[11px] font-medium transition-colors ${
                        selectedSlot === '09:00 AM - 09:30 AM'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      09:00 AM - 09:30 AM <span className="block text-[9px] opacity-75">Court 2</span>
                    </button>
                    <button
                      onClick={() => setSelectedSlot('09:30 AM - 10:00 AM')}
                      className={`p-1.5 rounded border text-left text-[11px] font-medium transition-colors ${
                        selectedSlot === '09:30 AM - 10:00 AM'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      09:30 AM - 10:00 AM <span className="block text-[9px] opacity-75">Court 2</span>
                    </button>
                  </div>

                  <p className="text-[10px] font-bold uppercase text-slate-400 pt-1">Afternoon</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedSlot('02:00 PM - 02:30 PM')}
                      className={`p-1.5 rounded border text-left text-[11px] font-medium transition-colors ${
                        selectedSlot === '02:00 PM - 02:30 PM'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      02:00 PM - 02:30 PM <span className="block text-[9px] opacity-75">Court 2</span>
                    </button>
                    <button
                      onClick={() => setSelectedSlot('02:30 PM - 03:30 PM')}
                      className={`p-1.5 rounded border text-left text-[11px] font-bold transition-colors ${
                        selectedSlot === '02:30 PM - 03:30 PM'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      02:30 PM - 03:30 PM ✓ <span className="block text-[9px] opacity-90">Court 2 (Selected)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Court Room & Details Config matching Page 9 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Select Court Room & Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Court Room</label>
                <select
                  value={courtRoom}
                  onChange={(e) => setCourtRoom(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
                >
                  <option>Court 2</option>
                  <option>Court 1</option>
                  <option>Court 3</option>
                  <option>Court 4</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">High Court (Accra) · Capacity: 50</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hearing Type</label>
                <select
                  value={hearingType}
                  onChange={(e) => setHearingType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
                >
                  <option>Case Management Conference</option>
                  <option>Pre-Trial Review</option>
                  <option>Trial / Hearing</option>
                  <option>Motion</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
                >
                  <option>1 Hour</option>
                  <option>30 Minutes</option>
                  <option>2 Hours</option>
                  <option>Half Day</option>
                </select>
              </div>
            </div>

            {/* Hearing Mode Radio */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hearing Mode
              </label>
              <div className="flex items-center gap-6 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="hearingMode"
                    checked={hearingMode === 'In-Person'}
                    onChange={() => setHearingMode('In-Person')}
                    className="text-blue-600"
                  />
                  <span>In-Person</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="hearingMode"
                    checked={hearingMode === 'Virtual'}
                    onChange={() => setHearingMode('Virtual')}
                    className="text-blue-600"
                  />
                  <span>Virtual (Video Conference)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="hearingMode"
                    checked={hearingMode === 'Hybrid'}
                    onChange={() => setHearingMode('Hybrid')}
                    className="text-blue-600"
                  />
                  <span>Hybrid</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Panel matching Page 9 */}
        <div className="lg:col-span-4 space-y-4">
          {/* Case Summary */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Case Summary
            </h4>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Case Title</span>
              <span className="font-bold text-slate-900 truncate max-w-[170px] text-right">
                {currentCase.caseTitle}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Filing Reference</span>
              <span className="font-mono text-blue-700">{currentCase.filingRef || 'EFL-2024-001256'}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Case Type</span>
              <span className="font-medium text-slate-800">{currentCase.caseType}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Court</span>
              <span className="font-medium text-slate-800">{currentCase.court}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Assigned Judge</span>
              <span className="font-bold text-slate-900">
                {currentCase.assignedJudgeName || 'Justice K. A. Mensah'}
              </span>
            </div>
          </div>

          {/* Hearing Summary Box */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              Hearing Summary
            </h4>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Proposed Date</span>
              <span className="font-bold text-slate-900">{selectedDate}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Time</span>
              <span className="font-bold font-mono text-blue-700">{selectedSlot}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Court Room</span>
              <span className="font-medium text-slate-800">{courtRoom}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Hearing Type</span>
              <span className="font-medium text-slate-800">{hearingType}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Duration</span>
              <span className="font-medium text-slate-800">{duration}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Mode</span>
              <span className="font-semibold text-emerald-700">{hearingMode}</span>
            </div>
          </div>

          {/* Parties to be Notified */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 text-xs">
            <h5 className="font-bold text-slate-800">Parties to be Notified (3)</h5>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-800">Ama Serwaa (Claimant)</span>
                <span className="text-blue-700 font-semibold">SMS & Email</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-800">Kwame Boateng (Defendant)</span>
                <span className="text-blue-700 font-semibold">SMS & Email</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-800">John Doe (Witness)</span>
                <span className="text-blue-700 font-semibold">Email</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleConfirmSchedule}
              className="w-full py-2.5 px-4 bg-[#14366A] hover:bg-[#0E264D] text-white text-xs font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue to Notify Parties</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('registry_dashboard')}
              className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

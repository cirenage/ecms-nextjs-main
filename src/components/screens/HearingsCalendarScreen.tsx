import React from 'react';
import { HearingItem } from '../../types';

export function HearingsCalendarScreen({ hearings, onSchedule, onVirtual }: { hearings: HearingItem[]; onSchedule: () => void; onVirtual: () => void }) {
  return <div className="space-y-5">
    <div className="flex flex-wrap justify-between gap-3"><div><h1 className="text-xl font-bold">Hearings & Calendar</h1><p className="text-sm text-slate-500">Court cause list and scheduled hearings</p></div><div className="flex gap-2"><button className="rounded-lg border px-4 py-2" onClick={onVirtual}>Virtual Court</button><button className="rounded-lg bg-[#14366A] text-white px-4 py-2" onClick={onSchedule}>Schedule Hearing</button></div></div>
    <div className="overflow-x-auto bg-white rounded-xl border"><table className="w-full text-sm text-left"><thead className="bg-slate-50"><tr>{['Case','Date & Time','Judge','Mode','Status'].map(h => <th className="p-4" key={h}>{h}</th>)}</tr></thead><tbody>{hearings.map(h => <tr key={h.id} className="border-t"><td className="p-4"><strong>{h.suitNumber}</strong><p>{h.caseTitle}</p></td><td className="p-4">{h.date}<p>{h.time}</p></td><td className="p-4">{h.judgeName}</td><td className="p-4">{h.mode}</td><td className="p-4">{h.status}</td></tr>)}</tbody></table>{!hearings.length && <p className="p-6">No hearings scheduled.</p>}</div>
  </div>;
}

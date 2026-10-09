import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, Video } from 'lucide-react';
import { CaseRecord, HearingItem, UserProfile } from '../../types';

export function VirtualCourtScreen({ hearings, cases, currentUser }: { hearings: HearingItem[]; cases: CaseRecord[]; currentUser: UserProfile }) {
  const [hearingId, setHearingId] = useState(hearings[0]?.id || '');
  const [joined, setJoined] = useState(false);
  const [camera, setCamera] = useState(false);
  const [mic, setMic] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [meetingUrl, setMeetingUrl] = useState('');
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const hearing = hearings.find(h => h.id === hearingId);
  const record = cases.find(c => c.id === hearing?.caseId || c.suitNumber === hearing?.suitNumber);

  useEffect(() => {
    try { setNotes(JSON.parse(localStorage.getItem('jsg_virtual_notes_' + hearingId) || '[]')); } catch { setNotes([]); }
    setNote('');
  }, [hearingId]);
  useEffect(() => () => { stream.current?.getTracks().forEach(t => t.stop()); }, []);
  useEffect(() => { if (video.current) video.current.srcObject = stream.current; }, [camera, joined]);

  async function toggleCamera() {
    setError('');
    if (camera) { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; setCamera(false); setMic(false); return; }
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      media.getAudioTracks().forEach(t => { t.enabled = false; });
      stream.current = media;
      setCamera(true);
    } catch { setError('Camera or microphone access was unavailable. Allow access in the browser and retry.'); }
  }
  function leave() { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; setCamera(false); setMic(false); setJoined(false); }
  function openMeeting() {
    try {
      const url = new URL(meetingUrl);
      if (url.protocol !== 'https:') throw new Error();
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
      setError('');
    } catch { setError('Enter a valid HTTPS meeting link from your meeting provider.'); }
  }
  function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    const updated = [...notes, `${new Date().toLocaleString()} · ${currentUser.name}: ${note.trim()}`];
    try { localStorage.setItem('jsg_virtual_notes_' + hearingId, JSON.stringify(updated)); setNotes(updated); setNote(''); } catch { setError('The browser could not save your note.'); }
  }
  return <div className="space-y-5">
    <div><h1 className="text-xl font-bold">Virtual Court</h1><p className="text-sm text-slate-500">Demo hearing room · local camera preview and notes</p></div>
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">The preview does not transmit video or audio. Open your court meeting link for a live session.</div>
    <label className="block text-sm font-semibold">Select Hearing<select disabled={joined} className="mt-2 block w-full rounded-lg border bg-white p-3" value={hearingId} onChange={e => setHearingId(e.target.value)}>{hearings.map(h => <option key={h.id} value={h.id}>{h.suitNumber} · {h.caseTitle} · {h.date} {h.time}</option>)}</select></label>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <div className="grid xl:grid-cols-3 gap-5"><section className="xl:col-span-2 rounded-xl overflow-hidden bg-[#0B192C] text-white">
      <div className="p-4 border-b border-slate-700 flex justify-between"><strong>{hearing?.suitNumber || 'No hearing available'}</strong><span>{joined ? 'Demo room open' : 'Waiting room'}</span></div>
      <div className="relative aspect-video flex items-center justify-center">{camera ? <video ref={video} autoPlay playsInline muted className="w-full h-full object-cover" /> : <div className="text-center"><Video className="mx-auto w-12 h-12 text-amber-400" /><p className="mt-3">{currentUser.name}</p><p className="text-sm text-slate-400">Camera is off</p></div>}</div>
      <div className="p-4 flex flex-wrap gap-3"><button onClick={toggleCamera} className="flex gap-2 items-center rounded-lg bg-slate-700 px-4 py-2"><Camera size={16} />{camera ? 'Stop Camera' : 'Preview Camera'}</button><button disabled={!camera} onClick={() => { const enabled = !mic; stream.current?.getAudioTracks().forEach(t => { t.enabled = enabled; }); setMic(enabled); }} className="flex gap-2 items-center rounded-lg bg-slate-700 px-4 py-2 disabled:opacity-40"><Mic size={16} />{mic ? 'Mute' : 'Unmute'}</button>{joined ? <button onClick={leave} className="rounded-lg bg-red-700 px-4 py-2">Leave Room</button> : <button disabled={!hearing} onClick={() => setJoined(true)} className="rounded-lg bg-amber-500 text-slate-950 px-4 py-2 font-bold">Enter Demo Room</button>}</div>
    </section><aside className="bg-white rounded-xl border p-5 space-y-4"><h2 className="font-bold">Hearing Details</h2><p>{hearing?.caseTitle}</p><p className="text-sm text-slate-500">{hearing?.judgeName}<br />{hearing?.date} · {hearing?.time}</p><h3 className="font-semibold">Parties</h3>{record?.parties.map(p => <p className="text-sm" key={p.id}>{p.name} · {p.role}</p>)}<h3 className="font-semibold">Meeting Link</h3><input type="url" aria-label="Court meeting URL" placeholder="https://…" className="border rounded-lg w-full p-2" value={meetingUrl} onChange={e => setMeetingUrl(e.target.value)} /><button onClick={openMeeting} className="bg-[#14366A] text-white rounded-lg px-4 py-2">Open Live Meeting</button></aside></div>
    <section className="bg-white rounded-xl border p-5 space-y-3"><h2 className="font-bold">Demo Hearing Notes</h2><p className="text-xs text-slate-500">Stored in this browser; these are not an official transcript.</p>{notes.map((n,i) => <p key={i} className="text-sm border-b pb-2">{n}</p>)}<form className="flex gap-3" onSubmit={addNote}><input aria-label="Hearing note" className="flex-1 min-w-0 border rounded-lg p-3" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a hearing note…" /><button disabled={!hearing} className="bg-[#14366A] text-white px-4 rounded-lg">Save Note</button></form></section>
  </div>;
}

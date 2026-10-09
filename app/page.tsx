"use client";
import dynamic from 'next/dynamic';
// Demo storage is browser-local; mount only in the browser to avoid SSR state mismatch.
const App = dynamic(() => import('../src/App'), { ssr: false, loading: () => <div className="p-8">Loading eCMS…</div> });
export default function Page() { return <App />; }

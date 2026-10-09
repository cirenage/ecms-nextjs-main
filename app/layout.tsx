import type { Metadata } from 'next';
import React from 'react';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'JSG eCMS 2.0 - Judicial Service of Ghana',
  description:
    'Judicial Service of Ghana Electronic Case Management System: Specialised Courts Platform, E-Filing, Intake, Cause Lists, and Judicial Workflow.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/JSG_logo.jpeg" />
      </head>
      <body className="antialiased bg-[#F4F6F9] text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}

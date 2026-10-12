import type { Metadata } from 'next';
import './globals.css';
import { ToddlerHQProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'ToddlerHQ — Preschool Operations, Project Management & Delegation OS',
  description:
    'Timeline-agnostic Project Management, Operations Management, and Downstairs Team Delegation Operating System for preschools and national preschool franchise brands.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans selection:bg-amber-100 selection:text-amber-900">
        <ToddlerHQProvider>{children}</ToddlerHQProvider>
      </body>
    </html>
  );
}

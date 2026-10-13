'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import {
  ShieldCheck,
  Sparkles,
  Users,
  HardDrive,
  FileSpreadsheet,
  FileText,
  MapPin,
  CheckCircle2,
  Building2,
  ArrowRight,
  Lock,
  Smartphone,
  Layers,
} from 'lucide-react';

export const GoogleGatewayScreen: React.FC = () => {
  const { connectGoogle, brand, campus } = useToddlerHQ();
  const [emailInput, setEmailInput] = useState('rajesh.mehta@edufranchise.com');
  const [nameInput, setNameInput] = useState('Rajesh Mehta');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleConnect = (email = emailInput, name = nameInput) => {
    connectGoogle({
      email,
      name,
      connectedAt: 'Just now',
      contactsCount: 8,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-sm"
            style={{ backgroundColor: brand.primaryColor }}
          >
            THQ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight">ToddlerHQ OS</span>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Google Workspace Native
              </span>
            </div>
            <p className="text-xs text-slate-400">
              India’s Operating System for Preschool Founders &amp; Franchise Chains
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>OAuth 2.0 Encrypted • Persistent Session</span>
        </div>
      </header>

      {/* Hero & Connection Modal */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>25+ Indian Preschool Chains Supported • NEP 2020 Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Connect Your Google Workspace to Access{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">
              {campus.campus_name}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            ToddlerHQ is deeply integrated into Google Workspace. Connect your Google account once to
            automatically sync parent contacts, Drive policies, fee spreadsheets, classroom lesson plans, and 1-click WhatsApp parent communication.
          </p>

          {/* Core Native Integrations Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <Users className="w-4 h-4 text-emerald-400" />
              <div className="font-bold text-white">Google Contacts</div>
              <div className="text-[11px] text-slate-400">Auto-sync parents, staff &amp; leads</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <div className="font-bold text-white">Google Sheets</div>
              <div className="text-[11px] text-slate-400">Live fee ledger &amp; payroll</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <div className="font-bold text-white">Google Drive</div>
              <div className="text-[11px] text-slate-400">Fire NOC &amp; circular repository</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <FileText className="w-4 h-4 text-blue-400" />
              <div className="font-bold text-white">Google Docs</div>
              <div className="text-[11px] text-slate-400">Child protection &amp; parent handbook</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <MapPin className="w-4 h-4 text-rose-400" />
              <div className="font-bold text-white">Google Maps</div>
              <div className="text-[11px] text-slate-400">Van routes &amp; catchment area</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div className="font-bold text-white">Gemini AI Agent</div>
              <div className="text-[11px] text-slate-400">Draft WhatsApp replies &amp; plans</div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Trust Login Card */}
        <div className="lg:col-span-5 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
          <div className="space-y-1.5 text-center">
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 shadow-xs mb-3">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Sign In with Google Workspace
            </h2>
            <p className="text-xs text-slate-500">
              Session is persistent and stays connected until you explicitly disconnect.
            </p>
          </div>

          {/* Quick Connect Founder Preset */}
          {!isCustomMode ? (
            <div className="space-y-3">
              <button
                onClick={() => handleConnect('rajesh.mehta@edufranchise.com', 'Rajesh Mehta')}
                className="w-full p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 text-left flex items-center justify-between transition-all group shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-sm">
                    RM
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-900">
                      Rajesh Mehta (Founder)
                    </div>
                    <div className="text-xs text-slate-500">
                      rajesh.mehta@edufranchise.com
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-indigo-600 text-white group-hover:scale-105 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-400 font-medium">or choose another staff account</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleConnect('principal.indiranagar@maplebear.in', 'Priya Sharma')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-left"
                >
                  <div className="font-bold text-slate-800">Priya Sharma</div>
                  <div className="text-[10px] text-slate-500 truncate">Center Head / Principal</div>
                </button>
                <button
                  onClick={() => handleConnect('audit.south@franchise-hq.com', 'Vikram Malhotra')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-left"
                >
                  <div className="font-bold text-slate-800">Vikram Malhotra</div>
                  <div className="text-[10px] text-slate-500 truncate">Franchise HQ Auditor</div>
                </button>
              </div>

              <button
                onClick={() => setIsCustomMode(true)}
                className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 pt-1"
              >
                Sign in with custom Gmail or Workspace ID &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  aria-label="Founder Full Name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Workspace / Gmail Address
                </label>
                <input
                  type="email"
                  aria-label="Google Workspace Email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={() => handleConnect(emailInput, nameInput)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                Connect &amp; Launch Preschool OS
              </button>

              <button
                onClick={() => setIsCustomMode(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-700"
              >
                &larr; Back to preset accounts
              </button>
            </div>
          )}

          {/* Persistent Login Assurance Note */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Persistent Login Policy</span>
            </div>
            <p>
              Once connected, you will not be asked to log in again on this device. The button in the header transforms into an active account badge and will not disconnect until you click &quot;Disconnect Google&quot;.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 border-t border-white/10 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>&copy; ToddlerHQ OS • Deterministic Preschool Operations</span>
        <div className="flex items-center gap-4">
          <span>Security Certified</span>
          <span>•</span>
          <span>Google People API</span>
          <span>•</span>
          <span>Gemini AI 2.0</span>
        </div>
      </footer>
    </div>
  );
};

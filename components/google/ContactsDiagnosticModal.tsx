'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import {
  X,
  AlertTriangle,
  Users,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Mail,
  Copy,
  Check,
  HelpCircle,
  Smartphone,
} from 'lucide-react';

interface ContactsDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactsDiagnosticModal: React.FC<ContactsDiagnosticModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    googleAuth,
    switchGoogleAccount,
    syncGoogleContactsNow,
    contactsSyncCount,
  } = useToddlerHQ();

  const [activeTab, setActiveTab] = useState<'explanation' | 'transfer_guide' | 'switch_account'>('explanation');
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleTriggerSync = () => {
    const count = syncGoogleContactsNow();
    setSyncFeedback(`Successfully synced ${count} preschool contacts from Google Contacts!`);
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Google Contacts Diagnostic Wizard</span>
            </div>
            <h3 className="text-xl font-black">
              Why are contacts not showing up?
            </h3>
            <p className="text-xs text-white/90">
              The 2-Gmail ID Problem explained + step-by-step resolution.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 px-6 pt-2">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'explanation'
                ? 'border-orange-500 text-orange-600 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            1. The 2-Gmail ID Problem
          </button>
          <button
            onClick={() => setActiveTab('transfer_guide')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'transfer_guide'
                ? 'border-orange-500 text-orange-600 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            2. Step-by-Step Transfer Guide
          </button>
          <button
            onClick={() => setActiveTab('switch_account')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'switch_account'
                ? 'border-orange-500 text-orange-600 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            3. Switch Connected Gmail ID
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-6">
          {/* TAB 1: Explanation */}
          {activeTab === 'explanation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <div className="font-extrabold text-sm text-amber-950">
                    Connected: {googleAuth.email} ({contactsSyncCount} contacts found)
                  </div>
                  <p>
                    In <strong>90% of Indian preschools</strong>, founders or principals connect their newly created official school domain email (e.g. <code>principal@school.in</code>), but all the real parent WhatsApp chats, inquiries, and phone contacts are saved in their <strong>personal Gmail account</strong> (e.g. <code>rajesh.founder@gmail.com</code>).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>Account A: School / Work ID</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Used for official emails, Google Drive policies, and franchise circulars. Usually has 0 phone contacts.
                  </p>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Currently Connected
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl border border-orange-200 bg-orange-50/50 space-y-2">
                  <div className="font-bold text-orange-950 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-orange-600" />
                    <span>Account B: Personal Phone Gmail</span>
                  </div>
                  <p className="text-orange-900 text-[11px]">
                    Synced with your Android/iPhone address book where 100+ parent WhatsApp numbers and leads reside.
                  </p>
                  <button
                    onClick={() => setActiveTab('switch_account')}
                    className="text-[11px] font-bold text-orange-700 hover:text-orange-900 underline"
                  >
                    Switch to this account &rarr;
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveTab('transfer_guide')}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <span>See How to Transfer Contacts in 2 Mins</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTriggerSync}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Force Re-Sync Now</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Step-by-Step Transfer Guide */}
          {activeTab === 'transfer_guide' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Follow this 4-step simple breakdown to export all your parent contacts from your personal Gmail into your school Google account:
              </div>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      Step 1: Open Google Contacts in Personal Account
                    </span>
                    <a
                      href="https://contacts.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      <span>contacts.google.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Open Google Contacts on your browser and ensure your personal Gmail (which has your phone contacts) is selected.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      Step 2: Click Export &rarr; Select &quot;Google CSV&quot;
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Google CSV Format
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Click the <strong>Export</strong> button on the left sidebar. Select &quot;Google CSV&quot; (recommended for Google accounts) and click <strong>Export</strong> to download the file.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      Step 3: Switch to School Account &rarr; Click Import
                    </span>
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                      contacts.google.com
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Switch profile to your school account (<code>{googleAuth.email}</code>). Click <strong>Import</strong> on the left, upload the downloaded CSV, and click Import.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950">
                      Step 4: Return to ToddlerHQ and Re-Sync
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-emerald-900">
                    All parent contacts with phone numbers and child names will immediately populate into the Stakeholder Directory and WhatsApp CRM.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleTriggerSync}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-Sync Contacts Now</span>
                </button>

                <button
                  onClick={() => setActiveTab('switch_account')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Or switch account directly &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Switch Account */}
          {activeTab === 'switch_account' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                You can easily toggle which Google Account ToddlerHQ uses for parent contact harvesting:
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    switchGoogleAccount('rajesh.mehta@edufranchise.com');
                    handleTriggerSync();
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    googleAuth.email === 'rajesh.mehta@edufranchise.com'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Work / School Domain: rajesh.mehta@edufranchise.com
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Connected to Drive policies &amp; fee registers
                    </div>
                  </div>
                  {googleAuth.email === 'rajesh.mehta@edufranchise.com' && (
                    <span className="p-1 rounded-full bg-indigo-600 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    switchGoogleAccount('rajesh.personal@gmail.com');
                    handleTriggerSync();
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    googleAuth.email === 'rajesh.personal@gmail.com'
                      ? 'border-orange-600 bg-orange-50/50 ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Personal Phone Gmail: rajesh.personal@gmail.com
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Synced with mobile contacts &amp; WhatsApp address book (8+ preschool contacts)
                    </div>
                  </div>
                  {googleAuth.email === 'rajesh.personal@gmail.com' && (
                    <span className="p-1 rounded-full bg-orange-600 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                💡 <strong>Pro Tip:</strong> ToddlerHQ allows dual-account linking so your Drive remains connected to your school Workspace while Contacts sync from your personal address book.
              </div>
            </div>
          )}

          {/* Sync Feedback Toast */}
          {syncFeedback && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Current contacts in system: <strong>{contactsSyncCount}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

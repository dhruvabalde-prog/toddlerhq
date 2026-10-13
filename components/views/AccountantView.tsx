'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import {
  Receipt,
  DollarSign,
  Send,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ExternalLink,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Building,
} from 'lucide-react';

interface AccountantViewProps {
  onOpenCopilot?: (tab?: string) => void;
}

export const AccountantView: React.FC<AccountantViewProps> = ({ onOpenCopilot }) => {
  const { students, vendorOrders, googleNativeAssets, dispatchGmail, campus } = useToddlerHQ();

  const [reminderNotice, setReminderNotice] = useState<string | null>(null);

  // Fee metrics calculation
  const totalEnrolled = students.filter((s) => s.status === 'admitted').length;
  const paidCount = students.filter((s) => s.status === 'admitted' && s.fee_paid).length;
  const dueStudents = students.filter((s) => s.status === 'admitted' && !s.fee_paid);

  const totalCollected = students
    .filter((s) => s.status === 'admitted' && s.fee_paid)
    .reduce((sum, s) => sum + s.fee_amount, 0);

  const totalOutstanding = dueStudents.reduce((sum, s) => sum + s.fee_amount, 0);

  // Vendor PO total
  const totalVendorExpenditure = vendorOrders.reduce((sum, po) => sum + po.amount, 0);

  const handleSendPaymentReminder = (student: typeof students[0]) => {
    dispatchGmail({
      toEmail: student.parent_email,
      recipientName: student.parent_name,
      subject: `Quarterly Tuition Fee Reminder for ${student.full_name} | ${campus.campus_name}`,
      type: 'fee_receipt',
      snippet: `Gentle reminder that the Q1 tuition fee of ₹${student.fee_amount.toLocaleString('en-IN')} for ${student.full_name} (${student.program_grade}) is due. Please tap the payment link to clear dues.`,
    });

    setReminderNotice(`Automated fee reminder dispatched to ${student.parent_email} via Gmail!`);
    setTimeout(() => setReminderNotice(null), 3500);
  };

  const financeAssets = googleNativeAssets.filter(
    (a) => a.department === 'Finance' || a.department === 'Procurement'
  );

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-xs">
              Accountant &amp; Finance Ledger
            </span>
            <span className="text-xs bg-white text-emerald-950 font-bold px-2.5 py-0.5 rounded-full">
              Q1 FISCAL YEAR 2026-27
            </span>
          </div>
          <h2 className="text-2xl font-black">Tuition Collection &amp; Vendor POs</h2>
          <p className="text-xs text-emerald-100 max-w-xl">
            Live collection register, fee defaulter notifications, vendor invoice verification, and native Google Sheets synchronization.
          </p>
        </div>

        {/* Deep Link to Master Budget Google Sheet */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://sheets.google.com/create?title=Preschool_Capex_Opex_Fitout_Budget"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Open Master Capex Sheet</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Reminder Alert Message */}
      {reminderNotice && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{reminderNotice}</span>
        </div>
      )}

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Q1 Fees Collected</span>
          <div className="text-2xl font-black text-emerald-700">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-400">{paidCount} of {totalEnrolled} students paid.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Pending Fee Dues</span>
          <div className="text-2xl font-black text-rose-600">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-400">{dueStudents.length} outstanding accounts.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Vendor PO Total</span>
          <div className="text-2xl font-black text-slate-800">
            ₹{totalVendorExpenditure.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-400">{vendorOrders.length} active procurement POs.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Sanctioned Capex</span>
          <div className="text-2xl font-black text-indigo-700">
            ₹{campus.budget_allocated.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-400">₹{(campus.budget_allocated - campus.budget_spent).toLocaleString('en-IN')} balance remaining.</p>
        </div>
      </div>

      {/* Main Split: Due Accounts & Vendor Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fee Defaulters List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  <span>Pending Tuition Fee Register ({dueStudents.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  One-click Gmail and WhatsApp fee reminder dispatch to parents.
                </p>
              </div>

              <span className="text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-xl">
                ₹{totalOutstanding.toLocaleString('en-IN')} Outstanding
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {dueStudents.map((stud) => (
                <div key={stud.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{stud.full_name}</span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        ({stud.program_grade})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Parent: {stud.parent_name} • {stud.parent_phone}
                    </p>
                    <span className="font-black text-rose-600 block pt-0.5">
                      ₹{stud.fee_amount.toLocaleString('en-IN')} Due
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendPaymentReminder(stud)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Gmail Reminder</span>
                    </button>
                  </div>
                </div>
              ))}

              {dueStudents.length === 0 && (
                <div className="py-8 text-center text-xs text-emerald-700 font-bold bg-emerald-50">
                  🎉 All enrolled students have cleared their quarterly fees!
                </div>
              )}
            </div>
          </div>

          {/* Vendor Purchase Order Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <span>Vendor Purchase Orders &amp; Invoices</span>
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {vendorOrders.map((po) => (
                <div key={po.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{po.vendor_name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                        {po.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{po.item_details}</p>
                    <span className="font-bold text-slate-800">₹{po.amount.toLocaleString('en-IN')}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    po.status === 'installed_verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {po.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Deep Linked Finance Sheets */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Finance Google Sheets</span>
            </h3>
            <p className="text-xs text-slate-500">
              Direct native deep links to official institutional accounting ledgers.
            </p>

            <div className="space-y-2.5">
              {financeAssets.map((asset) => (
                <a
                  key={asset.id}
                  href={asset.nativeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all flex items-center justify-between group text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 group-hover:text-emerald-950 block truncate max-w-[200px]">
                      {asset.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{asset.rowCountOrSections}</span>
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

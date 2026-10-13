'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { ToolPermission } from '@/types/toddlerhq';
import {
  FileSpreadsheet,
  FileText,
  Presentation,
  FormInput,
  BookOpen,
  GraduationCap,
  MapPin,
  CheckSquare,
  Sparkles,
  ShieldCheck,
  Download,
  ExternalLink,
  Table,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const DataHubTab: React.FC<{ onOpenCopilot?: (tab?: string) => void }> = ({
  onOpenCopilot,
}) => {
  const {
    students,
    dailyLogs,
    vendorOrders,
    stakeholders,
    aiToolPermissions,
    setAIToolPermission,
    campus,
    brand,
    googleAuth,
  } = useToddlerHQ();

  const [activeDataSection, setActiveDataSection] = useState<'trackers' | 'google_suite' | 'ai_permissions'>('trackers');

  // Compute live statistics from backend inputs
  const totalStudents = students.length;
  const paidCount = students.filter((s) => s.fee_paid).length;
  const totalRevenue = students.reduce((acc, s) => acc + (s.fee_paid ? s.fee_amount : 0), 0);
  const totalPending = students.reduce((acc, s) => acc + (!s.fee_paid ? s.fee_amount : 0), 0);

  const TOOL_ICONS: Record<ToolPermission['tool'], React.ReactNode> = {
    docs: <FileText className="w-5 h-5 text-blue-600" />,
    sheets: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
    slides: <Presentation className="w-5 h-5 text-amber-600" />,
    forms: <FormInput className="w-5 h-5 text-purple-600" />,
    notebooklm: <BookOpen className="w-5 h-5 text-indigo-600" />,
    classroom: <GraduationCap className="w-5 h-5 text-teal-600" />,
    maps: <MapPin className="w-5 h-5 text-rose-600" />,
    keep: <CheckSquare className="w-5 h-5 text-orange-600" />,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header with Section Navigation */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
              📊 Auto-Compiled Data
            </span>
            <span className="text-xs font-bold text-slate-500">
              Backend Trackers &amp; Google Suite (Tab 5)
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            School Data, Sheets, Docs &amp; AI Permissions Hub
          </h2>
          <p className="text-xs text-slate-500">
            Access all live data compiled from daily teacher logs, fee counters, and Google Workspace tools.
          </p>
        </div>

        {/* Section Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveDataSection('trackers')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeDataSection === 'trackers'
                ? 'bg-white text-indigo-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4 text-emerald-600" />
            <span>Compiled Trackers &amp; Registers</span>
          </button>
          <button
            onClick={() => setActiveDataSection('google_suite')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeDataSection === 'google_suite'
                ? 'bg-white text-indigo-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Google Workspace Suite (8 Tools)</span>
          </button>
          <button
            onClick={() => setActiveDataSection('ai_permissions')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeDataSection === 'ai_permissions'
                ? 'bg-white text-indigo-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Permission Matrix</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: COMPILED TRACKERS & REGISTERS */}
      {activeDataSection === 'trackers' && (
        <div className="space-y-6">
          {/* Revenue & Enrollment Top Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Total Students</span>
              <span className="text-2xl font-black text-slate-900">{totalStudents}</span>
              <span className="text-[10px] text-indigo-600 font-semibold block">Across 5 grades</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Collected Fees</span>
              <span className="text-2xl font-black text-emerald-600">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block">{paidCount} Paid in full</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Pending Fees</span>
              <span className="text-2xl font-black text-amber-600">
                ₹{totalPending.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-amber-700 font-semibold block">
                {totalStudents - paidCount} pending notices
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Capital Vendor Assets</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{vendorOrders.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">EVA mats, CCTV &amp; Toys</span>
            </div>
          </div>

          {/* Master Student Data Table */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Student Master Register &amp; Live Fee Status
                </h3>
                <p className="text-xs text-slate-500">
                  Auto-updated as teachers log attendance and fee counter receives payments.
                </p>
              </div>
              <button
                onClick={() => alert('Exporting to Google Sheets...')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Parent Name &amp; Phone</th>
                    <th className="py-2.5 px-3">Fee Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Allergies / Dietary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-extrabold text-slate-900">{st.full_name}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[10px]">
                          {st.program_grade}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{st.parent_name}</div>
                        <div className="text-[10px] text-slate-500">{st.parent_phone}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        ₹{st.fee_amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            st.fee_paid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {st.fee_paid ? 'Paid' : 'Due'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {st.allergies_dietary || 'None recorded'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Care Logs Register */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Classroom Daily Attendance, Nap &amp; Nutrition Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Child</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Gate Attendance</th>
                    <th className="py-2.5 px-3">Meals &amp; Nutrition</th>
                    <th className="py-2.5 px-3">Nap Rest</th>
                    <th className="py-2.5 px-3">Mood</th>
                    <th className="py-2.5 px-3">Teacher Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyLogs.map((log) => {
                    const st = students.find((s) => s.id === log.student_id);
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-extrabold text-slate-900">
                          {st?.full_name || 'Student'}
                        </td>
                        <td className="py-3 px-3 text-slate-500">{log.log_date}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.attendance === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {log.attendance.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700 capitalize">
                          {log.meal_status ? log.meal_status.replace('_', ' ') : 'N/A'}
                        </td>
                        <td className="py-3 px-3 font-bold text-indigo-700">
                          {log.nap_minutes} mins
                        </td>
                        <td className="py-3 px-3 text-base">{log.mood_emoji}</td>
                        <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                          {log.notes || 'Routine day'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: GOOGLE WORKSPACE SUITE (8 TOOLS) */}
      {activeDataSection === 'google_suite' && (
        <div className="space-y-6">
          <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs text-indigo-900">
            <div>
              <span className="font-extrabold text-sm block text-indigo-950">
                Connected Google Workspace Account: {googleAuth.email}
              </span>
              <span>All 8 productivity apps are synced to {campus.campus_name} Drive.</span>
            </div>
            <button
              onClick={() => alert('Synchronizing all Google Workspace tools...')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              Sync All Drive Files
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiToolPermissions.map((tool) => (
              <div
                key={tool.tool}
                className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100">
                      {TOOL_ICONS[tool.tool]}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tool.level === 'auto_sync'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tool.level === 'suggest'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      AI: {tool.level.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900">{tool.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{tool.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">{tool.lastSync}</span>
                  <button
                    onClick={() =>
                      alert(`Launching ${tool.title} for ${campus.campus_name}...`)
                    }
                    className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Open Tool</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: AI PERMISSIONS MATRIX */}
      {activeDataSection === 'ai_permissions' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>AI Agent Governance &amp; Security</span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Grant or Modify Gemini AI Permissions for Google Workspace Tools
              </h3>
              <p className="text-xs text-slate-500">
                Founders can explicitly decide whether the AI is read-only, suggests drafts, or automatically edits and modifies tools.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {aiToolPermissions.map((tool) => (
              <div
                key={tool.tool}
                className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
                    {TOOL_ICONS[tool.tool]}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">{tool.title}</div>
                    <div className="text-xs text-slate-500">{tool.description}</div>
                  </div>
                </div>

                {/* Permission Level Selector */}
                <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                  <select
                    value={tool.level}
                    onChange={(e) =>
                      setAIToolPermission(
                        tool.tool,
                        e.target.value as ToolPermission['level'],
                        tool.autoDraft
                      )
                    }
                    className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="disabled">🚫 Disabled (No AI Access)</option>
                    <option value="read">👁️ Read &amp; Analyze Only</option>
                    <option value="suggest">✍️ Suggest &amp; Draft (Human Approves)</option>
                    <option value="auto_sync">⚡ Auto-Sync &amp; Modify (Direct)</option>
                  </select>

                  <span className="text-[10px] text-slate-400 font-medium hidden md:inline">
                    Synced: {tool.lastSync}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>
              🔒 All modifications made by AI are encrypted, logged into the audit ledger, and reversible.
            </span>
            <button
              onClick={() => alert('Permissions audit verified!')}
              className="font-bold text-slate-900 hover:underline"
            >
              Verify Audit Log &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

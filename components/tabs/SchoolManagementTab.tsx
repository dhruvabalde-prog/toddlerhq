'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import {
  School,
  GraduationCap,
  Sparkles,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  FileText,
  DollarSign,
  Package,
  Eye,
  Camera,
  Layers,
  Search,
} from 'lucide-react';

export const SchoolManagementTab: React.FC<{ onOpenCopilot?: (tab?: string) => void }> = ({
  onOpenCopilot,
}) => {
  const {
    campus,
    brand,
    students,
    tasks,
    vendorOrders,
    staffList,
    dailyLogs,
    currentUser,
    setActiveTab,
  } = useToddlerHQ();

  const [activeSubTab, setActiveSubTab] = useState<'frontend' | 'backend'>('frontend');
  const [gradeFilter, setGradeFilter] = useState<'All' | 'Playgroup' | 'Nursery' | 'LKG' | 'UKG' | 'Daycare'>('All');

  const filteredStudents =
    gradeFilter === 'All'
      ? students
      : students.filter((s) => s.program_grade === gradeFilter);

  const totalCollectedFees = students.reduce(
    (acc, s) => acc + (s.fee_paid ? s.fee_amount : 0),
    0
  );
  const totalPendingFees = students.reduce(
    (acc, s) => acc + (!s.fee_paid ? s.fee_amount : 0),
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Management Header with Front-End vs Back-End Switcher */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-black text-white"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.name}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Operations &amp; Academics (Tab 2)
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Managing the School: Front-End &amp; Back-End
          </h2>
          <p className="text-xs text-slate-500">
            Toggle between parent/student front-of-house operations and behind-the-scenes staff &amp; compliance management.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('frontend')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'frontend'
                ? 'bg-white text-indigo-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Front-End School (Parents &amp; Teaching)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('backend')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'backend'
                ? 'bg-white text-indigo-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Back-End Operations (Rosters &amp; Finance)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: FRONT-END MANAGEMENT */}
      {activeSubTab === 'frontend' && (
        <div className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Total Enrolled</span>
              <span className="text-2xl font-black text-slate-900">
                {students.filter((s) => s.status === 'admitted').length}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block">Active in classrooms</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Today&apos;s Attendance</span>
              <span className="text-2xl font-black text-emerald-600">
                {dailyLogs.filter((l) => l.attendance === 'present').length} / {students.length}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">Morning gate scanned</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Tours Scheduled</span>
              <span className="text-2xl font-black text-amber-600">
                {students.filter((s) => s.status === 'tour_scheduled').length}
              </span>
              <span className="text-[10px] text-amber-700 font-semibold block">Parent walkthroughs today</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Active Curriculum</span>
              <span className="text-sm font-black text-slate-900 truncate block">
                {brand.pedagogy.split('(')[0]}
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold block">NEP 2020 Aligned</span>
            </div>
          </div>

          {/* Front-End Student & Classroom Roster */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Classroom Roster &amp; Daily Care Observations
                </h3>
                <p className="text-xs text-slate-500">
                  What parents see: attendance, morning circles, meals, and toddler nap routines.
                </p>
              </div>

              {/* Grade Filter Chips */}
              <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                {(['All', 'Playgroup', 'Nursery', 'LKG', 'UKG', 'Daycare'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGradeFilter(g)}
                    className={`px-3 py-1 rounded-xl transition-all ${
                      gradeFilter === g
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Students Table / Mobile Cards */}
            <div className="space-y-3">
              {filteredStudents.map((st) => {
                const log = dailyLogs.find((l) => l.student_id === st.id);
                return (
                  <div
                    key={st.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-sm">
                        {st.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{st.full_name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                            {st.program_grade}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Parent: {st.parent_name} ({st.parent_phone})
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {/* Attendance Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 ${
                          log?.attendance === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{log?.attendance === 'present' ? 'Present' : 'Not Marked'}</span>
                      </span>

                      {/* Meal & Nap */}
                      <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 font-semibold">
                        {log?.meal_status ? log.meal_status.replace('_', ' ') : 'Meal pending'}
                      </span>

                      <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                        💤 {log?.nap_minutes || 0}m nap
                      </span>

                      <button
                        onClick={() => setActiveTab('stakeholders')}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs"
                      >
                        1-Click WhatsApp &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BACK-END MANAGEMENT */}
      {activeSubTab === 'backend' && (
        <div className="space-y-6">
          {/* Back-End Operations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Staff Rosters & Shifts */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Teacher &amp; Didi Shifts
                  </h3>
                </div>
                <span className="text-xs font-bold text-indigo-600">{staffList.length} Active</span>
              </div>

              <div className="space-y-2 text-xs">
                {staffList.slice(0, 4).map((s) => (
                  <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{s.full_name}</div>
                      <div className="text-[10px] text-slate-500">{s.designation}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      8:15 AM – 4:00 PM
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('onboarding')}
                className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
              >
                + Add or modify staff in Tab 1 &rarr;
              </button>
            </div>

            {/* 2. Fee Reconciliation Ledger */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Fee Collections &amp; Cashflow
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-600">UPI Linked</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Total Collected</span>
                  <span className="text-xl font-black text-emerald-950">₹{totalCollectedFees.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending Collections</span>
                  <span className="text-xl font-black text-amber-950">₹{totalPendingFees.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('data_hub')}
                className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-900 pt-1"
              >
                Open Google Sheets Fee Ledger in Tab 5 &rarr;
              </button>
            </div>

            {/* 3. Statutory Compliance & Audits */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Statutory Compliance
                  </h3>
                </div>
                <span className="text-xs font-black text-emerald-600">{campus.compliance_score}% Valid</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Fire Department NOC</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Approved
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Staff Police Verification</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    100% Cleared
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">EVA 25mm Joint Sealing</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Certified EN71
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Zero Blindspot CCTV Feed</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Active 16 Cams
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('setup_running')}
                className="w-full text-center text-xs font-bold text-rose-700 hover:text-rose-900 pt-1"
              >
                Inspect Setup vs Running Tasks in Tab 3 &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { Task, Student, AttendanceStatus, MealStatus } from '@/types/toddlerhq';
import {
  Wrench,
  GraduationCap,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Utensils,
  Moon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Plus,
  Smile,
  Heart,
  UserCheck,
  Building,
  Check,
} from 'lucide-react';
import { TaskModal } from '@/components/tasks/TaskModal';
import { ProofReviewModal } from '@/components/tasks/ProofReviewModal';

export const SetupVsRunningTab: React.FC<{ onOpenCopilot?: (tab?: string) => void }> = ({
  onOpenCopilot,
}) => {
  const {
    mode,
    setMode,
    toggleMode,
    tasks,
    students,
    dailyLogs,
    currentUser,
    brand,
    campus,
    updateAttendance,
    logMeal,
    logNapMinutes,
    logMoodEmoji,
    transitionTaskStatus,
  } = useToddlerHQ();

  const [activeOperationalView, setActiveOperationalView] = useState<'setup' | 'running'>(
    mode === 'setup' ? 'setup' : 'running'
  );

  // Nap timer state for Running Mode
  const [napActive, setNapActive] = useState(false);
  const [napSeconds, setNapSeconds] = useState(0);
  const [selectedStudentForNap, setSelectedStudentForNap] = useState<Student | null>(
    students[0] || null
  );

  // Setup mode task modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedProofTask, setSelectedProofTask] = useState<Task | null>(null);

  // Nap timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (napActive) {
      interval = setInterval(() => {
        setNapSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [napActive]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveNapToStudent = () => {
    if (!selectedStudentForNap) return;
    const minutes = Math.max(1, Math.round(napSeconds / 60));
    logNapMinutes(selectedStudentForNap.id, minutes);
    setNapActive(false);
    setNapSeconds(0);
  };

  const handleAdvanceTask = (t: Task) => {
    let next = 'todo';
    if (t.status === 'backlog') next = 'todo';
    else if (t.status === 'todo') next = 'in_progress';
    else if (t.status === 'in_progress') next = 'under_review';
    else if (t.status === 'under_review') next = 'completed';
    else if (t.status === 'completed') next = 'verified';
    transitionTaskStatus(t.id, next as Task['status']);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controller: Setup Mode vs Running Mode */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                activeOperationalView === 'setup'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {activeOperationalView === 'setup'
                ? '🏗️ Setting Up the School'
                : '⏱️ Running the School Daily'}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Operational Life-Cycle (Tab 3)
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {activeOperationalView === 'setup'
              ? 'Pre-Launch Setup, Fit-Out & Statutory Approvals'
              : 'Live Daily Care, Nap Room, Meals & Gate Security'}
          </h2>
          <p className="text-xs text-slate-500">
            {activeOperationalView === 'setup'
              ? 'Complete civil fit-out, EVA flooring, fire clearance, and toy kit procurement before opening day.'
              : 'Live real-time morning gate check-in, peaceful nap room cot monitoring, and evening pickup authentication.'}
          </p>
        </div>

        {/* Big Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto text-xs font-black">
          <button
            onClick={() => {
              setActiveOperationalView('setup');
              setMode('setup');
            }}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeOperationalView === 'setup'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Setting Up Mode (Fit-out)</span>
          </button>
          <button
            onClick={() => {
              setActiveOperationalView('running');
              setMode('operations');
            }}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeOperationalView === 'running'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Running School (Live Care)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SETTING UP THE SCHOOL */}
      {activeOperationalView === 'setup' && (
        <div className="space-y-6">
          {/* Setup Department Progress Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Total Setup Milestones</span>
              <span className="text-2xl font-black text-slate-900">{tasks.length} Tasks</span>
              <span className="text-[10px] text-amber-600 font-semibold block">7 Departments</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Verified &amp; Closed</span>
              <span className="text-2xl font-black text-emerald-600">
                {tasks.filter((t) => t.status === 'verified').length} / {tasks.length}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block">Photo proof approved</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Safety Critical</span>
              <span className="text-2xl font-black text-rose-600">
                {tasks.filter((t) => t.priority === 'safety_critical' && t.status !== 'verified').length}
              </span>
              <span className="text-[10px] text-rose-700 font-semibold block">Gatekeepers pending</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Fit-out Budget Spent</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{(campus.budget_spent / 100000).toFixed(1)}L
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                of ₹{(campus.budget_allocated / 100000).toFixed(1)}L allocated
              </span>
            </div>
          </div>

          {/* Setup Milestones Checklist Table */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Pre-Launch Setup &amp; Fit-Out Milestones
                </h3>
                <p className="text-xs text-slate-500">
                  Track civil fit-out, EVA flooring, fire department NOC, and childproofing with photo-proof sign-off.
                </p>
              </div>

              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Setup Task</span>
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {t.department}
                      </span>
                      {t.priority === 'safety_critical' && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">
                          Safety Gatekeeper
                        </span>
                      )}
                      <span className="font-extrabold text-sm text-slate-900">{t.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto text-xs">
                    <span
                      className={`px-2.5 py-1 rounded-xl font-bold uppercase text-[10px] ${
                        t.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-900'
                          : t.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800'
                          : t.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>

                    {t.proof_image_url && (
                      <button
                        onClick={() => setSelectedProofTask(t)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                        title="View photo proof"
                      >
                        <Camera className="w-4 h-4 text-emerald-600" />
                      </button>
                    )}

                    {t.status !== 'verified' && (
                      <button
                        onClick={() => handleAdvanceTask(t)}
                        className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                      >
                        Advance &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: RUNNING THE SCHOOL (LIVE DAILY OPERATIONS) */}
      {activeOperationalView === 'running' && (
        <div className="space-y-6">
          {/* Nap Room & Sleep Tracker Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Nap Room Timer Console (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Live Nap Room &amp; Sleep Tracker
                    </h3>
                    <p className="text-xs text-slate-500">
                      Quiet room routine, cot monitoring &amp; lullaby environment.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900">
                  Quiet Zone Active
                </span>
              </div>

              {/* Interactive Timer & Controls */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white text-center space-y-4 shadow-lg">
                <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                  Toddler Nap Duration Counter
                </div>

                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-amber-400">
                  {formatTimer(napSeconds)}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  {!napActive ? (
                    <button
                      onClick={() => setNapActive(true)}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Nap Routine</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setNapActive(false)}
                      className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Nap Timer</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setNapActive(false);
                      setNapSeconds(0);
                    }}
                    className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Target Student Assignee */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
                  <span className="text-slate-400">Log nap for:</span>
                  <select
                    value={selectedStudentForNap?.id || ''}
                    onChange={(e) => {
                      const st = students.find((s) => s.id === e.target.value);
                      if (st) setSelectedStudentForNap(st);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-bold border border-white/20 focus:outline-none"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id} className="text-slate-900">
                        {st.full_name} ({st.program_grade})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleSaveNapToStudent}
                    disabled={napSeconds === 0}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs disabled:opacity-50"
                  >
                    Save Log &rarr;
                  </button>
                </div>
              </div>

              {/* Lullaby & Comfort Guidelines */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Nap Room Quiet Protocols</span>
                </span>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  Dim lighting to 20%, maintain room temperature at 24°C, and play soft instrumental lullabies. Didi must perform breathing check on all cots every 15 minutes.
                </p>
              </div>
            </div>

            {/* Morning Arrival & Evening Pickup Security (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Gate Check-In &amp; Pickup Security
                  </h3>
                </div>
                <span className="text-xs font-black text-emerald-600">Gate OTP Live</span>
              </div>

              <div className="space-y-3 text-xs">
                {students.map((st) => {
                  const log = dailyLogs.find((l) => l.student_id === st.id);
                  const isPresent = log?.attendance === 'present';

                  return (
                    <div
                      key={st.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900">{st.full_name}</div>
                        <div className="text-[10px] text-slate-500">
                          {st.program_grade} • Parent: {st.parent_name}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateAttendance(st.id, isPresent ? 'absent' : 'present')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                            isPresent
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isPresent ? '✓ Gate Scanned' : '+ Gate Check-In'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task & Proof Modals */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      {selectedProofTask && (
        <ProofReviewModal
          task={selectedProofTask}
          onClose={() => setSelectedProofTask(null)}
        />
      )}
    </div>
  );
};

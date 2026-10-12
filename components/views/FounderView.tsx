'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { Department, Task } from '@/types/toddlerhq';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { TaskModal } from '@/components/tasks/TaskModal';
import { ProofReviewModal } from '@/components/tasks/ProofReviewModal';

export const FounderView: React.FC<{ onOpenCopilot: (tab?: string) => void }> = ({
  onOpenCopilot,
}) => {
  const {
    campus,
    brand,
    tasks,
    students,
    vendorOrders,
    staffList,
    mode,
    transitionTaskStatus,
  } = useToddlerHQ();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedProofTask, setSelectedProofTask] = useState<Task | null>(null);
  const [activeGoogleEmail, setActiveGoogleEmail] = useState<'primary' | 'school'>('school');

  // Milestone Progress Calculations across Departments (Gantt-less progress over deadlines)
  const departments: { dept: Department; label: string; icon: string }[] = [
    { dept: 'Legal', label: 'Licensing & Fire NOC', icon: '⚖️' },
    { dept: 'Civil', label: 'Fit-out & EVA Flooring', icon: '🏗️' },
    { dept: 'Safety', label: 'Childproofing & Netting', icon: '🛡️' },
    { dept: 'Procurement', label: 'Air Quality & Furniture', icon: '📦' },
    { dept: 'Academic', label: 'Curriculum & Kits', icon: '📚' },
    { dept: 'HR', label: 'Staffing & Clearances', icon: '👥' },
    { dept: 'Marketing', label: 'Local Outreach & RWAs', icon: '📣' },
  ];

  const getDeptProgress = (dept: Department) => {
    const deptTasks = tasks.filter((t) => t.department === dept);
    if (deptTasks.length === 0) return { percent: 100, completed: 0, total: 0 };
    const completed = deptTasks.filter((t) => t.status === 'completed' || t.status === 'verified').length;
    return {
      percent: Math.round((completed / deptTasks.length) * 100),
      completed,
      total: deptTasks.length,
    };
  };

  // Financial calculations
  const totalTuitionFees = students.reduce((acc, s) => acc + (s.fee_paid ? s.fee_amount : 0), 0);
  const signedVendorOrders = vendorOrders.filter((v) => v.status !== 'rfq_sent');
  const signedVendorTotal = signedVendorOrders.reduce((acc, v) => acc + v.amount, 0);

  // Safety watch
  const unverifiedSafetyTasks = tasks.filter(
    (t) => t.priority === 'safety_critical' && t.status !== 'verified'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Executive Welcome & Multi-Account Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950">
                Executive Cockpit
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Founder / Co-Founder Board
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {campus.brand_name} — {campus.locality}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Timeline-Agnostic Launch &amp; Operations Radar. Track progress by milestones, audit safety gatekeepers, and govern downstairs delegation.
            </p>
          </div>

          {/* Multi-Email Account Switcher & Quick Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 text-xs flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setActiveGoogleEmail('school')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeGoogleEmail === 'school'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>School Account</span>
              </button>
              <button
                onClick={() => setActiveGoogleEmail('primary')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeGoogleEmail === 'primary'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Primary Trustee</span>
              </button>
            </div>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Delegate Task Downstairs</span>
            </button>
          </div>
        </div>

        {/* Executive Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Budget Burn
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white">
                ₹{(campus.budget_spent / 100000).toFixed(2)}L
              </span>
              <span className="text-xs text-slate-400">
                / ₹{(campus.budget_allocated / 100000).toFixed(0)}L
              </span>
            </div>
            <div className="w-full bg-slate-700/50 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{
                  width: `${Math.min(100, (campus.budget_spent / campus.budget_allocated) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tuition Collected
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                ₹{(totalTuitionFees / 1000).toFixed(0)}k
              </span>
              <span className="text-xs text-emerald-200">
                ({students.filter((s) => s.fee_paid).length} enrolled)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Average fee: ₹85k / term
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Signed PO Commitments
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-blue-300">
                ₹{(signedVendorTotal / 100000).toFixed(2)}L
              </span>
              <span className="text-xs text-slate-300">({signedVendorOrders.length} POs)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Flooring, childproofing &amp; ACs
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-2xl border border-slate-700/60">
            <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Safety Gatekeepers
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-rose-400">
                {unverifiedSafetyTasks.length} Pending
              </span>
            </div>
            <p className="text-[10px] text-rose-200/80 mt-2">
              Zero students allowed until 0
            </p>
          </div>
        </div>
      </div>

      {/* Gantt-less Milestone Completion Radar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Timeline-Agnostic Milestone Completion Radar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Progress over Deadlines philosophy: Preschools move at varying pace depending on civil readiness. Tracks update dynamically as tasks transition states.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full self-start sm:self-auto">
            Brand: {brand.pedagogy.split('(')[0].trim()}
          </span>
        </div>

        {/* Milestone Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const prog = getDeptProgress(dept.dept);
            return (
              <div
                key={dept.dept}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{dept.icon}</span>
                    <span className="font-bold text-sm text-slate-800">{dept.label}</span>
                  </div>
                  <span className="text-xs font-black text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {prog.percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      prog.percent === 100
                        ? 'bg-emerald-500'
                        : prog.percent > 50
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${prog.percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    {prog.completed} of {prog.total} milestones closed
                  </span>
                  <span className="font-medium text-slate-600 uppercase text-[10px]">
                    {dept.dept}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Gatekeeper Escalations & Downstairs Delegation Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tasks Requiring Founder Review / Unverified Proofs */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Under Review &amp; Safety Verification Proofs ({tasks.filter((t) => t.status === 'under_review').length})
              </h3>
              <p className="text-xs text-slate-500">
                Tasks waiting for Trustee / Center Head physical proof audit and sign-off.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {tasks
              .filter((t) => t.status === 'under_review' || (t.requires_proof && t.status !== 'verified'))
              .slice(0, 5)
              .map((task) => {
                const assignee = staffList.find((s) => s.id === task.assigned_to_id);

                return (
                  <div key={task.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                            task.priority === 'safety_critical'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {task.priority.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{task.department}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{task.title}</h4>
                      <p className="text-xs text-slate-500">
                        Assigned to: <strong>{assignee?.full_name}</strong> ({assignee?.designation})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {task.proof_image_url ? (
                        <button
                          onClick={() => setSelectedProofTask(task)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                        >
                          <span>Review Proof</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedProofTask(task)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
                        >
                          <span>Upload Proof</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Col: Multi-Campus Overview & Pedagogy Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Multi-Campus Franchise Network
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Trustee portfolio overview.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{campus.campus_name}</span>
                <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded-md">
                  CURRENT
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                {campus.locality}, {campus.city} • {tasks.length} Milestones
              </p>
              <div className="flex items-center justify-between text-xs pt-1 font-semibold text-slate-700">
                <span>Compliance Score</span>
                <span className="text-emerald-700 font-black">{campus.compliance_score}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 opacity-80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Bandra West Campus</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded-md">
                  Mumbai
                </span>
              </div>
              <p className="text-[11px] text-slate-500">EuroKids Pedagogy • Operations Live</p>
              <div className="flex items-center justify-between text-xs pt-1 text-slate-600 font-medium">
                <span>Enrolled Students</span>
                <span className="font-bold">48 Kids</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 opacity-80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Golf Course Road Campus</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded-md">
                  Gurugram
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Kangaroo Kids • Fit-out Phase</p>
              <div className="flex items-center justify-between text-xs pt-1 text-slate-600 font-medium">
                <span>Flooring Readiness</span>
                <span className="font-bold text-amber-700">85%</span>
              </div>
            </div>
          </div>

          {/* Quick AI Utility Trigger */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenCopilot('vendor_audit')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Audit Vendor Safety Specs with Gemini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />

      {/* Proof Review Modal */}
      <ProofReviewModal
        task={selectedProofTask}
        onClose={() => setSelectedProofTask(null)}
      />
    </div>
  );
};

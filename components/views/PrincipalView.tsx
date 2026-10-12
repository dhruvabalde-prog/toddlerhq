'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { Task, TaskStatus, VendorOrder } from '@/types/toddlerhq';
import {
  Kanban,
  ShieldAlert,
  Users,
  Package,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { TaskModal } from '@/components/tasks/TaskModal';
import { ProofReviewModal } from '@/components/tasks/ProofReviewModal';

const KANBAN_COLUMNS: { id: TaskStatus; label: string; badgeColor: string }[] = [
  { id: 'backlog', label: 'Backlog', badgeColor: 'bg-slate-100 text-slate-800' },
  { id: 'todo', label: 'To Do', badgeColor: 'bg-blue-100 text-blue-800' },
  { id: 'in_progress', label: 'In Progress', badgeColor: 'bg-amber-100 text-amber-800' },
  { id: 'under_review', label: 'Under Review (Proof Required)', badgeColor: 'bg-purple-100 text-purple-800' },
  { id: 'completed', label: 'Completed', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { id: 'verified', label: 'Verified & Closed', badgeColor: 'bg-emerald-200 text-emerald-900' },
];

export const PrincipalView: React.FC<{ onOpenCopilot: (tab?: string) => void }> = ({
  onOpenCopilot,
}) => {
  const {
    tasks,
    vendorOrders,
    staffList,
    currentUser,
    transitionTaskStatus,
    updateVendorOrderStatus,
  } = useToddlerHQ();

  const [activeTab, setActiveTab] = useState<'kanban' | 'safety_gatekeepers' | 'vendors' | 'team'>('kanban');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedProofTask, setSelectedProofTask] = useState<Task | null>(null);
  const [taskError, setTaskError] = useState<string | null>(null);

  // Safety Gatekeeper Alerts
  const criticalSafetyTasks = tasks.filter((t) => t.priority === 'safety_critical');
  const unverifiedSafetyTasks = criticalSafetyTasks.filter((t) => t.status !== 'verified');

  const handleAdvanceStatus = (task: Task) => {
    setTaskError(null);
    let nextStatus: TaskStatus = 'todo';
    if (task.status === 'backlog') nextStatus = 'todo';
    else if (task.status === 'todo') nextStatus = 'in_progress';
    else if (task.status === 'in_progress') nextStatus = 'under_review';
    else if (task.status === 'under_review') nextStatus = 'completed';
    else if (task.status === 'completed') nextStatus = 'verified';

    const res = transitionTaskStatus(task.id, nextStatus);
    if (!res.success) {
      setTaskError(res.error || 'Transition denied by state machine');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Principal Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200">
              Operational Hub
            </span>
            <span className="text-xs text-slate-500 font-semibold">Center Head / Principal Console</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Campus Operations &amp; Safety Compliance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage shifts, coordinate vendor orders, and enforce physical safety proofs across all departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenCopilot('vernacular_sop')}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs border border-indigo-200 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Vernacular SOP Translator</span>
          </button>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Operational Task</span>
          </button>
        </div>
      </div>

      {/* Error Alert Banner if any State Machine check triggers */}
      {taskError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{taskError}</span>
          </div>
          <button onClick={() => setTaskError(null)} className="text-rose-500 font-bold hover:text-rose-800">
            Dismiss
          </button>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'kanban'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Kanban className="w-3.5 h-3.5" />
          <span>Departmental Kanban Board</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-md text-slate-300">
            {tasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('safety_gatekeepers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'safety_gatekeepers'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Safety Gatekeepers</span>
          {unverifiedSafetyTasks.length > 0 && (
            <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-md font-black animate-pulse">
              {unverifiedSafetyTasks.length} ALERTS
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'vendors'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Vendor POs &amp; Specs</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-md font-bold">
            {vendorOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'team'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff Shifts &amp; Hierarchy</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-md font-bold">
            {staffList.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Departmental Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6">
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-slate-100/80 rounded-2xl p-3.5 border border-slate-200 flex flex-col min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-extrabold text-slate-900 truncate">
                    {col.label}
                  </span>
                  <span className="text-xs font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 space-y-3 pt-3 overflow-y-auto max-h-[68vh]">
                  {colTasks.map((task) => {
                    const assignee = staffList.find((s) => s.id === task.assigned_to_id);

                    return (
                      <div
                        key={task.id}
                        className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {task.department}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm ${
                              task.priority === 'safety_critical'
                                ? 'bg-rose-100 text-rose-800'
                                : task.priority === 'high'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.priority.replace('_', ' ')}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {task.title}
                        </h4>

                        {/* Assignee Badge */}
                        <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                          <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px]">
                            {assignee ? assignee.full_name.charAt(0) : '?'}
                          </div>
                          <span className="truncate">{assignee ? assignee.full_name : 'Unassigned'}</span>
                        </div>

                        {/* Proof Indicator */}
                        {task.requires_proof && (
                          <div className="pt-1 flex items-center justify-between text-[10px]">
                            <span className="flex items-center gap-1 text-amber-700 font-semibold">
                              <ShieldCheck className="w-3 h-3 text-amber-600" />
                              Proof Required
                            </span>
                            {task.proof_image_url ? (
                              <button
                                onClick={() => setSelectedProofTask(task)}
                                className="text-emerald-700 font-bold hover:underline"
                              >
                                View Proof ✓
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedProofTask(task)}
                                className="text-rose-600 font-bold hover:underline"
                              >
                                Attach +
                              </button>
                            )}
                          </div>
                        )}

                        {/* Action buttons based on status */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          {task.status !== 'verified' && (
                            <button
                              onClick={() => handleAdvanceStatus(task)}
                              className="text-[11px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-0.5"
                            >
                              <span>Advance</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          {task.status === 'verified' && (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          )}
                          <button
                            onClick={() => setSelectedProofTask(task)}
                            className="text-[10px] text-slate-400 hover:text-slate-600"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {colTasks.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400 italic">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Safety Gatekeepers Alert Board */}
      {activeTab === 'safety_gatekeepers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Preschool Safety Gatekeeper Audit Board
              </h3>
              <p className="text-xs text-slate-500">
                Mandatory early-childhood safety protocols. All items must have verified photographic proof before children enter campus.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                1. Window Grills &amp; Fall Protection
              </span>
              <p className="text-xs text-rose-800">
                No window gap can exceed 100mm (10cm). Low balconies must have 150kg tested safety netting.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold">
                <span>Status:</span>
                <span className="text-rose-700">Proof under review</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                2. Fire NOC &amp; Suppression
              </span>
              <p className="text-xs text-amber-800">
                4kg ABC fire extinguishers mounted at 1.2m. Heat sensor alarms installed in nap lounge and kitchen.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold">
                <span>Status:</span>
                <span className="text-amber-700">Inspection pending</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                3. Anti-Microbial EVA Flooring
              </span>
              <p className="text-xs text-emerald-800">
                25mm high-density tiles with EN71-3 heavy metal free certificate and beveled ramp door transitions.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold">
                <span>Status:</span>
                <span className="text-emerald-700">Verified &amp; Closed ✓</span>
              </div>
            </div>
          </div>

          {/* List of Safety Critical Tasks */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              All Safety Critical Tasks &amp; Verification State
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {criticalSafetyTasks.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{t.title}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        {t.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{t.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        t.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setSelectedProofTask(t)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Vendors & POs */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Preschool Vendor POs &amp; Safety Compliance
              </h3>
              <p className="text-xs text-slate-500">
                All early-years purchase orders require non-toxicity and fire-retardant safety checks.
              </p>
            </div>
            <button
              onClick={() => onOpenCopilot('vendor_audit')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Vendor Quote with Gemini</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {vendorOrders.map((po) => (
              <div key={po.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{po.vendor_name}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                      {po.category}
                    </span>
                    {po.safety_certified && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Safety Certified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{po.item_details}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">
                      ₹{po.amount.toLocaleString()}
                    </span>
                    <span className="block text-[11px] text-slate-500 capitalize">
                      {po.status.replace('_', ' ')}
                    </span>
                  </div>

                  <select
                    value={po.status}
                    onChange={(e) => updateVendorOrderStatus(po.id, e.target.value as any)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="quote_received">Quote Received</option>
                    <option value="safety_approved">Safety Approved</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="installed_verified">Installed &amp; Verified</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Team Shifts & Downstairs Hierarchy */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Campus Staff Roster &amp; Shifts</h3>
            <p className="text-xs text-slate-500">
              Downstairs hierarchy delegation view for {currentUser.full_name} ({currentUser.designation}).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                    {staff.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{staff.full_name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{staff.designation}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shift Hours:</span>
                    <span className="font-semibold text-slate-800">
                      {staff.role === 'educator' ? '08:00 AM - 02:00 PM' : '08:30 AM - 05:30 PM'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Google Email:</span>
                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-[150px]">
                      {staff.google_email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Police Check:</span>
                    <span className="text-emerald-700 font-bold">Verified ✓</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />

      {/* Proof Review Modal */}
      <ProofReviewModal
        task={selectedProofTask}
        onClose={() => setSelectedProofTask(null)}
      />
    </div>
  );
};

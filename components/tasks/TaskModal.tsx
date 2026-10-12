'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { Department, Priority, Task } from '@/types/toddlerhq';
import { AssigneeSelect } from '@/components/tasks/AssigneeSelect';
import { callGeminiCopilot } from '@/lib/geminiClient';
import { X, Sparkles, AlertTriangle, ShieldCheck, ListChecks, Loader2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task;
}

const DEPARTMENTS: Department[] = [
  'Safety',
  'Civil',
  'Legal',
  'Academic',
  'HR',
  'Marketing',
  'Operations',
  'Finance',
  'Procurement',
];

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'safety_critical', label: 'Safety Critical', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { value: 'high', label: 'High Priority', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'low', label: 'Low', color: 'bg-slate-100 text-slate-800 border-slate-300' },
];

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { currentUser, staffList, addTask, updateTask, brand, campus } = useToddlerHQ();

  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [department, setDepartment] = useState<Department>(taskToEdit?.department || 'Safety');
  const [priority, setPriority] = useState<Priority>(taskToEdit?.priority || 'high');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [assignedToId, setAssignedToId] = useState<string>(
    taskToEdit?.assigned_to_id || currentUser.id
  );
  const [requiresProof, setRequiresProof] = useState<boolean>(
    taskToEdit ? taskToEdit.requires_proof : priority === 'safety_critical'
  );
  const [sopSteps, setSopSteps] = useState<string[]>(taskToEdit?.sop_steps || []);
  const [isGeneratingSop, setIsGeneratingSop] = useState(false);
  const [sopError, setSopError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateSop = async () => {
    if (!title.trim()) {
      setSopError('Please enter a task title first before generating SOP steps.');
      return;
    }
    setSopError(null);
    setIsGeneratingSop(true);

    try {
      const steps = await callGeminiCopilot('task_sop_breakdown', {
        title,
        department,
        brandName: brand.name,
      });

      if (Array.isArray(steps) && steps.length > 0) {
        setSopSteps(steps);
      } else {
        setSopSteps([
          'Step 1: Conduct initial site inspection and benchmark against preschool safety standards',
          'Step 2: Collect vendor specification sheets and verify non-toxic credentials',
          'Step 3: Supervise installation adhering to early-years ergonomic guidelines',
          'Step 4: Take clear photographic proof of finished work and test load integrity',
          'Step 5: Submit for Center Head and Managing Trustee verification sign-off',
        ]);
      }
    } catch (e: any) {
      console.error(e);
      setSopError(e.message || 'Failed to generate SOP with Gemini.');
    } finally {
      setIsGeneratingSop(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        department,
        priority,
        description,
        assigned_to_id: assignedToId,
        requires_proof: requiresProof,
        sop_steps: sopSteps,
      });
    } else {
      addTask({
        campus_id: campus.id,
        title,
        department,
        priority,
        description,
        created_by_id: currentUser.id,
        assigned_to_id: assignedToId,
        status: 'todo',
        requires_proof: requiresProof,
        sop_steps: sopSteps,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {taskToEdit ? 'Edit Milestone / Task' : 'Create Operational Milestone Task'}
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic task assignment with strict Downstairs Hierarchy delegation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Task / Milestone Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Install 25mm Anti-Microbial EVA Foam Flooring in Toddler Gym"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Department & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => {
                  const p = e.target.value as Priority;
                  setPriority(p);
                  if (p === 'safety_critical') setRequiresProof(true);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Downstairs Assignee Select */}
          <AssigneeSelect
            currentUser={currentUser}
            campusStaff={staffList}
            selectedAssigneeId={assignedToId}
            onSelect={(id) => setAssignedToId(id)}
          />

          {/* Requires Proof Toggle */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Mandatory Photographic / Document Proof of Completion</span>
              </div>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                If enabled, task executor cannot advance status to &quot;Under Review&quot; without attaching photographic evidence (e.g. fire NOC receipt, installed foam floor drop-test).
              </p>
            </div>
            <input
              type="checkbox"
              id="requires_proof"
              checked={requiresProof}
              onChange={(e) => setRequiresProof(e.target.checked)}
              className="mt-1 w-4 h-4 text-amber-600 rounded-md border-amber-300 focus:ring-amber-500 cursor-pointer"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Detailed Scope &amp; Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Outline specific dimensions, safety thresholds, and installation protocols..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Gemini SOP Step Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <ListChecks className="w-4 h-4 text-slate-500" />
                SOP Action Checklist Steps ({sopSteps.length})
              </span>
              <button
                type="button"
                onClick={handleGenerateSop}
                disabled={isGeneratingSop}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/80 hover:bg-amber-200/80 px-2.5 py-1.5 rounded-lg border border-amber-300 transition-colors disabled:opacity-50"
              >
                {isGeneratingSop ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deconstructing SOP...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Deconstruct SOP with Gemini</span>
                  </>
                )}
              </button>
            </div>

            {sopError && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {sopError}
              </p>
            )}

            {sopSteps.length > 0 && (
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {sopSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors"
            >
              {taskToEdit ? 'Save Changes' : 'Create & Delegate Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

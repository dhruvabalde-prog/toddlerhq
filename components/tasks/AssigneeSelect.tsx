'use client';

import React from 'react';
import { StaffUser } from '@/types/toddlerhq';
import { getDelegableStaffGroups, ROLE_LABELS } from '@/lib/hierarchy';
import { ShieldCheck, UserCheck, Users } from 'lucide-react';

interface AssigneeSelectProps {
  currentUser: StaffUser;
  campusStaff: StaffUser[];
  selectedAssigneeId: string;
  onSelect: (assigneeId: string) => void;
  className?: string;
}

export const AssigneeSelect: React.FC<AssigneeSelectProps> = ({
  currentUser,
  campusStaff,
  selectedAssigneeId,
  onSelect,
  className = '',
}) => {
  const { myself, directSubordinates, secondarySubordinates } = getDelegableStaffGroups(
    currentUser,
    campusStaff
  );

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
        Downstairs Hierarchy Assignee
      </label>
      <div className="relative">
        <select
          value={selectedAssigneeId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          {/* Myself */}
          <optgroup label="👤 Self Assignment">
            {myself.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name} ({ROLE_LABELS[user.role]} - You)
              </option>
            ))}
          </optgroup>

          {/* Direct Subordinates */}
          {directSubordinates.length > 0 && (
            <optgroup label="⬇️ My Direct Subordinates (Reports Directly to You)">
              {directSubordinates.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} — {ROLE_LABELS[user.role]} ({user.department || 'Operations'})
                </option>
              ))}
            </optgroup>
          )}

          {/* Secondary Subordinates */}
          {secondarySubordinates.length > 0 && (
            <optgroup label="⏬ Secondary Campus Staff (Lower Hierarchy Tier)">
              {secondarySubordinates.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name} — {ROLE_LABELS[user.role]}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Strict Downstairs Rule: As <strong>{currentUser.designation}</strong>, you can only delegate downward in the operational tree.
      </p>
    </div>
  );
};

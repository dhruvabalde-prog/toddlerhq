'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { ROLE_LABELS } from '@/lib/hierarchy';
import { StaffRole } from '@/types/toddlerhq';
import {
  Wrench,
  GraduationCap,
  Sparkles,
  Users,
  Building2,
  MapPin,
  HardDrive,
  X,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenCopilot: (tab?: string) => void;
  onOpenWorkspace: () => void;
  onOpenLocation: () => void;
  onOpenBrands: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenCopilot,
  onOpenWorkspace,
  onOpenLocation,
  onOpenBrands,
}) => {
  const {
    mode,
    toggleMode,
    currentUser,
    setCurrentUserRole,
    staffList,
    brand,
    campus,
  } = useToddlerHQ();

  const [isRoleSheetOpen, setIsRoleSheetOpen] = useState(false);

  const roles: StaffRole[] = [
    'founder',
    'center_head',
    'academic_lead',
    'educator',
    'admissions_counselor',
    'support_staff',
  ];

  return (
    <>
      {/* Fixed Mobile Bottom Thumb Bar (Only on mobile/small screens) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl md:hidden pb-safe">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* 1. Mode Toggle */}
          <button
            onClick={toggleMode}
            className="flex flex-col items-center justify-center py-1 text-slate-700 active:scale-95 transition-transform"
            title="Toggle Setup vs Operations Mode"
          >
            <div
              className={`w-9 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                mode === 'setup'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {mode === 'setup' ? (
                <Wrench className="w-4 h-4" />
              ) : (
                <GraduationCap className="w-4 h-4" />
              )}
            </div>
            <span className="text-[10px] font-extrabold mt-1 text-slate-800 uppercase">
              {mode === 'setup' ? 'Setup' : 'Ops'}
            </span>
          </button>

          {/* 2. Top 25 Brands */}
          <button
            onClick={onOpenBrands}
            className="flex flex-col items-center justify-center py-1 text-slate-700 active:scale-95 transition-transform"
          >
            <div
              className="w-9 h-7 rounded-xl flex items-center justify-center text-[11px] font-black text-white shadow-2xs"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.id === 'independent' ? 'IND' : brand.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-[10px] font-bold mt-1 text-slate-800 truncate max-w-[55px]">
              Brands
            </span>
          </button>

          {/* 3. Center Copilot AI Action Trigger */}
          <button
            onClick={() => onOpenCopilot()}
            className="flex flex-col items-center justify-center py-1 -mt-4 active:scale-90 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg flex items-center justify-center ring-4 ring-white">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-black mt-1 text-amber-700">Copilot</span>
          </button>

          {/* 4. Google Workspace Ecosystem */}
          <button
            onClick={onOpenWorkspace}
            className="flex flex-col items-center justify-center py-1 text-slate-700 active:scale-95 transition-transform"
          >
            <div className="w-9 h-7 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <HardDrive className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold mt-1 text-slate-800">Workspace</span>
          </button>

          {/* 5. Role Switcher */}
          <button
            onClick={() => setIsRoleSheetOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-slate-700 active:scale-95 transition-transform"
          >
            <div className="w-9 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.full_name.charAt(0)}
            </div>
            <span className="text-[10px] font-bold mt-1 text-slate-800 truncate max-w-[55px]">
              {currentUser.role.split('_')[0]}
            </span>
          </button>
        </div>
      </nav>

      {/* Role Switcher Mobile Bottom Sheet */}
      {isRoleSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-3xl shadow-2xl border-t border-slate-200 p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Switch Logged-in Staff Role
                </h3>
                <p className="text-xs text-slate-500">
                  Instantly renders role-tailored view for {campus.campus_name}.
                </p>
              </div>
              <button
                onClick={() => setIsRoleSheetOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {roles.map((r) => {
                const isCurrent = currentUser.role === r;
                const staffMember = staffList.find((s) => s.role === r);

                return (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentUserRole(r);
                      setIsRoleSheetOpen(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between border transition-all ${
                      isCurrent
                        ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 active:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-900 block">
                        {ROLE_LABELS[r]}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {staffMember?.full_name} ({staffMember?.department || 'Operations'})
                      </span>
                    </div>

                    {isCurrent && (
                      <span className="p-1 rounded-full bg-amber-500 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
  HardDrive,
  X,
  Check,
  Table,
  MessageCircle,
  LogOut,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenCopilot: (tab?: string) => void;
  onOpenWorkspace: () => void;
  onOpenLocation: () => void;
  onOpenBrands: () => void;
  onOpenSetupWizard?: () => void;
  onOpenWorkspaceHub?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenCopilot,
  onOpenWorkspace,
  onOpenLocation,
  onOpenBrands,
  onOpenSetupWizard,
  onOpenWorkspaceHub,
}) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUserRole,
    staffList,
    brand,
    campus,
    disconnectGoogle,
  } = useToddlerHQ();

  const [isRoleSheetOpen, setIsRoleSheetOpen] = useState(false);

  const roles: StaffRole[] = [
    'founder',
    'franchise_hq',
    'center_head',
    'academic_lead',
    'educator',
    'didi',
    'admissions_counselor',
    'accountant',
    'mentor',
    'parent',
  ];

  return (
    <>
      {/* Fixed Mobile Bottom Thumb Bar (Only on mobile/small screens) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl md:hidden pb-safe">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* 1. Founder Setup / Input Tab */}
          <button
            onClick={() => setActiveTab('onboarding')}
            className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-95 ${
              activeTab === 'onboarding' ? 'text-indigo-600' : 'text-slate-600'
            }`}
          >
            <div
              className={`w-9 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                activeTab === 'onboarding'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              ⚙️
            </div>
            <span className="text-[10px] font-extrabold mt-1 uppercase">Setup</span>
          </button>

          {/* 2. School Management Tab */}
          <button
            onClick={() => setActiveTab('management')}
            className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-95 ${
              activeTab === 'management' ? 'text-indigo-600' : 'text-slate-600'
            }`}
          >
            <div
              className={`w-9 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                activeTab === 'management'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              🏫
            </div>
            <span className="text-[10px] font-bold mt-1">School</span>
          </button>

          {/* 3. Center Copilot AI Action Trigger */}
          <button
            onClick={() => onOpenCopilot()}
            className="flex flex-col items-center justify-center py-1 -mt-4 active:scale-90 transition-transform cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg flex items-center justify-center ring-4 ring-white">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-black mt-1 text-amber-700">Copilot</span>
          </button>

          {/* 4. Stakeholder WhatsApp CRM Tab */}
          <button
            onClick={() => setActiveTab('stakeholders')}
            className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-95 ${
              activeTab === 'stakeholders' ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            <div
              className={`w-9 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                activeTab === 'stakeholders'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[10px] font-bold mt-1 text-slate-800">WhatsApp</span>
          </button>

          {/* 5. Role Switcher & Menu */}
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

            {/* Quick Links to Other Tabs */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
              <button
                onClick={() => {
                  setActiveTab('setup_running');
                  setIsRoleSheetOpen(false);
                }}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 flex items-center gap-2"
              >
                <span>🏗️</span>
                <span>Setup vs Running</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('data_hub');
                  setIsRoleSheetOpen(false);
                }}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 flex items-center gap-2"
              >
                <span>📊</span>
                <span>Data Hub &amp; Sheets</span>
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
                        {staffMember?.full_name || `${r.toUpperCase()} Profile`}
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

            {/* Disconnect Google Action in Bottom Sheet */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  disconnectGoogle();
                  setIsRoleSheetOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Google Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

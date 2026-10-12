'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { ROLE_LABELS } from '@/lib/hierarchy';
import { StaffRole } from '@/types/toddlerhq';
import {
  Wrench,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Building2,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { BrandSelectorModal } from '@/components/modals/BrandSelectorModal';

interface NavbarProps {
  onOpenCopilot: (tab?: string) => void;
  onOpenWorkspace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot, onOpenWorkspace }) => {
  const {
    campus,
    brand,
    setBrand,
    mode,
    toggleMode,
    currentUser,
    setCurrentUserRole,
    staffList,
    contactsSyncCount,
    googleConnected,
  } = useToddlerHQ();

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand & Campus Identity */}
            <div className="flex items-center gap-3">
              {/* Logo / Brand Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shrink-0 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: brand.primaryColor }}
                onClick={() => setIsBrandModalOpen(true)}
                title="Click to change brand"
              >
                {brand.id === 'independent' ? 'THQ' : brand.name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base tracking-tight truncate max-w-[200px] sm:max-w-[260px]">
                    {campus.campus_name}
                  </span>
                  {/* Brand Selector Button */}
                  <button
                    onClick={() => setIsBrandModalOpen(true)}
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                  >
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>Top 25 Brands</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-600 truncate max-w-[180px]">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {campus.locality}, {campus.city} ({campus.pincode})
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Persistent Dual Operational Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <button
                onClick={() => toggleMode()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'setup'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Setup Mode: Fit-out, civil, safety netting, licensing, toy procurement"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Setup Mode</span>
              </button>

              <button
                onClick={() => toggleMode()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'operations'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Operations Mode: Student check-in, care logs, nap timer, lead CRM"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Operations Mode</span>
              </button>
            </div>

            {/* Right: Google Workspace Pill, Role Switcher, Copilot Button */}
            <div className="flex items-center gap-2.5">
              {/* Google Workspace Native Integration Pill */}
              <button
                onClick={onOpenWorkspace}
                className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
                title="Google Workspace connected: Gmail, Google Chat Spaces, Contacts sync, Drive compliance"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800">Google Workspace</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded-md">
                  {contactsSyncCount} synced
                </span>
              </button>

              {/* Gemini Copilot Button */}
              <button
                onClick={() => onOpenCopilot()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-sm hover:opacity-95 transition-transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gemini Copilot</span>
              </button>

              {/* Dynamic Role Switcher Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                    {currentUser.full_name.slice(0, 1)}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.full_name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-amber-700 font-semibold leading-tight capitalize">
                      {ROLE_LABELS[currentUser.role].split('/')[0].trim()}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Role Switcher Popover */}
                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">Switch Logged-in View</p>
                      <p className="text-[11px] text-slate-500">
                        Experience the role-tailored interface designed for each preschool staff tier.
                      </p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      {roles.map((r) => {
                        const isCurrent = currentUser.role === r;
                        const staffMember = staffList.find((s) => s.role === r);

                        return (
                          <button
                            key={r}
                            onClick={() => {
                              setCurrentUserRole(r);
                              setIsRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'bg-amber-50 text-amber-900 font-bold'
                                : 'text-slate-700 hover:bg-slate-50 font-medium'
                            }`}
                          >
                            <div>
                              <p className="font-semibold text-slate-900">
                                {ROLE_LABELS[r]}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {staffMember ? staffMember.full_name : 'Staff Member'}
                              </p>
                            </div>
                            {isCurrent && (
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Brand Selector Modal */}
      <BrandSelectorModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        currentBrandId={brand.id}
        onSelectBrand={(id) => setBrand(id)}
      />
    </>
  );
};

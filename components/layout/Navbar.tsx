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
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { BrandSelectorModal } from '@/components/modals/BrandSelectorModal';

interface NavbarProps {
  onOpenCopilot: (tab?: string) => void;
  onOpenWorkspace: () => void;
  onOpenLocation?: () => void;
  onOpenBrands?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCopilot,
  onOpenWorkspace,
  onOpenLocation,
  onOpenBrands,
}) => {
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

  const handleOpenBrandModal = () => {
    if (onOpenBrands) onOpenBrands();
    else setIsBrandModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Left: Brand Identity & Location Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                onClick={handleOpenBrandModal}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md shrink-0 transition-transform active:scale-95 hover:opacity-90"
                style={{ backgroundColor: brand.primaryColor }}
                title="Change Preschool Brand Preset"
              >
                {brand.id === 'independent' ? 'THQ' : brand.name.slice(0, 2).toUpperCase()}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate max-w-[130px] sm:max-w-[240px] md:max-w-xs">
                    {campus.campus_name}
                  </span>
                  <button
                    onClick={handleOpenBrandModal}
                    className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg border border-slate-200 transition-colors shrink-0"
                  >
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>Top 25 Brands</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <button
                    onClick={onOpenLocation}
                    className="flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 truncate max-w-[140px] sm:max-w-[200px]"
                  >
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="truncate">{campus.locality}, {campus.city}</span>
                  </button>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  {/* Zero-Connection Dropout State Indicator */}
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Zero Dropout Live
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Persistent Dual Operational Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner shrink-0">
              <button
                onClick={() => toggleMode()}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  mode === 'setup'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Setup Mode: Fit-out, civil, childproofing, licensing, toy procurement"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Setup</span>
              </button>

              <button
                onClick={() => toggleMode()}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  mode === 'operations'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Operations Mode: Care logs, nap timer, attendance, lead CRM"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Operations</span>
              </button>
            </div>

            {/* Right: Workspace, Copilot, Role Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Google Workspace Pill (Desktop) */}
              <button
                onClick={onOpenWorkspace}
                className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
                title="Google Workspace: Contacts, Chat, Gmail, Drive"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800">Workspace</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-black px-1.5 py-0.2 rounded-md">
                  {contactsSyncCount} synced
                </span>
              </button>

              {/* Gemini Copilot Trigger */}
              <button
                onClick={() => onOpenCopilot()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-sm hover:opacity-95 transition-transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini Copilot</span>
              </button>

              {/* Dynamic Role Switcher Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-2 py-1 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-2xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase overflow-hidden">
                    {currentUser.full_name.slice(0, 1)}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-extrabold text-slate-900 leading-tight">
                      {currentUser.full_name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-amber-700 font-bold leading-tight capitalize">
                      {ROLE_LABELS[currentUser.role].split('/')[0].trim()}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Role Switcher Popover */}
                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-extrabold text-slate-900">Switch Logged-in View</p>
                      <p className="text-[11px] text-slate-500">
                        Tailored interfaces with Downstairs delegation authority.
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
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'bg-amber-50 text-amber-900 font-bold'
                                : 'text-slate-700 hover:bg-slate-50 font-medium'
                            }`}
                          >
                            <div>
                              <p className="font-bold text-slate-900">
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

'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { ROLE_LABELS } from '@/lib/hierarchy';
import { StaffRole, AppNavTab } from '@/types/toddlerhq';
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
  Users,
  Layers,
  FileSpreadsheet,
  LogOut,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { BrandSelectorModal } from '@/components/modals/BrandSelectorModal';

interface NavbarProps {
  onOpenCopilot: (tab?: string) => void;
  onOpenWorkspace: () => void;
  onOpenLocation?: () => void;
  onOpenBrands?: () => void;
  onOpenSetupWizard?: () => void;
  onOpenWorkspaceHub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCopilot,
  onOpenWorkspace,
  onOpenLocation,
  onOpenBrands,
  onOpenSetupWizard,
  onOpenWorkspaceHub,
}) => {
  const {
    campus,
    brand,
    currentUser,
    setCurrentUserRole,
    staffList,
    googleAuth,
    disconnectGoogle,
    contactsSyncCount,
    setIsContactsDiagnosticOpen,
    activeTab,
    setActiveTab,
  } = useToddlerHQ();

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isDisconnectConfirmOpen, setIsDisconnectConfirmOpen] = useState(false);

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

  const handleOpenBrandModal = () => {
    if (onOpenBrands) onOpenBrands();
    else setIsBrandModalOpen(true);
  };

  const navTabs: { id: AppNavTab; label: string; icon: string }[] = [
    { id: 'onboarding', label: '1. Founder Setup', icon: '⚙️' },
    { id: 'management', label: '2. Managing School', icon: '🏫' },
    { id: 'setup_running', label: '3. Setup vs Running', icon: '🏗️' },
    { id: 'stakeholders', label: '4. People & WhatsApp', icon: '👥' },
    { id: 'data_hub', label: '5. Data Hub & Sheets', icon: '📊' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Main Top Row */}
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Left: Brand Identity & Location Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                onClick={handleOpenBrandModal}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md shrink-0 transition-transform active:scale-95 hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: brand.primaryColor }}
                title="Change Preschool Brand Preset"
              >
                {brand.id === 'independent' ? 'THQ' : brand.name.slice(0, 2).toUpperCase()}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate max-w-[130px] sm:max-w-[220px] md:max-w-xs">
                    {campus.campus_name}
                  </span>
                  <button
                    onClick={handleOpenBrandModal}
                    className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg border border-slate-200 transition-colors shrink-0 cursor-pointer"
                  >
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>25 Brands</span>
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
                </div>
              </div>
            </div>

            {/* Middle: Google Workspace Persistent Connected Badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[11px]">
                <span className="text-indigo-950 font-bold truncate max-w-[140px] inline-block align-bottom">
                  Google: {googleAuth.email.split('@')[0]}
                </span>
                <span className="text-indigo-600 font-semibold ml-1">
                  ({contactsSyncCount} contacts)
                </span>
              </div>
              <button
                onClick={() => setIsContactsDiagnosticOpen(true)}
                className="text-[10px] font-extrabold text-orange-700 hover:text-orange-900 underline ml-1 cursor-pointer"
                title="Troubleshoot Google Contacts Sync"
              >
                Diagnostic
              </button>
              <button
                onClick={() => setIsDisconnectConfirmOpen(true)}
                className="text-[10px] text-slate-400 hover:text-rose-600 ml-1 p-1"
                title="Disconnect Google Account"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>

            {/* Right: Actions (Setup & Team, Google OS, Copilot, Role Switcher) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Setup & Team Wizard Trigger */}
              <button
                type="button"
                onClick={onOpenSetupWizard}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Launch Campus Onboarding & Team Builder"
              >
                <span>⚙️ Setup &amp; Team</span>
              </button>

              {/* Google Workspace Native Hub Trigger */}
              <button
                type="button"
                onClick={onOpenWorkspaceHub || onOpenWorkspace}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Open 23 Google Native Sheets, Docs, and Forms"
              >
                <span className="text-emerald-400">📊</span>
                <span className="hidden sm:inline">Google OS</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">23</span>
              </button>

              {/* Gemini Copilot Trigger */}
              <button
                onClick={() => onOpenCopilot()}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/10 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Copilot</span>
              </button>

              {/* Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <span className="hidden md:inline truncate max-w-[90px]">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Role Preview
                      </div>
                      <div className="text-xs font-black text-slate-800">
                        {currentUser.full_name}
                      </div>
                    </div>

                    <div className="py-1 max-h-64 overflow-y-auto">
                      {roles.map((r) => {
                        const isSelected = currentUser.role === r;
                        return (
                          <button
                            key={r}
                            onClick={() => {
                              setCurrentUserRole(r);
                              setIsRoleDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-amber-50 text-amber-900 font-black'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{ROLE_LABELS[r]}</span>
                            {isSelected && <span className="text-amber-600 text-xs font-bold">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub-Bar: The 5 Primary App Navigation Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar text-xs">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs scale-102'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Disconnect Google Safety Confirmation Modal */}
      {isDisconnectConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Disconnect Google Workspace?</h3>
              <p className="text-xs text-slate-500">
                Disconnecting will lock the interface behind the Google Gateway screen until you sign in again. All your local preschool data remains saved.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsDisconnectConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  disconnectGoogle();
                  setIsDisconnectConfirmOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Yes, Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Selector Modal */}
      <BrandSelectorModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
      />
    </>
  );
};

'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { FounderView } from '@/components/views/FounderView';
import { PrincipalView } from '@/components/views/PrincipalView';
import { EducatorView } from '@/components/views/EducatorView';
import { AdmissionsView } from '@/components/views/AdmissionsView';
import { CopilotModal } from '@/components/copilot/CopilotModal';
import { WorkspaceDrawer } from '@/components/google/WorkspaceDrawer';
import { LocationSetupModal } from '@/components/modals/LocationSetupModal';
import { BrandSelectorModal } from '@/components/modals/BrandSelectorModal';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import {
  Wrench,
  GraduationCap,
  Sparkles,
  MapPin,
  ShieldCheck,
  CheckCircle,
  RotateCcw,
  Building,
  Info,
} from 'lucide-react';

export default function ToddlerHQPage() {
  const {
    campus,
    brand,
    mode,
    toggleMode,
    currentUser,
    tasks,
    students,
    resetToFactoryDefaults,
  } = useToddlerHQ();

  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotTab, setCopilotTab] = useState('parent_reply');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const handleOpenCopilot = (tab = 'parent_reply') => {
    setCopilotTab(tab);
    setIsCopilotOpen(true);
  };

  // Metrics for the persistent mode bar
  const completedSetupTasks = tasks.filter(
    (t) => t.status === 'completed' || t.status === 'verified'
  ).length;
  const admittedStudents = students.filter((s) => s.status === 'admitted').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Persistent Header */}
      <Navbar
        onOpenCopilot={handleOpenCopilot}
        onOpenWorkspace={() => setIsWorkspaceOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenBrands={() => setIsBrandModalOpen(true)}
      />

      {/* Mode & Location Context Sub-bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            {/* Mode Banner Indicator */}
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-2 ${
                  mode === 'setup'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                {mode === 'setup' ? (
                  <>
                    <Wrench className="w-3.5 h-3.5 text-amber-700" />
                    <span>Active: Setup Mode (Pre-Launch &amp; Civil Fit-out)</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Active: Operations Mode (Live School &amp; Daily Care Hub)</span>
                  </>
                )}
              </div>

              <span className="hidden lg:inline text-slate-500 font-medium">
                {mode === 'setup'
                  ? `Completed ${completedSetupTasks} of ${tasks.length} pre-launch milestones.`
                  : `${admittedStudents} enrolled students • Attendance &amp; Nap Logs live.`}
              </span>
            </div>

            {/* Location & Brand Preset Indicator */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors"
                title="Open Location-Aware Context Engine"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>
                  {campus.locality}, {campus.city}
                </span>
                <span className="text-[10px] text-slate-400">({campus.pincode})</span>
              </button>

              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="text-[11px] font-bold text-rose-700 hover:text-rose-900"
              >
                Local Vendors &amp; Hiring &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Renders the Role-Tailored Dynamic UI */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        {currentUser.role === 'founder' && (
          <FounderView onOpenCopilot={handleOpenCopilot} />
        )}

        {(currentUser.role === 'center_head' || currentUser.role === 'academic_lead') && (
          <PrincipalView onOpenCopilot={handleOpenCopilot} />
        )}

        {(currentUser.role === 'educator' || currentUser.role === 'support_staff') && (
          <EducatorView onOpenCopilot={handleOpenCopilot} />
        )}

        {currentUser.role === 'admissions_counselor' && (
          <AdmissionsView onOpenCopilot={handleOpenCopilot} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">ToddlerHQ OS</span>
            <span>•</span>
            <span>Deterministic Preschool &amp; Franchise Operations Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenCopilot()}
              className="font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Copilot</span>
            </button>

            <button
              onClick={() => setIsWorkspaceOpen(true)}
              className="font-bold text-indigo-600 hover:text-indigo-800"
            >
              Google Workspace Sync
            </button>

            <button
              onClick={resetToFactoryDefaults}
              className="text-slate-400 hover:text-slate-600 flex items-center gap-1"
              title="Reset state to initial seed data"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile-First Sticky Bottom Thumb Dock */}
      <MobileBottomNav
        onOpenCopilot={handleOpenCopilot}
        onOpenWorkspace={() => setIsWorkspaceOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenBrands={() => setIsBrandModalOpen(true)}
      />

      {/* Global Modals & Drawers */}
      <CopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        initialTab={copilotTab}
      />

      <WorkspaceDrawer
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
      />

      <LocationSetupModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <BrandSelectorModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
      />
    </div>
  );
}

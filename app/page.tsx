'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { GoogleGatewayScreen } from '@/components/google/GoogleGatewayScreen';
import { ContactsDiagnosticModal } from '@/components/google/ContactsDiagnosticModal';
import { FounderOnboardingTab } from '@/components/tabs/FounderOnboardingTab';
import { SchoolManagementTab } from '@/components/tabs/SchoolManagementTab';
import { SetupVsRunningTab } from '@/components/tabs/SetupVsRunningTab';
import { StakeholdersTab } from '@/components/tabs/StakeholdersTab';
import { DataHubTab } from '@/components/tabs/DataHubTab';
import { FounderView } from '@/components/views/FounderView';
import { PrincipalView } from '@/components/views/PrincipalView';
import { EducatorView } from '@/components/views/EducatorView';
import { AdmissionsView } from '@/components/views/AdmissionsView';
import { MentorView } from '@/components/views/MentorView';
import { AccountantView } from '@/components/views/AccountantView';
import { DidiSupportView } from '@/components/views/DidiSupportView';
import { CampusSetupWizard } from '@/components/setup/CampusSetupWizard';
import { GoogleWorkspaceHub } from '@/components/google/GoogleWorkspaceHub';
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
  Layers,
  Table,
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
    googleAuth,
    isContactsDiagnosticOpen,
    setIsContactsDiagnosticOpen,
    activeTab,
    setActiveTab,
    resetToFactoryDefaults,
  } = useToddlerHQ();

  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotTab, setCopilotTab] = useState('parent_reply');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);
  const [isWorkspaceHubOpen, setIsWorkspaceHubOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tabs' | 'role_dashboard'>('tabs');

  const handleOpenCopilot = (tab = 'parent_reply') => {
    setCopilotTab(tab);
    setIsCopilotOpen(true);
  };

  // 1. Google Native Gatekeeper Check
  // If not connected to Google Workspace, show the full gateway screen!
  if (!googleAuth.connected) {
    return <GoogleGatewayScreen />;
  }

  // Metrics for the sub-bar
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
        onOpenSetupWizard={() => setIsSetupWizardOpen(true)}
        onOpenWorkspaceHub={() => setIsWorkspaceHubOpen(true)}
      />

      {/* Mode & Location Context Sub-bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
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
                    <span>Mode: Setup (Pre-Launch &amp; Civil Fit-out)</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Mode: Live School &amp; Daily Operations</span>
                  </>
                )}
              </div>

              <span className="hidden lg:inline text-slate-500 font-medium">
                {mode === 'setup'
                  ? `Completed ${completedSetupTasks} of ${tasks.length} pre-launch milestones.`
                  : `${admittedStudents} enrolled toddlers • Attendance &amp; nap logs active.`}
              </span>
            </div>

            {/* Quick View Mode Toggle & Location */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => setViewMode(viewMode === 'tabs' ? 'role_dashboard' : 'tabs')}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 flex items-center gap-1.5 transition-colors"
                title="Toggle between 5 Core Tabs and Role-Tailored View"
              >
                {viewMode === 'tabs' ? (
                  <>
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>View: 5 Main Tabs</span>
                  </>
                ) : (
                  <>
                    <Table className="w-3.5 h-3.5 text-amber-600" />
                    <span>View: {currentUser.role.replace('_', ' ').toUpperCase()} Dashboard</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>
                  {campus.locality}, {campus.city}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        {/* If in Tabs mode, render the selected primary tab */}
        {viewMode === 'tabs' && (
          <>
            {activeTab === 'onboarding' && <FounderOnboardingTab />}
            {activeTab === 'management' && (
              <SchoolManagementTab onOpenCopilot={handleOpenCopilot} />
            )}
            {activeTab === 'setup_running' && (
              <SetupVsRunningTab onOpenCopilot={handleOpenCopilot} />
            )}
            {activeTab === 'stakeholders' && (
              <StakeholdersTab onOpenCopilot={handleOpenCopilot} />
            )}
            {activeTab === 'data_hub' && (
              <DataHubTab onOpenCopilot={handleOpenCopilot} />
            )}
          </>
        )}

        {/* If in Role Dashboard mode, render the persona-tailored UI */}
        {viewMode === 'role_dashboard' && (
          <>
            {currentUser.role === 'founder' && (
              <FounderView onOpenCopilot={handleOpenCopilot} />
            )}

            {(currentUser.role === 'mentor' || currentUser.role === 'franchise_hq') && (
              <MentorView onOpenCopilot={handleOpenCopilot} />
            )}

            {(currentUser.role === 'center_head' || currentUser.role === 'academic_lead') && (
              <PrincipalView onOpenCopilot={handleOpenCopilot} />
            )}

            {currentUser.role === 'educator' && (
              <EducatorView onOpenCopilot={handleOpenCopilot} />
            )}

            {(currentUser.role === 'admissions_counselor' || currentUser.role === 'parent') && (
              <AdmissionsView onOpenCopilot={handleOpenCopilot} />
            )}

            {currentUser.role === 'accountant' && (
              <AccountantView onOpenCopilot={handleOpenCopilot} />
            )}

            {(currentUser.role === 'didi' || currentUser.role === 'support_staff') && (
              <DidiSupportView onOpenCopilot={handleOpenCopilot} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">ToddlerHQ OS</span>
            <span>•</span>
            <span>Preschool &amp; Franchise Management Platform for India</span>
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
              onClick={() => setIsWorkspaceHubOpen(true)}
              className="font-bold text-emerald-600 hover:text-emerald-800"
            >
              Google Workspace OS (23)
            </button>

            <button
              onClick={() => setIsSetupWizardOpen(true)}
              className="font-bold text-indigo-600 hover:text-indigo-800"
            >
              Campus Setup &amp; Team
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
        onOpenSetupWizard={() => setIsSetupWizardOpen(true)}
        onOpenWorkspaceHub={() => setIsWorkspaceHubOpen(true)}
      />

      {/* Global Modals & Drawers */}
      <ContactsDiagnosticModal
        isOpen={isContactsDiagnosticOpen}
        onClose={() => setIsContactsDiagnosticOpen(false)}
      />

      <CopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        initialTab={copilotTab}
      />

      <WorkspaceDrawer
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
      />

      <GoogleWorkspaceHub
        isOpen={isWorkspaceHubOpen}
        onClose={() => setIsWorkspaceHubOpen(false)}
      />

      <CampusSetupWizard
        isOpen={isSetupWizardOpen}
        onClose={() => setIsSetupWizardOpen(false)}
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

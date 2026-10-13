'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Video,
  FileSpreadsheet,
  FileText,
  Calendar,
  Sparkles,
  Layers,
  Search,
} from 'lucide-react';

interface MentorViewProps {
  onOpenCopilot?: (tab?: string) => void;
}

export const MentorView: React.FC<MentorViewProps> = ({ onOpenCopilot }) => {
  const { campus, brand, googleNativeAssets, staffList, tasks } = useToddlerHQ();

  const [auditScores, setAuditScores] = useState({
    childSafetyRatio: 98,
    curriculumFidelity: 92,
    brandSignage: 100,
    hygieneProtocols: 95,
  });

  const [auditChecklist, setAuditChecklist] = useState([
    {
      id: 'chk-1',
      title: '25mm EVA Foam Flooring EN71 Safety Certification in Place',
      category: 'Childproofing',
      status: 'passed',
      reviewerNote: 'All playroom corners covered with non-toxic beveled border mats.',
    },
    {
      id: 'chk-2',
      title: 'Classroom Teacher-to-Toddler Ratio Maintained at 1:6',
      category: 'Staffing',
      status: 'passed',
      reviewerNote: 'Playgroup class currently staffed with 1 Lead Educator + 1 Assistant Didi.',
    },
    {
      id: 'chk-3',
      title: 'Montessori Sensory Apparatus Cleanliness & Weekly Rotation',
      category: 'Academics',
      status: 'passed',
      reviewerNote: 'Sensory water and sand bins sterilized daily.',
    },
    {
      id: 'chk-4',
      title: 'Fire NOC Hydro-Test Verification & Emergency Evacuation Route Map',
      category: 'Statutory Safety',
      status: 'in_review',
      reviewerNote: 'Awaiting annual municipal fire certificate renewal stamp.',
    },
  ]);

  const toggleChecklistStatus = (id: string) => {
    setAuditChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'passed' ? 'flagged' : 'passed',
            }
          : item
      )
    );
  };

  const mentorAssets = googleNativeAssets.filter(
    (a) =>
      a.recommendedRoles.includes('mentor') ||
      a.recommendedRoles.includes('franchise_hq') ||
      a.department === 'Legal' ||
      a.department === 'Academic'
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-xs">
              Franchise Area Director &amp; Advisory Portal
            </span>
            <span className="text-xs bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded-full">
              Q1 AUDIT ACTIVE
            </span>
          </div>
          <h2 className="text-2xl font-black">
            {campus.campus_name} • Brand Audit
          </h2>
          <p className="text-xs text-amber-100 max-w-xl">
            National Franchise Brand Standards, Child-to-Teacher Ratio Auditing, and Mentorship Consultation for {brand.name}.
          </p>
        </div>

        {/* Schedule Audit Call via Google Meet */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://meet.google.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white text-amber-900 font-bold text-xs flex items-center gap-2 shadow-md hover:bg-amber-50 active:scale-95 transition-all"
          >
            <Video className="w-4 h-4 text-emerald-600" />
            <span>Launch Google Meet Audit Call</span>
          </a>
        </div>
      </div>

      {/* Audit Scorecards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Child Safety Ratio</span>
          <div className="text-2xl font-black text-emerald-600">{auditScores.childSafetyRatio}%</div>
          <p className="text-[10px] text-slate-400">1:6 ratio verified across all 5 classes.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Curriculum Fidelity</span>
          <div className="text-2xl font-black text-indigo-600">{auditScores.curriculumFidelity}%</div>
          <p className="text-[10px] text-slate-400">52-week thematic plan adherence.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Brand Visual Standards</span>
          <div className="text-2xl font-black text-blue-600">{auditScores.brandSignage}%</div>
          <p className="text-[10px] text-slate-400">Signage, uniforms &amp; color palette.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Hygiene &amp; Sanitization</span>
          <div className="text-2xl font-black text-amber-600">{auditScores.hygieneProtocols}%</div>
          <p className="text-[10px] text-slate-400">Hourly ayah restroom cleaning logged.</p>
        </div>
      </div>

      {/* Main Split: Audit Checklist & Google Native Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Franchise Inspection Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Mandatory Franchise Quality Audit Checklist</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tap to mark points as verified or flag them for immediate founder remediation.
                </p>
              </div>

              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                {auditChecklist.filter((c) => c.status === 'passed').length} of {auditChecklist.length} Cleared
              </span>
            </div>

            <div className="space-y-3">
              {auditChecklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.status === 'passed'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        &ldquo;{item.reviewerNote}&rdquo;
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleChecklistStatus(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors ${
                        item.status === 'passed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {item.status === 'passed' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Review Required</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Deep-Linked Google Native Handbooks for Mentors */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Franchise Operating Handbooks</span>
            </h3>
            <p className="text-xs text-slate-500">
              Direct native deep links to official franchise legal charters and academic matrixes.
            </p>

            <div className="space-y-2.5">
              {mentorAssets.map((asset) => (
                <a
                  key={asset.id}
                  href={asset.nativeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all flex items-center justify-between group text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-900 block truncate max-w-[200px]">
                      {asset.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{asset.rowCountOrSections}</span>
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

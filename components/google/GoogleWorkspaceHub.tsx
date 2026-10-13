'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { GoogleNativeAsset, GoogleNativeAssetType, Department } from '@/types/toddlerhq';
import {
  FileSpreadsheet,
  FileText,
  ClipboardList,
  Presentation,
  HardDrive,
  MessageSquare,
  ExternalLink,
  Search,
  X,
  Filter,
  CheckCircle2,
  Clock,
  Building,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface GoogleWorkspaceHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleWorkspaceHub: React.FC<GoogleWorkspaceHubProps> = ({ isOpen, onClose }) => {
  const { googleNativeAssets, campus, brand } = useToddlerHQ();

  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | GoogleNativeAssetType>('all');
  const [activeDeptFilter, setActiveDeptFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredAssets = googleNativeAssets.filter((asset) => {
    const matchesType = activeTypeFilter === 'all' || asset.type === activeTypeFilter;
    const matchesDept = activeDeptFilter === 'all' || asset.department === activeDeptFilter;
    const matchesSearch =
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesDept && matchesSearch;
  });

  const getIconForType = (type: GoogleNativeAssetType) => {
    switch (type) {
      case 'sheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'form':
        return <ClipboardList className="w-5 h-5 text-purple-600" />;
      case 'slide':
        return <Presentation className="w-5 h-5 text-amber-600" />;
      case 'drive_folder':
        return <HardDrive className="w-5 h-5 text-indigo-600" />;
      case 'chat_space':
        return <MessageSquare className="w-5 h-5 text-rose-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBadgeColorForType = (type: GoogleNativeAssetType) => {
    switch (type) {
      case 'sheet':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'doc':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'form':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'slide':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl">
              🌐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Google Workspace Compilation OS
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                  AUTHENTICATED DEEP LINKS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {campus.campus_name} • 8 Sheets, 6 Docs, 5 Forms, 4 Slides ready to open natively.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls: Tool Type Tabs */}
        <div className="border-b border-slate-200 bg-white px-6 pt-3 pb-2 space-y-3">
          {/* Tool Type Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Artifacts (23)' },
              { id: 'sheet', label: 'Google Sheets (8)' },
              { id: 'doc', label: 'Google Docs (6)' },
              { id: 'form', label: 'Google Forms (5)' },
              { id: 'slide', label: 'Google Slides (4)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTypeFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  activeTypeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Department Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                aria-label="Search preschool Google Sheets, Docs, and Forms"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Department Pills */}
            <select
              aria-label="Filter by department"
              value={activeDeptFilter}
              onChange={(e) => setActiveDeptFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="all">All Departments</option>
              <option value="Finance">Finance &amp; Capex</option>
              <option value="Marketing">Marketing &amp; Admissions</option>
              <option value="Academic">Academics &amp; Curriculum</option>
              <option value="Safety">Safety &amp; Childproofing</option>
              <option value="Operations">Operations &amp; Student Care</option>
              <option value="Hygiene_Support">Hygiene &amp; Didi Support</option>
              <option value="Legal">Legal &amp; Franchise Agreement</option>
            </select>
          </div>
        </div>

        {/* Asset Cards List */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-3.5">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                    {getIconForType(asset.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{asset.title}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border uppercase ${getBadgeColorForType(asset.type)}`}>
                        {asset.type.toUpperCase()}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                        {asset.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {asset.description}
                    </p>
                  </div>
                </div>

                {/* Direct Native Link Button */}
                <a
                  href={asset.nativeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95 transition-all"
                >
                  <span>Open in Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Sample Columns or Document Structure Pills */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Pre-Engineered Schema &amp; Sections ({asset.rowCountOrSections})</span>
                  <span>Synced with {brand.name}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {asset.sampleColumnsOrOutline.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredAssets.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              No Google assets match your search or filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

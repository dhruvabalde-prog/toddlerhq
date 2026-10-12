'use client';

import React, { useState } from 'react';
import { PRESCHOOL_BRANDS } from '@/lib/brands';
import { BrandInfo } from '@/types/toddlerhq';
import { Search, X, Check, Sparkles, Building, Award, Shield, Layers } from 'lucide-react';

interface BrandSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrandId: string;
  onSelectBrand: (brandId: string) => void;
}

export const BrandSelectorModal: React.FC<BrandSelectorModalProps> = ({
  isOpen,
  onClose,
  currentBrandId,
  onSelectBrand,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<BrandInfo>(
    PRESCHOOL_BRANDS.find((b) => b.id === currentBrandId) || PRESCHOOL_BRANDS[0]
  );

  if (!isOpen) return null;

  const filteredBrands = PRESCHOOL_BRANDS.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pedagogy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs">TOP 25</span>
              <h2 className="text-xl font-bold text-slate-900">National Preschool Franchise & Brand Selector</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select one of India&apos;s leading preschool franchise networks or configure as an Independent Preschool. Selecting auto-configures pedagogy presets &amp; zones.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Search & Brand List */}
          <div className="w-full md:w-1/2 border-r border-slate-200 flex flex-col h-full bg-white">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search brands (e.g. Maple Bear, Kidzee, EuroKids, Montessori...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredBrands.map((brand, idx) => {
                const isSelected = selectedPreview.id === brand.id;
                const isCurrentActive = currentBrandId === brand.id;

                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedPreview(brand)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-400'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.id === 'independent' ? 'IND' : `${idx + 1}`}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 truncate">
                          {brand.name}
                        </span>
                        {isCurrentActive && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {brand.tagline}
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-medium text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200">
                        {brand.pedagogy.split('(')[0].trim()}
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="w-5 h-5 text-amber-600 shrink-0 self-center" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Brand Preview & Preset Breakdown */}
          <div className="w-full md:w-1/2 flex flex-col h-full bg-slate-50 overflow-y-auto p-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md"
                  style={{ backgroundColor: selectedPreview.primaryColor }}
                >
                  {selectedPreview.id === 'independent' ? 'HQ' : 'FR'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedPreview.name}</h3>
                  <p className="text-xs font-medium text-slate-500">{selectedPreview.tagline}</p>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Award className="w-3.5 h-3.5" /> Ratio: {selectedPreview.studentTeacherRatio} Student-to-Teacher
                  </span>
                </div>
              </div>

              {/* Pedagogy Blueprint */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Official Pedagogy Preset
                </span>
                <p className="text-sm font-semibold text-slate-800 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  {selectedPreview.pedagogy}
                </p>
              </div>

              {/* Recommended Classroom Zones */}
              <div className="mt-5 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" /> Prescribed Classroom Zones
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPreview.zones.map((zone, i) => (
                    <div
                      key={i}
                      className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <span className="truncate">{zone}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Curriculum Focus */}
              <div className="mt-5 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-500" /> Curriculum Pillars
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPreview.curriculumFocus.map((focus, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="mt-5 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" /> Mandatory Safety &amp; Brand Audits
                </span>
                <div className="space-y-1.5">
                  {selectedPreview.complianceRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Brand CTA */}
            <div className="sticky bottom-0 bg-slate-50 pt-2">
              <button
                onClick={() => {
                  onSelectBrand(selectedPreview.id);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
                style={{ backgroundColor: selectedPreview.primaryColor }}
              >
                <Check className="w-4 h-4" />
                Apply {selectedPreview.name} Presets to Campus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

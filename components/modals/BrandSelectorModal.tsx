'use client';

import React, { useState } from 'react';
import { PRESCHOOL_BRANDS } from '@/lib/brands';
import { BrandInfo } from '@/types/toddlerhq';
import { useToddlerHQ } from '@/lib/store';
import { Search, X, Check, Sparkles, Building, Award, Shield, Layers } from 'lucide-react';

interface BrandSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrandId?: string;
  onSelectBrand?: (brandId: string) => void;
}

export const BrandSelectorModal: React.FC<BrandSelectorModalProps> = ({
  isOpen,
  onClose,
  currentBrandId: propBrandId,
  onSelectBrand: propSelectBrand,
}) => {
  const { brand: storeBrand, setBrand: storeSetBrand } = useToddlerHQ();
  const currentBrandId = propBrandId || storeBrand.id;
  const onSelectBrand = propSelectBrand || storeSetBrand;

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Grab bar on mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-2 sm:hidden" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-white font-black text-xs">TOP 25</span>
              <h2 className="text-base sm:text-xl font-black text-slate-900">National Preschool Brand Selector</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select one of India&apos;s leading franchise networks to auto-configure pedagogy presets &amp; zones.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Search & Brand List */}
          <div className="w-full md:w-1/2 border-r border-slate-200 flex flex-col h-1/2 md:h-full bg-white">
            <div className="p-3 sm:p-4 border-b border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Filter Franchises &amp; Pedagogies</span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-[11px] text-amber-700 hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  aria-label="Filter preschool franchises by name or pedagogy"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50 font-medium"
                />
              </div>

              {/* Fast Pedagogy Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {[
                  { label: 'All 26', term: '' },
                  { label: 'Montessori', term: 'Montessori' },
                  { label: 'Play-Way', term: 'Play' },
                  { label: 'Reggio Emilia', term: 'Reggio' },
                  { label: 'Inquiry / IB', term: 'Inquiry' },
                  { label: 'Independent', term: 'Independent' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => setSearchTerm(chip.term)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${
                      searchTerm === chip.term
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
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
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-400'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.id === 'independent' ? 'IND' : `${idx + 1}`}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {brand.name}
                        </span>
                        {isCurrentActive && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.2 rounded-md">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {brand.tagline}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {brand.pedagogy.split('(')[0].trim()}
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-600 shrink-0 self-center" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Brand Preview & Preset Breakdown */}
          <div className="w-full md:w-1/2 flex flex-col h-1/2 md:h-full bg-slate-50 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base text-white shadow-md shrink-0"
                  style={{ backgroundColor: selectedPreview.primaryColor }}
                >
                  {selectedPreview.id === 'independent' ? 'HQ' : 'FR'}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {selectedPreview.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedPreview.tagline}</p>
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Award className="w-3 h-3" /> Ratio: {selectedPreview.studentTeacherRatio} Student-Teacher
                  </span>
                </div>
              </div>

              {/* Pedagogy Blueprint */}
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Official Pedagogy Preset
                </span>
                <p className="text-xs font-semibold text-slate-800 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                  {selectedPreview.pedagogy}
                </p>
              </div>

              {/* Recommended Classroom Zones */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" /> Prescribed Classroom Zones
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedPreview.zones.map((zone, i) => (
                    <div
                      key={i}
                      className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span className="truncate">{zone}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Curriculum Focus */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-blue-500" /> Curriculum Pillars
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedPreview.curriculumFocus.map((focus, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" /> Mandatory Safety &amp; Brand Audits
                </span>
                <div className="space-y-1">
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
            <div className="sticky bottom-0 bg-slate-50 pt-2 pb-safe">
              <button
                onClick={() => {
                  onSelectBrand(selectedPreview.id);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
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

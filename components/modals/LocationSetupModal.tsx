'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import {
  INDIAN_PRESCHOOL_HUBS,
  RECOMMENDED_VENDOR_CATEGORIES,
  LOCAL_HIRING_POOLS,
} from '@/lib/locations';
import {
  MapPin,
  X,
  Check,
  Building,
  ShieldCheck,
  Package,
  Users,
  Sparkles,
} from 'lucide-react';

interface LocationSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationSetupModal: React.FC<LocationSetupModalProps> = ({ isOpen, onClose }) => {
  const { campus, setCampusDetails, brand } = useToddlerHQ();

  const [selectedCity, setSelectedCity] = useState(campus.city);
  const [selectedLocality, setSelectedLocality] = useState(campus.locality);
  const [pincode, setPincode] = useState(campus.pincode);
  const [activeTab, setActiveTab] = useState<'location' | 'vendors' | 'hiring'>('location');

  if (!isOpen) return null;

  const currentCityHub = INDIAN_PRESCHOOL_HUBS.find((h) => h.city === selectedCity);

  const handleApplyLocation = () => {
    setCampusDetails({
      city: selectedCity,
      locality: selectedLocality,
      pincode: pincode,
      campus_name: `${brand.name} ${selectedLocality.split(' ')[0]} Campus`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Grab bar on mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-2 sm:hidden" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500 text-white shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Location-Aware Context Engine
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Auto-configures local vendors, logistics lead times, and hiring pools.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex items-center border-b border-slate-200 px-4 sm:px-6 bg-white overflow-x-auto">
          {[
            { id: 'location', label: '1. City & Locality', icon: MapPin },
            { id: 'vendors', label: '2. Recommended Vendors', icon: Package },
            { id: 'hiring', label: '3. ECCE Hiring Pools', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-rose-500 text-rose-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: City & Locality */}
          {activeTab === 'location' && (
            <div className="space-y-5">
              {/* City selector pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Select Metropolitan Early Years Hub
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {INDIAN_PRESCHOOL_HUBS.map((hub) => (
                    <button
                      key={hub.city}
                      onClick={() => {
                        setSelectedCity(hub.city);
                        setSelectedLocality(hub.localities[0].locality);
                        setPincode(hub.localities[0].pincode);
                      }}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                        selectedCity === hub.city
                          ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-400/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{hub.city}</span>
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        {hub.state}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Locality & Pincode */}
              {currentCityHub && (
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Select Preschool Micro-Market (Locality &amp; Pincode)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCityHub.localities.map((loc) => {
                      const isSelected = selectedLocality === loc.locality;

                      return (
                        <button
                          key={loc.locality}
                          onClick={() => {
                            setSelectedLocality(loc.locality);
                            setPincode(loc.pincode);
                          }}
                          className={`p-3.5 rounded-2xl text-left border transition-all flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {loc.locality}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Pincode: <strong>{loc.pincode}</strong> • {loc.tier}
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Save CTA */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 pb-safe">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyLocation}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-transform active:scale-95"
                >
                  Apply {selectedLocality}, {selectedCity}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Recommended Vendors */}
          {activeTab === 'vendors' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-medium">
                Auto-populated material specifications required for preschool compliance in <strong>{campus.city}</strong>:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {RECOMMENDED_VENDOR_CATEGORIES.map((cat) => (
                  <div
                    key={cat.category}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{cat.category}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                        {cat.leadTimeWeeks} wk lead time
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{cat.name}</p>

                    <div className="space-y-1 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-slate-600">
                        <strong>Mandatory Standard:</strong> {cat.mandatorySafetyStandard}
                      </p>
                      <p className="text-slate-600">
                        <strong>Estimated Cost:</strong> {cat.estimatedCostRange}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Typical Bill of Materials:
                      </span>
                      {cat.typicalItems.map((item, idx) => (
                        <p key={idx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span>{item}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Local Hiring Pools */}
          {activeTab === 'hiring' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-medium">
                Staff compensation benchmarks and background check mandates for <strong>{campus.city}</strong>:
              </div>

              <div className="space-y-3">
                {LOCAL_HIRING_POOLS.map((pool) => (
                  <div
                    key={pool.role}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900">{pool.role}</h4>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {pool.compensationBenchmark}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{pool.qualification}</p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Mandatory Clearances:
                      </span>
                      {pool.verificationsRequired.map((ver, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          ✓ {ver}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

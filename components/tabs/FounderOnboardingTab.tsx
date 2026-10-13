'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { PRESCHOOL_BRANDS } from '@/lib/brands';
import { ProgramGrade, StaffRole, SchoolConfig } from '@/types/toddlerhq';
import { ROLE_LABELS } from '@/lib/hierarchy';
import {
  Building2,
  MapPin,
  Sparkles,
  Users,
  ShieldCheck,
  DollarSign,
  Clock,
  Utensils,
  Bus,
  Save,
  CheckCircle2,
  Plus,
  Mail,
  UserPlus,
  GraduationCap,
  Layers,
  ChevronDown,
} from 'lucide-react';

const INDIAN_CITIES_LOCALITIES: Record<string, string[]> = {
  Bengaluru: ['Indiranagar 100ft Road', 'Koramangala 4th Block', 'Whitefield ITPL', 'HSR Layout Sector 2', 'Jayanagar 4th T Block', 'Malleshwaram'],
  'Mumbai & MMR': ['Bandra West Pali Hill', 'Andheri West Lokhandwala', 'Powai Hiranandani', 'Juhu Tara Road', 'Thane West Ghodbunder'],
  'Delhi NCR': ['Gurgaon DLF Phase 5', 'Gurgaon Golf Course Road', 'Noida Sector 50', 'South Delhi Greater Kailash 2', 'Vasant Vihar'],
  Hyderabad: ['Jubilee Hills Road 36', 'Gachibowli Financial District', 'Madhapur Hitec City', 'Banjara Hills Road 12'],
  Pune: ['Koregaon Park North Main', 'Kalyani Nagar', 'Baner High Street', 'Aundh D.P. Road', 'Wakad Datta Mandir'],
  Chennai: ['Adyar Gandhi Nagar', 'Anna Nagar West', 'Besant Nagar', 'OMR Thoraipakkam'],
  Kolkata: ['Salt Lake Sector 1', 'New Town Action Area 1', 'Alipore Burdwan Road', 'Ballygunge Circular Road'],
};

export const FounderOnboardingTab: React.FC = () => {
  const {
    brand,
    setBrand,
    campus,
    schoolConfig,
    updateSchoolConfig,
    staffList,
    inviteTeamMember,
    setActiveTab,
  } = useToddlerHQ();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Team Member Invite State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<StaffRole>('educator');
  const [newMemberDept, setNewMemberDept] = useState('Academic');
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const handleBrandSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    setBrand(brandId);
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    const localities = INDIAN_CITIES_LOCALITIES[city] || ['Main Campus'];
    updateSchoolConfig({
      city,
      locality: localities[0],
    });
  };

  const handleLocalitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSchoolConfig({ locality: e.target.value });
  };

  const toggleGrade = (grade: ProgramGrade) => {
    const current = schoolConfig.gradesOffered || [];
    const exists = current.includes(grade);
    const updated = exists ? current.filter((g) => g !== grade) : [...current, grade];
    updateSchoolConfig({ gradesOffered: updated });
  };

  const handleSaveConfiguration = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail || !newMemberName) return;

    inviteTeamMember({
      name: newMemberName,
      email: newMemberEmail,
      phone: newMemberPhone || '+91 99999 00000',
      role: newMemberRole,
      department: newMemberDept,
    });

    setInviteSuccess(`Invited ${newMemberName} (${newMemberEmail}) as ${ROLE_LABELS[newMemberRole]}!`);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setTimeout(() => setInviteSuccess(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Founder Onboarding &amp; Setup Console (Tab 1)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Configure &amp; Adapt Your Preschool Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Input your school parameters using smart dropdowns below. ToddlerHQ automatically customizes its curriculum, compliance checklists, fee registers, and WhatsApp templates based on your franchise and locality.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveConfiguration}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Apply Changes</span>
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-bold text-xs border border-white/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Go to School Management &rarr;</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>School parameters saved and applied across all modules!</span>
          </div>
        )}
      </div>

      {/* Grid of Dropdown-First Configuration Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Core School Configuration */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Brand & Identity */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs"
                style={{ backgroundColor: brand.primaryColor }}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  1. Preschool Brand &amp; Franchise Model
                </h3>
                <p className="text-xs text-slate-500">
                  Select from top 25 Indian preschool brand presets or independent bespoke model.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Brand Preset (25 Options)
                </label>
                <select
                  value={brand.id}
                  onChange={handleBrandSelect}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {PRESCHOOL_BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Pedagogy: {brand.pedagogy}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Campus Display Name
                </label>
                <input
                  type="text"
                  aria-label="Campus Display Name"
                  value={schoolConfig.campusName}
                  onChange={(e) => updateSchoolConfig({ campusName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Location & Geo-Catchment */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  2. Campus Location &amp; Local Market Catchment
                </h3>
                <p className="text-xs text-slate-500">
                  Location configures local vendor directory, competitor density, and police station jurisdiction.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">City</label>
                <select
                  value={schoolConfig.city}
                  onChange={handleCitySelect}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.keys(INDIAN_CITIES_LOCALITIES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Locality / Neighborhood
                </label>
                <select
                  value={schoolConfig.locality}
                  onChange={handleLocalitySelect}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {(INDIAN_CITIES_LOCALITIES[schoolConfig.city] || [schoolConfig.locality]).map(
                    (loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Pincode</label>
                <input
                  type="text"
                  aria-label="Campus Pincode"
                  value={schoolConfig.pincode}
                  onChange={(e) => updateSchoolConfig({ pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Programs Offered & Capacity */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  3. Grades Offered &amp; Total Student Capacity
                </h3>
                <p className="text-xs text-slate-500">
                  Toggle active age groups and select campus total enrollment limit.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Active Grades (Click to Toggle)
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Playgroup', 'Nursery', 'LKG', 'UKG', 'Daycare'] as ProgramGrade[]).map(
                    (grade) => {
                      const isSelected = (schoolConfig.gradesOffered || []).includes(grade);
                      return (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => toggleGrade(grade)}
                          className={`px-4 py-2 rounded-xl font-bold transition-all border ${
                            isSelected
                              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {grade}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Total Campus Capacity
                  </label>
                  <select
                    value={schoolConfig.totalCapacity}
                    onChange={(e) =>
                      updateSchoolConfig({ totalCapacity: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {[60, 90, 120, 150, 180, 240, 300].map((cap) => (
                      <option key={cap} value={cap}>
                        {cap} Students Maximum
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Operating Hours Preset
                  </label>
                  <select
                    value={schoolConfig.operatingHours}
                    onChange={(e) => updateSchoolConfig({ operatingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="08:30 AM – 12:30 PM (Daycare till 06:30 PM)">
                      Standard: 08:30 AM – 12:30 PM (Daycare till 06:30 PM)
                    </option>
                    <option value="09:00 AM – 01:00 PM (Daycare till 07:00 PM)">
                      Late Shift: 09:00 AM – 01:00 PM (Daycare till 07:00 PM)
                    </option>
                    <option value="08:00 AM – 01:30 PM (Morning Only)">
                      Half Day Only: 08:00 AM – 01:30 PM
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Operations & Facilities (Meals, Transport, Safety) */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  4. Meals, Transport &amp; Statutory Safety
                </h3>
                <p className="text-xs text-slate-500">
                  Operational setup for daily toddler nutrition, GPS school vans, and fire safety.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Meal Provision
                </label>
                <select
                  value={schoolConfig.mealsProvision}
                  onChange={(e) =>
                    updateSchoolConfig({
                      mealsProvision: e.target.value as SchoolConfig['mealsProvision'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="in_house_kitchen">In-House Fresh Kitchen</option>
                  <option value="catered_organic">Certified Catered Organic</option>
                  <option value="parent_lunchbox">Parent Lunchbox with Reheating</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  School Transport
                </label>
                <select
                  value={schoolConfig.transportProvision}
                  onChange={(e) =>
                    updateSchoolConfig({
                      transportProvision: e.target.value as SchoolConfig['transportProvision'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="school_vans_gps">GPS School Vans + Female Attendant</option>
                  <option value="auto_rickshaw_pool">Auto-Rickshaw Verified Pool</option>
                  <option value="parent_drop_only">Parent Self Drop &amp; Pickup Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Fire Dept NOC Status
                </label>
                <select
                  value={schoolConfig.fireNocStatus}
                  onChange={(e) =>
                    updateSchoolConfig({
                      fireNocStatus: e.target.value as SchoolConfig['fireNocStatus'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="approved">Approved &amp; Certified (Valid)</option>
                  <option value="in_review">Inspection Done / In Review</option>
                  <option value="pending">Application Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Team & Mentors Invite by Gmail ID */}
        <div className="lg:col-span-4 space-y-6">
          {/* Team Invite Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Add Team &amp; Mentors
                </h3>
                <p className="text-xs text-slate-500">
                  Invite staff and advisors via Gmail ID with role-based access.
                </p>
              </div>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  aria-label="Staff Full Name"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Gmail ID / Google Workspace Email
                </label>
                <input
                  type="email"
                  aria-label="Staff Email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  aria-label="Staff Phone"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Role / User Type
                  </label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as StaffRole)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold bg-white text-slate-800"
                  >
                    <option value="center_head">Center Head / Principal</option>
                    <option value="academic_lead">Academic Lead</option>
                    <option value="educator">Classroom Educator</option>
                    <option value="didi">Didi / Caregiver</option>
                    <option value="admissions_counselor">Admissions Counselor</option>
                    <option value="mentor">Pedagogy Mentor</option>
                    <option value="franchise_hq">Franchise Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={newMemberDept}
                    onChange={(e) => setNewMemberDept(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold bg-white text-slate-800"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Advisory">Advisory</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Grant Access &amp; Send Invite</span>
              </button>

              {inviteSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{inviteSuccess}</span>
                </div>
              )}
            </form>
          </div>

          {/* Current Team Members List */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Active Staff &amp; Mentors ({staffList.length})
              </h4>
              <span className="text-[10px] text-slate-400">Gmail Linked</span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {staffList.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-extrabold text-slate-900 truncate">
                      {member.full_name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {ROLE_LABELS[member.role] || member.designation}
                    </div>
                    <div className="text-[10px] text-indigo-600 truncate">
                      {member.google_email || member.email}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 shrink-0">
                    {member.department || 'Operations'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

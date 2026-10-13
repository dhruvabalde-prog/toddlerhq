'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { PRESCHOOL_BRANDS } from '@/lib/brands';
import { StaffRole, CampusSetupInput } from '@/types/toddlerhq';
import { ROLE_LABELS } from '@/lib/hierarchy';
import {
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Mail,
  Phone,
  FileSpreadsheet,
  FileText,
  Sliders,
  Award,
} from 'lucide-react';

interface CampusSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewStaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: string;
}

export const CampusSetupWizard: React.FC<CampusSetupWizardProps> = ({ isOpen, onClose }) => {
  const { campus, brand, schoolConfig, staffList, applyCampusSetup, inviteTeamMember, setCampusDetails } =
    useToddlerHQ();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State initialized with current campus data
  const [selectedBrandId, setSelectedBrandId] = useState<string>(brand.id || 'maple-bear');
  const [campusName, setCampusName] = useState<string>(campus.campus_name);
  const [trustName, setTrustName] = useState<string>('Aarambh Early Learning Trust');
  const [registrationType, setRegistrationType] = useState<'Trust' | 'Society' | 'Section 8' | 'LLP' | 'Pvt Ltd'>('Trust');

  const [city, setCity] = useState<string>(campus.city || 'Bengaluru');
  const [locality, setLocality] = useState<string>(campus.locality || 'Indiranagar 100ft Road');
  const [pincode, setPincode] = useState<string>(campus.pincode || '560038');
  const [totalSqft, setTotalSqft] = useState<number>(3500);
  const [outdoorSqft, setOutdoorSqft] = useState<number>(1200);
  const [classroomCount, setClassroomCount] = useState<number>(5);
  const [daycareOffered, setDaycareOffered] = useState<boolean>(true);
  const [cctvCloudEnabled, setCctvCloudEnabled] = useState<boolean>(true);

  // Leadership & Mentors
  const [founderName, setFounderName] = useState<string>('Rajesh Mehta');
  const [founderEmail, setFounderEmail] = useState<string>('rajesh.mehta@edufranchise.com');
  const [founderPhone, setFounderPhone] = useState<string>('+91 98450 11223');
  const [franchisePocName, setFranchisePocName] = useState<string>('Vikram Malhotra (Regional Director)');
  const [franchisePocEmail, setFranchisePocEmail] = useState<string>('audit.south@franchise-hq.com');

  // Custom Staff Roster
  const [customTeam, setCustomTeam] = useState<NewStaffMember[]>([
    {
      id: 'staff-1',
      name: 'Priya Sharma',
      email: 'principal.indiranagar@maplebear.in',
      phone: '+91 98860 33445',
      role: 'center_head',
      department: 'Operations',
    },
    {
      id: 'staff-2',
      name: 'Meera Nair',
      email: 'academic.lead@maplebear.in',
      phone: '+91 97410 55667',
      role: 'academic_lead',
      department: 'Academic',
    },
    {
      id: 'staff-3',
      name: 'Aditi Rao',
      email: 'admissions.indiranagar@maplebear.in',
      phone: '+91 99000 77889',
      role: 'admissions_counselor',
      department: 'Marketing',
    },
    {
      id: 'staff-4',
      name: 'Suresh Narayanan',
      email: 'accounts.indiranagar@maplebear.in',
      phone: '+91 98450 44332',
      role: 'accountant',
      department: 'Finance',
    },
    {
      id: 'staff-5',
      name: 'Lakshmi Bai',
      email: 'lakshmi.support@maplebear.in',
      phone: '+91 97310 99887',
      role: 'didi',
      department: 'Operations',
    },
  ]);

  // Form input for new staff member
  const [newStaffName, setNewStaffName] = useState<string>('Kavita Sen');
  const [newStaffEmail, setNewStaffEmail] = useState<string>('kavita.playgroup@maplebear.in');
  const [newStaffPhone, setNewStaffPhone] = useState<string>('+91 98440 22334');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('educator');
  const [newStaffDept, setNewStaffDept] = useState<string>('Academic');

  if (!isOpen) return null;

  const handleAddStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;
    const added: NewStaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      phone: newStaffPhone.trim() || '+91 98000 00000',
      role: newStaffRole,
      department: newStaffDept,
    };
    setCustomTeam([...customTeam, added]);
    // Reset inputs with alternative authentic presets
    setNewStaffName('Sunita Devi');
    setNewStaffEmail('sunita.care@maplebear.in');
    setNewStaffPhone('+91 98111 22334');
    setNewStaffRole('didi');
    setNewStaffDept('Operations');
  };

  const handleRemoveStaff = (id: string) => {
    setCustomTeam(customTeam.filter((s) => s.id !== id));
  };

  const handleSaveAndLaunch = () => {
    const setupData: CampusSetupInput = {
      brand_id: selectedBrandId,
      school_type: selectedBrandId === 'independent' ? 'independent' : 'franchise',
      campus_name: campusName,
      trust_name: trustName,
      registration_type: registrationType,
      city,
      locality,
      pincode,
      total_sqft: totalSqft,
      outdoor_play_sqft: outdoorSqft,
      classroom_count: classroomCount,
      daycare_offered: daycareOffered,
      cctv_cloud_enabled: cctvCloudEnabled,
      franchise_poc_name: franchisePocName,
      franchise_poc_email: franchisePocEmail,
      mentors: [
        {
          name: 'Prof. Aruna Swaminathan',
          email: 'aruna.swami@gmail.com',
          organization: 'Early Childhood Association (ECA India)',
        },
      ],
    };

    applyCampusSetup(setupData);

    // Sync custom team members to store if they are new
    customTeam.forEach((member) => {
      inviteTeamMember({
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        department: member.department,
      });
    });

    onClose();
  };

  const selectedBrand = PRESCHOOL_BRANDS.find((b) => b.id === selectedBrandId) || PRESCHOOL_BRANDS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Grab bar on mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-2 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Campus Setup &amp; Onboarding Wizard</h3>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full">
                  STEP {currentStep} OF 5
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Configure your preschool identity, physical infrastructure, leadership, and staff hierarchy.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-5 h-1.5 bg-slate-100 border-b border-slate-200">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-full transition-all ${
                currentStep >= step ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* STEP 1: School Identity & Brand */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Step 1: School Brand &amp; Legal Identity</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Select whether you are operating a National Franchise campus or an Independent Boutique preschool.
                </p>
              </div>

              {/* Franchise Brand Selector Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Select Preschool Franchise or Independent Model</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                  {PRESCHOOL_BRANDS.map((b) => {
                    const isSelected = selectedBrandId === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setSelectedBrandId(b.id);
                          setCampusName(`${b.name} ${locality ? locality.split(' ')[0] : 'Campus'}`);
                        }}
                        className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400 text-indigo-950'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{b.name}</span>
                        <span className="text-[10px] font-normal text-slate-500 mt-1 truncate">
                          {b.pedagogy.split(',')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* School Name & Legal Trust Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Official Campus Display Name</label>
                  <input
                    type="text"
                    aria-label="Official Campus Display Name"
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-1.5 overflow-x-auto pt-1">
                    {['Maple Bear Indiranagar Campus', 'Kidzee Whitefield Early Years', 'EuroKids Powai Campus', 'Little Palms Independent Academy'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setCampusName(chip)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 whitespace-nowrap"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Managing Trust / Society Name</label>
                  <input
                    type="text"
                    aria-label="Managing Trust or Society Name"
                    value={trustName}
                    onChange={(e) => setTrustName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-1.5 overflow-x-auto pt-1">
                    {['Aarambh Early Learning Trust', 'Vidya Vani Educational Society', 'Little Wonder Learning Foundation'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setTrustName(chip)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 whitespace-nowrap"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Registration Type Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Legal Registration Structure</label>
                <div className="flex flex-wrap gap-2">
                  {(['Trust', 'Society', 'Section 8', 'LLP', 'Pvt Ltd'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRegistrationType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        registrationType === type
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Campus Infrastructure & Specifications */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Step 2: Campus Location &amp; Physical Infrastructure</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Specify your micro-market location, floor area, outdoor play facilities, and classroom counts.
                </p>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    aria-label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Locality / Neighborhood</label>
                  <input
                    type="text"
                    aria-label="Locality"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pincode</label>
                  <input
                    type="text"
                    aria-label="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Square Footage & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-700">Total Built-Up Area</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      aria-label="Total Built-Up Area in square feet"
                      value={totalSqft}
                      onChange={(e) => setTotalSqft(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    />
                    <span className="text-xs text-slate-500 font-bold shrink-0">sq ft</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Standard: 3,000–5,000 sq ft for preschools.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-700">Outdoor Play Area</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      aria-label="Outdoor Play Area in square feet"
                      value={outdoorSqft}
                      onChange={(e) => setOutdoorSqft(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    />
                    <span className="text-xs text-slate-500 font-bold shrink-0">sq ft</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Sand pit, splash pool &amp; rubber turf.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-700">Classrooms Count</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      aria-label="Classroom count"
                      value={classroomCount}
                      onChange={(e) => setClassroomCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    />
                    <span className="text-xs text-slate-500 font-bold shrink-0">Rooms</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Playgroup, Nursery, LKG, UKG, Discovery.</p>
                </div>
              </div>

              {/* Facilities Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Dedicated Daycare Wing</h5>
                    <p className="text-[11px] text-slate-500">Includes infant cribs, cot nap room, and afternoon meal pantry.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDaycareOffered(!daycareOffered)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      daycareOffered ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">CCTV Cloud Live-Stream</h5>
                    <p className="text-[11px] text-slate-500">Provides secure authenticated live camera feeds for verified parents.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCctvCloudEnabled(!cctvCloudEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      cctvCloudEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Founders & Leadership Team */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Step 3: Founders, Franchise POC &amp; Mentors</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Designate who holds top-level capex sign-off, franchise auditing rights, and advisory board oversight.
                </p>
              </div>

              {/* Primary Founder */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Primary Founder / Trustee
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Full Name</label>
                    <input
                      type="text"
                      aria-label="Founder Full Name"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Official Email</label>
                    <input
                      type="email"
                      aria-label="Founder Email"
                      value={founderEmail}
                      onChange={(e) => setFounderEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Direct Phone</label>
                    <input
                      type="text"
                      aria-label="Founder Phone"
                      value={founderPhone}
                      onChange={(e) => setFounderPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Franchise POC / Area Director */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Franchise Area Director / Mentor POC
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Representative Name &amp; Title</label>
                    <input
                      type="text"
                      aria-label="Franchise POC Name"
                      value={franchisePocName}
                      onChange={(e) => setFranchisePocName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Official HQ / Mentor Email</label>
                    <input
                      type="email"
                      aria-label="Franchise POC Email"
                      value={franchisePocEmail}
                      onChange={(e) => setFranchisePocEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Custom Team & Staff Roster Builder */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Step 4: Campus Staff Hierarchy &amp; Downstairs Roles</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Assign Principals, Academic Leads, Teachers, Front Desk, Accountants, and Didis to your school roster.
                </p>
              </div>

              {/* Existing Staff Roster Cards */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Configured Campus Staff ({customTeam.length})</span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {customTeam.map((member) => (
                    <div key={member.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{member.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-extrabold px-2 py-0.5 rounded-md uppercase">
                            {ROLE_LABELS[member.role] || member.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {member.email} • {member.phone} • Dept: {member.department}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveStaff(member.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Staff Member Form */}
              <form onSubmit={handleAddStaffMember} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-indigo-600" /> Add Team Member
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    aria-label="Staff Full Name"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                  <input
                    type="email"
                    aria-label="Staff Email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                  <input
                    type="text"
                    aria-label="Staff Phone"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <select
                    aria-label="Staff Role"
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold text-slate-800"
                  >
                    <option value="center_head">Center Head / Principal</option>
                    <option value="academic_lead">Academic Curriculum Lead</option>
                    <option value="educator">Classroom Teacher (Educator)</option>
                    <option value="admissions_counselor">Admissions Counselor</option>
                    <option value="accountant">Accountant &amp; Finance Admin</option>
                    <option value="didi">Daycare Didi (Caregiver / Helper)</option>
                    <option value="support_staff">Campus Security &amp; Support</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Roster</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: Google Workspace Provisioning Summary */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Step 5: Google Workspace Compilation &amp; Ready to Launch</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Review the auto-provisioned Google Sheets, Docs, and Drive vaults connected to your campus.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" /> 8x Native Google Sheets
                  </span>
                  <p className="text-emerald-800 text-[11px]">
                    Capex &amp; Opex Fit-out Tracker, Lead CRM, Student Emergency Matrix, Staff Shifts, Fee Register.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1.5">
                  <span className="font-bold text-blue-950 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-700" /> 6x Native Google Docs
                  </span>
                  <p className="text-blue-800 text-[11px]">
                    Founding Campus SOP Manual, Franchise Agreement, Child Protection Policy, Parent Handbook.
                  </p>
                </div>
              </div>

              {/* Ready Confirmation */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Ready to Launch {campusName}
                </div>
                <p className="text-xs text-slate-300">
                  Clicking &ldquo;Save &amp; Launch Campus OS&rdquo; will apply your exact brand, location, team roster, and permissions across all stakeholder views.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              currentStep === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <span>Next: Step {currentStep + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndLaunch}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save &amp; Launch Campus OS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

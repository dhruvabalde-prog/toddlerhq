'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { Student, StudentStatus } from '@/types/toddlerhq';
import {
  UserPlus,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Search,
  MessageCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Send,
  X,
} from 'lucide-react';
import { callGeminiCopilot } from '@/lib/geminiClient';

const PIPELINE_STAGES: { id: StudentStatus; label: string; color: string }[] = [
  { id: 'lead', label: '1. Inquiries', color: 'bg-blue-100 text-blue-900 border-blue-200' },
  { id: 'tour_scheduled', label: '2. Tours Booked', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  { id: 'tour_completed', label: '3. Walkthrough Done', color: 'bg-purple-100 text-purple-900 border-purple-200' },
  { id: 'admitted', label: '4. Enrolled', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
];

const PRESET_LEADS = [
  {
    childName: 'Samaira Sen',
    parentName: 'Rohit & Tanya Sen',
    grade: 'Playgroup' as Student['program_grade'],
    phone: '+91 98450 67890',
    email: 'rohit.sen@microsoft.com',
    notes: 'Inquiring about 1:6 teacher-student ratio, AC nap room, and afternoon daycare combo hours.',
  },
  {
    childName: 'Reyansh Reddy',
    parentName: 'Deepa Reddy',
    grade: 'Nursery' as Student['program_grade'],
    phone: '+91 98860 12345',
    email: 'deepa.reddy@accenture.com',
    notes: 'Interested in inquiry-based phonics and sensory sand pit safety certification.',
  },
  {
    childName: 'Aanya Kulkarni',
    parentName: 'Amit Kulkarni',
    grade: 'LKG' as Student['program_grade'],
    phone: '+91 99002 98765',
    email: 'amit.kulkarni@infosys.com',
    notes: 'Transferred from Pune. Requests morning campus tour with academic head.',
  },
];

export const AdmissionsView: React.FC<{ onOpenCopilot: (tab?: string) => void }> = ({
  onOpenCopilot,
}) => {
  const {
    students,
    brand,
    updateStudentStatus,
    markFeePaid,
    addStudent,
    dispatchGmail,
    contactsSyncCount,
    syncGoogleContactsNow,
  } = useToddlerHQ();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeStageFilter, setActiveStageFilter] = useState<StudentStatus | 'all'>('all');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedStudentForReply, setSelectedStudentForReply] = useState<Student | null>(null);
  const [aiDraft, setAiDraft] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // New Lead Form State with rich real defaults
  const [newChildName, setNewChildName] = useState(PRESET_LEADS[0].childName);
  const [newGrade, setNewGrade] = useState<Student['program_grade']>(PRESET_LEADS[0].grade);
  const [newParentName, setNewParentName] = useState(PRESET_LEADS[0].parentName);
  const [newPhone, setNewPhone] = useState(PRESET_LEADS[0].phone);
  const [newEmail, setNewEmail] = useState(PRESET_LEADS[0].email);
  const [newNotes, setNewNotes] = useState(PRESET_LEADS[0].notes);

  const filteredStudents = students.filter(
    (s) =>
      (activeStageFilter === 'all' || s.status === activeStageFilter) &&
      (s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parent_phone.includes(searchTerm))
  );

  const handleSyncContacts = () => {
    const count = syncGoogleContactsNow();
    setSyncFeedback(`Synchronized ${count} parent contact cards & emergency numbers to campus Google Contacts!`);
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handleOpenSmartResponder = async (student: Student) => {
    setSelectedStudentForReply(student);
    setIsGeneratingDraft(true);
    setAiDraft('');

    try {
      const reply = await callGeminiCopilot('parent_inquiry_reply', {
        parentName: student.parent_name,
        childName: student.full_name,
        childAge: student.program_grade === 'Playgroup' ? '2.2 years' : '3.5 years',
        program: student.program_grade,
        inquiryText: student.notes || 'Inquired about campus tour, fee structure, and learning zones',
        brandName: brand.name,
        pedagogy: brand.pedagogy,
      });
      setAiDraft(reply);
    } catch (e: any) {
      setAiDraft(
        `Dear ${student.parent_name}, warm greetings from ${brand.name}! We would be thrilled to welcome you and ${student.full_name} for an experiential campus walkthrough this week. Would 10:00 AM or 11:30 AM work best for you? 🌟🎈`
      );
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleSendGmailReceipt = (student: Student) => {
    dispatchGmail({
      toEmail: student.parent_email,
      recipientName: student.parent_name,
      subject: `Official Fee Receipt & Enrollment Confirmation | ${brand.name}`,
      type: 'fee_receipt',
      snippet: `Confirmed receipt of ₹${student.fee_amount.toLocaleString()} for ${student.full_name}'s enrollment in ${student.program_grade}.`,
    });
    markFeePaid(student.id, true);
    setSyncFeedback(`Dispatched official receipt for ₹${student.fee_amount.toLocaleString()} to ${student.parent_email} via native Gmail!`);
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handleApplyLeadTemplate = (lead: typeof PRESET_LEADS[0]) => {
    setNewChildName(lead.childName);
    setNewParentName(lead.parentName);
    setNewGrade(lead.grade);
    setNewPhone(lead.phone);
    setNewEmail(lead.email);
    setNewNotes(lead.notes);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim() || !newParentName.trim()) return;

    addStudent({
      campus_id: 'campus-blr-1',
      full_name: newChildName,
      date_of_birth: '2024-01-01',
      program_grade: newGrade,
      parent_name: newParentName,
      parent_phone: newPhone || '+91 98450 12345',
      parent_email: newEmail || 'parent.contact@gmail.com',
      status: 'lead',
      notes: newNotes,
      fee_amount: 85000,
      fee_paid: false,
    });

    setIsAddLeadModalOpen(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
      {/* Admissions CRM Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
              Front Desk &amp; Admissions CRM
            </span>
            <span className="text-xs text-slate-500 font-bold">
              Inquiry to Enrollment Pipeline
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Visual Inquiry-to-Admission Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-sync leads with Google Contacts so educators see caller ID immediately when parents dial campus phones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleSyncContacts}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Sync Google Contacts ({contactsSyncCount})</span>
          </button>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Parent Inquiry</span>
          </button>
        </div>
      </div>

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
          <button onClick={() => setSyncFeedback(null)} className="text-emerald-700 font-bold p-1">
            ✕
          </button>
        </div>
      )}

      {/* Search & Mobile Filter Chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Stage Filter Buttons for Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveStageFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeStageFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            All Stages ({students.length})
          </button>
          {PIPELINE_STAGES.map((stg) => (
            <button
              key={stg.id}
              onClick={() => setActiveStageFilter(stg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeStageFilter === stg.id
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {stg.label} ({students.filter((s) => s.status === stg.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Visual Pipeline Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_STAGES.map((stage) => {
          if (activeStageFilter !== 'all' && activeStageFilter !== stage.id) return null;

          const stageStudents = filteredStudents.filter((s) => s.status === stage.id);

          return (
            <div
              key={stage.id}
              className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[380px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-black text-slate-900">{stage.label}</span>
                <span className="text-xs font-black bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  {stageStudents.length}
                </span>
              </div>

              {/* Student Cards in this stage */}
              <div className="flex-1 space-y-3 pt-3 overflow-y-auto">
                {stageStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">
                        {student.full_name}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md">
                        {student.program_grade}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-[11px] text-slate-600">
                      <p className="font-semibold text-slate-800">
                        👤 Parent: {student.parent_name}
                      </p>
                      <p className="flex items-center gap-1 text-slate-500 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{student.parent_phone}</span>
                      </p>
                    </div>

                    {student.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
                        {student.notes}
                      </p>
                    )}

                    {/* Stage specific quick buttons */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
                      {/* WhatsApp Smart Responder Button */}
                      <button
                        onClick={() => handleOpenSmartResponder(student)}
                        className="text-[11px] font-black text-emerald-700 hover:text-emerald-900 flex items-center gap-1 active:scale-95"
                        title="Draft response using Gemini"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Smart Reply</span>
                      </button>

                      {/* Advance Stage button */}
                      {student.status === 'lead' && (
                        <button
                          onClick={() => updateStudentStatus(student.id, 'tour_scheduled')}
                          className="text-[11px] font-black text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
                        >
                          <span>Book Tour</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}

                      {student.status === 'tour_scheduled' && (
                        <button
                          onClick={() => updateStudentStatus(student.id, 'tour_completed')}
                          className="text-[11px] font-black text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
                        >
                          <span>Tour Done</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}

                      {student.status === 'tour_completed' && (
                        <button
                          onClick={() => updateStudentStatus(student.id, 'admitted')}
                          className="text-[11px] font-black text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                        >
                          <span>Enroll</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}

                      {student.status === 'admitted' && (
                        <div>
                          {student.fee_paid ? (
                            <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Paid ₹{(student.fee_amount / 1000).toFixed(0)}k
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendGmailReceipt(student)}
                              className="text-[10px] font-black text-blue-700 hover:text-blue-900 flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" /> Send Receipt
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {stageStudents.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400 italic">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart WhatsApp Responder Modal */}
      {selectedStudentForReply && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  Gemini Smart Inquiry Responder
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentForReply(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Personalized walkthrough invitation tailored for {selectedStudentForReply.parent_name} in {brand.name} voice.
            </p>

            {isGeneratingDraft ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <Sparkles className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                <p className="font-bold">Drafting warm response under 80 words...</p>
              </div>
            ) : (
              <textarea
                rows={4}
                value={aiDraft}
                onChange={(e) => setAiDraft(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium leading-relaxed focus:outline-none focus:border-emerald-500 font-sans"
              />
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-medium">
                Counselor edits freely before dispatch
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStudentForReply(null)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <a
                  href={`https://wa.me/${selectedStudentForReply.parent_phone.replace(/\D/g, '')}?text=${encodeURIComponent(aiDraft)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Launch WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Inquiry Sheet / Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Log New Parent Inquiry
              </h3>
              <button
                onClick={() => setIsAddLeadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick lead preset chips */}
            <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-100 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-purple-700">
                Quick Preset Parent Inquiries:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {PRESET_LEADS.map((lead, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyLeadTemplate(lead)}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-900 shrink-0 hover:bg-purple-100"
                  >
                    {lead.childName} ({lead.grade})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Child&apos;s Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Program Grade
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="Playgroup">Playgroup</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Daycare">Daycare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mobile Number (Google Contacts Sync)
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Inquiry Notes &amp; Interests
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition-transform active:scale-95"
                >
                  Create &amp; Sync Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

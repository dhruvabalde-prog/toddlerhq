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
} from 'lucide-react';
import { callGeminiCopilot } from '@/lib/geminiClient';

const PIPELINE_STAGES: { id: StudentStatus; label: string; color: string }[] = [
  { id: 'lead', label: '1. New Inquiries', color: 'bg-blue-100 text-blue-900 border-blue-200' },
  { id: 'tour_scheduled', label: '2. Tours Booked', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  { id: 'tour_completed', label: '3. Walkthrough Done', color: 'bg-purple-100 text-purple-900 border-purple-200' },
  { id: 'admitted', label: '4. Enrolled & Admitted', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
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
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedStudentForReply, setSelectedStudentForReply] = useState<Student | null>(null);
  const [aiDraft, setAiDraft] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // New Lead Form State
  const [newChildName, setNewChildName] = useState('');
  const [newGrade, setNewGrade] = useState<Student['program_grade']>('Playgroup');
  const [newParentName, setNewParentName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parent_phone.includes(searchTerm)
  );

  const handleSyncContacts = () => {
    const count = syncGoogleContactsNow();
    setSyncFeedback(`Successfully synchronized ${count} parent contacts & emergency numbers to campus Google Contacts!`);
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

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim() || !newParentName.trim()) return;

    addStudent({
      campus_id: 'campus-blr-1',
      full_name: newChildName,
      date_of_birth: '2024-01-01',
      program_grade: newGrade,
      parent_name: newParentName,
      parent_phone: newPhone || '+91 98000 00000',
      parent_email: newEmail || 'parent@example.com',
      status: 'lead',
      notes: newNotes,
      fee_amount: 85000,
      fee_paid: false,
    });

    setIsAddLeadModalOpen(false);
    setNewChildName('');
    setNewParentName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admissions CRM Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
              Front Desk &amp; Admissions CRM
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Parent Inquiry to Enrollment Funnel
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Visual Inquiry-to-Admission Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-sync leads with Google Contacts so educators see caller ID immediately when parents dial campus phones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncContacts}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Sync Google Contacts ({contactsSyncCount})</span>
          </button>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Parent Inquiry</span>
          </button>
        </div>
      </div>

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncFeedback}</span>
          </div>
          <button onClick={() => setSyncFeedback(null)} className="text-emerald-700 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search leads by child name, parent, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
      </div>

      {/* Visual Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_STAGES.map((stage) => {
          const stageStudents = filteredStudents.filter((s) => s.status === stage.id);

          return (
            <div
              key={stage.id}
              className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[420px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-black text-slate-900">{stage.label}</span>
                <span className="text-xs font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
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
                      <p className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{student.parent_phone}</span>
                      </p>
                    </div>

                    {student.notes && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        &quot;{student.notes}&quot;
                      </p>
                    )}

                    {/* Stage specific quick buttons */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1">
                      {/* WhatsApp Smart Responder Button */}
                      <button
                        onClick={() => handleOpenSmartResponder(student)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                        title="Draft response using Gemini"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Smart Reply</span>
                      </button>

                      {/* Advance Stage button */}
                      {student.status === 'lead' && (
                        <button
                          onClick={() => updateStudentStatus(student.id, 'tour_scheduled')}
                          className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
                        >
                          <span>Book Tour</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}

                      {student.status === 'tour_scheduled' && (
                        <button
                          onClick={() => updateStudentStatus(student.id, 'tour_completed')}
                          className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
                        >
                          <span>Tour Done</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}

                      {student.status === 'tour_completed' && (
                        <button
                          onClick={() => updateStudentStatus(student.id, 'admitted')}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                        >
                          <span>Enroll</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}

                      {student.status === 'admitted' && (
                        <div>
                          {student.fee_paid ? (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Paid ₹{(student.fee_amount / 1000).toFixed(0)}k
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendGmailReceipt(student)}
                              className="text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
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
                    No leads at this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart WhatsApp Responder Modal */}
      {selectedStudentForReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Gemini Smart Inquiry Responder
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentForReply(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Personalized WhatsApp walkthrough invitation tailored for {selectedStudentForReply.parent_name} in {brand.name} voice.
            </p>

            {isGeneratingDraft ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <Sparkles className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                <p>Drafting warm response under 80 words...</p>
              </div>
            ) : (
              <textarea
                rows={4}
                value={aiDraft}
                onChange={(e) => setAiDraft(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-500 font-sans"
              />
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Counselor edits freely before dispatch
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStudentForReply(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <a
                  href={`https://wa.me/${selectedStudentForReply.parent_phone.replace(/\D/g, '')}?text=${encodeURIComponent(aiDraft)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Launch WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Inquiry Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Log New Parent Walkthrough Inquiry
            </h3>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Child&apos;s Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samaira Sen"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
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
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
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
                    Parent Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Sen"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mobile Number (for Google Contacts sync)
                </label>
                <input
                  type="text"
                  placeholder="+91 98450 12345"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Inquiry Notes / Program Interests
                </label>
                <textarea
                  rows={2}
                  placeholder="Inquired about teacher-student ratio, AC nap room, meal plan..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
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

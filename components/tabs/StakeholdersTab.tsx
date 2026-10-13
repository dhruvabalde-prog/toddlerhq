'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { Stakeholder, StakeholderType, WhatsAppTemplate } from '@/types/toddlerhq';
import { DEFAULT_WHATSAPP_TEMPLATES } from '@/lib/googleWorkspace';
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  Mail,
  Plus,
  Send,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  UserPlus,
  DollarSign,
  Heart,
  ShieldCheck,
  Building2,
  X,
  Copy,
  Check,
} from 'lucide-react';

export const StakeholdersTab: React.FC<{ onOpenCopilot?: (tab?: string) => void }> = ({
  onOpenCopilot,
}) => {
  const {
    stakeholders,
    addStakeholder,
    logCommunication,
    communicationLogs,
    generateWhatsAppLink,
    currentUser,
    brand,
    campus,
  } = useToddlerHQ();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<StakeholderType | 'all'>('all');

  // Selected stakeholder for WhatsApp Draft & Send Modal
  const [activeWhatsAppStakeholder, setActiveWhatsAppStakeholder] = useState<Stakeholder | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate>(DEFAULT_WHATSAPP_TEMPLATES[0]);
  const [customDraftText, setCustomDraftText] = useState('');
  const [isNewStakeholderModalOpen, setIsNewStakeholderModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filtered Stakeholders
  const filteredStakeholders = stakeholders.filter((s) => {
    const matchesType = selectedTypeFilter === 'all' || s.type === selectedTypeFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.relationDetails && s.relationDetails.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleOpenWhatsAppComposer = (stk: Stakeholder) => {
    setActiveWhatsAppStakeholder(stk);
    // Find best default template based on stakeholder type
    const template =
      stk.type === 'parent'
        ? stk.feeStatus === 'due'
          ? DEFAULT_WHATSAPP_TEMPLATES.find((t) => t.id === 'fee-reminder-due') || DEFAULT_WHATSAPP_TEMPLATES[0]
          : DEFAULT_WHATSAPP_TEMPLATES.find((t) => t.id === 'daily-care-update') || DEFAULT_WHATSAPP_TEMPLATES[0]
        : stk.type === 'lead'
        ? DEFAULT_WHATSAPP_TEMPLATES.find((t) => t.id === 'tour-invitation') || DEFAULT_WHATSAPP_TEMPLATES[0]
        : stk.type === 'franchise'
        ? DEFAULT_WHATSAPP_TEMPLATES.find((t) => t.id === 'franchise-audit-notice') || DEFAULT_WHATSAPP_TEMPLATES[0]
        : stk.type === 'teacher' || stk.type === 'didi'
        ? DEFAULT_WHATSAPP_TEMPLATES.find((t) => t.id === 'teacher-shift-reminder') || DEFAULT_WHATSAPP_TEMPLATES[0]
        : DEFAULT_WHATSAPP_TEMPLATES[0];

    setSelectedTemplate(template);
    // Build initial preview text
    const link = generateWhatsAppLink(stk, template);
    const parsedText = decodeURIComponent(link.split('?text=')[1] || '');
    setCustomDraftText(parsedText);
  };

  const handleSelectTemplate = (template: WhatsAppTemplate) => {
    if (!activeWhatsAppStakeholder) return;
    setSelectedTemplate(template);
    const link = generateWhatsAppLink(activeWhatsAppStakeholder, template);
    const parsedText = decodeURIComponent(link.split('?text=')[1] || '');
    setCustomDraftText(parsedText);
  };

  const handleSendWhatsApp = () => {
    if (!activeWhatsAppStakeholder) return;
    const cleanPhone = activeWhatsAppStakeholder.phone.replace(/[^0-9]/g, '');
    const finalUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customDraftText)}`;

    // Log the communication
    logCommunication({
      stakeholderId: activeWhatsAppStakeholder.id,
      stakeholderName: activeWhatsAppStakeholder.name,
      channel: 'whatsapp',
      message: customDraftText.slice(0, 100) + '...',
      draftedBy: `${currentUser.full_name} (${currentUser.designation})`,
      status: 'delivered',
    });

    // Deep link opens WhatsApp Web or App directly with text filled!
    window.open(finalUrl, '_blank');
    setActiveWhatsAppStakeholder(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                💬 1-Way WhatsApp CRM
              </span>
              <span className="text-xs font-bold text-slate-500">
                People &amp; Stakeholder Directory (Tab 4)
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Universal Stakeholder Management &amp; Communication
            </h2>
            <p className="text-xs text-slate-500">
              Search, research, and trigger 1-click WhatsApp with pre-drafted Indian preschool templates, phone calls, or Gmail dispatches.
            </p>
          </div>

          <button
            onClick={() => setIsNewStakeholderModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Stakeholder</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              aria-label="Search stakeholders by name, phone, child name, or grade"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            {(
              [
                { id: 'all', label: 'All Stakeholders' },
                { id: 'parent', label: 'Parents' },
                { id: 'lead', label: 'Leads' },
                { id: 'franchise', label: 'Franchise HQ' },
                { id: 'teacher', label: 'Teachers' },
                { id: 'didi', label: 'Didis' },
                { id: 'mentor', label: 'Mentors' },
                { id: 'vendor', label: 'Vendors' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedTypeFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedTypeFilter === cat.id
                    ? 'bg-emerald-600 text-white shadow-2xs font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stakeholders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStakeholders.map((stk) => {
          const typeBadgeColor =
            stk.type === 'parent'
              ? 'bg-blue-100 text-blue-900 border-blue-200'
              : stk.type === 'lead'
              ? 'bg-amber-100 text-amber-900 border-amber-200'
              : stk.type === 'franchise'
              ? 'bg-purple-100 text-purple-900 border-purple-200'
              : stk.type === 'mentor'
              ? 'bg-rose-100 text-rose-900 border-rose-200'
              : stk.type === 'didi'
              ? 'bg-orange-100 text-orange-900 border-orange-200'
              : stk.type === 'teacher'
              ? 'bg-indigo-100 text-indigo-900 border-indigo-200'
              : 'bg-slate-100 text-slate-800 border-slate-200';

          return (
            <div
              key={stk.id}
              className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Top Row: Avatar & Details */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                      {stk.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-slate-900 truncate">
                        {stk.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{stk.roleTitle}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shrink-0 ${typeBadgeColor}`}
                  >
                    {stk.type}
                  </span>
                </div>

                {stk.relationDetails && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    {stk.relationDetails}
                  </p>
                )}

                {/* Tags & Fee Status */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {stk.feeStatus === 'due' && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">
                      ₹{stk.dueAmount?.toLocaleString('en-IN')} Fee Due
                    </span>
                  )}
                  {stk.feeStatus === 'paid' && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Fee Paid
                    </span>
                  )}
                  {stk.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Communication Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* 1-Click Call */}
                <a
                  href={`tel:${stk.phone.replace(/[^0-9+]/g, '')}`}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                  title={`Call ${stk.phone}`}
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Call</span>
                </a>

                {/* 1-Click Email */}
                {stk.email && (
                  <a
                    href={`mailto:${stk.email}`}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                    title={`Email ${stk.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">Email</span>
                  </a>
                )}

                {/* Main Action: 1-Click WhatsApp Draft & Send */}
                <button
                  onClick={() => handleOpenWhatsAppComposer(stk)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Draft</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT COMMUNICATION LOGS LEDGER */}
      {communicationLogs.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">
              Communication &amp; WhatsApp Dispatch History
            </h3>
            <span className="text-xs text-slate-400">{communicationLogs.length} Logged</span>
          </div>

          <div className="space-y-2 text-xs">
            {communicationLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    To: {log.stakeholderName} ({log.channel.toUpperCase()})
                  </div>
                  <div className="text-[11px] text-slate-500">{log.message}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded block">
                    {log.status}
                  </span>
                  <span className="text-[10px] text-slate-400">{log.sentAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHATSAPP DRAFT & SEND MODAL (1-WAY DEEP LINK ENGINE) */}
      {activeWhatsAppStakeholder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200 space-y-5 p-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    WhatsApp 1-Way Draft &amp; Send
                  </h3>
                  <p className="text-xs text-slate-500">
                    To: <strong>{activeWhatsAppStakeholder.name}</strong> ({activeWhatsAppStakeholder.phone})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveWhatsAppStakeholder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Pre-Drafted Template */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Choose Context Template (Auto-Populates with Child &amp; School Data)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {DEFAULT_WHATSAPP_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedTemplate.id === tmpl.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-[11px] truncate">{tmpl.title}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{tmpl.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Draft Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">
                  Review &amp; Edit Message Text
                </label>
                <span className="text-[10px] text-slate-400">
                  Opens in WhatsApp with this exact text
                </span>
              </div>
              <textarea
                rows={7}
                value={customDraftText}
                onChange={(e) => setCustomDraftText(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            {/* The One-Touch Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Open in WhatsApp (Text Pre-filled) &rarr;</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(customDraftText);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              💡 Clicking &quot;Open in WhatsApp&quot; opens your WhatsApp chat with the text already typed in. You only need to touch Send.
            </p>
          </div>
        </div>
      )}

      {/* ADD STAKEHOLDER MODAL */}
      {isNewStakeholderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add New Stakeholder</h3>
              <button
                onClick={() => setIsNewStakeholderModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                addStakeholder({
                  name: fd.get('name') as string,
                  type: fd.get('type') as StakeholderType,
                  phone: fd.get('phone') as string,
                  email: fd.get('email') as string,
                  roleTitle: fd.get('roleTitle') as string,
                  relationDetails: fd.get('relationDetails') as string,
                  preferredChannel: 'whatsapp',
                  tags: [(fd.get('type') as string).toUpperCase()],
                });
                setIsNewStakeholderModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  name="name"
                  aria-label="Stakeholder Full Name"
                  required
                  defaultValue="Alok Verma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select name="type" aria-label="Stakeholder Category" className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold bg-white">
                    <option value="parent">Parent</option>
                    <option value="lead">Admissions Lead</option>
                    <option value="franchise">Franchise HQ POC</option>
                    <option value="teacher">Teacher</option>
                    <option value="didi">Didi / Caregiver</option>
                    <option value="mentor">Mentor</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone (+91)</label>
                  <input
                    name="phone"
                    aria-label="Phone Number"
                    required
                    defaultValue="+91 98450 11223"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email / Gmail</label>
                <input
                  name="email"
                  type="email"
                  aria-label="Email Address"
                  defaultValue="alok.verma@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Title</label>
                <input
                  name="roleTitle"
                  aria-label="Role Title"
                  required
                  defaultValue="Father of Reyan (Nursery)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Relation Details</label>
                <textarea
                  name="relationDetails"
                  aria-label="Notes and Relation Details"
                  rows={2}
                  defaultValue="Inquiring about daycare hours & school bus."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Add Stakeholder to Directory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

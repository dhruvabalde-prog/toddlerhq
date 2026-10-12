'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import {
  X,
  Phone,
  MessageSquare,
  Mail,
  HardDrive,
  Calendar,
  CheckCircle2,
  Send,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  RefreshCw,
} from 'lucide-react';

interface WorkspaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceDrawer: React.FC<WorkspaceDrawerProps> = ({ isOpen, onClose }) => {
  const {
    googleConnected,
    campus,
    brand,
    students,
    googleChatSpaces,
    chatMessages,
    sendChatMessage,
    driveFiles,
    gmailDispatches,
    contactsSyncCount,
    syncGoogleContactsNow,
  } = useToddlerHQ();

  const [activeTab, setActiveTab] = useState<'chat' | 'contacts' | 'gmail' | 'drive'>('chat');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('space-alerts');
  const [newChatText, setNewChatText] = useState('');
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSpace = googleChatSpaces.find((s) => s.id === selectedSpaceId) || googleChatSpaces[0];
  const spaceMessages = chatMessages.filter((m) => m.spaceId === selectedSpaceId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    sendChatMessage(selectedSpaceId, newChatText.trim());
    setNewChatText('');
  };

  const handleSyncContacts = () => {
    const count = syncGoogleContactsNow();
    setSyncNotice(`Synced ${count} parent contact cards to Google Contacts!`);
    setTimeout(() => setSyncNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
              <span className="text-xl">🌐</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Google Workspace Ecosystem</h3>
                <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Connected to: <strong>principal.indiranagar@maplebear.in</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white overflow-x-auto">
          {[
            { id: 'chat', label: 'Google Chat Spaces', icon: MessageSquare },
            { id: 'contacts', label: 'Google Contacts (Caller ID)', icon: Smartphone },
            { id: 'gmail', label: 'Gmail Dispatches', icon: Mail },
            { id: 'drive', label: 'Google Drive Proofs', icon: HardDrive },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {/* TAB 1: Google Chat Spaces */}
          {activeTab === 'chat' && (
            <div className="space-y-4 h-full flex flex-col">
              {/* Space Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {googleChatSpaces.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSpaceId(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedSpaceId === s.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>#{s.name}</span>
                    {s.unreadAlerts > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Space Topic Banner */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800">#{currentSpace.name}:</span>{' '}
                {currentSpace.topic}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px] bg-white p-4 rounded-2xl border border-slate-200">
                {spaceMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl text-xs space-y-1 ${
                      msg.isAlertCard
                        ? 'bg-rose-50 border border-rose-200 text-rose-950'
                        : 'bg-slate-50 border border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span>{msg.senderAvatar}</span>
                        <span className="font-bold text-slate-900">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-400">({msg.senderRole})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs leading-relaxed">{msg.content}</p>
                  </div>
                ))}
                {spaceMessages.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-400 italic">
                    No recent messages in #{currentSpace.name}
                  </div>
                )}
              </div>

              {/* Send Chat input */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Post to #${currentSpace.name}...`}
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Google Contacts & Caller ID */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Zero-Leak Parent Address Book Sync
                    </h4>
                    <p className="text-xs text-slate-500">
                      Synchronizes student directory and emergency numbers with Google Contacts labels: &quot;School-2026-Leads&quot; &amp; &quot;Nursery-A&quot;.
                    </p>
                  </div>
                  <button
                    onClick={handleSyncContacts}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Now</span>
                  </button>
                </div>

                {syncNotice && (
                  <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    {syncNotice}
                  </p>
                )}
              </div>

              {/* Smartphone Caller ID Simulation Preview */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl max-w-sm mx-auto space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Google Phone Android / iOS</span>
                  <span>10:42 AM</span>
                </div>

                <div className="text-center py-4 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-slate-800 text-white text-2xl flex items-center justify-center mx-auto border-2 border-emerald-400 animate-pulse">
                    📞
                  </div>
                  <h4 className="text-lg font-bold">Incoming Call...</h4>
                  <p className="text-sm font-semibold text-emerald-400">
                    Dr. Ananya Iyer (Parent)
                  </p>
                  <p className="text-xs text-slate-300">
                    Child: Aarav (Nursery) • Inquiry ID #INQ-2026-44
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">+91 98862 44556</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800 text-[10px] text-slate-300 text-center">
                  ✨ Powered by Google Contacts Sync: Staff immediately recognize parents without manual number lookup!
                </div>
              </div>

              {/* Synced Contacts Directory */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Active Synced Parents ({students.length})
                </h4>
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                  {students.map((s) => (
                    <div key={s.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{s.parent_name}</p>
                        <p className="text-slate-500">
                          Child: {s.full_name} ({s.program_grade})
                        </p>
                      </div>
                      <span className="font-mono text-slate-600">{s.parent_phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Gmail Dispatches */}
          {activeTab === 'gmail' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  Native Gmail Tuition &amp; Admission Dispatcher
                </h4>
                <p className="text-xs text-slate-500">
                  Emails are sent from the official school mailbox. Parent replies land directly into the Principal&apos;s native Gmail inbox.
                </p>
              </div>

              <div className="space-y-3">
                {gmailDispatches.map((mail) => (
                  <div
                    key={mail.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold text-slate-900">{mail.recipientName}</span>
                        <span className="text-slate-400">&lt;{mail.toEmail}&gt;</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{mail.timestamp}</span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-800">{mail.subject}</h5>
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      &quot;{mail.snippet}&quot;
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Delivered to Gmail Inbox
                      </span>
                      <span className="text-slate-400 uppercase text-[9px] font-bold">
                        {mail.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Google Drive Compliance Proofs */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  Structured Google Drive Compliance Archive
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  /PreschoolOS/{campus.campus_name.split(' ')[0]}/2026/Compliance/
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {file.fileType === 'pdf' ? '📄' : '🖼️'}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{file.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">{file.path}</p>
                      <p className="text-[10px] text-slate-400">
                        Uploaded by: {file.uploadedBy} • {file.timestamp} • {file.size}
                      </p>
                    </div>

                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md shrink-0">
                      VERIFIED
                    </span>
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

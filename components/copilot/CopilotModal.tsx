'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { callGeminiCopilot } from '@/lib/geminiClient';
import {
  Sparkles,
  X,
  Copy,
  Check,
  Languages,
  BookOpen,
  ShieldCheck,
  FileText,
  MessageSquare,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const CopilotModal: React.FC<CopilotModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'parent_reply',
}) => {
  const { brand, campus, students } = useToddlerHQ();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tab 1: Parent Reply State (pre-filled with authentic preschool inquiry)
  const [parentName, setParentName] = useState('Dr. Ananya Iyer');
  const [childName, setChildName] = useState('Aarav');
  const [childAge, setChildAge] = useState('2.5 years');
  const [program, setProgram] = useState('Nursery');
  const [inquiryText, setInquiryText] = useState(
    'Inquiring about experiential learning curriculum, outdoor sand pit safety, and teacher-student ratio.'
  );

  // Tab 2: Sensory Lesson Plan State
  const [theme, setTheme] = useState('Monsoon & Water Drops');
  const [ageGroup, setAgeGroup] = useState('2.5 to 3.5 years (Nursery)');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [materials, setMaterials] = useState(
    'Blue and green non-toxic playdough, textured sponges, water mist sprayers, cardboard raindrops'
  );

  // Tab 3: Vendor Safety Audit State
  const [vendorName, setVendorName] = useState('SafePlay India Mats Pvt Ltd');
  const [category, setCategory] = useState('EVA Foam Flooring');
  const [quoteText, setQuoteText] = useState(
    '1200 sq ft 25mm interlocking foam tiles. Density 45 Shore C. Anti-microbial, heavy metal free per EN71-3. Class A fire retardant.'
  );

  // Tab 4: Weekly Progress Digest State
  const [selectedStudentName, setSelectedStudentName] = useState(
    students[0]?.full_name || 'Vihaan Rao'
  );
  const [studentGrade, setStudentGrade] = useState<string>(
    students[0]?.program_grade || 'Playgroup'
  );
  const [mealSummary, setMealSummary] = useState(
    'Ate wholesome vegetable khichdi and fresh fruits happily with his classmates.'
  );
  const [napSummary, setNapSummary] = useState(
    'Rested comfortably for 45 minutes during quiet lullaby nap routine.'
  );
  const [moodSummary, setMoodSummary] = useState(
    'Energetic, smiling, actively engaged during morning circle song.'
  );
  const [milestones, setMilestones] = useState(
    'Practiced stacking 6 wooden cubes and identified circle and square shapes.'
  );

  // Tab 5: Vernacular SOP Translation State
  const [sopTitle, setSopTitle] = useState('Diaper Changing & Infant Hygiene Sanitization');
  const [englishText, setEnglishText] = useState(
    '1. Wash hands with antiseptic soap for 20 seconds. 2. Put on disposable nitrile gloves. 3. Place infant on sanitized change mat. 4. Clean with hypoallergenic water wipes from front to back. 5. Discard soiled diaper in sealed step-bin. 6. Disinfect mat with quaternary spray and remove gloves.'
  );
  const [targetLanguage, setTargetLanguage] = useState('Hindi');

  if (!isOpen) return null;

  const handleRunCopilot = async (action: string, payload: any) => {
    setLoading(true);
    setResult('');
    setErrorMsg(null);
    setCopied(false);

    try {
      const output = await callGeminiCopilot(action, payload);
      setResult(typeof output === 'string' ? output : JSON.stringify(output, null, 2));
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || 'Error executing Gemini copilot.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Grab bar on mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-2 sm:hidden" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  ToddlerHQ Gemini Copilot
                </h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  Non-Agentic Utility
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Deterministic early-childhood operational intelligence invoked on user clicks.
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

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-2 border-b border-slate-200 bg-white flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'parent_reply', label: 'Parent Responder', icon: MessageSquare },
            { id: 'lesson_plan', label: 'Sensory Planner', icon: BookOpen },
            { id: 'vendor_audit', label: 'Safety Audit', icon: ShieldCheck },
            { id: 'progress_digest', label: 'Weekly Digest', icon: FileText },
            { id: 'vernacular_sop', label: 'Vernacular SOP', icon: Languages },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setResult('');
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-black border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-amber-500 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Two columns (Input form on left, Output on right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Input Form */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 border-r border-slate-200 overflow-y-auto space-y-4">
            {/* TAB 1: Parent Inquiry Reply */}
            {activeTab === 'parent_reply' && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                  Generates an under-80-word warm WhatsApp response reflecting {brand.name}&apos;s pedagogy, inviting parents for a campus walkthrough.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Parent Name
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Child Name &amp; Age
                    </label>
                    <input
                      type="text"
                      value={`${childName} (${childAge})`}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Program Interested In
                  </label>
                  <input
                    type="text"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Parent Inquiry Context
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900"
                  />
                </div>

                <button
                  onClick={() =>
                    handleRunCopilot('parent_inquiry_reply', {
                      parentName,
                      childName,
                      childAge,
                      program,
                      inquiryText,
                      brandName: brand.name,
                      pedagogy: brand.pedagogy,
                    })
                  }
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Draft Polite WhatsApp Response</span>
                </button>
              </div>
            )}

            {/* TAB 2: Sensory Lesson Plan */}
            {activeTab === 'lesson_plan' && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 font-medium">
                  Designs a step-by-step 20-minute sensory activity with safety tips and sensory milestones.
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Activity Theme
                  </label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Age Group
                    </label>
                    <input
                      type="text"
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Available Props &amp; Materials
                  </label>
                  <textarea
                    rows={3}
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900"
                  />
                </div>

                <button
                  onClick={() =>
                    handleRunCopilot('sensory_lesson_plan', {
                      theme,
                      ageGroup,
                      durationMinutes,
                      materials,
                      brandName: brand.name,
                    })
                  }
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate 20-Min Lesson Plan</span>
                </button>
              </div>
            )}

            {/* TAB 3: Vendor Safety Audit */}
            {activeTab === 'vendor_audit' && (
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 font-medium">
                  Audits quotes against EN71-3 non-toxicity and Class A fire-retardant safety benchmarks.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Material Category
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Quotation / Specification Text
                  </label>
                  <textarea
                    rows={4}
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900"
                  />
                </div>

                <button
                  onClick={() =>
                    handleRunCopilot('vendor_safety_audit', {
                      vendorName,
                      category,
                      quoteText,
                      brandName: brand.name,
                    })
                  }
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Analyze Vendor Specs &amp; Safety</span>
                </button>
              </div>
            )}

            {/* TAB 4: Weekly Progress Digest */}
            {activeTab === 'progress_digest' && (
              <div className="space-y-3">
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 font-medium">
                  Compiles a warm 4-line weekly WhatsApp digest for parents based on daily care logs.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={selectedStudentName}
                      onChange={(e) => setSelectedStudentName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Grade
                    </label>
                    <input
                      type="text"
                      value={studentGrade}
                      onChange={(e) => setStudentGrade(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Meal Summary
                  </label>
                  <input
                    type="text"
                    value={mealSummary}
                    onChange={(e) => setMealSummary(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nap Summary
                  </label>
                  <input
                    type="text"
                    value={napSummary}
                    onChange={(e) => setNapSummary(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Mood &amp; Social
                  </label>
                  <input
                    type="text"
                    value={moodSummary}
                    onChange={(e) => setMoodSummary(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Milestones
                  </label>
                  <input
                    type="text"
                    value={milestones}
                    onChange={(e) => setMilestones(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <button
                  onClick={() =>
                    handleRunCopilot('weekly_progress_digest', {
                      studentName: selectedStudentName,
                      grade: studentGrade,
                      mealSummary,
                      napSummary,
                      moodSummary,
                      milestones,
                      brandName: brand.name,
                    })
                  }
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Draft 4-Line Parent Summary</span>
                </button>
              </div>
            )}

            {/* TAB 5: Vernacular SOP Translation */}
            {activeTab === 'vernacular_sop' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                  Translates English protocols into Hindi, Marathi, Kannada, Tamil, or Telugu for campus ayahs and support staff.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      SOP Title
                    </label>
                    <input
                      type="text"
                      value={sopTitle}
                      onChange={(e) => setSopTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Target Language
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Standard English SOP Text
                  </label>
                  <textarea
                    rows={4}
                    value={englishText}
                    onChange={(e) => setEnglishText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900"
                  />
                </div>

                <button
                  onClick={() =>
                    handleRunCopilot('vernacular_sop_translation', {
                      sopTitle,
                      englishText,
                      targetLanguage,
                    })
                  }
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                  <span>Translate SOP for Ayahs &amp; Support</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Output / Results Area */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 bg-slate-50 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Gemini Copilot Output
              </span>

              {result && (
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 pt-3">
              {loading && (
                <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  <p className="text-xs font-bold">Gemini generating structured insight...</p>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Gemini API Notice</span>
                  </div>
                  <p>{errorMsg}</p>
                </div>
              )}

              {!loading && !errorMsg && !result && (
                <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-slate-400 text-center p-4 space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-300" />
                  <h4 className="text-xs font-bold text-slate-600">No output generated yet</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Click the trigger button on the left to invoke the deterministic Gemini Copilot.
                  </p>
                </div>
              )}

              {!loading && result && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans shadow-xs">
                  {result}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

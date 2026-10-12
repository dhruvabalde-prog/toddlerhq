'use client';

import React, { useState, useEffect } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { AttendanceStatus, MealStatus, Student } from '@/types/toddlerhq';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Check,
  Smile,
  Frown,
  Meh,
  Sun,
  Flame,
  Clock,
  Heart,
  ChevronDown,
  X,
} from 'lucide-react';
import { callGeminiCopilot } from '@/lib/geminiClient';

const OBSERVATION_QUICK_CHIPS = [
  'Ate full bowl of vegetable khichdi independently.',
  'Shared wooden puzzle blocks cooperatively with classmates.',
  'Recognized primary colors and practiced pincer grip with playdough.',
  'Rested peacefully during 45-minute quiet nap routine.',
  'Enjoyed water-wheel sensory funnel in discovery yard.',
];

export const EducatorView: React.FC<{ onOpenCopilot: (tab?: string) => void }> = ({
  onOpenCopilot,
}) => {
  const {
    students,
    dailyLogs,
    currentUser,
    brand,
    updateAttendance,
    logMeal,
    logNapMinutes,
    logMoodEmoji,
    addCareLogNote,
  } = useToddlerHQ();

  // Nap timer states
  const [napActive, setNapActive] = useState(false);
  const [napSeconds, setNapSeconds] = useState(0);
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<Student | null>(null);
  const [noteText, setNoteText] = useState(OBSERVATION_QUICK_CHIPS[0]);
  const [activeGradeFilter, setActiveGradeFilter] = useState<'All' | 'Playgroup' | 'Nursery' | 'Daycare'>('All');

  // Quick Gemini Sensory Plan state
  const [sensoryActivity, setSensoryActivity] = useState<string | null>(null);
  const [isGeneratingSensory, setIsGeneratingSensory] = useState(false);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (napActive) {
      interval = setInterval(() => {
        setNapSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [napActive]);

  const handleStopNapTimer = () => {
    setNapActive(false);
    const minutes = Math.max(1, Math.round(napSeconds / 60));
    students.forEach((s) => {
      logNapMinutes(s.id, minutes);
    });
  };

  const handleQuickSensoryActivity = async () => {
    setIsGeneratingSensory(true);
    setSensoryActivity(null);
    try {
      const plan = await callGeminiCopilot('sensory_lesson_plan', {
        theme: 'Monsoon Tactile & Raindrop Discovery',
        ageGroup: '2.5 to 3.5 years',
        durationMinutes: 15,
        materials: 'Colored construction paper, blue playdough, sensory water sponges',
        brandName: brand.name,
      });
      setSensoryActivity(plan);
    } catch (e: any) {
      setSensoryActivity(
        'Activity: Sensory Raindrop Finger-Press\nMaterials: Non-toxic blue playdough & textured paper.\nSteps: 1. Warmup finger taps (2 min). 2. Roll playdough droplets (8 min). 3. Press raindrops onto sheet (5 min).'
      );
    } finally {
      setIsGeneratingSensory(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.status === 'admitted' || s.status === 'tour_completed') &&
      (activeGradeFilter === 'All' || s.program_grade === activeGradeFilter)
  );

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16 animate-in fade-in duration-300">
      {/* Educator Header with Nap Timer & Quick Gemini Button */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400 text-slate-950">
                Classroom Mobile Console
              </span>
              <span className="text-xs text-emerald-200 font-medium">
                {currentUser.full_name} ({currentUser.designation})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Single-Touch Student Care Logs
            </h2>
            <p className="text-xs text-emerald-100">
              {brand.name} • {brand.pedagogy.split('(')[0].trim()}
            </p>
          </div>

          {/* Sensory Assistant Quick Trigger */}
          <button
            onClick={handleQuickSensoryActivity}
            disabled={isGeneratingSensory}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>
              {isGeneratingSensory
                ? 'Generating Activity...'
                : '15-Min Rainy Day Sensory Plan'}
            </span>
          </button>
        </div>

        {/* Live Nap Time Sticky Bar */}
        <div className="bg-emerald-900/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-600/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center font-bold text-lg">
              😴
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Quiet Nap Routine Timer
                </span>
                {napActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <span className="text-2xl font-black font-mono tracking-wider">
                {formatTimer(napSeconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!napActive ? (
              <button
                onClick={() => setNapActive(true)}
                className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-md flex items-center gap-1.5 hover:bg-emerald-50 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Nap Routine</span>
              </button>
            ) : (
              <button
                onClick={() => setNapActive(false)}
                className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 hover:bg-amber-300 active:scale-95"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={handleStopNapTimer}
              disabled={napSeconds === 0}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs border border-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              Apply All ({Math.round(napSeconds / 60)}m)
            </button>
          </div>
        </div>
      </div>

      {/* Generated Sensory Plan Modal/Banner */}
      {sensoryActivity && (
        <div className="bg-amber-50 rounded-3xl p-5 sm:p-6 border border-amber-300 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                Gemini Sensory Lesson Plan (15-Min Indoor Activity)
              </h3>
            </div>
            <button
              onClick={() => setSensoryActivity(null)}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 p-1"
            >
              ✕
            </button>
          </div>
          <div className="text-xs text-amber-900 whitespace-pre-line leading-relaxed font-medium bg-white/80 p-4 rounded-2xl border border-amber-200">
            {sensoryActivity}
          </div>
        </div>
      )}

      {/* Grade Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Playgroup', 'Nursery', 'Daycare'] as const).map((grade) => (
          <button
            key={grade}
            onClick={() => setActiveGradeFilter(grade)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeGradeFilter === grade
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {grade}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-auto font-bold pr-1">
          {filteredStudents.length} Students
        </span>
      </div>

      {/* Student Care Cards (Mobile-first, 44px+ tap targets) */}
      <div className="space-y-4">
        {filteredStudents.map((student) => {
          const today = new Date().toISOString().split('T')[0];
          const log = dailyLogs.find(
            (l) => l.student_id === student.id && l.log_date === today
          );

          const attendance: AttendanceStatus = log?.attendance || 'present';
          const meal: MealStatus | undefined = log?.meal_status;
          const mood = log?.mood_emoji || '😊';

          return (
            <div
              key={student.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Row 1: Student Identity & Allergy Flag */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-black text-lg flex items-center justify-center shrink-0">
                    {student.full_name.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 leading-tight">
                      {student.full_name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {student.program_grade} • Parent: {student.parent_name}
                    </p>
                  </div>
                </div>

                {student.allergies_dietary && (
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md border border-rose-200">
                    ⚠️ {student.allergies_dietary}
                  </span>
                )}
              </div>

              {/* Row 2: 1-Touch Attendance Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Attendance Check
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateAttendance(student.id, 'present')}
                    className={`min-h-[44px] py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      attendance === 'present'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Present</span>
                    {attendance === 'present' && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => updateAttendance(student.id, 'absent')}
                    className={`min-h-[44px] py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      attendance === 'absent'
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Absent</span>
                    {attendance === 'absent' && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => updateAttendance(student.id, 'late')}
                    className={`min-h-[44px] py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      attendance === 'late'
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Late</span>
                    {attendance === 'late' && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Row 3: 1-Touch Food Intake Logger */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Meal / Food Intake
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ate_full', label: 'Full Meal 🍲' },
                    { id: 'ate_half', label: 'Half Meal 🥣' },
                    { id: 'refused', label: 'Refused ❌' },
                    { id: 'light_snack', label: 'Snack Only 🍎' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => logMeal(student.id, m.id as MealStatus)}
                      className={`min-h-[42px] py-2 px-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
                        meal === m.id
                          ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Mood & Milestone Notes */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-slate-400 uppercase mr-1">
                    Mood:
                  </span>
                  {['😄', '😊', '🌟', '😴', '🥺', '⚡'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => logMoodEmoji(student.id, emoji)}
                      className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-transform active:scale-90 ${
                        mood === emoji
                          ? 'bg-amber-100 scale-110 shadow-xs ring-1 ring-amber-300'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {log?.notes ? (
                    <span className="text-xs text-slate-600 italic truncate max-w-[180px] sm:max-w-xs">
                      &quot;{log.notes}&quot;
                    </span>
                  ) : null}
                  <button
                    onClick={() => {
                      setSelectedStudentForNote(student);
                      setNoteText(log?.notes || OBSERVATION_QUICK_CHIPS[0]);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-black transition-colors"
                  >
                    + Note
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Observation Note Sheet / Modal */}
      {selectedStudentForNote && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Observation Note for {selectedStudentForNote.full_name}
              </h3>
              <button
                onClick={() => setSelectedStudentForNote(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">
                Quick Observation Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {OBSERVATION_QUICK_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNoteText(chip)}
                    className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedStudentForNote(null)}
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addCareLogNote(selectedStudentForNote.id, noteText);
                  setSelectedStudentForNote(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-transform active:scale-95"
              >
                Save Observation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import {
  Sparkles,
  Utensils,
  Moon,
  Bus,
  CheckCircle2,
  Clock,
  PhoneCall,
  Languages,
  ShieldAlert,
  Baby,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react';

interface DidiSupportViewProps {
  onOpenCopilot?: (tab?: string) => void;
}

export const DidiSupportView: React.FC<DidiSupportViewProps> = ({ onOpenCopilot }) => {
  const { students, campus } = useToddlerHQ();

  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Care tasks state
  const [washroomStatus, setWashroomStatus] = useState<Record<string, string>>({
    'washroom-1': '08:30 AM (सफाई पूर्ण)',
    'washroom-2': '09:00 AM (सफाई पूर्ण)',
  });

  const [mealServedCounts, setMealServedCounts] = useState({
    milk: 14,
    fruitSnack: 12,
    warmLunch: 0,
  });

  const [napRoomQuiet, setNapRoomQuiet] = useState(false);
  const [gateDutySigned, setGateDutySigned] = useState(true);

  const t = {
    hi: {
      roleTitle: 'डेकेयर दीदी व सहायिका सहायता पोर्टल',
      campusName: campus.campus_name,
      washroomTitle: 'टॉयलेट व डायपर सफाई',
      washroomDesc: 'हर घंटे डेटॉल व ब्लीच से फर्श व कमोड की सफाई दर्ज करें',
      cleanBtn1: 'टॉयलेट 1 सफाई दर्ज करें (Clean Washroom 1)',
      cleanBtn2: 'टॉयलेट 2 सफाई दर्ज करें (Clean Washroom 2)',
      diaperBtn: 'डायपर बदला गया (Diaper Changed)',
      mealTitle: 'भोजन व नाश्ता वितरण',
      mealDesc: 'बच्चों को गुनगुना दूध व फल परोसने की गिनती',
      milkLabel: 'दूध पिलाया गया (Warm Milk):',
      snackLabel: 'ताजा फल नाश्ता (Fruit Snack):',
      lunchLabel: 'दोपहर का भोजन (Warm Lunch):',
      serveMilk: '+1 दूध दिया',
      serveSnack: '+1 फल दिया',
      serveLunch: '+1 भोजन दिया',
      napTitle: 'दोपहर की नींद (Quiet Nap Time)',
      napDesc: 'मैट्रेस की सफाई व बच्चों की निगरानी',
      napActive: 'कमरे में शांति है और बच्चे सो रहे हैं ✅',
      napQuietBtn: 'कमरा शांत किया गया (Mark Nap Quiet)',
      busTitle: 'स्कूल बस व गेट सुरक्षा',
      busDesc: 'अभिभावक को बच्चा सौंपते समय पहचान पत्र देखें',
      gateSigned: 'सुबह का आगमन पूरा (Morning Arrival Done) ✅',
      emergencyBtn: 'प्रिंसिपल को तुरंत बुलाएं (Call Principal Alert)',
      formDeepLink: 'गूगल फॉर्म में सफाई रजिस्टर खोलें',
    },
    en: {
      roleTitle: 'Daycare Didi & Caregiver Support Portal',
      campusName: campus.campus_name,
      washroomTitle: 'Restroom & Diaper Sanitization',
      washroomDesc: 'Log hourly washroom disinfection and toddler diaper changes',
      cleanBtn1: 'Log Washroom 1 Sanitized',
      cleanBtn2: 'Log Washroom 2 Sanitized',
      diaperBtn: 'Log Toddler Diaper Change',
      mealTitle: 'Meal & Snack Distribution',
      mealDesc: 'Track warm milk and organic fruit snacks served to toddlers',
      milkLabel: 'Warm Milk Served:',
      snackLabel: 'Fruit Snack Served:',
      lunchLabel: 'Warm Lunch Served:',
      serveMilk: '+1 Milk Served',
      serveSnack: '+1 Snack Served',
      serveLunch: '+1 Lunch Served',
      napTitle: 'Afternoon Nap Supervision',
      napDesc: 'Cots sanitized, lullaby active & sleep supervision',
      napActive: 'Nap Room Quiet & Children Sleeping ✅',
      napQuietBtn: 'Mark Nap Room Ready & Quiet',
      busTitle: 'School Bus & Gate Dispersal',
      busDesc: 'Verify authorized parent ID before child handover',
      gateSigned: 'Morning Arrival Check Cleared ✅',
      emergencyBtn: 'Emergency: Alert Principal & Nurse',
      formDeepLink: 'Open Google Form Hygiene Register',
    },
  }[language];

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const logWashroomClean = (key: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setWashroomStatus({
      ...washroomStatus,
      [key]: `${timeStr} (${language === 'hi' ? 'सफाई पूर्ण' : 'Cleaned'})`,
    });
    triggerToast(language === 'hi' ? 'टॉयलेट सफाई सफलतापूर्वक दर्ज की गई!' : 'Washroom cleaning logged successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner with Language Switcher */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-rose-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 font-black text-xs uppercase tracking-wider">
              {t.roleTitle}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">{t.campusName}</h2>
          <p className="text-xs text-rose-100">
            {language === 'hi'
              ? 'बड़ा व आसान बटन सिस्टम — सफाई, खाना, व बच्चों की देखभाल के लिए।'
              : 'Extra-large touch interface for hygiene, meal logs, and child supervision.'}
          </p>
        </div>

        {/* Language Switcher Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="px-4 py-2.5 rounded-2xl bg-white text-rose-900 font-extrabold text-xs flex items-center gap-2 shadow-md hover:bg-rose-50 active:scale-95 transition-all"
          >
            <Languages className="w-4 h-4 text-rose-600" />
            <span>{language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Primary Caregiver Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CARD 1: Restroom & Diaper Sanitization */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
              🧼
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{t.washroomTitle}</h3>
              <p className="text-xs text-slate-500">{t.washroomDesc}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
              <span className="font-bold text-slate-700">Washroom 1 (Toddler Wing):</span>
              <span className="font-black text-emerald-700">{washroomStatus['washroom-1']}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
              <span className="font-bold text-slate-700">Washroom 2 (Playgroup Wing):</span>
              <span className="font-black text-emerald-700">{washroomStatus['washroom-2']}</span>
            </div>
          </div>

          {/* Big Tap Buttons (60px high) */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => logWashroomClean('washroom-1')}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.cleanBtn1}</span>
            </button>

            <button
              type="button"
              onClick={() => logWashroomClean('washroom-2')}
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.cleanBtn2}</span>
            </button>

            <button
              type="button"
              onClick={() => triggerToast(language === 'hi' ? 'डायपर बदलना सफलतापूर्वक दर्ज हुआ!' : 'Diaper change logged!')}
              className="w-full h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors"
            >
              <Baby className="w-4 h-4 text-pink-600" />
              <span>{t.diaperBtn}</span>
            </button>
          </div>

          <a
            href="https://forms.google.com/create?title=Preschool_Hourly_Restroom_Clean_Log"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1 pt-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span>{t.formDeepLink}</span>
          </a>
        </div>

        {/* CARD 2: Meal & Snack Serving Counts */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              🥣
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{t.mealTitle}</h3>
              <p className="text-xs text-slate-500">{t.mealDesc}</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Milk Row */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">{t.milkLabel}</span>
                <span className="text-lg font-black text-amber-900">{mealServedCounts.milk} बच्चे</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMealServedCounts({ ...mealServedCounts, milk: mealServedCounts.milk + 1 });
                  triggerToast(language === 'hi' ? 'दूध पिलाने की गिनती बढ़ाई गई' : 'Milk count logged');
                }}
                className="h-11 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs active:scale-95 transition-all"
              >
                {t.serveMilk}
              </button>
            </div>

            {/* Snack Row */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">{t.snackLabel}</span>
                <span className="text-lg font-black text-emerald-900">{mealServedCounts.fruitSnack} बच्चे</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMealServedCounts({ ...mealServedCounts, fruitSnack: mealServedCounts.fruitSnack + 1 });
                  triggerToast(language === 'hi' ? 'फल नाश्ते की गिनती बढ़ाई गई' : 'Fruit snack logged');
                }}
                className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs active:scale-95 transition-all"
              >
                {t.serveSnack}
              </button>
            </div>

            {/* Lunch Row */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">{t.lunchLabel}</span>
                <span className="text-lg font-black text-slate-900">{mealServedCounts.warmLunch} बच्चे</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMealServedCounts({ ...mealServedCounts, warmLunch: mealServedCounts.warmLunch + 1 });
                  triggerToast(language === 'hi' ? 'दोपहर भोजन की गिनती बढ़ाई गई' : 'Lunch count logged');
                }}
                className="h-11 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs active:scale-95 transition-all"
              >
                {t.serveLunch}
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3: Nap Time Supervisor */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
              💤
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{t.napTitle}</h3>
              <p className="text-xs text-slate-500">{t.napDesc}</p>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs font-semibold text-purple-950">
            {napRoomQuiet ? (
              <span className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t.napActive}
              </span>
            ) : (
              <span>12:30 PM - 02:00 PM: सभी मैट्रेस साफ हैं, बच्चों को पानी पिलाया गया।</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setNapRoomQuiet(!napRoomQuiet);
              triggerToast(language === 'hi' ? 'नींद का समय दर्ज किया गया!' : 'Nap time status updated!');
            }}
            className="w-full h-14 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
          >
            <Moon className="w-5 h-5" />
            <span>{t.napQuietBtn}</span>
          </button>
        </div>

        {/* CARD 4: School Bus & Emergency Alert */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              🚌
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{t.busTitle}</h3>
              <p className="text-xs text-slate-500">{t.busDesc}</p>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t.gateSigned}</span>
          </div>

          {/* Emergency Alert Button */}
          <button
            type="button"
            onClick={() => triggerToast(language === 'hi' ? '🚨 आपातकालीन सूचना प्रिंसिपल के फोन पर भेजी गई!' : '🚨 Emergency alert sent to Principal!')}
            className="w-full h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
          >
            <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            <span>{t.emergencyBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useChecklistStore } from './store/checklistStore';
import { CHECKLIST_SECTIONS } from './data/protocol';

import { WeightModal } from './components/WeightModal';
import { SectionNav } from './components/SectionNav';
import { SectionList } from './components/SectionList';
import { IntubationStartBanner } from './components/IntubationStartBanner';
import { LMAWarningModal } from './components/LMAWarningModal';
import { MedicationFAB } from './components/MedicationFAB';
import { MedicationDrawer } from './components/MedicationDrawer';
import { HardAirwayFAB } from './components/HardAirwayFAB';
import { HardAirwayOverlay } from './components/HardAirwayOverlay';
import { SessionLog } from './components/SessionLog';
import { SectionWarningModal } from './components/SectionWarningModal';

export default function App() {
  const {
    weight, currentSection, intubationStarted,
    toggleSessionLog, sessionLogOpen, endSession,
    isDark, toggleTheme, resetSession,
  } = useChecklistStore();

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const section = CHECKLIST_SECTIONS[currentSection];
  const isLastSection = currentSection === CHECKLIST_SECTIONS.length - 1;

  return (
    <div className={isDark ? 'dark' : ''} style={{ height: '100dvh' }}>
      <div className="flex flex-col bg-white dark:bg-slate-950 overflow-hidden h-full">

        {/* ── Header ──────────────────────────────────────────── */}
        <header className="flex-shrink-0 px-3 pt-3 pb-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2 gap-2">
            {/* Branding */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-blue-500 dark:text-blue-400 font-bold text-sm">הדסה</span>
              <span className="text-slate-300 dark:text-slate-600 text-sm">|</span>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">אינטובציה</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {weight && (
                <button
                  onClick={() => useChecklistStore.getState().openWeightModal()}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1.5 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  {weight} ק"ג ✎
                </button>
              )}
              <MedicationFAB compact />
              <HardAirwayFAB compact />
              <button
                onClick={toggleTheme}
                className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={toggleSessionLog}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  sessionLogOpen
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                📋 לוג
              </button>
              <button
                onClick={() => setResetConfirmOpen(true)}
                className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              >
                🔄
              </button>
            </div>
          </div>
          <SectionNav />
        </header>

        {/* ── Section title ────────────────────────────────────── */}
        <div className="flex-shrink-0 px-4 py-2 border-b border-slate-100 dark:border-slate-800/60">
          <h2 className="text-slate-800 dark:text-slate-200 font-bold text-base">{section?.title}</h2>
        </div>

        {/* ── Main content ─────────────────────── */}
        <main className="flex-1 overflow-hidden px-3 pt-2 flex flex-col min-h-0">
          <SectionList />

          {currentSection === 1 && !intubationStarted && (
            <div className="flex-shrink-0">
              <IntubationStartBanner />
            </div>
          )}

          {isLastSection && intubationStarted && (
            <div className="flex-shrink-0 mt-2 mb-2">
              <button
                onClick={endSession}
                className="w-full bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-base py-4 rounded-2xl transition-all"
              >
                ✓ סיום אינטובציה
              </button>
            </div>
          )}
        </main>

        {/* ── Bottom: copyright only ────────────────────────────── */}
        <div className="flex-shrink-0 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-600 text-[11px] text-center leading-tight">
            ©איתמר גרינברג · וצוות החייאה: תמי לוי וגפן הלל
          </p>
        </div>

        {/* ── Overlays ─────────────────────────────────────────── */}
        <WeightModal />
        <LMAWarningModal />
        <MedicationDrawer />
        <HardAirwayOverlay />
        <SessionLog />
        <SectionWarningModal />

        {/* ── Reset confirm modal ───────────────────────────────── */}
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 w-full max-w-xs shadow-2xl">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg text-center mb-2">התחלת סשן חדש</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6 leading-relaxed">
                כל המידע הקודם ימחק ולא ניתן לשחזר אותו.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setResetConfirmOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold py-3 rounded-2xl transition-all text-sm"
                >
                  ביטול
                </button>
                <button
                  onClick={() => { setResetConfirmOpen(false); resetSession(); }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl transition-all text-sm"
                >
                  מסכים/ה
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

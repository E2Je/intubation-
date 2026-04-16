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

export default function App() {
  const {
    weight, currentSection, intubationStarted,
    toggleSessionLog, sessionLogOpen, endSession,
  } = useChecklistStore();

  const section = CHECKLIST_SECTIONS[currentSection];
  const isLastSection = currentSection === CHECKLIST_SECTIONS.length - 1;

  return (
    <div className="flex flex-col bg-slate-950 overflow-hidden" style={{ height: '100dvh' }}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex-shrink-0 px-3 pt-3 pb-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-sm">הדסה</span>
            <span className="text-slate-600 text-sm">|</span>
            <span className="text-slate-300 text-sm font-medium">אינטובציה</span>
          </div>
          <div className="flex items-center gap-2">
            {weight && (
              <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium">
                {weight} ק"ג
              </span>
            )}
            <button
              onClick={toggleSessionLog}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                sessionLogOpen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              📋 לוג
            </button>
          </div>
        </div>
        <SectionNav />
      </header>

      {/* ── Section title ────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-slate-800/60">
        <h2 className="text-slate-200 font-bold text-base">{section?.title}</h2>
      </div>

      {/* ── Main content: accordion list ─────────────────────── */}
      <main className="flex-1 overflow-hidden px-3 pt-2 flex flex-col min-h-0">
        <SectionList />

        {/* Intubation start banner - shown after equipment section */}
        {currentSection === 1 && !intubationStarted && (
          <div className="flex-shrink-0">
            <IntubationStartBanner />
          </div>
        )}

        {/* End session button */}
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

      {/* ── Bottom FAB bar ────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-3 bg-slate-900 border-t border-slate-800">
        <MedicationFAB />
        <p className="text-slate-500 text-xs text-center leading-tight">©איתמר גרינברג<br/>וצוות החייאה: תמי לוי וגפן הלל</p>
        <HardAirwayFAB />
      </div>

      {/* ── Overlays ─────────────────────────────────────────── */}
      <WeightModal />
      <LMAWarningModal />
      <MedicationDrawer />
      <HardAirwayOverlay />
      <SessionLog />
    </div>
  );
}

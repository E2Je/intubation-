import { useChecklistStore } from '../store/checklistStore';
import { MED_SECTIONS } from '../data/protocol';
import type { MedItem } from '../data/protocol';

/** Returns formatted dose string with unit, e.g. "18.0mg - 22.0mg" or "36.0mg" */
function formatDose(dosageStr: string, weight: number, unit: string): string {
  const u = unit.split('/')[0]; // "mg" or "mcg"
  if (dosageStr.includes('-')) {
    const [lo, hi] = dosageStr.split('-').map(Number);
    return `${(lo * weight).toFixed(1)}${u} - ${(hi * weight).toFixed(1)}${u}`;
  }
  return `${(parseFloat(dosageStr) * weight).toFixed(1)}${u}`;
}

function MedRow({ item, weight, isAdult }: { item: MedItem; weight: number; isAdult: boolean }) {
  const dosage = isAdult ? item.adult_dosage : item.pediatric_dosage;
  const doseStr = formatDose(dosage, weight, item.unit);

  return (
    <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-4">
      {/* Drug name + calculated dose */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="text-slate-900 dark:text-white font-bold text-base flex-1 text-right">
          {item.label}
        </span>
        {/* dir=ltr forces left-to-right number reading: 18.0mg - 22.0mg */}
        <span
          dir="ltr"
          className="text-emerald-600 dark:text-emerald-400 font-bold text-lg font-mono whitespace-nowrap"
        >
          {doseStr}
        </span>
      </div>
      {/* Per-kg info */}
      <div dir="ltr" className="text-xs text-slate-500 dark:text-slate-500 text-left">
        {dosage} {item.unit} × {weight} ק"ג
      </div>
      <p className="text-rose-500 dark:text-rose-400 text-xs mt-2 leading-tight text-right">
        {item.warning_note}
      </p>
    </div>
  );
}

export function MedicationDrawer() {
  const { medDrawerOpen, toggleMedDrawer, weight, isAdult, setIsAdult, openWeightModal } = useChecklistStore();

  if (!medDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end" onClick={toggleMedDrawer}>
      <div
        className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg">מחשבון תרופות</h3>
          <div className="flex items-center gap-3">
            {/* Adult/Pediatric toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5">
              <button
                onClick={() => setIsAdult(true)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${isAdult ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
              >
                מבוגר
              </button>
              <button
                onClick={() => setIsAdult(false)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${!isAdult ? 'bg-purple-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
              >
                ילד
              </button>
            </div>
            <button onClick={toggleMedDrawer} className="text-slate-400 dark:text-slate-400 text-xl">✕</button>
          </div>
        </div>

        {/* Weight display */}
        {weight ? (
          <div className="flex items-center justify-between px-5 py-2 bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-600 dark:text-slate-300 text-sm">משקל</span>
            <button onClick={openWeightModal} className="text-blue-500 dark:text-blue-400 font-bold text-lg hover:text-blue-600 dark:hover:text-blue-300">
              {weight} ק"ג ✎
            </button>
          </div>
        ) : (
          <div className="px-5 py-2">
            <button onClick={openWeightModal} className="text-blue-500 dark:text-blue-400 text-sm">הכנס משקל</button>
          </div>
        )}

        {/* Drug list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-4">
          {MED_SECTIONS.map(section => (
            <div key={section.title}>
              <h4 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">
                {section.title}
              </h4>
              <div className="space-y-2">
                {section.items.map(item => (
                  <MedRow
                    key={item.id}
                    item={item}
                    weight={weight ?? 70}
                    isAdult={isAdult}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

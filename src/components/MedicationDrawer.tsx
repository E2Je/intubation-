import { useState } from 'react';
import { useChecklistStore } from '../store/checklistStore';
import { MED_SECTIONS } from '../data/protocol';
import type { MedItem } from '../data/protocol';

// ─── Inline Calculator ─────────────────────────────────────────────────────

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [pending, setPending] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [justEvaled, setJustEvaled] = useState(false);

  const append = (char: string) => {
    if (justEvaled) { setDisplay(char === '.' ? '0.' : char); setJustEvaled(false); return; }
    if (char === '.' && display.includes('.')) return;
    setDisplay(prev => (prev === '0' && char !== '.') ? char : prev + char);
  };

  const chooseOp = (o: string) => {
    setPending(display);
    setOp(o);
    setJustEvaled(true);
  };

  const evaluate = () => {
    if (!op || pending === null) return;
    const a = parseFloat(pending), b = parseFloat(display);
    let result: number;
    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '×': result = a * b; break;
      case '÷': result = b !== 0 ? a / b : 0; break;
      default: return;
    }
    const str = parseFloat(result.toFixed(6)).toString();
    setDisplay(str);
    setPending(null);
    setOp(null);
    setJustEvaled(true);
  };

  const clear = () => { setDisplay('0'); setPending(null); setOp(null); setJustEvaled(false); };
  const toggleSign = () => setDisplay(d => d.startsWith('-') ? d.slice(1) : '-' + d);
  const percent = () => setDisplay(d => String(parseFloat(d) / 100));

  const btnBase = 'h-14 rounded-2xl font-semibold text-lg flex items-center justify-center active:brightness-90 transition-all select-none';

  return (
    <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-3 mb-3 border border-slate-200 dark:border-slate-700">
      {/* Display */}
      <div className="bg-slate-900 dark:bg-black rounded-xl px-4 py-3 mb-3 text-right overflow-hidden">
        {op && pending !== null && (
          <div className="text-slate-500 text-xs mb-0.5 font-mono truncate">{pending} {op}</div>
        )}
        <div className="text-white text-3xl font-light font-mono truncate" dir="ltr">{display}</div>
      </div>

      {/* Buttons 4×5 — RTL grid: first DOM child = rightmost column */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1: ÷ | % | +/- | C  (op rightmost) */}
        <button onClick={() => chooseOp('÷')} className={`${btnBase} ${op === '÷' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>÷</button>
        <button onClick={percent}    className={`${btnBase} bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white`}>%</button>
        <button onClick={toggleSign} className={`${btnBase} bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white`}>+/-</button>
        <button onClick={clear}      className={`${btnBase} bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white`}>C</button>
        {/* Row 2: × | 9 | 8 | 7 */}
        <button onClick={() => chooseOp('×')} className={`${btnBase} ${op === '×' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>×</button>
        {['9','8','7'].map(n => <button key={n} onClick={() => append(n)} className={`${btnBase} bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white`}>{n}</button>)}
        {/* Row 3: − | 6 | 5 | 4 */}
        <button onClick={() => chooseOp('-')} className={`${btnBase} ${op === '-' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>−</button>
        {['6','5','4'].map(n => <button key={n} onClick={() => append(n)} className={`${btnBase} bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white`}>{n}</button>)}
        {/* Row 4: + | 3 | 2 | 1 */}
        <button onClick={() => chooseOp('+')} className={`${btnBase} ${op === '+' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>+</button>
        {['3','2','1'].map(n => <button key={n} onClick={() => append(n)} className={`${btnBase} bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white`}>{n}</button>)}
        {/* Row 5: = | . | 0 (span 2) */}
        <button onClick={evaluate}           className={`${btnBase} bg-orange-500 text-white`}>=</button>
        <button onClick={() => append('.')}  className={`${btnBase} bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white`}>.</button>
        <button onClick={() => append('0')}  className={`${btnBase} col-span-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white`}>0</button>
      </div>
    </div>
  );
}

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
  const [calcOpen, setCalcOpen] = useState(false);

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
          <div className="flex items-center gap-2">
            {/* Calculator toggle */}
            <button
              onClick={() => setCalcOpen(o => !o)}
              title="מחשבון"
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                calcOpen
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              🧮
            </button>
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

        {/* Drug list + optional calculator */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-4">
          {calcOpen && <Calculator />}
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

import { useChecklistStore } from '../store/checklistStore';
import { CHECKLIST_SECTIONS } from '../data/protocol';

function fmt(ts: number | null): string {
  if (!ts) return '-';
  return new Date(ts).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function elapsed(start: number, end: number | null): string {
  if (!end) return 'בתהליך';
  const sec = Math.floor((end - start) / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')} דקות`;
}

export function SessionLog() {
  const {
    sessionLogOpen, toggleSessionLog,
    sessionStartTime, intubationStartTime, sessionEndTime,
    itemStatuses, resetSession,
  } = useChecklistStore();

  if (!sessionLogOpen) return null;

  const now = Date.now();

  return (
    <div className="fixed inset-0 z-40 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-slate-900 dark:text-white font-bold text-lg">סיכום סשן</h2>
        <button
          onClick={toggleSessionLog}
          className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white w-10 h-10 rounded-xl flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Timestamps */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-3 shadow-sm dark:shadow-none">
          <h3 className="text-slate-700 dark:text-slate-300 text-sm font-bold">זמנים</h3>
          <Row label="התחלת הכנה" value={fmt(sessionStartTime)} />
          <Row label="התחלת אינטובציה" value={fmt(intubationStartTime)} />
          <Row label="סיום" value={fmt(sessionEndTime)} />
          <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
            <Row
              label="זמן הכנה"
              value={elapsed(sessionStartTime, intubationStartTime ?? now)}
              highlight
            />
            {intubationStartTime && (
              <Row
                label="זמן אינטובציה"
                value={elapsed(intubationStartTime, sessionEndTime ?? now)}
                highlight
              />
            )}
          </div>
        </div>

        {/* Per-section progress */}
        {CHECKLIST_SECTIONS.map(section => {
          const total = section.items.length;
          const done = section.items.filter(i => itemStatuses[i.id] === 'done').length;
          const skipped = section.items.filter(i => itemStatuses[i.id] === 'skipped').length;
          const notRel = section.items.filter(i => itemStatuses[i.id] === 'not_relevant').length;
          const pending = section.items.filter(i => itemStatuses[i.id] === 'pending').length;
          const pct = Math.round(((total - pending) / total) * 100);

          return (
            <div key={section.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-slate-900 dark:text-white font-bold text-sm">{section.title}</h3>
                <span className={`text-sm font-bold ${pct === 100 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                  {pct}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex gap-3 text-xs text-slate-400">
                <span className="text-emerald-500">✓ {done} בוצע</span>
                <span className="text-rose-500">✗ {skipped} לא בוצע</span>
                <span className="text-sky-500">○ {notRel} לא רלוונטי</span>
                {pending > 0 && <span className="text-slate-400 dark:text-slate-500">• {pending} ממתין</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset button */}
      <div className="px-4 pb-6 pt-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={resetSession}
          className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 active:bg-slate-300 dark:active:bg-slate-800 text-slate-800 dark:text-white font-bold py-4 rounded-2xl transition-all"
        >
          🔄 סשן חדש
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500 dark:text-slate-400 text-sm">{label}</span>
      <span className={`font-mono text-sm ${highlight ? 'text-blue-500 dark:text-blue-400 font-bold' : 'text-slate-900 dark:text-white'}`}>
        {value}
      </span>
    </div>
  );
}

import { useState } from 'react';
import { useChecklistStore } from '../store/checklistStore';
import { CHECKLIST_SECTIONS } from '../data/protocol';
import type { ItemStatus } from '../data/protocol';
import { TeamPanel } from './TeamPanel';

function fmt(ts: number | null): string {
  if (!ts) return '-';
  return new Date(ts).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const STATUS_LABEL: Record<ItemStatus, string> = {
  pending: 'ממתין', done: 'בוצע', skipped: 'לא בוצע', not_relevant: 'לא רלוונטי',
};

function buildSummary(
  itemStatuses: Record<string, ItemStatus>,
  sessionStartTime: number,
  intubationStartTime: number | null,
  sessionEndTime: number | null,
  weight: number | null,
): string {
  const d = (ts: number | null) => ts ? new Date(ts).toLocaleTimeString('he-IL') : '-';
  const el = (a: number, b: number | null) => {
    if (!b) return 'בתהליך';
    const s = Math.floor((b - a) / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} דק'`;
  };
  const lines: string[] = [
    'סיכום אינטובציה - הדסה',
    `משקל: ${weight ?? '?'} ק"ג`,
    '',
    `התחלת הכנה: ${d(sessionStartTime)}`,
    `התחלת אינטובציה: ${d(intubationStartTime)}`,
    `סיום: ${d(sessionEndTime)}`,
    `זמן הכנה: ${el(sessionStartTime, intubationStartTime ?? Date.now())}`,
    '',
  ];
  CHECKLIST_SECTIONS.forEach(section => {
    lines.push(`=== ${section.title} ===`);
    section.items.forEach(item => {
      const s = itemStatuses[item.id] ?? 'pending';
      lines.push(`[${STATUS_LABEL[s]}] ${item.label}`);
    });
    lines.push('');
  });
  return lines.join('\n');
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
    itemStatuses, resetSession, weight,
  } = useChecklistStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handlePrint = () => window.print();

  const handleEmail = () => {
    const body = encodeURIComponent(
      buildSummary(itemStatuses, sessionStartTime, intubationStartTime, sessionEndTime, weight)
    );
    window.location.href = `mailto:?subject=${encodeURIComponent('סיכום אינטובציה - הדסה')}&body=${body}`;
  };

  if (!sessionLogOpen) return null;

  const now = Date.now();

  return (
    <div className="fixed inset-0 z-40 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-slate-900 dark:text-white font-bold text-lg">סיכום סשן</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirmOpen(true)}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
          >
            🔄 סשן חדש
          </button>
          <button
            onClick={toggleSessionLog}
            className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white w-10 h-10 rounded-xl flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Team info panel */}
        <TeamPanel />

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

      {/* Actions */}
      <div className="px-4 pb-5 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold py-3 rounded-2xl transition-all text-sm"
          >
            🖨️ הדפסה / PDF
          </button>
          <button
            onClick={handleEmail}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold py-3 rounded-2xl transition-all text-sm"
          >
            ✉️ שלח במייל
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 w-full max-w-xs shadow-2xl">
            <h3 className="text-slate-900 dark:text-white font-bold text-lg text-center mb-2">התחלת סשן חדש</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6 leading-relaxed">
              כל המידע הקודם ימחק ולא ניתן לשחזר אותו.
            </p>
            {/* RTL: first = right */}
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmOpen(false); resetSession(); }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl transition-all text-sm"
              >
                מסכים/ה
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold py-3 rounded-2xl transition-all text-sm"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
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

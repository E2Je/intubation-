import { useEffect, useState } from 'react';
import { useChecklistStore } from '../store/checklistStore';

function logoUrl() {
  return `${import.meta.env.BASE_URL}logo.jpg`;
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function TeamPanel() {
  const { department, setDepartment, staffList, addStaff, updateStaff, removeStaff, intubationStartTime } = useChecklistStore();
  const clock = useClock();
  const [logoError, setLogoError] = useState(false);

  const displayTime = intubationStartTime
    ? new Date(intubationStartTime)
    : clock;

  const dateStr = displayTime.toLocaleDateString('he-IL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const timeStr = intubationStartTime
    ? displayTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    : clock.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="mx-0 mb-3 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">

      {/* Logo + date/time row */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
        {!logoError ? (
          <img
            src={logoUrl()}
            alt="הדסה"
            onError={() => setLogoError(true)}
            className="h-12 w-12 object-contain flex-shrink-0 rounded-xl"
          />
        ) : (
          <div className="h-12 w-12 flex-shrink-0 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg">ה</div>
        )}
        <div className="flex-1 text-right">
          <div className="text-slate-800 dark:text-slate-100 font-bold text-base tabular-nums" dir="ltr">{timeStr}</div>
          <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{dateStr}</div>
          {intubationStartTime && (
            <div className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-0.5">זמן תחילת אינטובציה</div>
          )}
        </div>
      </div>

      {/* Department */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 text-right">מחלקה</label>
        <input
          type="text"
          value={department}
          onChange={e => setDepartment(e.target.value)}
          placeholder="שם המחלקה..."
          className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-right text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Staff list */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={addStaff}
            className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:text-blue-500 transition-colors"
          >
            <span className="text-lg leading-none">+</span> הוסף איש צוות
          </button>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">צוות</span>
        </div>

        <div className="space-y-2">
          {staffList.map((member, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <button
                onClick={() => removeStaff(idx)}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-900/40 dark:hover:text-rose-400 transition-all text-xs font-bold"
                aria-label="הסר"
              >
                ×
              </button>
              <input
                type="text"
                value={member.role}
                onChange={e => updateStaff(idx, 'role', e.target.value)}
                placeholder="תפקיד"
                className="w-28 flex-shrink-0 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600 rounded-xl px-2.5 py-2 text-right text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={member.name}
                onChange={e => updateStaff(idx, 'name', e.target.value)}
                placeholder="שם"
                className="flex-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600 rounded-xl px-2.5 py-2 text-right text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

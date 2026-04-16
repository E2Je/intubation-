import { useChecklistStore } from '../store/checklistStore';
import { HARD_AIRWAY_ITEMS } from '../data/protocol';
import { useState } from 'react';
import type { ItemStatus } from '../data/protocol';

const STATUS_LABEL: Record<ItemStatus, string> = {
  pending: '', done: 'בוצע', skipped: 'לא בוצע', not_relevant: 'לא רלוונטי',
};

export function HardAirwayOverlay() {
  const { hardAirwayOpen, toggleHardAirway, itemStatuses, setStatus } = useChecklistStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (!hardAirwayOpen) return null;

  const item = HARD_AIRWAY_ITEMS[activeIdx];
  const status = itemStatuses[item.id] ?? 'pending';

  const handleStatus = (s: ItemStatus) => {
    setStatus(item.id, s);
    const next = HARD_AIRWAY_ITEMS[activeIdx + 1];
    if (next) setActiveIdx(activeIdx + 1);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-red-900/40 border-b border-red-700">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔴</span>
          <div>
            <h2 className="text-white font-bold text-lg">נתיב אוויר קשה</h2>
            <p className="text-red-300 text-xs">ציוד נוסף לאינטובציה קשה</p>
          </div>
        </div>
        <button
          onClick={toggleHardAirway}
          className="bg-slate-700 hover:bg-slate-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {/* Item tabs */}
      <div className="flex gap-2 px-4 py-3">
        {HARD_AIRWAY_ITEMS.map((it, idx) => {
          const s = itemStatuses[it.id] ?? 'pending';
          return (
            <button
              key={it.id}
              onClick={() => setActiveIdx(idx)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                activeIdx === idx ? 'bg-red-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {it.label}
              {s !== 'pending' && <span className="block text-[10px] mt-0.5 opacity-70">{STATUS_LABEL[s]}</span>}
            </button>
          );
        })}
      </div>

      {/* Item */}
      <div className="flex-1 overflow-y-auto px-4 pb-2 flex flex-col gap-3">
        <h3 className="text-white font-bold text-xl text-center">{item.label}</h3>

        {item.img && !imgError ? (
          <div className="w-full rounded-2xl overflow-hidden" style={{ maxHeight: '38vh' }}>
            <img
              src={`/assets/${encodeURIComponent(item.img)}`}
              alt={item.label}
              className="w-full object-cover"
              style={{ maxHeight: '38vh' }}
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="w-full rounded-2xl bg-slate-700 flex items-center justify-center" style={{ height: '120px' }}>
            <span className="text-slate-400 text-4xl">📋</span>
          </div>
        )}

        <div className="bg-slate-800/80 rounded-xl px-4 py-2 text-center">
          <p className="text-slate-300 text-sm">{item.clinical_note}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['done', 'skipped', 'not_relevant'] as ItemStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => handleStatus(s)}
              className={`min-h-[52px] rounded-xl font-bold text-sm text-white transition-all
                ${s === 'done' ? 'bg-emerald-600 hover:bg-emerald-500' : s === 'skipped' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-sky-600 hover:bg-sky-500'}
                ${status === s ? 'ring-2 ring-white brightness-110' : 'opacity-85'}
              `}
            >
              {s === 'done' ? 'בוצע' : s === 'skipped' ? 'לא בוצע' : 'לא רלוונטי'}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 px-4 pb-4 flex-shrink-0">
        <button
          onClick={() => setActiveIdx(i => Math.min(HARD_AIRWAY_ITEMS.length - 1, i + 1))}
          disabled={activeIdx === HARD_AIRWAY_ITEMS.length - 1}
          className="flex-1 min-h-[56px] bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white font-bold rounded-2xl transition-all"
        >
          הבא
        </button>
        <button
          onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
          disabled={activeIdx === 0}
          className="flex-1 min-h-[56px] bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white font-bold rounded-2xl transition-all"
        >
          הקודם
        </button>
      </div>
    </div>
  );
}

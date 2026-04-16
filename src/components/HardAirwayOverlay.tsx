import { useChecklistStore } from '../store/checklistStore';
import { HARD_AIRWAY_ITEMS } from '../data/protocol';
import { useState, useEffect } from 'react';
import type { ItemStatus, HardAirwayItem } from '../data/protocol';
import { playClick } from '../utils/sound';
import { assetUrl } from '../utils/assetPath';

const STATUS_DOT: Record<ItemStatus, string> = {
  pending:      'bg-slate-500',
  done:         'bg-emerald-500',
  skipped:      'bg-rose-500',
  not_relevant: 'bg-sky-500',
};

const STATUS_LABEL: Record<ItemStatus, string> = {
  pending: '', done: 'בוצע', skipped: 'לא בוצע', not_relevant: 'לא רלוונטי',
};

const STATUS_ROW_BORDER: Record<ItemStatus, string> = {
  pending:      'border-transparent',
  done:         'border-emerald-500',
  skipped:      'border-rose-500',
  not_relevant: 'border-sky-500',
};

// ─── Bottom sheet within the overlay ──────────────────────────────────────

interface SheetProps {
  item: HardAirwayItem;
  status: ItemStatus;
  onClose: () => void;
  onStatus: (id: string, s: ItemStatus) => void;
}

function HardAirwaySheet({ item, status, onClose, onStatus }: SheetProps) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [item.id]);

  const handle = (s: ItemStatus) => {
    playClick(s === 'pending' ? 'nav' : s);
    onStatus(item.id, s);
  };

  return (
    <>
      {/* Backdrop inside overlay */}
      <div className="absolute inset-0 z-10 bg-black/60" onClick={onClose} />

      {/* Sheet */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col bg-slate-900 rounded-t-3xl"
        style={{ height: '72%' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 text-base"
          >
            ✕
          </button>
          <h3 className="flex-1 text-white font-bold text-lg text-right pr-3 leading-snug">
            {item.label}
          </h3>
        </div>

        {/* Image fills remaining space */}
        <div className="flex-1 min-h-0 px-4 pb-2">
          {item.img && !imgError ? (
            <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-800">
              <img
                src={assetUrl(item.img)}
                alt={item.label}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-2xl bg-slate-800 flex items-center justify-center">
              <span className="text-5xl">📋</span>
            </div>
          )}
        </div>

        {/* Clinical note */}
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="bg-slate-800/80 rounded-xl px-4 py-2">
            <p className="text-slate-300 text-sm text-center leading-relaxed">{item.clinical_note}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-5 flex-shrink-0">
          {(['done', 'skipped', 'not_relevant'] as ItemStatus[]).map(s => (
            <button
              key={s}
              onClick={() => handle(s)}
              className={`
                min-h-[56px] rounded-2xl font-bold text-sm text-white transition-all
                ${s === 'done'    ? 'bg-emerald-600 hover:bg-emerald-500' :
                  s === 'skipped' ? 'bg-rose-600 hover:bg-rose-500' :
                                    'bg-sky-600 hover:bg-sky-500'}
                ${status === s ? 'ring-2 ring-white brightness-110 scale-[1.02]' : ''}
              `}
            >
              {s === 'done' ? 'בוצע' : s === 'skipped' ? 'לא בוצע' : 'לא רלוונטי'}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Main overlay ──────────────────────────────────────────────────────────

export function HardAirwayOverlay() {
  const { hardAirwayOpen, toggleHardAirway, itemStatuses, setStatus } = useChecklistStore();
  const [sheetItemId, setSheetItemId] = useState<string | null>(null);

  if (!hardAirwayOpen) return null;

  const handleStatus = (id: string, s: ItemStatus) => {
    setStatus(id, s);
    const idx = HARD_AIRWAY_ITEMS.findIndex(i => i.id === id);
    const next = HARD_AIRWAY_ITEMS[idx + 1];
    setSheetItemId(next?.id ?? null);
  };

  const sheetItem = sheetItemId
    ? HARD_AIRWAY_ITEMS.find(i => i.id === sheetItemId) ?? null
    : null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-sm flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-red-900/40 border-b border-red-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔴</span>
          <div>
            <h2 className="text-white font-bold text-lg">נתיב אוויר קשה</h2>
            <p className="text-red-300 text-xs">ציוד נוסף לאינטובציה קשה</p>
          </div>
        </div>
        <button
          onClick={() => { playClick('nav'); toggleHardAirway(); }}
          className="bg-slate-700 hover:bg-slate-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-4 space-y-2">
        {HARD_AIRWAY_ITEMS.map(item => {
          const status = itemStatuses[item.id] ?? 'pending';
          return (
            <button
              key={item.id}
              onClick={() => { playClick('nav'); setSheetItemId(item.id); }}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-r-4 transition-all text-right
                ${STATUS_ROW_BORDER[status]} bg-slate-800/70 hover:bg-slate-800 active:scale-[0.99]`}
            >
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
              <span className="flex-1 text-white font-semibold text-base">{item.label}</span>
              {status !== 'pending' && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  status === 'done'    ? 'bg-emerald-900/60 text-emerald-300' :
                  status === 'skipped' ? 'bg-rose-900/60 text-rose-300' :
                                         'bg-sky-900/60 text-sky-300'
                }`}>
                  {STATUS_LABEL[status]}
                </span>
              )}
              <span className="text-slate-600 text-xs">›</span>
            </button>
          );
        })}
      </div>

      {/* Sheet appears over list */}
      {sheetItem && (
        <HardAirwaySheet
          item={sheetItem}
          status={itemStatuses[sheetItem.id] ?? 'pending'}
          onClose={() => setSheetItemId(null)}
          onStatus={handleStatus}
        />
      )}
    </div>
  );
}

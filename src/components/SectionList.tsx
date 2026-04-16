import { useState, useEffect } from 'react';
import type { ChecklistItem, ItemStatus } from '../data/protocol';
import { CHECKLIST_SECTIONS } from '../data/protocol';
import { useChecklistStore } from '../store/checklistStore';
import { playClick } from '../utils/sound';
import { assetUrl } from '../utils/assetPath';

const STATUS_DOT: Record<ItemStatus, string> = {
  pending:      'bg-slate-400 dark:bg-slate-600',
  done:         'bg-emerald-500',
  skipped:      'bg-rose-500',
  not_relevant: 'bg-sky-500',
};

const STATUS_LABEL: Record<ItemStatus, string> = {
  pending:      '',
  done:         'בוצע',
  skipped:      'לא בוצע',
  not_relevant: 'לא רלוונטי',
};

const STATUS_ROW_BORDER: Record<ItemStatus, string> = {
  pending:      'border-slate-200 dark:border-transparent',
  done:         'border-emerald-500',
  skipped:      'border-rose-500',
  not_relevant: 'border-sky-500',
};

// ─── Bottom sheet that shows when a row is tapped ──────────────────────────

interface ItemSheetProps {
  item: ChecklistItem;
  status: ItemStatus;
  onClose: () => void;
  onStatus: (id: string, status: ItemStatus) => void;
}

function ItemSheet({ item, status, onClose, onStatus }: ItemSheetProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => { setImgError(false); }, [item.id]);

  const handle = (s: ItemStatus) => {
    playClick(s === 'pending' ? 'nav' : s);
    onStatus(item.id, s);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-20 bg-black/50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 flex flex-col bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl"
        style={{ height: '72dvh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-base"
          >
            ✕
          </button>
          <h3 className="flex-1 text-slate-900 dark:text-white font-bold text-lg text-right pr-3 leading-snug">
            {item.label}
          </h3>
        </div>

        {/* Image — fills remaining space, object-contain = full image, no crop */}
        <div className="flex-1 min-h-0 px-4 pb-2">
          {item.img && !imgError ? (
            <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800">
              <img
                src={assetUrl(item.img)}
                alt={item.label}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="text-5xl">📋</span>
            </div>
          )}
        </div>

        {/* Clinical note */}
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl px-4 py-2 border border-slate-100 dark:border-transparent">
            <p className="text-slate-600 dark:text-slate-300 text-sm text-center leading-relaxed">
              {item.clinical_note}
            </p>
          </div>
        </div>

        {/* Action buttons — always visible at bottom */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-5 flex-shrink-0">
          {(['done', 'skipped', 'not_relevant'] as ItemStatus[]).map(s => (
            <button
              key={s}
              onClick={() => handle(s)}
              className={`
                min-h-[56px] rounded-2xl font-bold text-sm text-white transition-all
                ${s === 'done'         ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700' :
                  s === 'skipped'      ? 'bg-rose-600    hover:bg-rose-500    active:bg-rose-700' :
                                         'bg-sky-600     hover:bg-sky-500     active:bg-sky-700'}
                ${status === s ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900 brightness-110 scale-[1.02]' : ''}
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

// ─── Simple list row ───────────────────────────────────────────────────────

interface RowProps {
  item: ChecklistItem;
  status: ItemStatus;
  onTap: () => void;
}

function Row({ item, status, onTap }: RowProps) {
  return (
    <button
      onClick={onTap}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-r-4 transition-all text-right
        ${STATUS_ROW_BORDER[status]}
        bg-white dark:bg-slate-800/70 shadow-sm dark:shadow-none
        hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.99]`}
    >
      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
      <span className="flex-1 text-slate-900 dark:text-white font-semibold text-base leading-snug">
        {item.label}
      </span>
      {status !== 'pending' && (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
          status === 'done'         ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
          status === 'skipped'      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' :
                                      'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
        }`}>
          {STATUS_LABEL[status]}
        </span>
      )}
      <span className="text-slate-400 dark:text-slate-600 text-xs">›</span>
    </button>
  );
}

// ─── Main section list ─────────────────────────────────────────────────────

export function SectionList() {
  const { currentSection, itemStatuses, setStatus } = useChecklistStore();
  const section = CHECKLIST_SECTIONS[currentSection];
  const items = section?.items ?? [];

  const [sheetItemId, setSheetItemId] = useState<string | null>(null);

  // Auto-open first pending item when section changes
  useEffect(() => {
    const first = items.find(i => (itemStatuses[i.id] ?? 'pending') === 'pending');
    setSheetItemId(first?.id ?? null);
  }, [currentSection]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatus = (id: string, status: ItemStatus) => {
    setStatus(id, status);
    const idx = items.findIndex(i => i.id === id);
    const next = items[idx + 1];
    // Advance to next item, or close sheet if last
    setSheetItemId(next?.id ?? null);
  };

  const sheetItem = sheetItemId ? items.find(i => i.id === sheetItemId) ?? null : null;

  return (
    <>
      <div className="overflow-y-auto flex-1 pb-2 space-y-2">
        {items.map(item => (
          <Row
            key={item.id}
            item={item}
            status={itemStatuses[item.id] ?? 'pending'}
            onTap={() => setSheetItemId(item.id)}
          />
        ))}
      </div>

      {sheetItem && (
        <ItemSheet
          item={sheetItem}
          status={itemStatuses[sheetItem.id] ?? 'pending'}
          onClose={() => setSheetItemId(null)}
          onStatus={handleStatus}
        />
      )}
    </>
  );
}

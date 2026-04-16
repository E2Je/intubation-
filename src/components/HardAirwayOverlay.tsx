import { useChecklistStore } from '../store/checklistStore';
import { HARD_AIRWAY_ITEMS } from '../data/protocol';
import { useState, useEffect, useRef } from 'react';
import type { ItemStatus, HardAirwayItem } from '../data/protocol';
import { playClick } from '../utils/sound';
import { assetUrl } from '../utils/assetPath';

const STATUS_DOT: Record<ItemStatus, string> = {
  pending:      'bg-slate-400 dark:bg-slate-600',
  done:         'bg-emerald-500',
  skipped:      'bg-rose-500',
  not_relevant: 'bg-sky-500',
};

const STATUS_LABEL: Record<ItemStatus, string> = {
  pending: '', done: 'בוצע', skipped: 'לא בוצע', not_relevant: 'לא רלוונטי',
};

const STATUS_ROW_BORDER: Record<ItemStatus, string> = {
  pending:      'border-transparent',
  done:         'border-emerald-600',
  skipped:      'border-rose-600',
  not_relevant: 'border-sky-600',
};

interface HardAirwayRowProps {
  item: HardAirwayItem;
  isExpanded: boolean;
  status: ItemStatus;
  onToggle: () => void;
  onStatus: (id: string, s: ItemStatus) => void;
}

function HardAirwayRow({ item, isExpanded, status, onToggle, onStatus }: HardAirwayRowProps) {
  const [imgError, setImgError] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setImgError(false); }, [item.id]);

  useEffect(() => {
    if (isExpanded && rowRef.current) {
      const t = setTimeout(() => {
        rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
      return () => clearTimeout(t);
    }
  }, [isExpanded]);

  return (
    <div
      ref={rowRef}
      className={`rounded-2xl overflow-hidden border-r-4 transition-all ${STATUS_ROW_BORDER[status]} bg-slate-800/70`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-4 text-right"
      >
        <div className={`w-3 h-3 rounded-full flex-shrink-0 transition-colors ${STATUS_DOT[status]}`} />
        <span className="flex-1 text-white font-semibold text-base leading-snug">{item.label}</span>
        {status !== 'pending' && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
            status === 'done' ? 'bg-emerald-900/60 text-emerald-300' :
            status === 'skipped' ? 'bg-rose-900/60 text-rose-300' :
            'bg-sky-900/60 text-sky-300'
          }`}>
            {STATUS_LABEL[status]}
          </span>
        )}
        <span className={`text-slate-500 text-sm transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="px-3 pb-4 flex flex-col gap-3">
          {item.img && !imgError ? (
            <div className="w-full rounded-2xl overflow-hidden" style={{ maxHeight: '26vh' }}>
              <img
                key={item.id}
                src={assetUrl(item.img)}
                alt={item.label}
                className="w-full object-cover"
                style={{ maxHeight: '26vh' }}
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-full rounded-2xl bg-slate-700 flex items-center justify-center" style={{ height: '100px' }}>
              <span className="text-slate-400 text-4xl">📋</span>
            </div>
          )}

          <div className="bg-slate-900/70 rounded-xl px-4 py-2">
            <p className="text-slate-300 text-sm leading-relaxed text-center">{item.clinical_note}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['done', 'skipped', 'not_relevant'] as ItemStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => { playClick(s as 'done' | 'skipped' | 'not_relevant'); onStatus(item.id, s); }}
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
      )}
    </div>
  );
}

export function HardAirwayOverlay() {
  const { hardAirwayOpen, toggleHardAirway, itemStatuses, setStatus } = useChecklistStore();
  const [expandedId, setExpandedId] = useState<string | null>(HARD_AIRWAY_ITEMS[0]?.id ?? null);

  if (!hardAirwayOpen) return null;

  const handleStatus = (id: string, s: ItemStatus) => {
    setStatus(id, s);
    const idx = HARD_AIRWAY_ITEMS.findIndex(i => i.id === id);
    const next = HARD_AIRWAY_ITEMS[idx + 1];
    setExpandedId(next?.id ?? null);
  };

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-sm flex flex-col">
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

      {/* Accordion list */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-4 space-y-2">
        {HARD_AIRWAY_ITEMS.map(item => (
          <HardAirwayRow
            key={item.id}
            item={item}
            isExpanded={expandedId === item.id}
            status={itemStatuses[item.id] ?? 'pending'}
            onToggle={() => toggle(item.id)}
            onStatus={handleStatus}
          />
        ))}
      </div>
    </div>
  );
}

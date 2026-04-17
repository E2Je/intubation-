import { useState, useEffect, useRef } from 'react';
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

// ─── Single accordion item ─────────────────────────────────────────────────

interface AccordionItemProps {
  item: ChecklistItem;
  isExpanded: boolean;
  status: ItemStatus;
  onToggle: () => void;
  onStatus: (id: string, status: ItemStatus) => void;
}

function AccordionItem({ item, isExpanded, status, onToggle, onStatus }: AccordionItemProps) {
  const [imgError, setImgError] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Scroll so title sits near top of scroll area — user sees title→image→buttons
  useEffect(() => {
    if (isExpanded && itemRef.current) {
      const t = setTimeout(() => {
        itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => clearTimeout(t);
    }
  }, [isExpanded]);

  const handleStatus = (s: ItemStatus) => {
    playClick(s === 'pending' ? 'nav' : s);
    onStatus(item.id, s);
  };

  return (
    <div
      ref={itemRef}
      className={`rounded-2xl overflow-hidden border-r-4 transition-all
        ${STATUS_ROW_BORDER[status]}
        bg-white dark:bg-slate-800/70 shadow-sm dark:shadow-none`}
    >
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-4 text-right"
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
        <span className={`text-slate-400 dark:text-slate-500 text-sm transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-4 flex flex-col gap-3">
          {/* Image — object-contain: shows full image, no cropping */}
          {item.img && !imgError ? (
            <div
              className="w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center"
              style={{ maxHeight: '38vh' }}
            >
              <img
                src={assetUrl(item.img)}
                alt={item.label}
                className="w-full object-contain"
                style={{ maxHeight: '38vh' }}
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-full rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center" style={{ height: '100px' }}>
              <span className="text-slate-400 text-4xl">📋</span>
            </div>
          )}

          {/* Clinical note */}
          <div className="bg-slate-50 dark:bg-slate-900/70 rounded-xl px-4 py-2 border border-slate-100 dark:border-transparent">
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed text-center">
              {item.clinical_note}
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            {(['done', 'skipped', 'not_relevant'] as ItemStatus[]).map(s => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                className={`
                  min-h-[56px] rounded-2xl font-bold text-sm text-white transition-all
                  ${s === 'done'         ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700' :
                    s === 'skipped'      ? 'bg-rose-600    hover:bg-rose-500    active:bg-rose-700' :
                                           'bg-sky-600     hover:bg-sky-500     active:bg-sky-700'}
                  ${status === s ? 'ring-2 ring-white ring-offset-1 dark:ring-offset-slate-900 brightness-110' : ''}
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

// ─── Main section list ─────────────────────────────────────────────────────

export function SectionList() {
  const { currentSection, itemStatuses, setStatus, setSection } = useChecklistStore();
  const section = CHECKLIST_SECTIONS[currentSection];
  const items = section?.items ?? [];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const first = items.find(i => (itemStatuses[i.id] ?? 'pending') === 'pending');
    setExpandedId(first?.id ?? items[0]?.id ?? null);
  }, [currentSection]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatus = (id: string, status: ItemStatus) => {
    setStatus(id, status);
    const idx = items.findIndex(i => i.id === id);
    const next = items[idx + 1];
    setExpandedId(next?.id ?? null);

    // Auto-advance הכנה (section 0) → ציוד (section 1) when last item is filled
    if (currentSection === 0 && !next) {
      const updatedStatuses = { ...itemStatuses, [id]: status };
      const allFilled = items.every(i => (updatedStatuses[i.id] ?? 'pending') !== 'pending');
      if (allFilled) {
        setTimeout(() => setSection(1), 400);
      }
    }
  };

  return (
    <div className="overflow-y-auto flex-1 pb-2 space-y-2">
      {items.map(item => (
        <AccordionItem
          key={item.id}
          item={item}
          isExpanded={expandedId === item.id}
          status={itemStatuses[item.id] ?? 'pending'}
          onToggle={() => setExpandedId(prev => prev === item.id ? null : item.id)}
          onStatus={handleStatus}
        />
      ))}
    </div>
  );
}

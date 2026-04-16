import { useState, useEffect } from 'react';
import type { ChecklistItem, ItemStatus } from '../data/protocol';
import { CHECKLIST_SECTIONS } from '../data/protocol';
import { useChecklistStore } from '../store/checklistStore';
import { playClick } from '../utils/sound';

const STATUS_DOT: Record<ItemStatus, string> = {
  pending:      'bg-slate-600',
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
  pending:      'border-transparent',
  done:         'border-emerald-600',
  skipped:      'border-rose-600',
  not_relevant: 'border-sky-600',
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

  return (
    <div className={`rounded-2xl overflow-hidden border-r-4 transition-all ${STATUS_ROW_BORDER[status]} bg-slate-800/70`}>
      {/* Row header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-4 text-right"
      >
        <div className={`w-3 h-3 rounded-full flex-shrink-0 transition-colors ${STATUS_DOT[status]}`} />
        <span className="flex-1 text-white font-semibold text-base leading-snug">{item.label}</span>
        {status !== 'pending' && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
            status === 'done'         ? 'bg-emerald-900/60 text-emerald-300' :
            status === 'skipped'      ? 'bg-rose-900/60 text-rose-300' :
                                        'bg-sky-900/60 text-sky-300'
          }`}>
            {STATUS_LABEL[status]}
          </span>
        )}
        <span className={`text-slate-500 text-sm transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-4 flex flex-col gap-3">
          {/* Image */}
          {item.img && !imgError ? (
            <div className="w-full rounded-2xl overflow-hidden" style={{ maxHeight: '42vh' }}>
              <img
                src={`/assets/${encodeURIComponent(item.img)}`}
                alt={item.label}
                className="w-full object-cover"
                style={{ maxHeight: '42vh' }}
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-full rounded-2xl bg-slate-700 flex items-center justify-center" style={{ height: '120px' }}>
              <span className="text-slate-400 text-4xl">📋</span>
            </div>
          )}

          {/* Clinical note */}
          <div className="bg-slate-900/70 rounded-xl px-4 py-2">
            <p className="text-slate-300 text-sm leading-relaxed text-center">{item.clinical_note}</p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            <ActionBtn
              label="בוצע"
              color="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700"
              active={status === 'done'}
              activeRing="ring-emerald-400"
              onClick={() => { playClick('done'); onStatus(item.id, 'done'); }}
            />
            <ActionBtn
              label="לא בוצע"
              color="bg-rose-600 hover:bg-rose-500 active:bg-rose-700"
              active={status === 'skipped'}
              activeRing="ring-rose-400"
              onClick={() => { playClick('skipped'); onStatus(item.id, 'skipped'); }}
            />
            <ActionBtn
              label="לא רלוונטי"
              color="bg-sky-600 hover:bg-sky-500 active:bg-sky-700"
              active={status === 'not_relevant'}
              activeRing="ring-sky-400"
              onClick={() => { playClick('not_relevant'); onStatus(item.id, 'not_relevant'); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({
  label, color, active, activeRing, onClick,
}: {
  label: string; color: string; active: boolean; activeRing: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        min-h-[52px] rounded-xl font-bold text-sm text-white transition-all
        ${color}
        ${active ? `ring-2 ${activeRing} brightness-110` : 'opacity-85'}
      `}
    >
      {label}
    </button>
  );
}

// ─── Main section list ─────────────────────────────────────────────────────

export function SectionList() {
  const { currentSection, itemStatuses, setStatus } = useChecklistStore();
  const section = CHECKLIST_SECTIONS[currentSection];
  const items = section?.items ?? [];

  // Expand the first pending item when section loads
  const [expandedId, setExpandedId] = useState<string | null>(() => {
    const first = items.find(i => (itemStatuses[i.id] ?? 'pending') === 'pending');
    return first?.id ?? items[0]?.id ?? null;
  });

  // When section changes, re-expand first pending
  useEffect(() => {
    const first = items.find(i => (itemStatuses[i.id] ?? 'pending') === 'pending');
    setExpandedId(first?.id ?? items[0]?.id ?? null);
  }, [currentSection]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatus = (id: string, status: ItemStatus) => {
    setStatus(id, status);
    // Auto-advance: expand next item
    const idx = items.findIndex(i => i.id === id);
    const next = items[idx + 1];
    setExpandedId(next?.id ?? null);
  };

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="overflow-y-auto flex-1 pb-2 space-y-2">
      {items.map(item => (
        <AccordionItem
          key={item.id}
          item={item}
          isExpanded={expandedId === item.id}
          status={itemStatuses[item.id] ?? 'pending'}
          onToggle={() => toggle(item.id)}
          onStatus={handleStatus}
        />
      ))}
    </div>
  );
}

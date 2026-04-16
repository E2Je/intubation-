import type { ChecklistItem as Item, ItemStatus } from '../data/protocol';
import { useChecklistStore } from '../store/checklistStore';

interface Props {
  item: Item;
  compact?: boolean; // for list mode rows
  onJump?: () => void; // in list mode, tap to jump to focus
}

const STATUS_COLORS: Record<ItemStatus, string> = {
  pending: 'bg-slate-700',
  done: 'bg-emerald-500',
  skipped: 'bg-rose-500',
  not_relevant: 'bg-sky-500',
};

const STATUS_BORDER: Record<ItemStatus, string> = {
  pending: 'border-slate-700',
  done: 'border-emerald-500',
  skipped: 'border-rose-500',
  not_relevant: 'border-sky-500',
};

export function ChecklistItem({ item, compact = false, onJump }: Props) {
  const { itemStatuses, setStatus } = useChecklistStore();
  const status = itemStatuses[item.id] ?? 'pending';

  if (compact) {
    return (
      <button
        onClick={onJump}
        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-slate-800/60 border-r-4 ${STATUS_BORDER[status]} text-right transition-all active:scale-95`}
      >
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${STATUS_COLORS[status]}`} />
        <span className="flex-1 text-white text-base font-medium">{item.label}</span>
        {status !== 'pending' && (
          <span className="text-xs text-slate-400">
            {status === 'done' ? 'בוצע' : status === 'skipped' ? 'לא בוצע' : 'לא רלוונטי'}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full h-full">
      {/* Label */}
      <h2 className="flex-shrink-0 text-white text-xl font-bold text-center leading-snug px-2">
        {item.label}
      </h2>

      {/* Image or placeholder — fills available space */}
      <div className={`relative flex-1 min-h-0 w-full max-w-[500px] mx-auto rounded-3xl overflow-hidden border-4 ${STATUS_BORDER[status]} transition-all`}>
        {item.img ? (
          <img
            src={`/assets/${item.img}`}
            alt={item.label}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                const placeholder = parent.querySelector('.placeholder') as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div
          className="placeholder absolute inset-0 bg-slate-700 flex items-center justify-center"
          style={{ display: item.img ? 'none' : 'flex' }}
        >
          <span className="text-slate-400 text-5xl">📋</span>
        </div>
      </div>

      {/* Clinical note */}
      <div className="flex-shrink-0 bg-slate-800/80 rounded-2xl px-4 py-2 text-center">
        <p className="text-slate-300 text-sm leading-relaxed">{item.clinical_note}</p>
      </div>

      {/* Action buttons */}
      <div className="flex-shrink-0 grid grid-cols-3 gap-3">
        <ActionBtn
          label="בוצע"
          color="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700"
          active={status === 'done'}
          activeRing="ring-emerald-400"
          onClick={() => setStatus(item.id, 'done')}
        />
        <ActionBtn
          label="לא בוצע"
          color="bg-rose-600 hover:bg-rose-500 active:bg-rose-700"
          active={status === 'skipped'}
          activeRing="ring-rose-400"
          onClick={() => setStatus(item.id, 'skipped')}
        />
        <ActionBtn
          label="לא רלוונטי"
          color="bg-sky-600 hover:bg-sky-500 active:bg-sky-700"
          active={status === 'not_relevant'}
          activeRing="ring-sky-400"
          onClick={() => setStatus(item.id, 'not_relevant')}
        />
      </div>
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
        min-h-[56px] rounded-2xl font-bold text-sm text-white transition-all
        ${color}
        ${active ? `ring-2 ${activeRing} scale-95 brightness-110` : 'opacity-80'}
      `}
    >
      {label}
    </button>
  );
}

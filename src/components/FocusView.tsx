import { useChecklistStore } from '../store/checklistStore';
import { CHECKLIST_SECTIONS } from '../data/protocol';
import { ChecklistItem } from './ChecklistItem';

export function FocusView() {
  const { currentSection, currentItemIndex, setItemIndex } = useChecklistStore();
  const section = CHECKLIST_SECTIONS[currentSection];
  const items = section?.items ?? [];
  const item = items[currentItemIndex];
  const total = items.length;

  if (!item) return null;

  const prev = () => { if (currentItemIndex > 0) setItemIndex(currentItemIndex - 1); };
  const next = () => { if (currentItemIndex < total - 1) setItemIndex(currentItemIndex + 1); };

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <span className="text-slate-400 text-sm">{currentItemIndex + 1} / {total}</span>
        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentItemIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Item card — flex-1 min-h-0 so ChecklistItem can fill remaining space */}
      <div className="flex-1 min-h-0">
        <ChecklistItem item={item} />
      </div>

      {/* Navigation arrows */}
      <div className="flex gap-3 mt-3">
        <button
          onClick={prev}
          disabled={currentItemIndex === 0}
          className="flex-1 min-h-[56px] bg-slate-700 hover:bg-slate-600 active:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-white text-2xl font-bold rounded-2xl transition-all"
        >
          ←
        </button>
        <button
          onClick={next}
          disabled={currentItemIndex === total - 1}
          className="flex-1 min-h-[56px] bg-slate-700 hover:bg-slate-600 active:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-white text-2xl font-bold rounded-2xl transition-all"
        >
          →
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
        {items.map((it, idx) => {
          const isActive = idx === currentItemIndex;
          return (
            <button
              key={it.id}
              onClick={() => setItemIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                isActive ? 'bg-blue-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

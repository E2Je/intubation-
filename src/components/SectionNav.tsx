import { useChecklistStore } from '../store/checklistStore';
import { CHECKLIST_SECTIONS } from '../data/protocol';

const SECTION_SHORT = ['הכנה', 'ציוד', 'אחרי'];

export function SectionNav() {
  const { currentSection, itemStatuses, setSection, intubationStarted } = useChecklistStore();

  return (
    <div className="flex gap-2">
      {CHECKLIST_SECTIONS.map((section, idx) => {
        const total = section.items.length;
        const done = section.items.filter(
          i => itemStatuses[i.id] !== 'pending'
        ).length;
        const isActive = currentSection === idx;
        const isLocked = idx === 2 && !intubationStarted;

        return (
          <button
            key={section.id}
            onClick={() => !isLocked && setSection(idx)}
            disabled={isLocked}
            className={`
              flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all text-center
              ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : isLocked
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }
            `}
          >
            <span className="text-xs font-bold">{SECTION_SHORT[idx]}</span>
            <span className={`text-xs mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>
              {done}/{total}
            </span>
          </button>
        );
      })}
    </div>
  );
}

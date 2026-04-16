import { useChecklistStore } from '../store/checklistStore';
import { CHECKLIST_SECTIONS } from '../data/protocol';

const STATUS_CHIP: Record<string, { label: string; cls: string }> = {
  pending:      { label: 'ממתין',       cls: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  done:         { label: 'בוצע',        cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' },
  skipped:      { label: 'לא בוצע',    cls: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
  not_relevant: { label: 'לא רלוונטי', cls: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300' },
};

export function SectionWarningModal() {
  const { sectionWarningOpen, closeSectionWarning, confirmSectionNavigation, itemStatuses } = useChecklistStore();

  if (!sectionWarningOpen) return null;

  const prepItems = CHECKLIST_SECTIONS[0].items;
  const pendingItems = prepItems.filter(i => (itemStatuses[i.id] ?? 'pending') === 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-sm shadow-2xl flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="text-3xl mb-2 text-center">⚠️</div>
          <h2 className="text-slate-900 dark:text-white font-bold text-lg text-center">לא סיימת את ההכנה</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-1">
            {pendingItems.length} פריטים עדיין ממתינים
          </p>
        </div>

        {/* Item list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {prepItems.map(item => {
            const status = itemStatuses[item.id] ?? 'pending';
            const chip = STATUS_CHIP[status];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60"
              >
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap ${chip.cls}`}>
                  {chip.label}
                </span>
                <span className="text-slate-800 dark:text-slate-200 text-sm flex-1 text-right">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-4 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={confirmSectionNavigation}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold py-4 rounded-2xl transition-all text-sm"
          >
            המשך לציוד
          </button>
          <button
            onClick={closeSectionWarning}
            className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all text-sm"
          >
            המשך לערוך
          </button>
        </div>
      </div>
    </div>
  );
}

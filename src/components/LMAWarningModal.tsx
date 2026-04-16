import { useChecklistStore } from '../store/checklistStore';
import { LMA_WARNING } from '../data/protocol';

export function LMAWarningModal() {
  const { lmaModalOpen, closeLmaModal, startIntubation } = useChecklistStore();

  if (!lmaModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-red-500 rounded-3xl p-6 w-full max-w-sm shadow-2xl shadow-red-900/50">
        {/* Warning icon */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold">אזהרת LMA</h2>
        </div>

        {/* LMA rule */}
        <div className="bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 rounded-2xl p-4 mb-6">
          <p className="text-red-700 dark:text-red-200 text-base text-center font-medium leading-relaxed">
            {LMA_WARNING}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={closeLmaModal}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-4 rounded-2xl transition-all"
          >
            ביטול
          </button>
          <button
            onClick={startIntubation}
            className="flex-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-all"
          >
            הבנתי - המשך
          </button>
        </div>
      </div>
    </div>
  );
}

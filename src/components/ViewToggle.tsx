import { useChecklistStore } from '../store/checklistStore';

export function ViewToggle() {
  const { viewMode, toggleViewMode } = useChecklistStore();

  return (
    <button
      onClick={toggleViewMode}
      className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
    >
      {viewMode === 'focus' ? (
        <>
          <span>☰</span>
          <span>רשימה</span>
        </>
      ) : (
        <>
          <span>⊞</span>
          <span>פוקוס</span>
        </>
      )}
    </button>
  );
}

import { useChecklistStore } from '../store/checklistStore';

export function HardAirwayFAB({ compact = false }: { compact?: boolean }) {
  const { toggleHardAirway, hardAirwayOpen } = useChecklistStore();

  return (
    <button
      onClick={toggleHardAirway}
      className={`
        flex items-center gap-1.5 rounded-xl font-bold text-sm shadow transition-all
        ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-3 text-sm shadow-lg'}
        ${hardAirwayOpen
          ? 'bg-red-500 text-white scale-95'
          : 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white'}
      `}
    >
      <span>🔴</span>
      <span>נתיב קשה</span>
    </button>
  );
}

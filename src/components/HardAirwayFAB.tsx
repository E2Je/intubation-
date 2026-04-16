import { useChecklistStore } from '../store/checklistStore';

export function HardAirwayFAB() {
  const { toggleHardAirway, hardAirwayOpen } = useChecklistStore();

  return (
    <button
      onClick={toggleHardAirway}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all
        ${hardAirwayOpen
          ? 'bg-red-500 text-white scale-95'
          : 'bg-red-700 hover:bg-red-600 active:bg-red-800 text-white'}
      `}
    >
      <span>🔴</span>
      <span>נתיב קשה</span>
    </button>
  );
}

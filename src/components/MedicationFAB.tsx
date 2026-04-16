import { useChecklistStore } from '../store/checklistStore';

export function MedicationFAB() {
  const { toggleMedDrawer, medDrawerOpen } = useChecklistStore();

  return (
    <button
      onClick={toggleMedDrawer}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all
        ${medDrawerOpen
          ? 'bg-blue-500 text-white scale-95'
          : 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white'}
      `}
    >
      <span>💊</span>
      <span>תרופות</span>
    </button>
  );
}

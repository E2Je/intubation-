import { useChecklistStore } from '../store/checklistStore';

export function MedicationFAB({ compact = false }: { compact?: boolean }) {
  const { toggleMedDrawer, medDrawerOpen } = useChecklistStore();

  return (
    <button
      onClick={toggleMedDrawer}
      className={`
        flex items-center gap-1.5 rounded-xl font-bold text-sm shadow transition-all
        ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-3 text-sm shadow-lg'}
        ${medDrawerOpen
          ? 'bg-blue-500 text-white scale-95'
          : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white'}
      `}
    >
      <span>💊</span>
      <span>תרופות</span>
    </button>
  );
}

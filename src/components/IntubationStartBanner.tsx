import { useChecklistStore } from '../store/checklistStore';
import { CHECKLIST_SECTIONS } from '../data/protocol';

export function IntubationStartBanner() {
  const { currentSection, itemStatuses, intubationStarted, openLmaModal } = useChecklistStore();

  if (intubationStarted) return null;
  if (currentSection !== 1) return null;

  const equipmentItems = CHECKLIST_SECTIONS[1].items;
  const allFilled = equipmentItems.every(i => (itemStatuses[i.id] ?? 'pending') !== 'pending');

  if (!allFilled) return null;

  // All equipment items filled → show centred overlay button
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="px-8 w-full max-w-xs text-center">
        <button
          onClick={openLmaModal}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600
            hover:from-orange-500 hover:to-red-500
            active:from-orange-700 active:to-red-700
            text-white font-bold text-2xl py-7 rounded-3xl
            shadow-2xl shadow-red-900/60 transition-all"
        >
          🚨 התחלת אינטובציה
        </button>
        <p className="text-white/70 text-sm mt-3">
          כל הציוד מוכן — לחץ להתחיל
        </p>
      </div>
    </div>
  );
}

import { useChecklistStore } from '../store/checklistStore';
import { CHECKLIST_SECTIONS } from '../data/protocol';

export function IntubationStartBanner() {
  const { currentSection, currentItemIndex, itemStatuses, intubationStarted, openLmaModal } = useChecklistStore();

  // Show only on prep section, after all prep items, and not yet started
  const prepSection = CHECKLIST_SECTIONS[0];
  const isLastPrepItem = currentSection === 0 && currentItemIndex === prepSection.items.length - 1;
  const allPrepActioned = prepSection.items.every(i => itemStatuses[i.id] !== 'pending');

  if (intubationStarted) return null;
  if (!(isLastPrepItem || allPrepActioned)) return null;

  return (
    <div className="mt-4">
      <button
        onClick={openLmaModal}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:from-orange-700 active:to-red-700 text-white font-bold text-xl py-5 rounded-2xl shadow-lg shadow-red-900/40 transition-all"
      >
        🚨 התחלת אינטובציה
      </button>
      <p className="text-slate-500 text-xs text-center mt-2">
        לחץ לפני תחילת הליך האינטובציה
      </p>
    </div>
  );
}

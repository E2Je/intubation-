import { useChecklistStore } from '../store/checklistStore';
import { CHECKLIST_SECTIONS } from '../data/protocol';
import { ChecklistItem } from './ChecklistItem';

export function ListView() {
  const { currentSection, itemStatuses, setItemIndex, toggleViewMode } = useChecklistStore();
  const section = CHECKLIST_SECTIONS[currentSection];
  const items = section?.items ?? [];

  const jumpToItem = (idx: number) => {
    setItemIndex(idx);
    toggleViewMode(); // switch back to focus
  };

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full pb-2">
      <p className="text-slate-400 text-sm text-center mb-1">לחץ על פריט לפתיחה בפוקוס</p>
      {items.map((item, idx) => {
        const status = itemStatuses[item.id] ?? 'pending';
        const isPending = status === 'pending';
        return (
          <div
            key={item.id}
            className={isPending ? 'opacity-100' : 'opacity-80'}
          >
            <ChecklistItem
              item={item}
              compact={true}
              onJump={() => jumpToItem(idx)}
            />
          </div>
        );
      })}
    </div>
  );
}

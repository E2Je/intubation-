/**
 * Shown when a new version is detected.
 * Reload preserves localStorage (Zustand persist) — session data is safe.
 */
export function UpdateBanner({ onReload, onDismiss }: {
  onReload: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed top-0 inset-x-0 z-50 px-3 pt-2">
      <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
        <span className="text-xl flex-shrink-0">🔄</span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">עדכון זמין</p>
          <p className="text-blue-200 text-xs leading-tight">
            הנתונים והסשן הנוכחי שמורים
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onDismiss}
            className="text-blue-300 hover:text-white text-xs px-2 py-1.5 rounded-lg transition-all"
          >
            אחר כך
          </button>
          <button
            onClick={onReload}
            className="bg-white text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all"
          >
            עדכן עכשיו
          </button>
        </div>
      </div>
    </div>
  );
}

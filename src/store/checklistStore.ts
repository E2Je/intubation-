import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ItemStatus } from '../data/protocol';
import { CHECKLIST_SECTIONS, HARD_AIRWAY_ITEMS } from '../data/protocol';

const allIds = [
  ...CHECKLIST_SECTIONS.flatMap(s => s.items.map(i => i.id)),
  ...HARD_AIRWAY_ITEMS.map(i => i.id),
];

const initialStatuses: Record<string, ItemStatus> = {};
allIds.forEach(id => { initialStatuses[id] = 'pending'; });

interface ChecklistState {
  // Patient
  weight: number | null;
  isAdult: boolean;
  weightModalOpen: boolean;

  // Navigation
  currentSection: number;
  currentItemIndex: number;

  // Item statuses
  itemStatuses: Record<string, ItemStatus>;

  // Overlays / UI
  medDrawerOpen: boolean;
  hardAirwayOpen: boolean;
  lmaModalOpen: boolean;
  sessionLogOpen: boolean;

  // Section warning modal
  sectionWarningOpen: boolean;
  sectionWarningTarget: number | null;

  // Session timing
  intubationStarted: boolean;
  sessionStartTime: number;
  intubationStartTime: number | null;
  sessionEndTime: number | null;

  // Theme
  isDark: boolean;

  // Actions
  setWeight: (w: number) => void;
  setIsAdult: (v: boolean) => void;
  closeWeightModal: () => void;
  openWeightModal: () => void;

  setSection: (idx: number) => void;
  requestSection: (idx: number) => void;   // navigates with warning check
  setItemIndex: (idx: number) => void;

  setStatus: (id: string, status: ItemStatus) => void;

  toggleMedDrawer: () => void;
  toggleHardAirway: () => void;
  openLmaModal: () => void;
  closeLmaModal: () => void;
  toggleSessionLog: () => void;

  closeSectionWarning: () => void;
  confirmSectionNavigation: () => void;

  startIntubation: () => void;
  endSession: () => void;
  resetSession: () => void;
  toggleTheme: () => void;
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      weight: null,
      isAdult: true,
      weightModalOpen: true,

      currentSection: 0,
      currentItemIndex: 0,

      itemStatuses: { ...initialStatuses },

      medDrawerOpen: false,
      hardAirwayOpen: false,
      lmaModalOpen: false,
      sessionLogOpen: false,
      sectionWarningOpen: false,
      sectionWarningTarget: null,

      intubationStarted: false,
      sessionStartTime: Date.now(),
      intubationStartTime: null,
      sessionEndTime: null,

      isDark: true,

      setWeight: (w) => set({ weight: w }),
      setIsAdult: (v) => set({ isAdult: v }),
      closeWeightModal: () => set({ weightModalOpen: false }),
      openWeightModal: () => set({ weightModalOpen: true }),

      setSection: (idx) => set({ currentSection: idx, currentItemIndex: 0 }),

      requestSection: (idx) => {
        const { currentSection, itemStatuses, intubationStarted } = get();
        // Section 2 locked until intubation started
        if (idx === 2 && !intubationStarted) return;
        // Going to ציוד (1) from הכנה (0) - check for pending items
        if (idx === 1 && currentSection === 0) {
          const prepItems = CHECKLIST_SECTIONS[0].items;
          const hasPending = prepItems.some(i => (itemStatuses[i.id] ?? 'pending') === 'pending');
          if (hasPending) {
            set({ sectionWarningOpen: true, sectionWarningTarget: idx });
            return;
          }
        }
        set({ currentSection: idx, currentItemIndex: 0 });
      },

      setItemIndex: (idx) => set({ currentItemIndex: idx }),

      setStatus: (id, status) =>
        set((s) => ({ itemStatuses: { ...s.itemStatuses, [id]: status } })),

      toggleMedDrawer: () => set((s) => ({
        medDrawerOpen: !s.medDrawerOpen,
        hardAirwayOpen: false, lmaModalOpen: false, sessionLogOpen: false,
      })),
      toggleHardAirway: () => set((s) => ({
        hardAirwayOpen: !s.hardAirwayOpen,
        medDrawerOpen: false, lmaModalOpen: false, sessionLogOpen: false,
      })),
      openLmaModal: () => set({ lmaModalOpen: true, medDrawerOpen: false, hardAirwayOpen: false }),
      closeLmaModal: () => set({ lmaModalOpen: false }),
      toggleSessionLog: () => set((s) => ({
        sessionLogOpen: !s.sessionLogOpen,
        medDrawerOpen: false, hardAirwayOpen: false,
      })),

      closeSectionWarning: () => set({ sectionWarningOpen: false, sectionWarningTarget: null }),
      confirmSectionNavigation: () => {
        const { sectionWarningTarget } = get();
        if (sectionWarningTarget !== null) {
          set({ currentSection: sectionWarningTarget, currentItemIndex: 0, sectionWarningOpen: false, sectionWarningTarget: null });
        }
      },

      startIntubation: () =>
        set({ intubationStarted: true, intubationStartTime: Date.now(), lmaModalOpen: false, currentSection: 2, currentItemIndex: 0 }),

      endSession: () => set({ sessionEndTime: Date.now(), sessionLogOpen: true }),

      resetSession: () => set({
        weight: null,
        weightModalOpen: true,
        currentSection: 0,
        currentItemIndex: 0,
        itemStatuses: { ...initialStatuses },
        intubationStarted: false,
        sessionStartTime: Date.now(),
        intubationStartTime: null,
        sessionEndTime: null,
        medDrawerOpen: false,
        hardAirwayOpen: false,
        lmaModalOpen: false,
        sessionLogOpen: false,
        sectionWarningOpen: false,
        sectionWarningTarget: null,
      }),

      toggleTheme: () => set((s) => ({ isDark: !s.isDark })),
    }),
    {
      name: 'intubation-checklist-v1',
      partialize: (s) => ({
        weight: s.weight,
        isAdult: s.isAdult,
        itemStatuses: s.itemStatuses,
        currentSection: s.currentSection,
        currentItemIndex: s.currentItemIndex,
        intubationStarted: s.intubationStarted,
        sessionStartTime: s.sessionStartTime,
        intubationStartTime: s.intubationStartTime,
        sessionEndTime: s.sessionEndTime,
        isDark: s.isDark,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Show weight modal only if no weight saved
          state.weightModalOpen = state.weight === null;
          // Reset transient UI state
          state.medDrawerOpen = false;
          state.hardAirwayOpen = false;
          state.lmaModalOpen = false;
          state.sessionLogOpen = false;
          state.sectionWarningOpen = false;
          state.sectionWarningTarget = null;
        }
      },
    }
  )
);

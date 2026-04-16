import { create } from 'zustand';
import type { ItemStatus } from '../data/protocol';
import { CHECKLIST_SECTIONS, HARD_AIRWAY_ITEMS } from '../data/protocol';

// Collect all item IDs across main sections + hard airway
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
  currentSection: number;        // index into CHECKLIST_SECTIONS (0-2)
  currentItemIndex: number;
  viewMode: 'focus' | 'list';

  // Item statuses
  itemStatuses: Record<string, ItemStatus>;

  // Overlays
  medDrawerOpen: boolean;
  hardAirwayOpen: boolean;
  lmaModalOpen: boolean;
  sessionLogOpen: boolean;

  // Session timing
  intubationStarted: boolean;
  sessionStartTime: number;
  intubationStartTime: number | null;
  sessionEndTime: number | null;

  // Actions
  setWeight: (w: number) => void;
  setIsAdult: (v: boolean) => void;
  closeWeightModal: () => void;
  openWeightModal: () => void;

  setSection: (idx: number) => void;
  setItemIndex: (idx: number) => void;
  toggleViewMode: () => void;

  setStatus: (id: string, status: ItemStatus) => void;

  toggleMedDrawer: () => void;
  toggleHardAirway: () => void;
  openLmaModal: () => void;
  closeLmaModal: () => void;
  toggleSessionLog: () => void;

  startIntubation: () => void;
  endSession: () => void;
  resetSession: () => void;
}

export const useChecklistStore = create<ChecklistState>((set) => ({
  weight: null,
  isAdult: true,
  weightModalOpen: true,

  currentSection: 0,
  currentItemIndex: 0,
  viewMode: 'focus',

  itemStatuses: { ...initialStatuses },

  medDrawerOpen: false,
  hardAirwayOpen: false,
  lmaModalOpen: false,
  sessionLogOpen: false,

  intubationStarted: false,
  sessionStartTime: Date.now(),
  intubationStartTime: null,
  sessionEndTime: null,

  setWeight: (w) => set({ weight: w }),
  setIsAdult: (v) => set({ isAdult: v }),
  closeWeightModal: () => set({ weightModalOpen: false }),
  openWeightModal: () => set({ weightModalOpen: true }),

  setSection: (idx) => set({ currentSection: idx, currentItemIndex: 0 }),
  setItemIndex: (idx) => set({ currentItemIndex: idx }),
  toggleViewMode: () => set((s) => ({ viewMode: s.viewMode === 'focus' ? 'list' : 'focus' })),

  setStatus: (id, status) =>
    set((s) => ({ itemStatuses: { ...s.itemStatuses, [id]: status } })),

  toggleMedDrawer: () => set((s) => ({ medDrawerOpen: !s.medDrawerOpen, hardAirwayOpen: false, lmaModalOpen: false, sessionLogOpen: false })),
  toggleHardAirway: () => set((s) => ({ hardAirwayOpen: !s.hardAirwayOpen, medDrawerOpen: false, lmaModalOpen: false, sessionLogOpen: false })),
  openLmaModal: () => set({ lmaModalOpen: true, medDrawerOpen: false, hardAirwayOpen: false }),
  closeLmaModal: () => set({ lmaModalOpen: false }),
  toggleSessionLog: () => set((s) => ({ sessionLogOpen: !s.sessionLogOpen, medDrawerOpen: false, hardAirwayOpen: false })),

  startIntubation: () =>
    set({ intubationStarted: true, intubationStartTime: Date.now(), lmaModalOpen: false, currentSection: 2, currentItemIndex: 0 }),

  endSession: () => set({ sessionEndTime: Date.now(), sessionLogOpen: true }),

  resetSession: () =>
    set({
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
    }),
}));

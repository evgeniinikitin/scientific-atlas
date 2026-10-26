"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedItem {
  id: string;
  title: string;
  kind: "problem" | "node" | "paper";
  problemSlug?: string;
  savedAt: string;
}

export interface RecentItem {
  id: string;
  title: string;
  href: string;
  viewedAt: string;
}

interface UserState {
  bookmarks: SavedItem[];
  recent: RecentItem[];
  demoSession: boolean;
  profile: { name: string; specialty: string; interests: string };
  toggleBookmark: (item: Omit<SavedItem, "savedAt">) => boolean;
  isBookmarked: (id: string, kind: SavedItem["kind"]) => boolean;
  addRecent: (item: Omit<RecentItem, "viewedAt">) => void;
  startDemoSession: () => void;
  endDemoSession: () => void;
  updateProfile: (profile: UserState["profile"]) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      recent: [],
      demoSession: false,
      profile: { name: "Алексей Морозов", specialty: "Исследователь", interests: "Теория чисел, вычислительная биология" },
      toggleBookmark: (item) => {
        const exists = get().bookmarks.some((saved) => saved.id === item.id && saved.kind === item.kind);
        set({
          bookmarks: exists
            ? get().bookmarks.filter((saved) => !(saved.id === item.id && saved.kind === item.kind))
            : [{ ...item, savedAt: new Date().toISOString() }, ...get().bookmarks],
        });
        return !exists;
      },
      isBookmarked: (id, kind) => get().bookmarks.some((saved) => saved.id === id && saved.kind === kind),
      addRecent: (item) => set({ recent: [{ ...item, viewedAt: new Date().toISOString() }, ...get().recent.filter((recent) => recent.id !== item.id)].slice(0, 12) }),
      startDemoSession: () => set({ demoSession: true }),
      endDemoSession: () => set({ demoSession: false }),
      updateProfile: (profile) => set({ profile }),
    }),
    { name: "scientific-atlas-user" },
  ),
);

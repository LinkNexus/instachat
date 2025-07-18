import {create} from 'zustand';
import {combine, persist} from 'zustand/middleware';
import type {User} from '@/types';

type Theme = "dark" | "light" | "system"

export const useAppStore = create(
  persist(
    combine(
      {
        user: window.user,
        lastRequestedUrl: null as string | null,
        theme: "system" as Theme
      },
      (set) => ({
        setUser: (user: User | undefined) => set({ user }),
        setLastRequestedUrl: (url: string) => set({lastRequestedUrl: url}),
        setTheme: (theme: Theme) => set({theme})
      })
    ),
    {
      name: "app-store",
      partialize: (store) => ({
        theme: store.theme,
        lastRequestedUrl: store.lastRequestedUrl,
      })
    }
  )
);

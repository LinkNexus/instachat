import {create} from 'zustand';
import {combine, persist} from 'zustand/middleware';
import type {User} from '@/types';
import {apiFetch} from "@/lib/fetch.ts";

type Theme = "dark" | "light" | "system"

export const useAppStore = create(
  persist(
    combine(
      {
        user: window.user,
        theme: "system" as Theme
      },
      (set) => ({
        setUser: (user: User | undefined) => set({ user }),
        setTheme: (theme: Theme) => set({theme}),
        logout: () => {
          apiFetch("/api/auth/logout")
            .then(() => set({ user: undefined }))
        }
      })
    ),
    {
      name: "app-store",
      partialize: (store) => ({
        theme: store.theme,
      })
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: null | any;
  setUser: (user: any) => void;
}

export const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: any) => set({ user }),
    }),
    {
      name: "user-store",
    }
  )
);

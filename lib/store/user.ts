import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";

interface AuthState {
  user: null | any;
  userRole: null | string;
  setUser: (user: any) => void;
  setUserRole: (role: string) => void;
  fetchUser: () => Promise<void>;
}

const supabase = createClient();

export const useUserStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userRole: null,
      setUser: (user: any) => set({ user }),
      setUserRole: (role: string) => set({ userRole: role }),

      // Fetch user function
      fetchUser: async () => {
        try {
          const { data: authData } = await supabase.auth.getUser();

          if (!authData?.user) {
            return;
          }

          // Fetch user role
          const { data: userData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("id", authData.user.id)
            .single();

          if (!userData) {
            console.error("No user role found");
            return;
          }

          // FETCH PATIENT USER DATA AND SET TO STORE
          if (userData.role === "patient") {
            const { data: patientDetails } = await supabase
              .from("patients")
              .select("*")
              .eq("id", authData.user.id)
              .single();

            if (patientDetails) {
              set({ user: patientDetails });
              set({ userRole: userData.role });
            }
          }

          // FETCH BIRTH CENTER USER DATA AND SET TO STORE
          if (userData.role === "birth_center") {
            const { data: birthCenterDetails } = await supabase
              .from("birth_centers")
              .select("*")
              .eq("id", authData.user.id)
              .single();

            if (birthCenterDetails) {
              set({ user: birthCenterDetails });
              set({ userRole: userData.role });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      },
    }),
    {
      name: "user-store",
    }
  )
);

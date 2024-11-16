"use client";
import React, { useCallback, useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useUserStore } from "@/lib/store/user";

export default function Header() {
  const { user } = useUserStore();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      return;
    }

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("userRole");
    }
    router.push("/login");
  };

  const getInitials = useCallback((name: string | null) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.map((n) => n.charAt(0).toUpperCase()).join("");
  }, []);

  const userDisplayName = useMemo(
    () => user?.fullName || user?.centerName,
    [user?.fullName, user?.centerName]
  );

  const initials = userDisplayName ? getInitials(userDisplayName) : "";

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <SidebarTrigger className="mr-4 text-gray-500 hover:text-gray-600" />
            {/* Logo */}
          </div>
          <div className="flex items-center">
            <Popover className="relative">
              <PopoverButton className="flex items-center rounded-full bg-gray-200 p-1 text-gray-500 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-medium text-white">
                  {initials}{" "}
                </span>
              </PopoverButton>
              <PopoverPanel className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => console.log("Edit Profile")}
                >
                  Edit Profile
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </PopoverPanel>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}

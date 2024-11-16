"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const supabase = createClient();

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Error in fetchUser:", err);
      }
    };

    fetchUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    }
  };

  return (
    <div className="w-full">
      <h1>Patient Dashboard</h1>
      <h1>{user?.email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
